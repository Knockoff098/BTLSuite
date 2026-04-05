/**
 * BTL Diff
 * Compares two BTL documents and produces a structured diff report
 * showing added, removed, and modified parts and processings.
 */

class BTLDiff {
  /**
   * Compare two BTLDocument objects.
   * @param {BTLDocument} docA - The "before" document
   * @param {BTLDocument} docB - The "after" document
   * @returns {BTLDiffReport}
   */
  static compare(docA, docB) {
    const report = new BTLDiffReport();

    // Compare metadata
    BTLDiff._compareMetadata(docA, docB, report);

    // Compare project
    BTLDiff._compareProject(docA, docB, report);

    // Compare parts
    BTLDiff._compareParts(docA, docB, report);

    return report;
  }

  static _compareMetadata(docA, docB, report) {
    const fieldsToCheck = ['version', 'generator', 'date'];
    for (const field of fieldsToCheck) {
      const a = docA.metadata[field] || '';
      const b = docB.metadata[field] || '';
      if (a !== b) {
        report.addChange('metadata', field, a, b);
      }
    }

    // Compare root attributes
    const allKeys = new Set([
      ...Object.keys(docA.rootAttributes || {}),
      ...Object.keys(docB.rootAttributes || {}),
    ]);
    for (const key of allKeys) {
      const a = (docA.rootAttributes || {})[key] || '';
      const b = (docB.rootAttributes || {})[key] || '';
      if (a !== b) {
        report.addChange('rootAttribute', key, a, b);
      }
    }
  }

  static _compareProject(docA, docB, report) {
    const projA = docA.project;
    const projB = docB.project;

    if (!projA && !projB) return;

    if (!projA && projB) {
      report.addAddition('project', 'Project', projB);
      return;
    }

    if (projA && !projB) {
      report.addRemoval('project', 'Project', projA);
      return;
    }

    const fields = ['name', 'description', 'customer', 'architect'];
    for (const field of fields) {
      if ((projA[field] || '') !== (projB[field] || '')) {
        report.addChange('project', field, projA[field] || '', projB[field] || '');
      }
    }
  }

  static _compareParts(docA, docB, report) {
    const partsA = docA.parts || [];
    const partsB = docB.parts || [];

    // Index parts by ID for matching
    const mapA = new Map();
    const mapB = new Map();

    partsA.forEach((p, i) => {
      const key = p.id || `__index_${i}`;
      mapA.set(key, p);
    });

    partsB.forEach((p, i) => {
      const key = p.id || `__index_${i}`;
      mapB.set(key, p);
    });

    // Find removed parts (in A but not in B)
    for (const [key, partA] of mapA) {
      if (!mapB.has(key)) {
        report.addRemoval('part', partA.name || partA.id || key, partA);
      }
    }

    // Find added parts (in B but not in A)
    for (const [key, partB] of mapB) {
      if (!mapA.has(key)) {
        report.addAddition('part', partB.name || partB.id || key, partB);
      }
    }

    // Find modified parts (in both A and B)
    for (const [key, partA] of mapA) {
      if (mapB.has(key)) {
        const partB = mapB.get(key);
        BTLDiff._comparePartDetails(key, partA, partB, report);
      }
    }
  }

  static _comparePartDetails(partKey, partA, partB, report) {
    const fields = ['name', 'type', 'material'];
    const numFields = ['length', 'width', 'height'];

    for (const field of fields) {
      if ((partA[field] || '') !== (partB[field] || '')) {
        report.addChange(`part:${partKey}`, field, partA[field] || '', partB[field] || '');
      }
    }

    for (const field of numFields) {
      if ((partA[field] || 0) !== (partB[field] || 0)) {
        report.addChange(`part:${partKey}`, field, partA[field] || 0, partB[field] || 0);
      }
    }

    // Compare processings within this part
    BTLDiff._compareProcessings(partKey, partA.processings || [], partB.processings || [], report);
  }

  static _compareProcessings(partKey, procsA, procsB, report) {
    const mapA = new Map();
    const mapB = new Map();

    procsA.forEach((p, i) => {
      const key = p.id || `__proc_${i}`;
      mapA.set(key, p);
    });

    procsB.forEach((p, i) => {
      const key = p.id || `__proc_${i}`;
      mapB.set(key, p);
    });

    for (const [key, procA] of mapA) {
      if (!mapB.has(key)) {
        report.addRemoval(`part:${partKey}:processing`, procA.type || key, procA);
      }
    }

    for (const [key, procB] of mapB) {
      if (!mapA.has(key)) {
        report.addAddition(`part:${partKey}:processing`, procB.type || key, procB);
      }
    }

    for (const [key, procA] of mapA) {
      if (mapB.has(key)) {
        const procB = mapB.get(key);
        const procFields = ['type', 'name', 'referenceSide'];
        for (const field of procFields) {
          if ((procA[field] || '') !== (procB[field] || '')) {
            report.addChange(`part:${partKey}:processing:${key}`, field, procA[field] || '', procB[field] || '');
          }
        }

        // Compare parameters
        const allParamKeys = new Set([
          ...Object.keys(procA.parameters || {}),
          ...Object.keys(procB.parameters || {}),
        ]);
        for (const pk of allParamKeys) {
          const a = (procA.parameters || {})[pk];
          const b = (procB.parameters || {})[pk];
          if (a !== b) {
            report.addChange(`part:${partKey}:processing:${key}`, `param:${pk}`,
              a !== undefined ? a : '(absent)', b !== undefined ? b : '(absent)');
          }
        }
      }
    }
  }
}

/**
 * Structured diff report for BTL documents.
 */
class BTLDiffReport {
  constructor() {
    this.changes = [];
    this.additions = [];
    this.removals = [];
  }

  addChange(scope, field, oldValue, newValue) {
    this.changes.push({ scope, field, oldValue, newValue });
  }

  addAddition(scope, label, data) {
    this.additions.push({ scope, label, data });
  }

  addRemoval(scope, label, data) {
    this.removals.push({ scope, label, data });
  }

  get hasDifferences() {
    return this.changes.length > 0 || this.additions.length > 0 || this.removals.length > 0;
  }

  get totalDifferences() {
    return this.changes.length + this.additions.length + this.removals.length;
  }

  /**
   * Get a human-readable summary.
   * @returns {string}
   */
  getSummary() {
    if (!this.hasDifferences) {
      return 'Documents are identical.';
    }
    const parts = [];
    if (this.additions.length > 0) parts.push(`${this.additions.length} addition(s)`);
    if (this.removals.length > 0) parts.push(`${this.removals.length} removal(s)`);
    if (this.changes.length > 0) parts.push(`${this.changes.length} change(s)`);
    return `Differences found: ${parts.join(', ')}.`;
  }

  /**
   * Get all differences as a flat list for display.
   * @returns {Array}
   */
  toList() {
    const list = [];
    for (const a of this.additions) {
      list.push({ type: 'added', scope: a.scope, label: a.label, detail: '' });
    }
    for (const r of this.removals) {
      list.push({ type: 'removed', scope: r.scope, label: r.label, detail: '' });
    }
    for (const c of this.changes) {
      list.push({
        type: 'changed',
        scope: c.scope,
        label: c.field,
        detail: `${c.oldValue} -> ${c.newValue}`,
      });
    }
    return list;
  }
}

// Export for module usage and testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BTLDiff, BTLDiffReport };
}
