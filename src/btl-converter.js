/**
 * BTL Converter
 * Converts BTL documents between formats: BTL/XML, JSON, CSV, YAML-like text.
 */

class BTLConverter {
  constructor() {
    this.parser = new BTLParser();
  }

  // ── BTL/XML to JSON ──────────────────────────────────────────────

  /**
   * Convert BTL XML string to JSON.
   * @param {string} xmlString
   * @returns {string} JSON string
   */
  btlToJson(xmlString) {
    const doc = this.parser.parse(xmlString);
    return JSON.stringify(doc.toJSON(), null, 2);
  }

  // ── JSON to BTL/XML ──────────────────────────────────────────────

  /**
   * Convert a BTLDocument JSON object back to BTL XML.
   * @param {object|string} jsonData - BTLDocument JSON or string
   * @returns {string} BTL XML string
   */
  jsonToBtl(jsonData) {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    return this._buildXml(data);
  }

  _buildXml(data) {
    const lines = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');

    const rootTag = data.rootTagName || 'BTLDocument';
    const rootAttrs = this._attrsToString(data.rootAttributes || {});
    lines.push(`<${rootTag}${rootAttrs}>`);

    // Project
    if (data.project) {
      lines.push(...this._indent(this._buildProjectXml(data.project), 2));
    }

    // Parts
    if (data.parts && data.parts.length > 0) {
      for (const part of data.parts) {
        lines.push(...this._indent(this._buildPartXml(part), 2));
      }
    }

    // Top-level processings
    if (data.processings && data.processings.length > 0) {
      for (const proc of data.processings) {
        lines.push(...this._indent(this._buildProcessingXml(proc), 2));
      }
    }

    // Generic tree fallback
    if (data.genericTree && !data.project && (!data.parts || data.parts.length === 0)) {
      lines.push(...this._indent(this._buildGenericXml(data.genericTree), 2));
    }

    lines.push(`</${rootTag}>`);
    return lines.join('\n');
  }

  _buildProjectXml(project) {
    const lines = [];
    const attrs = this._attrsToString(project.attributes || {});
    lines.push(`<Project${attrs}>`);
    if (project.name) lines.push(`  <Name>${this._escapeXml(project.name)}</Name>`);
    if (project.description) lines.push(`  <Description>${this._escapeXml(project.description)}</Description>`);
    if (project.customer) lines.push(`  <Customer>${this._escapeXml(project.customer)}</Customer>`);
    if (project.architect) lines.push(`  <Architect>${this._escapeXml(project.architect)}</Architect>`);
    lines.push('</Project>');
    return lines;
  }

  _buildPartXml(part) {
    const lines = [];
    const attrs = {};
    if (part.id) attrs.Id = part.id;
    if (part.name) attrs.Name = part.name;
    if (part.type) attrs.Type = part.type;
    if (part.material) attrs.Material = part.material;
    const attrStr = this._attrsToString(attrs);
    lines.push(`<Part${attrStr}>`);

    if (part.length) lines.push(`  <Length>${part.length}</Length>`);
    if (part.width) lines.push(`  <Width>${part.width}</Width>`);
    if (part.height) lines.push(`  <Height>${part.height}</Height>`);

    if (part.processings) {
      for (const proc of part.processings) {
        lines.push(...this._indent(this._buildProcessingXml(proc), 2));
      }
    }

    lines.push('</Part>');
    return lines;
  }

  _buildProcessingXml(proc) {
    const lines = [];
    const tag = proc.type || 'Processing';
    const attrs = {};
    if (proc.id) attrs.Id = proc.id;
    if (proc.name) attrs.Name = proc.name;
    if (proc.referenceSide) attrs.ReferenceSide = proc.referenceSide;
    const attrStr = this._attrsToString(attrs);

    const params = proc.parameters || {};
    const paramKeys = Object.keys(params);

    if (paramKeys.length === 0) {
      lines.push(`<${tag}${attrStr} />`);
    } else {
      lines.push(`<${tag}${attrStr}>`);
      for (const [key, val] of Object.entries(params)) {
        lines.push(`  <${key}>${this._escapeXml(String(val))}</${key}>`);
      }
      lines.push(`</${tag}>`);
    }
    return lines;
  }

  _buildGenericXml(node) {
    if (!node) return [];
    const lines = [];
    const attrs = this._attrsToString(node.attributes || {});

    if (node.children && node.children.length > 0) {
      lines.push(`<${node.tagName}${attrs}>`);
      if (node.text) lines.push(`  ${this._escapeXml(node.text)}`);
      for (const child of node.children) {
        lines.push(...this._indent(this._buildGenericXml(child), 2));
      }
      lines.push(`</${node.tagName}>`);
    } else if (node.text) {
      lines.push(`<${node.tagName}${attrs}>${this._escapeXml(node.text)}</${node.tagName}>`);
    } else {
      lines.push(`<${node.tagName}${attrs} />`);
    }
    return lines;
  }

  // ── BTL to CSV ───────────────────────────────────────────────────

  /**
   * Convert BTL parts data to CSV format.
   * @param {string} xmlString
   * @returns {string} CSV string
   */
  btlToCsv(xmlString) {
    const doc = this.parser.parse(xmlString);
    return this._documentToCsv(doc);
  }

  _documentToCsv(doc) {
    const rows = [];

    if (doc.parts.length > 0) {
      // Parts CSV
      rows.push(['Section: Parts'].join(','));
      rows.push(['ID', 'Name', 'Type', 'Material', 'Length', 'Width', 'Height', 'Processings Count'].join(','));
      for (const part of doc.parts) {
        rows.push([
          this._csvEscape(part.id),
          this._csvEscape(part.name),
          this._csvEscape(part.type),
          this._csvEscape(part.material),
          part.length || '',
          part.width || '',
          part.height || '',
          part.processings.length,
        ].join(','));
      }
      rows.push('');

      // Processings CSV
      const allProcs = [];
      for (const part of doc.parts) {
        for (const proc of part.processings) {
          allProcs.push({ partId: part.id, partName: part.name, ...proc });
        }
      }

      if (allProcs.length > 0) {
        rows.push(['Section: Processings'].join(','));
        // Collect all unique parameter keys
        const paramKeys = new Set();
        for (const proc of allProcs) {
          Object.keys(proc.parameters || {}).forEach(k => paramKeys.add(k));
        }
        const paramKeyArr = [...paramKeys];

        rows.push(['Part ID', 'Part Name', 'Processing Type', 'Processing ID', 'Reference Side', ...paramKeyArr].join(','));
        for (const proc of allProcs) {
          rows.push([
            this._csvEscape(proc.partId),
            this._csvEscape(proc.partName),
            this._csvEscape(proc.type),
            this._csvEscape(proc.id),
            this._csvEscape(proc.referenceSide),
            ...paramKeyArr.map(k => proc.parameters[k] !== undefined ? proc.parameters[k] : ''),
          ].join(','));
        }
      }
    } else if (doc.genericTree) {
      rows.push(['Section: Generic Tree Data'].join(','));
      rows.push(['Path', 'Tag', 'Text', 'Attributes'].join(','));
      this._flattenTree(doc.genericTree, '', rows);
    }

    return rows.join('\n');
  }

  _flattenTree(node, path, rows) {
    const currentPath = path ? `${path}/${node.tagName}` : node.tagName;
    const attrStr = Object.entries(node.attributes || {}).map(([k, v]) => `${k}=${v}`).join('; ');
    rows.push([
      this._csvEscape(currentPath),
      this._csvEscape(node.tagName),
      this._csvEscape(node.text || ''),
      this._csvEscape(attrStr),
    ].join(','));

    if (node.children) {
      for (const child of node.children) {
        this._flattenTree(child, currentPath, rows);
      }
    }
  }

  // ── CSV to BTL ───────────────────────────────────────────────────

  /**
   * Convert a CSV with parts data back to BTL XML.
   * @param {string} csvString
   * @returns {string} BTL XML
   */
  csvToBtl(csvString) {
    const lines = csvString.split('\n').map(l => l.trim()).filter(l => l);
    const data = {
      rootTagName: 'BTLDocument',
      rootAttributes: { Version: '1.0' },
      parts: [],
      processings: [],
    };

    let section = '';
    let headers = [];

    for (const line of lines) {
      if (line.startsWith('Section:')) {
        section = line.replace('Section:', '').trim();
        headers = [];
        continue;
      }

      const cols = this._parseCsvLine(line);

      if (headers.length === 0) {
        headers = cols;
        continue;
      }

      if (section === 'Parts') {
        const row = this._zipToObject(headers, cols);
        data.parts.push({
          id: row['ID'] || '',
          name: row['Name'] || '',
          type: row['Type'] || '',
          material: row['Material'] || '',
          length: Number(row['Length']) || 0,
          width: Number(row['Width']) || 0,
          height: Number(row['Height']) || 0,
          processings: [],
        });
      }
    }

    return this.jsonToBtl(data);
  }

  // ── Utility ──────────────────────────────────────────────────────

  _attrsToString(attrs) {
    const entries = Object.entries(attrs);
    if (entries.length === 0) return '';
    return ' ' + entries.map(([k, v]) => `${k}="${this._escapeXml(String(v))}"`).join(' ');
  }

  _escapeXml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  _csvEscape(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  _parseCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          result.push(current);
          current = '';
        } else {
          current += ch;
        }
      }
    }
    result.push(current);
    return result;
  }

  _zipToObject(keys, values) {
    const obj = {};
    for (let i = 0; i < keys.length; i++) {
      obj[keys[i]] = values[i] || '';
    }
    return obj;
  }

  _indent(lines, spaces) {
    const pad = ' '.repeat(spaces);
    return lines.map(l => pad + l);
  }
}

// Export for module usage and testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BTLConverter };
}
