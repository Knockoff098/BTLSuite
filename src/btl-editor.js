/**
 * BTL Editor
 * Provides editing capabilities for BTL documents: add/remove/modify parts,
 * processings, and project metadata.
 */

class BTLEditor {
  /**
   * @param {BTLDocument} document - A parsed BTL document
   */
  constructor(document) {
    this.document = document;
    this.history = [];
    this.historyIndex = -1;
    this._saveState();
  }

  // ── State Management ─────────────────────────────────────────────

  _saveState() {
    const state = JSON.stringify(this.document.toJSON());
    // Trim future history if we've undone steps
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    this.history.push(state);
    this.historyIndex = this.history.length - 1;
  }

  _restoreState(index) {
    const data = JSON.parse(this.history[index]);
    this.document.rootTagName = data.rootTagName;
    this.document.namespaceURI = data.namespaceURI;
    this.document.rootAttributes = data.rootAttributes;
    this.document.metadata = data.metadata;
    this.document.project = data.project;
    this.document.parts = data.parts;
    this.document.processings = data.processings;
    this.document.genericTree = data.genericTree;
  }

  /**
   * Undo the last edit operation.
   * @returns {boolean} Whether undo was successful
   */
  undo() {
    if (this.historyIndex <= 0) return false;
    this.historyIndex--;
    this._restoreState(this.historyIndex);
    return true;
  }

  /**
   * Redo a previously undone operation.
   * @returns {boolean} Whether redo was successful
   */
  redo() {
    if (this.historyIndex >= this.history.length - 1) return false;
    this.historyIndex++;
    this._restoreState(this.historyIndex);
    return true;
  }

  get canUndo() { return this.historyIndex > 0; }
  get canRedo() { return this.historyIndex < this.history.length - 1; }

  // ── Metadata Editing ─────────────────────────────────────────────

  /**
   * Update document metadata fields.
   * @param {object} updates - Key-value pairs to update
   */
  updateMetadata(updates) {
    Object.assign(this.document.metadata, updates);
    this._saveState();
  }

  /**
   * Update root attributes.
   * @param {object} updates
   */
  updateRootAttributes(updates) {
    Object.assign(this.document.rootAttributes, updates);
    this._saveState();
  }

  // ── Project Editing ──────────────────────────────────────────────

  /**
   * Set or create project info.
   * @param {object} projectData
   */
  setProject(projectData) {
    this.document.project = {
      name: projectData.name || '',
      description: projectData.description || '',
      customer: projectData.customer || '',
      architect: projectData.architect || '',
      attributes: projectData.attributes || {},
      children: projectData.children || { tagName: 'Project', attributes: {}, text: '', children: [] },
    };
    this._saveState();
  }

  /**
   * Update existing project fields.
   * @param {object} updates
   */
  updateProject(updates) {
    if (!this.document.project) {
      this.setProject(updates);
      return;
    }
    Object.assign(this.document.project, updates);
    this._saveState();
  }

  // ── Part Editing ─────────────────────────────────────────────────

  /**
   * Add a new part to the document.
   * @param {object} partData
   * @returns {number} Index of the new part
   */
  addPart(partData) {
    const part = {
      id: partData.id || `part-${this.document.parts.length + 1}`,
      name: partData.name || '',
      type: partData.type || '',
      material: partData.material || '',
      length: partData.length || 0,
      width: partData.width || 0,
      height: partData.height || 0,
      attributes: partData.attributes || {},
      processings: partData.processings || [],
      children: partData.children || { tagName: 'Part', attributes: {}, text: '', children: [] },
    };
    this.document.parts.push(part);
    this._saveState();
    return this.document.parts.length - 1;
  }

  /**
   * Update an existing part.
   * @param {number} index
   * @param {object} updates
   */
  updatePart(index, updates) {
    if (index < 0 || index >= this.document.parts.length) {
      throw new Error(`Part index ${index} out of range`);
    }
    Object.assign(this.document.parts[index], updates);
    this._saveState();
  }

  /**
   * Remove a part by index.
   * @param {number} index
   */
  removePart(index) {
    if (index < 0 || index >= this.document.parts.length) {
      throw new Error(`Part index ${index} out of range`);
    }
    this.document.parts.splice(index, 1);
    this._saveState();
  }

  /**
   * Duplicate a part.
   * @param {number} index
   * @returns {number} Index of the new part
   */
  duplicatePart(index) {
    if (index < 0 || index >= this.document.parts.length) {
      throw new Error(`Part index ${index} out of range`);
    }
    const clone = JSON.parse(JSON.stringify(this.document.parts[index]));
    clone.id = `${clone.id}-copy`;
    clone.name = clone.name ? `${clone.name} (copy)` : '';
    this.document.parts.push(clone);
    this._saveState();
    return this.document.parts.length - 1;
  }

  // ── Processing Editing ───────────────────────────────────────────

  /**
   * Add a processing to a specific part.
   * @param {number} partIndex
   * @param {object} processingData
   * @returns {number} Index of the new processing
   */
  addProcessingToPart(partIndex, processingData) {
    if (partIndex < 0 || partIndex >= this.document.parts.length) {
      throw new Error(`Part index ${partIndex} out of range`);
    }
    const proc = {
      type: processingData.type || 'Processing',
      id: processingData.id || `proc-${Date.now()}`,
      name: processingData.name || '',
      referenceSide: processingData.referenceSide || '',
      attributes: processingData.attributes || {},
      parameters: processingData.parameters || {},
      children: processingData.children || { tagName: processingData.type || 'Processing', attributes: {}, text: '', children: [] },
    };
    this.document.parts[partIndex].processings.push(proc);
    this._saveState();
    return this.document.parts[partIndex].processings.length - 1;
  }

  /**
   * Update a processing within a part.
   * @param {number} partIndex
   * @param {number} procIndex
   * @param {object} updates
   */
  updateProcessing(partIndex, procIndex, updates) {
    const part = this.document.parts[partIndex];
    if (!part) throw new Error(`Part index ${partIndex} out of range`);
    if (procIndex < 0 || procIndex >= part.processings.length) {
      throw new Error(`Processing index ${procIndex} out of range`);
    }
    Object.assign(part.processings[procIndex], updates);
    this._saveState();
  }

  /**
   * Remove a processing from a part.
   * @param {number} partIndex
   * @param {number} procIndex
   */
  removeProcessing(partIndex, procIndex) {
    const part = this.document.parts[partIndex];
    if (!part) throw new Error(`Part index ${partIndex} out of range`);
    if (procIndex < 0 || procIndex >= part.processings.length) {
      throw new Error(`Processing index ${procIndex} out of range`);
    }
    part.processings.splice(procIndex, 1);
    this._saveState();
  }

  /**
   * Update processing parameters.
   * @param {number} partIndex
   * @param {number} procIndex
   * @param {object} paramUpdates
   */
  updateProcessingParams(partIndex, procIndex, paramUpdates) {
    const part = this.document.parts[partIndex];
    if (!part) throw new Error(`Part index ${partIndex} out of range`);
    const proc = part.processings[procIndex];
    if (!proc) throw new Error(`Processing index ${procIndex} out of range`);
    Object.assign(proc.parameters, paramUpdates);
    this._saveState();
  }

  // ── Bulk Operations ──────────────────────────────────────────────

  /**
   * Replace all parts at once.
   * @param {Array} parts
   */
  replaceParts(parts) {
    this.document.parts = parts;
    this._saveState();
  }

  /**
   * Clear all parts and processings.
   */
  clearAll() {
    this.document.parts = [];
    this.document.processings = [];
    this.document.project = null;
    this._saveState();
  }

  // ── Export ────────────────────────────────────────────────────────

  /**
   * Get the current document state.
   * @returns {BTLDocument}
   */
  getDocument() {
    return this.document;
  }

  /**
   * Get the current document as JSON.
   * @returns {object}
   */
  toJSON() {
    return this.document.toJSON();
  }
}

// Export for module usage and testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BTLEditor };
}
