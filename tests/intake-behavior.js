const fs = require('fs');

const source = fs.readFileSync('app.js', 'utf8');
const elements = new Map();
const element = () => ({
  value: '', checked: false, options: [], style: {}, className: '', textContent: '', innerHTML: '',
  classList: { toggle() {}, add() {}, remove() {} }, closest() { return null; }, replaceChildren() {},
  append() {}, setAttribute() {}, showModal() {}, close() {}, click() {}
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
const originalSetTimeout = global.setTimeout;
global.setTimeout = callback => { callback(); return 0; };

try {
  const app = Function('localStorage', 'document', 'confirm', 'navigator',
    `${source}; return { entries: () => betEntries };`
  )(localStorageMock, documentMock, () => false, { clipboard: { writeText() {} } });

  const text = '福123 456直组各一倍';
  get('autoMode').checked = false;
  get('rawBetText').value = text;
  get('rawBetText').onpaste();
  if (get('calculatedBetAmount').value !== 8 || app.entries().length !== 0) {
    throw new Error('关闭自动计算后，粘贴应仅试算，不应自动记录');
  }

  get('autoCalculate').onclick();
  if (app.entries().length !== 1 || app.entries()[0].amount !== 8) {
    throw new Error('点击计算并记录后，应写入试算金额');
  }
  console.log('PASS 关闭自动计算后仅试算，点击后记录');
} finally {
  global.setTimeout = originalSetTimeout;
}
