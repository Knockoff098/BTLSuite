/**
 * BTL Suite - Node.js Test Runner
 * Run with: node tests/btl-tests.js
 *
 * Uses a minimal JSDOM-like approach for DOM parsing in Node.
 * Falls back to regex-based validation if no DOM available.
 */

// Minimal test framework
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.log(`  FAIL: ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.log(`  FAIL: ${message} (expected: ${JSON.stringify(expected)}, got: ${JSON.stringify(actual)})`);
  }
}

function suite(name) {
  console.log(`\n== ${name} ==`);
}

// ── Check if we can run DOM-based tests ────────────────────────

let canRunDom = false;
try {
  // Try to use jsdom if available
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.DOMParser = dom.window.DOMParser;
  global.XMLSerializer = dom.window.XMLSerializer;
  global.Node = dom.window.Node;
  global.document = dom.window.document;
  canRunDom = true;
} catch (e) {
  // jsdom not available, try linkedom
  try {
    const { parseHTML } = require('linkedom');
    const { document: doc, DOMParser: DP, XMLSerializer: XS, Node: N } = parseHTML('<!DOCTYPE html><html><body></body></html>');
    global.DOMParser = DP;
    global.XMLSerializer = XS;
    global.Node = N;
    global.document = doc;
    canRunDom = true;
  } catch (e2) {
    console.log('Note: No DOM library available (jsdom/linkedom). Running structural tests only.\n');
  }
}

// ── Sample BTL XML ─────────────────────────────────────────────

const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<BTLDocument Version="2.0" Generator="BTLSuite" Date="2026-04-04">
  <Project Name="Test Project" Description="Test description">
    <Customer>Test Customer</Customer>
    <Architect>Test Architect</Architect>
  </Project>
  <Part Id="beam-001" Name="Main Beam" Type="Beam" Material="GL24h">
    <Length>6000</Length>
    <Width>200</Width>
    <Height>400</Height>
    <Cut Id="cut-001" ReferenceSide="1">
      <Angle>90</Angle>
      <Depth>400</Depth>
    </Cut>
    <Drilling Id="drill-001" ReferenceSide="2">
      <Diameter>16</Diameter>
      <Depth>200</Depth>
    </Drilling>
  </Part>
  <Part Id="rafter-001" Name="Rafter" Type="Rafter" Material="C24">
    <Length>4500</Length>
    <Width>100</Width>
    <Height>200</Height>
  </Part>
</BTLDocument>`;

if (canRunDom) {
  // Load source files
  const fs = require('fs');
  const path = require('path');
  const vm = require('vm');

  const srcDir = path.join(__dirname, '..', 'src');
  const files = ['btl-parser.js', 'btl-converter.js', 'btl-editor.js', 'btl-validator.js', 'btl-diff.js', 'btl-search.js'];

  const context = vm.createContext({
    DOMParser: global.DOMParser,
    XMLSerializer: global.XMLSerializer,
    Node: global.Node,
    document: global.document,
    console: console,
    module: { exports: {} },
    Date: Date,
    Number: Number,
    JSON: JSON,
    Object: Object,
    Array: Array,
    String: String,
    Set: Set,
    Map: Map,
    Error: Error,
    isNaN: isNaN,
    parseInt: parseInt,
    parseFloat: parseFloat,
    setTimeout: setTimeout,
  });

  for (const file of files) {
    const code = fs.readFileSync(path.join(srcDir, file), 'utf8');
    // Reset module.exports before each file so classes are captured
    context.module = { exports: {} };
    vm.runInContext(code, context);
    // Copy exported classes to context globals
    for (const [key, val] of Object.entries(context.module.exports)) {
      context[key] = val;
    }
  }

  // ── Parser Tests ─────────────────────────────────────────────

  suite('BTLParser - Basic Parsing');

  const parser = new context.BTLParser();
  const doc = parser.parse(sampleXml);

  assertEqual(doc.rootTagName, 'BTLDocument', 'Root tag name is BTLDocument');
  assertEqual(doc.rootAttributes['Version'], '2.0', 'Version attribute is 2.0');
  assertEqual(doc.metadata.version, '2.0', 'Metadata version extracted');

  suite('BTLParser - Project');

  assert(doc.project !== null, 'Project is parsed');
  assertEqual(doc.project.name, 'Test Project', 'Project name');
  assertEqual(doc.project.customer, 'Test Customer', 'Project customer');

  suite('BTLParser - Parts');

  assertEqual(doc.parts.length, 2, 'Two parts parsed');
  assertEqual(doc.parts[0].id, 'beam-001', 'First part ID');
  assertEqual(doc.parts[0].name, 'Main Beam', 'First part name');
  assertEqual(doc.parts[0].length, 6000, 'First part length');

  suite('BTLParser - Processings');

  assertEqual(doc.parts[0].processings.length, 2, 'First part has 2 processings');
  assertEqual(doc.parts[0].processings[0].type, 'Cut', 'First processing is Cut');
  assertEqual(doc.parts[0].processings[0].parameters['Angle'], 90, 'Cut angle');

  // ── Converter Tests ──────────────────────────────────────────

  suite('BTLConverter - To JSON');

  const converter = new context.BTLConverter();
  const jsonStr = converter.btlToJson(sampleXml);
  const jsonObj = JSON.parse(jsonStr);

  assert(jsonObj.rootTagName === 'BTLDocument', 'JSON has root tag');
  assert(jsonObj.parts.length === 2, 'JSON has 2 parts');

  suite('BTLConverter - To CSV');

  const csv = converter.btlToCsv(sampleXml);
  assert(csv.includes('beam-001'), 'CSV contains beam ID');
  assert(csv.includes('Section: Parts'), 'CSV has Parts section');

  suite('BTLConverter - Roundtrip');

  const btlXml = converter.jsonToBtl(jsonObj);
  assert(btlXml.includes('BTLDocument'), 'Roundtrip has root tag');
  assert(btlXml.includes('beam-001'), 'Roundtrip has part ID');

  const doc2 = parser.parse(btlXml);
  assertEqual(doc2.parts.length, 2, 'Roundtrip re-parsed: 2 parts');

  // ── Editor Tests ─────────────────────────────────────────────

  suite('BTLEditor - Basic Operations');

  const editorDoc = parser.parse(sampleXml);
  const editor = new context.BTLEditor(editorDoc);

  assertEqual(editor.getDocument().parts.length, 2, 'Editor starts with 2 parts');

  editor.addPart({ id: 'post-001', name: 'Post', length: 3000 });
  assertEqual(editor.getDocument().parts.length, 3, 'After add: 3 parts');

  editor.undo();
  assertEqual(editor.getDocument().parts.length, 2, 'After undo: 2 parts');

  editor.redo();
  assertEqual(editor.getDocument().parts.length, 3, 'After redo: 3 parts');

  editor.removePart(2);
  assertEqual(editor.getDocument().parts.length, 2, 'After remove: 2 parts');

  editor.duplicatePart(0);
  assertEqual(editor.getDocument().parts.length, 3, 'After duplicate: 3 parts');

  editor.clearAll();
  assertEqual(editor.getDocument().parts.length, 0, 'After clear: 0 parts');

  // ── Validator Tests ─────────────────────────────────────────

  suite('BTLValidator - Valid Document');

  const validator = new context.BTLValidator();
  const validDoc = parser.parse(sampleXml);
  const validReport = validator.validate(validDoc);

  assert(validReport.isValid, 'Sample document passes validation');
  assertEqual(validReport.errors.length, 0, 'No errors in valid document');
  assert(validReport.warnings.length >= 0, 'Warnings count is a number');

  suite('BTLValidator - Invalid Document');

  const invalidDoc = parser.parse(sampleXml);
  invalidDoc.parts.push({
    id: '',
    name: '',
    type: '',
    material: '',
    length: -5,
    width: 0,
    height: 0,
    processings: [{
      type: '',
      id: '',
      name: '',
      referenceSide: '99',
      attributes: {},
      parameters: { Angle: 500, Depth: -10, Diameter: -1 },
      children: { tagName: 'Processing', attributes: {}, text: '', children: [] },
    }],
    attributes: {},
    children: { tagName: 'Part', attributes: {}, text: '', children: [] },
  });

  const invalidReport = validator.validate(invalidDoc);
  assert(!invalidReport.isValid, 'Document with bad part fails validation');
  assert(invalidReport.errors.length > 0, 'Has errors for invalid values');

  suite('BTLValidator - Duplicate IDs');

  const dupDoc = parser.parse(sampleXml);
  dupDoc.parts.push(JSON.parse(JSON.stringify(dupDoc.parts[0])));
  const dupReport = validator.validate(dupDoc);
  assert(dupReport.errors.some(e => e.message.includes('Duplicate')), 'Detects duplicate part IDs');

  suite('BTLValidator - Summary');

  assert(typeof validReport.getSummary() === 'string', 'getSummary returns string');
  assert(typeof invalidReport.issueCount === 'number', 'issueCount is a number');
  assert(invalidReport.issueCount > 0, 'Invalid doc has issues');

  // ── Diff Tests ────────────────────────────────────────────────

  suite('BTLDiff - Identical Documents');

  const diffDocA = parser.parse(sampleXml);
  const diffDocB = parser.parse(sampleXml);
  const identicalReport = context.BTLDiff.compare(diffDocA, diffDocB);

  assert(!identicalReport.hasDifferences, 'Identical docs have no differences');
  assertEqual(identicalReport.totalDifferences, 0, 'Zero total differences');

  suite('BTLDiff - Modified Document');

  const modifiedXml = sampleXml.replace('Main Beam', 'Modified Beam').replace('6000', '7000');
  const diffDocC = parser.parse(modifiedXml);
  const modReport = context.BTLDiff.compare(diffDocA, diffDocC);

  assert(modReport.hasDifferences, 'Modified doc has differences');
  assert(modReport.changes.length > 0, 'Has changes');
  assert(modReport.toList().length > 0, 'toList returns items');

  suite('BTLDiff - Added/Removed Parts');

  const addedPartDoc = parser.parse(sampleXml);
  addedPartDoc.parts.push({
    id: 'new-part',
    name: 'New Part',
    type: 'Post',
    material: 'C24',
    length: 2000,
    width: 100,
    height: 100,
    processings: [],
    attributes: {},
    children: { tagName: 'Part', attributes: {}, text: '', children: [] },
  });

  const addReport = context.BTLDiff.compare(diffDocA, addedPartDoc);
  assert(addReport.additions.length > 0, 'Detects added part');

  const removeReport = context.BTLDiff.compare(addedPartDoc, diffDocA);
  assert(removeReport.removals.length > 0, 'Detects removed part');

  suite('BTLDiff - Summary');

  assert(typeof identicalReport.getSummary() === 'string', 'Identical diff summary is string');
  assert(identicalReport.getSummary().includes('identical'), 'Identical summary says identical');

  // ── Search Tests ──────────────────────────────────────────────

  suite('BTLSearch - Part Search');

  const searchDoc = parser.parse(sampleXml);
  const search = new context.BTLSearch(searchDoc);

  const beamResults = search.searchParts('beam');
  assert(beamResults.length > 0, 'Finds beam by name search');
  assert(beamResults[0].matches.includes('name') || beamResults[0].matches.includes('id'), 'Match includes field name');

  const noResults = search.searchParts('nonexistent12345');
  assertEqual(noResults.length, 0, 'No results for nonexistent query');

  suite('BTLSearch - Processing Search');

  const cutResults = search.searchProcessings('cut');
  assert(cutResults.length > 0, 'Finds Cut processings');

  const drillResults = search.searchProcessings('drilling');
  assert(drillResults.length > 0, 'Finds Drilling processings');

  suite('BTLSearch - Filter Parts');

  const beamFilter = search.filterParts({ type: 'Beam' });
  assert(beamFilter.length > 0, 'Filter by type finds beams');
  assert(beamFilter.every(r => r.part.type === 'Beam'), 'All filtered results are Beams');

  const materialFilter = search.filterParts({ material: 'GL24h' });
  assert(materialFilter.length > 0, 'Filter by material works');

  const lengthFilter = search.filterParts({ minLength: 5000 });
  assert(lengthFilter.length > 0, 'Filter by min length works');
  assert(lengthFilter.every(r => r.part.length >= 5000), 'All results meet min length');

  const noFilter = search.filterParts({});
  assertEqual(noFilter.length, searchDoc.parts.length, 'Empty filter returns all parts');

  suite('BTLSearch - Unique Values');

  const types = search.getUniqueValues('type');
  assert(Array.isArray(types), 'getUniqueValues returns array');
  assert(types.length > 0, 'Has unique types');

  const procTypes = search.getProcessingTypes();
  assert(Array.isArray(procTypes), 'getProcessingTypes returns array');
  assert(procTypes.includes('Cut'), 'Processing types include Cut');

  suite('BTLSearch - Statistics');

  const stats = search.getStatistics();
  assertEqual(stats.totalParts, 2, 'Stats: 2 total parts');
  assert(stats.totalProcessings > 0, 'Stats: has processings');
  assert(stats.totalVolumeCubicMeters > 0, 'Stats: volume is positive');
  assert(typeof stats.partsByType === 'object', 'Stats: partsByType is object');
  assert(typeof stats.procsByType === 'object', 'Stats: procsByType is object');
  assert(stats.dimensions.length.min > 0, 'Stats: length min is positive');
  assert(stats.dimensions.length.max >= stats.dimensions.length.min, 'Stats: length max >= min');

} else {
  // Structural / regex tests when no DOM is available
  suite('Structural Tests - XML Content Validation');

  assert(sampleXml.includes('BTLDocument'), 'Sample has BTLDocument root');
  assert(sampleXml.includes('Version="2.0"'), 'Sample has version');
  assert(sampleXml.includes('beam-001'), 'Sample has beam part');
  assert(sampleXml.includes('rafter-001'), 'Sample has rafter part');
  assert(sampleXml.includes('<Cut'), 'Sample has Cut processing');
  assert(sampleXml.includes('<Drilling'), 'Sample has Drilling processing');
  assert(sampleXml.includes('<Length>6000</Length>'), 'Sample has length value');

  suite('Structural Tests - Source File Existence');

  const fs = require('fs');
  const path = require('path');

  const expectedFiles = [
    'src/btl-parser.js',
    'src/btl-converter.js',
    'src/btl-editor.js',
    'src/btl-validator.js',
    'src/btl-diff.js',
    'src/btl-search.js',
    'src/app.js',
    'index.html',
    'styles.css',
  ];

  for (const file of expectedFiles) {
    const fullPath = path.join(__dirname, '..', file);
    assert(fs.existsSync(fullPath), `File exists: ${file}`);
  }

  suite('Structural Tests - Source File Content');

  const parserSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'btl-parser.js'), 'utf8');
  assert(parserSrc.includes('class BTLParser'), 'Parser has BTLParser class');
  assert(parserSrc.includes('class BTLDocument'), 'Parser has BTLDocument class');
  assert(parserSrc.includes('parse('), 'Parser has parse method');

  const converterSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'btl-converter.js'), 'utf8');
  assert(converterSrc.includes('class BTLConverter'), 'Converter has BTLConverter class');
  assert(converterSrc.includes('btlToJson'), 'Converter has btlToJson');
  assert(converterSrc.includes('btlToCsv'), 'Converter has btlToCsv');
  assert(converterSrc.includes('jsonToBtl'), 'Converter has jsonToBtl');

  const editorSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'btl-editor.js'), 'utf8');
  assert(editorSrc.includes('class BTLEditor'), 'Editor has BTLEditor class');
  assert(editorSrc.includes('addPart'), 'Editor has addPart');
  assert(editorSrc.includes('undo'), 'Editor has undo');
  assert(editorSrc.includes('redo'), 'Editor has redo');

  const validatorSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'btl-validator.js'), 'utf8');
  assert(validatorSrc.includes('class BTLValidator'), 'Validator has BTLValidator class');
  assert(validatorSrc.includes('validate'), 'Validator has validate method');
  assert(validatorSrc.includes('class BTLValidationReport'), 'Validator has BTLValidationReport class');

  const diffSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'btl-diff.js'), 'utf8');
  assert(diffSrc.includes('class BTLDiff'), 'Diff has BTLDiff class');
  assert(diffSrc.includes('compare'), 'Diff has compare method');
  assert(diffSrc.includes('class BTLDiffReport'), 'Diff has BTLDiffReport class');

  const searchSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'btl-search.js'), 'utf8');
  assert(searchSrc.includes('class BTLSearch'), 'Search has BTLSearch class');
  assert(searchSrc.includes('searchParts'), 'Search has searchParts');
  assert(searchSrc.includes('filterParts'), 'Search has filterParts');
  assert(searchSrc.includes('getStatistics'), 'Search has getStatistics');
}

// ── Summary ────────────────────────────────────────────────────

console.log(`\n========================================`);
console.log(`Results: ${passed}/${passed + failed} passed${failed > 0 ? ` (${failed} FAILED)` : ' - All tests passed!'}`);
console.log(`========================================\n`);

process.exit(failed > 0 ? 1 : 0);
