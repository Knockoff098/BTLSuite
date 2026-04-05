/**
 * BTL Search & Filter
 * Provides search, filter, and query capabilities for BTL documents.
 */

class BTLSearch {
  /**
   * @param {BTLDocument} document
   */
  constructor(document) {
    this.document = document;
  }

  /**
   * Search parts by a text query (matches against id, name, type, material).
   * @param {string} query - Search text (case-insensitive)
   * @returns {Array<{partIndex: number, part: object, matches: string[]}>}
   */
  searchParts(query) {
    if (!query) return [];
    const q = query.toLowerCase();
    const results = [];

    this.document.parts.forEach((part, index) => {
      const matches = [];
      if (part.id && part.id.toLowerCase().includes(q)) matches.push('id');
      if (part.name && part.name.toLowerCase().includes(q)) matches.push('name');
      if (part.type && part.type.toLowerCase().includes(q)) matches.push('type');
      if (part.material && part.material.toLowerCase().includes(q)) matches.push('material');

      if (matches.length > 0) {
        results.push({ partIndex: index, part, matches });
      }
    });

    return results;
  }

  /**
   * Search processings across all parts by type or parameter values.
   * @param {string} query - Search text (case-insensitive)
   * @returns {Array<{partIndex: number, procIndex: number, processing: object, matches: string[]}>}
   */
  searchProcessings(query) {
    if (!query) return [];
    const q = query.toLowerCase();
    const results = [];

    this.document.parts.forEach((part, partIndex) => {
      part.processings.forEach((proc, procIndex) => {
        const matches = [];
        if (proc.type && proc.type.toLowerCase().includes(q)) matches.push('type');
        if (proc.id && proc.id.toLowerCase().includes(q)) matches.push('id');
        if (proc.name && proc.name.toLowerCase().includes(q)) matches.push('name');

        // Search in parameter keys and values
        for (const [key, val] of Object.entries(proc.parameters || {})) {
          if (key.toLowerCase().includes(q) || String(val).toLowerCase().includes(q)) {
            matches.push(`param:${key}`);
          }
        }

        if (matches.length > 0) {
          results.push({ partIndex, procIndex, processing: proc, matches });
        }
      });
    });

    return results;
  }

  /**
   * Filter parts by criteria.
   * @param {object} criteria - Filter criteria
   * @param {string} [criteria.type] - Part type to match
   * @param {string} [criteria.material] - Material to match
   * @param {number} [criteria.minLength] - Minimum length
   * @param {number} [criteria.maxLength] - Maximum length
   * @param {number} [criteria.minWidth] - Minimum width
   * @param {number} [criteria.maxWidth] - Maximum width
   * @param {number} [criteria.minHeight] - Minimum height
   * @param {number} [criteria.maxHeight] - Maximum height
   * @param {boolean} [criteria.hasProcessings] - Whether part must have processings
   * @param {string} [criteria.processingType] - Part must contain this processing type
   * @returns {Array<{partIndex: number, part: object}>}
   */
  filterParts(criteria) {
    if (!criteria || Object.keys(criteria).length === 0) {
      return this.document.parts.map((part, partIndex) => ({ partIndex, part }));
    }

    const results = [];

    this.document.parts.forEach((part, partIndex) => {
      if (this._matchesCriteria(part, criteria)) {
        results.push({ partIndex, part });
      }
    });

    return results;
  }

  _matchesCriteria(part, criteria) {
    if (criteria.type && part.type.toLowerCase() !== criteria.type.toLowerCase()) return false;
    if (criteria.material && part.material.toLowerCase() !== criteria.material.toLowerCase()) return false;

    if (criteria.minLength !== undefined && part.length < criteria.minLength) return false;
    if (criteria.maxLength !== undefined && part.length > criteria.maxLength) return false;
    if (criteria.minWidth !== undefined && part.width < criteria.minWidth) return false;
    if (criteria.maxWidth !== undefined && part.width > criteria.maxWidth) return false;
    if (criteria.minHeight !== undefined && part.height < criteria.minHeight) return false;
    if (criteria.maxHeight !== undefined && part.height > criteria.maxHeight) return false;

    if (criteria.hasProcessings === true && part.processings.length === 0) return false;
    if (criteria.hasProcessings === false && part.processings.length > 0) return false;

    if (criteria.processingType) {
      const hasType = part.processings.some(
        p => p.type.toLowerCase() === criteria.processingType.toLowerCase()
      );
      if (!hasType) return false;
    }

    return true;
  }

  /**
   * Get unique values for a given part field (useful for building filter dropdowns).
   * @param {string} field - Field name ('type', 'material', etc.)
   * @returns {string[]} Sorted unique values
   */
  getUniqueValues(field) {
    const values = new Set();
    for (const part of this.document.parts) {
      const val = part[field];
      if (val !== undefined && val !== null && val !== '') {
        values.add(String(val));
      }
    }
    return [...values].sort();
  }

  /**
   * Get all unique processing types across the document.
   * @returns {string[]}
   */
  getProcessingTypes() {
    const types = new Set();
    for (const part of this.document.parts) {
      for (const proc of part.processings) {
        if (proc.type) types.add(proc.type);
      }
    }
    for (const proc of this.document.processings) {
      if (proc.type) types.add(proc.type);
    }
    return [...types].sort();
  }

  /**
   * Get statistics about the document.
   * @returns {object}
   */
  getStatistics() {
    const parts = this.document.parts;
    const totalParts = parts.length;

    // Parts by type
    const partsByType = {};
    for (const part of parts) {
      const t = part.type || 'Unknown';
      partsByType[t] = (partsByType[t] || 0) + 1;
    }

    // Parts by material
    const partsByMaterial = {};
    for (const part of parts) {
      const m = part.material || 'Unknown';
      partsByMaterial[m] = (partsByMaterial[m] || 0) + 1;
    }

    // Processing counts by type
    const procsByType = {};
    let totalProcessings = 0;
    for (const part of parts) {
      for (const proc of part.processings) {
        totalProcessings++;
        const t = proc.type || 'Unknown';
        procsByType[t] = (procsByType[t] || 0) + 1;
      }
    }
    for (const proc of this.document.processings) {
      totalProcessings++;
      const t = proc.type || 'Unknown';
      procsByType[t] = (procsByType[t] || 0) + 1;
    }

    // Dimension statistics
    const lengths = parts.filter(p => p.length > 0).map(p => p.length);
    const widths = parts.filter(p => p.width > 0).map(p => p.width);
    const heights = parts.filter(p => p.height > 0).map(p => p.height);

    // Total volume (mm^3 -> m^3)
    let totalVolume = 0;
    for (const part of parts) {
      if (part.length > 0 && part.width > 0 && part.height > 0) {
        totalVolume += (part.length * part.width * part.height);
      }
    }
    const totalVolumeCubicMeters = totalVolume / 1e9;

    return {
      totalParts,
      totalProcessings,
      partsByType,
      partsByMaterial,
      procsByType,
      dimensions: {
        length: BTLSearch._dimStats(lengths),
        width: BTLSearch._dimStats(widths),
        height: BTLSearch._dimStats(heights),
      },
      totalVolumeMm3: totalVolume,
      totalVolumeCubicMeters: Math.round(totalVolumeCubicMeters * 1000) / 1000,
    };
  }

  static _dimStats(values) {
    if (values.length === 0) return { min: 0, max: 0, avg: 0, count: 0 };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    return { min, max, avg, count: values.length };
  }
}

// Export for module usage and testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BTLSearch };
}
