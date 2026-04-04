/**
 * BTL Suite - Main Application
 * Coordinates the UI, parser, editor, and converter modules.
 */

class BTLApp {
  constructor() {
    this.parser = new BTLParser();
    this.converter = new BTLConverter();
    this.editor = null;
    this.currentDocument = null;
    this.currentTab = 'viewer';

    this._initUI();
    this._loadSampleOnStart();
  }

  // ── Initialization ───────────────────────────────────────────────

  _initUI() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this._switchTab(btn.dataset.tab));
    });

    // File input
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', (e) => this._handleFileUpload(e));

    // Drop zone
    const dropZone = document.getElementById('drop-zone');
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => this._handleDrop(e));

    // Load from text button
    document.getElementById('btn-load-text').addEventListener('click', () => this._loadFromText());

    // Editor buttons
    document.getElementById('btn-add-part').addEventListener('click', () => this._addPart());
    document.getElementById('btn-undo').addEventListener('click', () => this._undo());
    document.getElementById('btn-redo').addEventListener('click', () => this._redo());
    document.getElementById('btn-save-edits').addEventListener('click', () => this._saveEdits());

    // Converter buttons
    document.getElementById('btn-to-json').addEventListener('click', () => this._convertToJson());
    document.getElementById('btn-to-csv').addEventListener('click', () => this._convertToCsv());
    document.getElementById('btn-to-btl').addEventListener('click', () => this._convertToBtl());
    document.getElementById('btn-download-output').addEventListener('click', () => this._downloadOutput());

    // Sample BTL button
    document.getElementById('btn-load-sample').addEventListener('click', () => this._loadSample());

    // Raw XML editor save
    document.getElementById('btn-apply-raw').addEventListener('click', () => this._applyRawXml());
  }

  _loadSampleOnStart() {
    // Don't auto-load; wait for user action
  }

  // ── Tab Navigation ───────────────────────────────────────────────

  _switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabName}`);
    });
  }

  // ── File Loading ─────────────────────────────────────────────────

  async _handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      this._loadDocument(text, file.name);
    } catch (err) {
      this._showError(`Failed to read file: ${err.message}`);
    }
  }

  _handleDrop(event) {
    event.preventDefault();
    document.getElementById('drop-zone').classList.remove('drag-over');
    const file = event.dataTransfer.files[0];
    if (file) {
      file.text().then(text => this._loadDocument(text, file.name));
    }
  }

  _loadFromText() {
    const textarea = document.getElementById('xml-input');
    const text = textarea.value.trim();
    if (!text) {
      this._showError('Please paste BTL/XML content into the text area first.');
      return;
    }
    this._loadDocument(text, 'pasted-input.btl');
  }

  _loadDocument(xmlString, fileName) {
    try {
      this.currentDocument = this.parser.parse(xmlString);
      this.currentDocument.metadata.fileName = fileName || '';
      this.editor = new BTLEditor(this.currentDocument);

      this._showSuccess(`Loaded: ${fileName}`);
      this._updateViewer();
      this._updateEditorUI();
      this._updateRawEditor(xmlString);
      this._switchTab('viewer');
    } catch (err) {
      this._showError(`Parse error: ${err.message}`);
    }
  }

  _loadSample() {
    const sample = this._getSampleBTL();
    document.getElementById('xml-input').value = sample;
    this._loadDocument(sample, 'sample.btl');
  }

  // ── Viewer ───────────────────────────────────────────────────────

  _updateViewer() {
    const doc = this.currentDocument;
    if (!doc) return;

    const container = document.getElementById('viewer-content');
    const summary = doc.getSummary();

    let html = '<div class="viewer-section">';
    html += '<h3>Document Summary</h3>';
    html += '<div class="info-grid">';
    html += this._infoRow('File', doc.metadata.fileName);
    html += this._infoRow('Root Element', summary.rootTag);
    html += this._infoRow('Version', summary.version || 'N/A');
    html += this._infoRow('Generator', summary.generator || 'N/A');
    html += this._infoRow('Parts', summary.partsCount);
    html += this._infoRow('Processings', summary.processingsCount);
    html += '</div></div>';

    // Root attributes
    const rootAttrKeys = Object.keys(doc.rootAttributes);
    if (rootAttrKeys.length > 0) {
      html += '<div class="viewer-section">';
      html += '<h3>Root Attributes</h3>';
      html += '<div class="info-grid">';
      for (const [k, v] of Object.entries(doc.rootAttributes)) {
        html += this._infoRow(k, v);
      }
      html += '</div></div>';
    }

    // Project
    if (doc.project) {
      html += '<div class="viewer-section">';
      html += '<h3>Project</h3>';
      html += '<div class="info-grid">';
      html += this._infoRow('Name', doc.project.name);
      html += this._infoRow('Description', doc.project.description);
      html += this._infoRow('Customer', doc.project.customer);
      html += this._infoRow('Architect', doc.project.architect);
      html += '</div></div>';
    }

    // Parts
    if (doc.parts.length > 0) {
      html += '<div class="viewer-section">';
      html += '<h3>Parts / Members</h3>';
      for (const part of doc.parts) {
        html += this._renderPartCard(part);
      }
      html += '</div>';
    }

    // Top-level processings
    if (doc.processings.length > 0) {
      html += '<div class="viewer-section">';
      html += '<h3>Processings</h3>';
      for (const proc of doc.processings) {
        html += this._renderProcessingCard(proc);
      }
      html += '</div>';
    }

    // Generic tree
    if (doc.genericTree && doc.parts.length === 0 && !doc.project) {
      html += '<div class="viewer-section">';
      html += '<h3>Document Tree</h3>';
      html += '<div class="tree-view">';
      html += this._renderTree(doc.genericTree, 0);
      html += '</div></div>';
    }

    container.innerHTML = html;
  }

  _infoRow(label, value) {
    return `<div class="info-row"><span class="info-label">${label}</span><span class="info-value">${value || ''}</span></div>`;
  }

  _renderPartCard(part) {
    let html = '<div class="card">';
    html += `<div class="card-header"><strong>${part.name || part.id || 'Unnamed Part'}</strong>`;
    if (part.type) html += ` <span class="badge">${part.type}</span>`;
    html += '</div>';
    html += '<div class="card-body">';
    html += '<div class="info-grid">';
    if (part.id) html += this._infoRow('ID', part.id);
    if (part.material) html += this._infoRow('Material', part.material);
    if (part.length) html += this._infoRow('Length', part.length);
    if (part.width) html += this._infoRow('Width', part.width);
    if (part.height) html += this._infoRow('Height', part.height);
    html += '</div>';

    if (part.processings.length > 0) {
      html += `<h4>Processings (${part.processings.length})</h4>`;
      for (const proc of part.processings) {
        html += this._renderProcessingCard(proc);
      }
    }
    html += '</div></div>';
    return html;
  }

  _renderProcessingCard(proc) {
    let html = '<div class="card card-nested">';
    html += `<div class="card-header"><strong>${proc.type}</strong>`;
    if (proc.id) html += ` <span class="badge badge-secondary">${proc.id}</span>`;
    if (proc.referenceSide) html += ` <span class="badge badge-info">Side: ${proc.referenceSide}</span>`;
    html += '</div>';

    const params = Object.entries(proc.parameters || {});
    if (params.length > 0) {
      html += '<div class="card-body"><div class="info-grid">';
      for (const [k, v] of params) {
        html += this._infoRow(k, v);
      }
      html += '</div></div>';
    }
    html += '</div>';
    return html;
  }

  _renderTree(node, depth) {
    if (!node) return '';
    const indent = depth * 16;
    let html = `<div class="tree-node" style="padding-left:${indent}px">`;
    html += `<span class="tree-tag">&lt;${node.tagName}&gt;</span>`;

    const attrs = Object.entries(node.attributes || {});
    if (attrs.length > 0) {
      html += '<span class="tree-attrs">';
      for (const [k, v] of attrs) {
        html += ` ${k}="${v}"`;
      }
      html += '</span>';
    }
    if (node.text) {
      html += `<span class="tree-text">${node.text}</span>`;
    }
    html += '</div>';

    if (node.children) {
      for (const child of node.children) {
        html += this._renderTree(child, depth + 1);
      }
    }
    return html;
  }

  // ── Editor UI ────────────────────────────────────────────────────

  _updateEditorUI() {
    if (!this.editor) return;
    const doc = this.editor.getDocument();
    const container = document.getElementById('editor-parts');

    let html = '';

    // Project section
    html += '<div class="editor-section">';
    html += '<h3>Project Info</h3>';
    html += '<div class="form-row">';
    html += `<label>Name</label><input type="text" id="edit-project-name" value="${this._escHtml(doc.project?.name || '')}" />`;
    html += '</div><div class="form-row">';
    html += `<label>Description</label><input type="text" id="edit-project-desc" value="${this._escHtml(doc.project?.description || '')}" />`;
    html += '</div><div class="form-row">';
    html += `<label>Customer</label><input type="text" id="edit-project-customer" value="${this._escHtml(doc.project?.customer || '')}" />`;
    html += '</div></div>';

    // Parts
    doc.parts.forEach((part, i) => {
      html += `<div class="editor-section" data-part-index="${i}">`;
      html += `<div class="editor-section-header">`;
      html += `<h3>Part ${i + 1}: ${this._escHtml(part.name || part.id || 'Unnamed')}</h3>`;
      html += `<button class="btn btn-sm btn-danger" onclick="app._removePart(${i})">Remove</button>`;
      html += `<button class="btn btn-sm btn-secondary" onclick="app._duplicatePart(${i})">Duplicate</button>`;
      html += `</div>`;

      html += '<div class="form-grid">';
      html += this._editorField(`part-${i}-id`, 'ID', part.id);
      html += this._editorField(`part-${i}-name`, 'Name', part.name);
      html += this._editorField(`part-${i}-type`, 'Type', part.type);
      html += this._editorField(`part-${i}-material`, 'Material', part.material);
      html += this._editorField(`part-${i}-length`, 'Length', part.length, 'number');
      html += this._editorField(`part-${i}-width`, 'Width', part.width, 'number');
      html += this._editorField(`part-${i}-height`, 'Height', part.height, 'number');
      html += '</div>';

      // Processings
      if (part.processings.length > 0) {
        html += `<h4>Processings</h4>`;
        part.processings.forEach((proc, j) => {
          html += `<div class="editor-proc" data-proc-index="${j}">`;
          html += `<div class="editor-section-header">`;
          html += `<strong>${proc.type}</strong>`;
          html += `<button class="btn btn-sm btn-danger" onclick="app._removeProcessing(${i}, ${j})">Remove</button>`;
          html += `</div>`;
          html += '<div class="form-grid">';
          html += this._editorField(`proc-${i}-${j}-type`, 'Type', proc.type);
          html += this._editorField(`proc-${i}-${j}-id`, 'ID', proc.id);
          html += this._editorField(`proc-${i}-${j}-refside`, 'Ref Side', proc.referenceSide);

          for (const [pk, pv] of Object.entries(proc.parameters)) {
            html += this._editorField(`proc-${i}-${j}-param-${pk}`, pk, pv, typeof pv === 'number' ? 'number' : 'text');
          }
          html += '</div></div>';
        });
      }

      html += `<button class="btn btn-sm btn-primary" onclick="app._addProcessingToPart(${i})">+ Add Processing</button>`;
      html += '</div>';
    });

    container.innerHTML = html;

    // Update undo/redo state
    document.getElementById('btn-undo').disabled = !this.editor.canUndo;
    document.getElementById('btn-redo').disabled = !this.editor.canRedo;
  }

  _editorField(id, label, value, type = 'text') {
    const val = value !== null && value !== undefined ? value : '';
    return `<div class="form-row"><label for="${id}">${label}</label><input type="${type}" id="${id}" value="${this._escHtml(String(val))}" /></div>`;
  }

  _saveEdits() {
    if (!this.editor) return;
    const doc = this.editor.getDocument();

    // Save project
    this.editor.updateProject({
      name: document.getElementById('edit-project-name')?.value || '',
      description: document.getElementById('edit-project-desc')?.value || '',
      customer: document.getElementById('edit-project-customer')?.value || '',
    });

    // Save parts
    doc.parts.forEach((part, i) => {
      const getId = (field) => document.getElementById(`part-${i}-${field}`)?.value;
      this.editor.updatePart(i, {
        id: getId('id') || part.id,
        name: getId('name') || part.name,
        type: getId('type') || part.type,
        material: getId('material') || part.material,
        length: Number(getId('length')) || 0,
        width: Number(getId('width')) || 0,
        height: Number(getId('height')) || 0,
      });

      // Save processings
      part.processings.forEach((proc, j) => {
        const getProc = (field) => document.getElementById(`proc-${i}-${j}-${field}`)?.value;
        const updates = {
          type: getProc('type') || proc.type,
          id: getProc('id') || proc.id,
          referenceSide: getProc('refside') || proc.referenceSide,
        };
        this.editor.updateProcessing(i, j, updates);

        // Save parameters
        const paramUpdates = {};
        for (const pk of Object.keys(proc.parameters)) {
          const el = document.getElementById(`proc-${i}-${j}-param-${pk}`);
          if (el) {
            paramUpdates[pk] = el.type === 'number' ? Number(el.value) : el.value;
          }
        }
        if (Object.keys(paramUpdates).length > 0) {
          this.editor.updateProcessingParams(i, j, paramUpdates);
        }
      });
    });

    this._updateViewer();
    this._updateRawFromDocument();
    this._showSuccess('Changes saved successfully.');
  }

  _addPart() {
    if (!this.editor) {
      this._showError('Load a document first.');
      return;
    }
    this.editor.addPart({
      name: 'New Part',
      type: 'Timber',
      material: 'Wood',
      length: 1000,
      width: 100,
      height: 100,
    });
    this._updateEditorUI();
  }

  _removePart(index) {
    if (!this.editor) return;
    this.editor.removePart(index);
    this._updateEditorUI();
    this._updateViewer();
  }

  _duplicatePart(index) {
    if (!this.editor) return;
    this.editor.duplicatePart(index);
    this._updateEditorUI();
  }

  _addProcessingToPart(partIndex) {
    if (!this.editor) return;
    this.editor.addProcessingToPart(partIndex, {
      type: 'Cut',
      name: 'New Cut',
      referenceSide: '1',
      parameters: {
        Angle: 90,
        Depth: 50,
      },
    });
    this._updateEditorUI();
  }

  _removeProcessing(partIndex, procIndex) {
    if (!this.editor) return;
    this.editor.removeProcessing(partIndex, procIndex);
    this._updateEditorUI();
  }

  _undo() {
    if (!this.editor) return;
    this.editor.undo();
    this._updateEditorUI();
    this._updateViewer();
  }

  _redo() {
    if (!this.editor) return;
    this.editor.redo();
    this._updateEditorUI();
    this._updateViewer();
  }

  // ── Raw XML Editor ───────────────────────────────────────────────

  _updateRawEditor(xmlString) {
    const el = document.getElementById('raw-editor');
    if (el) el.value = xmlString;
  }

  _updateRawFromDocument() {
    if (!this.currentDocument) return;
    try {
      const xml = this.converter.jsonToBtl(this.currentDocument.toJSON());
      this._updateRawEditor(xml);
    } catch (err) {
      // Silently ignore; raw editor stays as-is
    }
  }

  _applyRawXml() {
    const el = document.getElementById('raw-editor');
    if (!el) return;
    const xml = el.value.trim();
    if (!xml) {
      this._showError('Raw XML editor is empty.');
      return;
    }
    this._loadDocument(xml, this.currentDocument?.metadata?.fileName || 'edited.btl');
  }

  // ── Converter ────────────────────────────────────────────────────

  _convertToJson() {
    if (!this.currentDocument) {
      this._showError('Load a document first.');
      return;
    }
    const json = JSON.stringify(this.currentDocument.toJSON(), null, 2);
    document.getElementById('converter-output').value = json;
    this._outputFormat = 'json';
    this._showSuccess('Converted to JSON.');
  }

  _convertToCsv() {
    if (!this.currentDocument) {
      this._showError('Load a document first.');
      return;
    }
    const csv = this.converter._documentToCsv(this.currentDocument);
    document.getElementById('converter-output').value = csv;
    this._outputFormat = 'csv';
    this._showSuccess('Converted to CSV.');
  }

  _convertToBtl() {
    if (!this.currentDocument) {
      // Try to convert from the output textarea content
      const outputEl = document.getElementById('converter-output');
      const content = outputEl.value.trim();
      if (!content) {
        this._showError('Load a document or paste JSON in the output area first.');
        return;
      }
      try {
        const xml = this.converter.jsonToBtl(content);
        outputEl.value = xml;
        this._outputFormat = 'btl';
        this._showSuccess('Converted JSON to BTL/XML.');
        return;
      } catch (err) {
        this._showError(`Conversion error: ${err.message}`);
        return;
      }
    }
    const xml = this.converter.jsonToBtl(this.currentDocument.toJSON());
    document.getElementById('converter-output').value = xml;
    this._outputFormat = 'btl';
    this._showSuccess('Converted to BTL/XML.');
  }

  _downloadOutput() {
    const output = document.getElementById('converter-output').value;
    if (!output) {
      this._showError('Nothing to download. Convert a document first.');
      return;
    }
    const ext = this._outputFormat === 'json' ? '.json' : this._outputFormat === 'csv' ? '.csv' : '.btl';
    const mime = this._outputFormat === 'json' ? 'application/json' : this._outputFormat === 'csv' ? 'text/csv' : 'application/xml';
    const baseName = (this.currentDocument?.metadata?.fileName || 'output').replace(/\.[^.]+$/, '');

    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = baseName + ext;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Notifications ────────────────────────────────────────────────

  _showError(msg) {
    this._showNotification(msg, 'error');
  }

  _showSuccess(msg) {
    this._showNotification(msg, 'success');
  }

  _showNotification(msg, type) {
    const container = document.getElementById('notifications');
    const el = document.createElement('div');
    el.className = `notification ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  // ── Helpers ──────────────────────────────────────────────────────

  _escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  _getSampleBTL() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<BTLDocument Version="2.0" Generator="BTLSuite" Date="2026-04-04">
  <Project Name="Sample Timber Frame" Description="A sample BTL document for demonstration">
    <Customer>Acme Construction</Customer>
    <Architect>Jane Smith</Architect>
  </Project>

  <Part Id="beam-001" Name="Main Ridge Beam" Type="Beam" Material="GL24h">
    <Length>6000</Length>
    <Width>200</Width>
    <Height>400</Height>

    <Cut Id="cut-001" ReferenceSide="1">
      <Angle>90</Angle>
      <Depth>400</Depth>
      <StartX>0</StartX>
    </Cut>

    <Cut Id="cut-002" ReferenceSide="1">
      <Angle>45</Angle>
      <Depth>200</Depth>
      <StartX>6000</StartX>
    </Cut>

    <Drilling Id="drill-001" ReferenceSide="2">
      <Diameter>16</Diameter>
      <Depth>200</Depth>
      <PositionX>500</PositionX>
      <PositionY>100</PositionY>
    </Drilling>
  </Part>

  <Part Id="rafter-001" Name="Rafter Left" Type="Rafter" Material="C24">
    <Length>4500</Length>
    <Width>100</Width>
    <Height>200</Height>

    <Birdsmouth Id="bm-001" ReferenceSide="1">
      <Depth>50</Depth>
      <Length>100</Length>
      <Angle>30</Angle>
    </Birdsmouth>

    <Notch Id="notch-001" ReferenceSide="3">
      <Width>100</Width>
      <Depth>50</Depth>
      <StartX>2000</StartX>
      <Length>200</Length>
    </Notch>
  </Part>

  <Part Id="post-001" Name="Corner Post" Type="Post" Material="GL24h">
    <Length>3000</Length>
    <Width>200</Width>
    <Height>200</Height>

    <Tenon Id="tenon-001" ReferenceSide="5">
      <Width>80</Width>
      <Height>60</Height>
      <Length>50</Length>
    </Tenon>

    <Mortise Id="mortise-001" ReferenceSide="1">
      <Width>82</Width>
      <Height>62</Height>
      <Depth>55</Depth>
      <PositionX>0</PositionX>
      <PositionY>60</PositionY>
    </Mortise>
  </Part>
</BTLDocument>`;
  }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new BTLApp();
});
