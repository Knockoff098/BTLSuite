/**
 * BTL Validator
 * Validates BTL documents for structural correctness, required fields,
 * and value constraints common in timber construction data exchange.
 */

class BTLValidator {
  constructor() {
    this.rules = BTLValidator.defaultRules();
  }

  /**
   * Validate a BTLDocument and return a validation report.
   * @param {BTLDocument} doc - Parsed BTL document
   * @returns {BTLValidationReport}
   */
  validate(doc) {
    const report = new BTLValidationReport();

    this._validateMetadata(doc, report);
    this._validateProject(doc, report);
    this._validateParts(doc, report);
    this._validateProcessings(doc, report);
    this._validateDuplicateIds(doc, report);

    return report;
  }

  _validateMetadata(doc, report) {
    if (!doc.rootTagName) {
      report.addError('document', 'Missing root tag name');
    }
    if (!doc.metadata.version) {
      report.addWarning('metadata', 'No version specified in document');
    }
  }

  _validateProject(doc, report) {
    if (!doc.project && doc.parts.length > 0) {
      report.addWarning('project', 'Document has parts but no project information');
    }
    if (doc.project) {
      if (!doc.project.name) {
        report.addWarning('project', 'Project is missing a name');
      }
    }
  }

  _validateParts(doc, report) {
    if (doc.parts.length === 0 && !doc.genericTree) {
      report.addWarning('parts', 'Document contains no parts');
    }

    const rules = this.rules;

    doc.parts.forEach((part, index) => {
      const label = `Part[${index}] (${part.name || part.id || 'unnamed'})`;

      if (!part.id) {
        report.addError(label, 'Part is missing an ID');
      }

      if (!part.name) {
        report.addWarning(label, 'Part is missing a name');
      }

      // Dimension validations
      if (part.length !== undefined && part.length !== 0) {
        if (part.length < rules.minDimension) {
          report.addError(label, `Length ${part.length} is below minimum ${rules.minDimension}`);
        }
        if (part.length > rules.maxLength) {
          report.addError(label, `Length ${part.length} exceeds maximum ${rules.maxLength}`);
        }
      } else {
        report.addWarning(label, 'Part has no length specified');
      }

      if (part.width !== undefined && part.width !== 0) {
        if (part.width < rules.minDimension) {
          report.addError(label, `Width ${part.width} is below minimum ${rules.minDimension}`);
        }
        if (part.width > rules.maxWidth) {
          report.addError(label, `Width ${part.width} exceeds maximum ${rules.maxWidth}`);
        }
      }

      if (part.height !== undefined && part.height !== 0) {
        if (part.height < rules.minDimension) {
          report.addError(label, `Height ${part.height} is below minimum ${rules.minDimension}`);
        }
        if (part.height > rules.maxHeight) {
          report.addError(label, `Height ${part.height} exceeds maximum ${rules.maxHeight}`);
        }
      }

      // Validate part processings
      this._validatePartProcessings(part, index, report);
    });
  }

  _validatePartProcessings(part, partIndex, report) {
    const label = `Part[${partIndex}]`;

    part.processings.forEach((proc, procIndex) => {
      const procLabel = `${label}.Processing[${procIndex}] (${proc.type})`;

      if (!proc.type) {
        report.addError(procLabel, 'Processing is missing a type');
      }

      // Validate reference side (typically 1-6 for a rectangular timber)
      if (proc.referenceSide) {
        const side = parseInt(proc.referenceSide, 10);
        if (isNaN(side) || side < 1 || side > 6) {
          report.addWarning(procLabel, `Reference side "${proc.referenceSide}" is outside typical range 1-6`);
        }
      }

      // Validate common processing parameters
      const params = proc.parameters || {};

      if (params.Angle !== undefined) {
        if (params.Angle < 0 || params.Angle > 360) {
          report.addError(procLabel, `Angle ${params.Angle} is outside range 0-360`);
        }
      }

      if (params.Depth !== undefined && params.Depth < 0) {
        report.addError(procLabel, `Depth ${params.Depth} cannot be negative`);
      }

      if (params.Diameter !== undefined && params.Diameter <= 0) {
        report.addError(procLabel, `Diameter ${params.Diameter} must be positive`);
      }

      if (params.Width !== undefined && params.Width < 0) {
        report.addError(procLabel, `Width ${params.Width} cannot be negative`);
      }

      if (params.Length !== undefined && params.Length < 0) {
        report.addError(procLabel, `Length ${params.Length} cannot be negative`);
      }
    });
  }

  _validateProcessings(doc, report) {
    // Validate top-level processings (not associated with a part)
    doc.processings.forEach((proc, index) => {
      const label = `TopProcessing[${index}] (${proc.type})`;
      if (!proc.type) {
        report.addError(label, 'Processing is missing a type');
      }
    });
  }

  _validateDuplicateIds(doc, report) {
    const partIds = new Map();
    doc.parts.forEach((part, index) => {
      if (part.id) {
        if (partIds.has(part.id)) {
          report.addError('duplicates', `Duplicate part ID "${part.id}" at indices ${partIds.get(part.id)} and ${index}`);
        } else {
          partIds.set(part.id, index);
        }
      }
    });

    // Check processing IDs within each part
    doc.parts.forEach((part, partIndex) => {
      const procIds = new Map();
      part.processings.forEach((proc, procIndex) => {
        if (proc.id) {
          if (procIds.has(proc.id)) {
            report.addError('duplicates',
              `Duplicate processing ID "${proc.id}" in Part[${partIndex}] at indices ${procIds.get(proc.id)} and ${procIndex}`);
          } else {
            procIds.set(proc.id, procIndex);
          }
        }
      });
    });
  }

  /**
   * Default validation rules with typical timber construction limits.
   * All dimensions in millimeters.
   */
  static defaultRules() {
    return {
      minDimension: 1,
      maxLength: 30000,   // 30 meters
      maxWidth: 2000,     // 2 meters
      maxHeight: 2000,    // 2 meters
    };
  }

  /**
   * Update validation rules.
   * @param {object} ruleUpdates
   */
  setRules(ruleUpdates) {
    Object.assign(this.rules, ruleUpdates);
  }
}

/**
 * Represents a validation report with errors and warnings.
 */
class BTLValidationReport {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  addError(source, message) {
    this.errors.push({ source, message, severity: 'error' });
  }

  addWarning(source, message) {
    this.warnings.push({ source, message, severity: 'warning' });
  }

  get isValid() {
    return this.errors.length === 0;
  }

  get issueCount() {
    return this.errors.length + this.warnings.length;
  }

  /**
   * Get all issues sorted by severity (errors first).
   * @returns {Array}
   */
  getAllIssues() {
    return [...this.errors, ...this.warnings];
  }

  /**
   * Get a human-readable summary string.
   * @returns {string}
   */
  getSummary() {
    if (this.isValid && this.warnings.length === 0) {
      return 'Document is valid with no issues.';
    }
    const parts = [];
    if (this.errors.length > 0) {
      parts.push(`${this.errors.length} error(s)`);
    }
    if (this.warnings.length > 0) {
      parts.push(`${this.warnings.length} warning(s)`);
    }
    return `Validation: ${parts.join(', ')}. ${this.isValid ? 'Document is structurally valid.' : 'Document has errors.'}`;
  }
}

// Export for module usage and testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BTLValidator, BTLValidationReport };
}
