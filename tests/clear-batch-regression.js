const fs = require('fs');
const assert = require('assert/strict');
const source = fs.readFileSync('app.js', 'utf8');
function setup(filter, accepted = true) {
  const elements = new Map();
  const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
  const get = id => { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); };
  const storage = new Map([
    ['lottery-bet-batches-v1', JSON.stringify([{id:'first',label:'第一批'}, {id:'second',label:'第二批'}, {id:'empty',label:'空批次'}])],
    ['lottery-active-batch-v1', 'first'],
    ['lottery-bet-ledger-v1', JSON.stringify([
      {id:'one',record:1,batchId:'first',original:'福123直1元',amount:1},
      {id:'two',record:2,batchId:'second',original:'体456直2元',amount:2},
      {id:'legacy',record:3,original:'福789直3元',amount:3}
    ])]
  ]);
  const prompts = [];
  const api = Function('localStorage', 'document', 'confirm', 'navigator', 'setTimeout', `${source}; return {
    setFilter(value) { currentBetBatchFilter = value; },
    bets: () => betEntries, batches: () => betBatches, active: () => activeBetBatchId
  };`)(
    {getItem:key=>storage.get(key) ?? null, setItem:(key,value)=>storage.set(key,value)},
    {getElementById:get,querySelectorAll:()=>[],createElement:element},
    message => { prompts.push(message); return accepted; }, {}, () => 0
  );
  api.setFilter(filter);
  const before = JSON.stringify(api.bets());
  get('resetBetData').onclick();
  return {api,storage,prompts,before};
}
const active = setup('active');
assert.deepEqual(active.api.bets().map(entry=>entry.id), ['two']);
assert.equal(active.api.batches().length, 3);
assert.equal(active.api.active(), 'first');
assert.match(active.prompts[0], /第一批.*2条/);
assert.deepEqual(JSON.parse(active.storage.get('lottery-bet-ledger-v1')), active.api.bets());
const selected = setup('second');
assert.deepEqual(selected.api.bets().map(entry=>entry.id), ['one','legacy']);
assert.match(selected.prompts[0], /第二批.*1条/);
assert.equal(selected.api.active(), 'first');
for (const filter of ['all','missing','empty']) {
  const result = setup(filter);
  assert.equal(JSON.stringify(result.api.bets()), result.before);
  assert.equal(result.prompts.length, 0);
}
const cancelled = setup('active', false);
assert.equal(JSON.stringify(cancelled.api.bets()), cancelled.before);
console.log('PASS clear current/selected batch, preserve other batches, cancellation, all/invalid/empty guards and persistence');
