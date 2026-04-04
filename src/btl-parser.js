/**
 * BTL (Building Transfer Language) Parser
 * Parses BTL/BTLX XML files used in timber construction CNC data exchange.
 */

class BTLParser {
  constructor() {
    this.domParser = new DOMParser();
    this.serializer = new XMLSerializer();
  }

  /**
   * Parse a BTL/BTLX XML string into a structured object.
   * @param {string} xmlString - Raw XML content of a BTL file
   * @returns {BTLDocument} Parsed BTL document
   */
  parse(xmlString) {
    const doc = this.domParser.parseFromString(xmlString, 'application/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new BTLParseError(`XML parse error: ${parseError.textContent}`);
    }

    const root = doc.documentElement;
    return this._parseDocument(root, xmlString);
  }

  /**
   * Parse from a File object (async).
   * @param {File} file
   * @returns {Promise<BTLDocument>}
   */
  async parseFile(file) {
    const text = await file.text();
    const result = this.parse(text);
    result.metadata.fileName = file.name;
    result.metadata.fileSize = file.size;
    result.metadata.lastModified = new Date(file.lastModified).toISOString();
    return result;
  }

  _parseDocument(root, rawXml) {
    const doc = new BTLDocument();
    doc.rawXml = rawXml;
    doc.rootTagName = root.tagName;
    doc.namespaceURI = root.namespaceURI || '';

    // Extract attributes from root
    for (const attr of root.attributes) {
      doc.rootAttributes[attr.name] = attr.value;
    }

    // Parse metadata / header info
    doc.metadata = this._extractMetadata(root);

    // Parse project info
    const projectEl = this._findElement(root, ['Project', 'project', 'BTLProject']);
    if (projectEl) {
      doc.project = this._parseProject(projectEl);
    }

    // Parse parts / members
    const parts = this._findElements(root, ['Part', 'part', 'Member', 'member', 'Timber', 'timber']);
    for (const partEl of parts) {
      doc.parts.push(this._parsePart(partEl));
    }

    // Parse processings / operations
    const processings = this._findElements(root, ['Processing', 'processing', 'Operation', 'operation']);
    for (const procEl of processings) {
      doc.processings.push(this._parseProcessing(procEl));
    }

    // If no specific structure found, do a generic deep parse
    if (doc.parts.length === 0 && doc.processings.length === 0 && !doc.project) {
      doc.genericTree = this._deepParse(root);
    }

    return doc;
  }

  _extractMetadata(root) {
    const meta = {
      version: '',
      generator: '',
      date: '',
      fileName: '',
      fileSize: 0,
      lastModified: '',
    };

    // Try common metadata attribute names
    meta.version = root.getAttribute('Version') || root.getAttribute('version') || 
                   root.getAttribute('BTLVersion') || '';
    meta.generator = root.getAttribute('Generator') || root.getAttribute('generator') ||
                     root.getAttribute('Software') || '';
    meta.date = root.getAttribute('Date') || root.getAttribute('date') ||
                root.getAttribute('CreationDate') || '';

    // Look for header element
    const headerEl = this._findElement(root, ['Header', 'header', 'FileInfo', 'Info']);
    if (headerEl) {
      meta.version = meta.version || this._getChildText(headerEl, ['Version', 'version']);
      meta.generator = meta.generator || this._getChildText(headerEl, ['Generator', 'generator', 'Software']);
      meta.date = meta.date || this._getChildText(headerEl, ['Date', 'date', 'CreationDate']);
    }

    return meta;
  }

  _parseProject(el) {
    return {
      name: el.getAttribute('Name') || el.getAttribute('name') || this._getChildText(el, ['Name', 'name']) || '',
      description: el.getAttribute('Description') || this._getChildText(el, ['Description', 'description']) || '',
      customer: this._getChildText(el, ['Customer', 'customer']) || '',
      architect: this._getChildText(el, ['Architect', 'architect']) || '',
      attributes: this._getAttributes(el),
      children: this._deepParse(el),
    };
  }

  _parsePart(el) {
    const part = {
      id: el.getAttribute('Id') || el.getAttribute('id') || el.getAttribute('ID') || '',
      name: el.getAttribute('Name') || el.getAttribute('name') || this._getChildText(el, ['Name', 'name']) || '',
      type: el.getAttribute('Type') || el.getAttribute('type') || '',
      material: el.getAttribute('Material') || this._getChildText(el, ['Material', 'material']) || '',
      length: this._getNumericAttrOrChild(el, 'Length', 'length'),
      width: this._getNumericAttrOrChild(el, 'Width', 'width'),
      height: this._getNumericAttrOrChild(el, 'Height', 'height'),
      attributes: this._getAttributes(el),
      processings: [],
      children: this._deepParse(el),
    };

    // Parse nested processings within part
    const procs = this._findElements(el, ['Processing', 'processing', 'Operation', 'operation',
      'Cut', 'cut', 'Drilling', 'drilling', 'Notch', 'notch', 'Pocket', 'pocket',
      'Tenon', 'tenon', 'Mortise', 'mortise', 'DovetailTenon', 'DovetailMortise',
      'LapJoint', 'Birdsmouth', 'FreeContour']);
    for (const proc of procs) {
      part.processings.push(this._parseProcessing(proc));
    }

    return part;
  }

  _parseProcessing(el) {
    const proc = {
      type: el.tagName,
      id: el.getAttribute('Id') || el.getAttribute('id') || '',
      name: el.getAttribute('Name') || el.getAttribute('name') || '',
      referenceSide: el.getAttribute('ReferenceSide') || el.getAttribute('referenceSide') || '',
      attributes: this._getAttributes(el),
      parameters: {},
      children: this._deepParse(el),
    };

    // Extract all child elements as parameters
    for (const child of el.children) {
      const val = child.textContent.trim();
      if (val && child.children.length === 0) {
        proc.parameters[child.tagName] = isNaN(Number(val)) ? val : Number(val);
      }
    }

    return proc;
  }

  _deepParse(el) {
    const result = {
      tagName: el.tagName,
      attributes: this._getAttributes(el),
      text: '',
      children: [],
    };

    const textParts = [];
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const t = node.textContent.trim();
        if (t) textParts.push(t);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        result.children.push(this._deepParse(node));
      }
    }
    result.text = textParts.join(' ');

    return result;
  }

  _findElement(parent, tagNames) {
    for (const name of tagNames) {
      const el = parent.querySelector(name);
      if (el) return el;
    }
    // Also check direct children
    for (const child of parent.children) {
      for (const name of tagNames) {
        if (child.tagName.toLowerCase() === name.toLowerCase()) return child;
      }
    }
    return null;
  }

  _findElements(parent, tagNames) {
    const results = [];
    const seen = new Set();
    for (const name of tagNames) {
      const els = parent.querySelectorAll(name);
      for (const el of els) {
        if (!seen.has(el)) {
          seen.add(el);
          results.push(el);
        }
      }
    }
    return results;
  }

  _getChildText(parent, tagNames) {
    const el = this._findElement(parent, tagNames);
    return el ? el.textContent.trim() : '';
  }

  _getAttributes(el) {
    const attrs = {};
    for (const attr of el.attributes) {
      attrs[attr.name] = attr.value;
    }
    return attrs;
  }

  _getNumericAttrOrChild(el, ...names) {
    for (const name of names) {
      const attrVal = el.getAttribute(name);
      if (attrVal) return Number(attrVal) || 0;
    }
    const text = this._getChildText(el, names);
    return text ? (Number(text) || 0) : 0;
  }
}

/**
 * Represents a parsed BTL document.
 */
class BTLDocument {
  constructor() {
    this.rawXml = '';
    this.rootTagName = '';
    this.namespaceURI = '';
    this.rootAttributes = {};
    this.metadata = {
      version: '',
      generator: '',
      date: '',
      fileName: '',
      fileSize: 0,
      lastModified: '',
    };
    this.project = null;
    this.parts = [];
    this.processings = [];
    this.genericTree = null;
  }

  /**
   * Get a summary of the document contents.
   */
  getSummary() {
    return {
      rootTag: this.rootTagName,
      version: this.metadata.version,
      generator: this.metadata.generator,
      partsCount: this.parts.length,
      processingsCount: this.processings.length + 
        this.parts.reduce((sum, p) => sum + p.processings.length, 0),
      hasProject: !!this.project,
      hasGenericTree: !!this.genericTree,
    };
  }

  /**
   * Convert to a flat JSON representation.
   */
  toJSON() {
    return {
      rootTagName: this.rootTagName,
      namespaceURI: this.namespaceURI,
      rootAttributes: this.rootAttributes,
      metadata: this.metadata,
      project: this.project,
      parts: this.parts,
      processings: this.processings,
      genericTree: this.genericTree,
    };
  }
}

class BTLParseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BTLParseError';
  }
}

// Export for module usage and testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BTLParser, BTLDocument, BTLParseError };
}
