const fs = require('fs');

const source = fs.readFileSync('app.js', 'utf8');
const elements = new Map();
const element = () => ({
  value: '', checked: false, options: [], style: {}, className: '', textContent: '', innerHTML: '',
  children: [],
  classList: { toggle() {}, add() {}, remove() {} }, closest() { return null; }, replaceChildren() { this.children = []; },
  append(child) { this.children.push(child); }, setAttribute() {}, showModal() {}, close() {}, click() {}
});
const get = id => {
  if (!elements.has(id)) elements.set(id, element());
  return elements.get(id);
};
const documentMock = {
  getElementById: get,
  querySelectorAll() { return []; },
  createElement() { return element(); }
};
const localStorageMock = { getItem() { return null; }, setItem() {} };

const app = Function('localStorage', 'document', 'confirm', 'navigator',
  `${source}; return { batchRecordNumber, makeWinningEntry, winningEntryRecordNumber, winningEntryBatchId, setBetEntries: rows => { betEntries = rows; } };`
)(localStorageMock, documentMock, () => false, { clipboard: { writeText() {} } });

const records = [
  { id: 'a-first', record: 1, batchId: 'a' },
  { id: 'b-first', record: 2, batchId: 'b' },
  { id: 'a-second', record: 3, batchId: 'a' },
  { id: 'b-second', record: 4, batchId: 'b' }
];
app.setBetEntries(records);
const numbers = Object.fromEntries(records.map(record => [record.id, app.batchRecordNumber(record)]));
if (JSON.stringify(numbers) !== JSON.stringify({ 'a-first': 1, 'b-first': 1, 'a-second': 2, 'b-second': 2 })) {
  throw new Error(`batch sequence should restart per batch: ${JSON.stringify(numbers)}`);
}

const win = app.makeWinningEntry(records[3], '体彩', '组选', '123', 2, 173, 0);
if (win.batchRecord !== 2 || app.winningEntryRecordNumber(win) !== 2 || app.winningEntryBatchId(win) !== 'b') {
  throw new Error(`winner rows must use the source batch number: ${JSON.stringify(win)}`);
}

const rerecorded = { id: 'a-rerecorded', record: 5, batchId: 'a' };
app.setBetEntries([rerecorded]);
if (app.batchRecordNumber(rerecorded) !== 1) {
  throw new Error('a cleared batch must restart at 1 when recorded again');
}

console.log('BATCH_RECORD_NUMBER passed=3 failed=0');
