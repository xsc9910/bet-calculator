const STORAGE_KEY = 'lottery-checker-v1';
const BET_STORAGE_KEY = 'lottery-bet-ledger-v1';
const BET_BATCH_STORAGE_KEY = 'lottery-bet-batches-v1';
const ACTIVE_BET_BATCH_KEY = 'lottery-active-batch-v1';

const seedBetAmounts = [14,8,344,52,44,16,24,120,50,32,8,8,4,6,4,10,20,8,8,36,24,10,10,626,436,60,60,40,20,76,40,24,32,20,84,60,200,70,196,6,24,26,38,40,48,25,92.4,20,150.9,800,24,50,20,32,24,48,60,20,10,36,48,50,16,32,75,100,26,20,10,76,10,4,12,70,8,50,48,48,36,2,62.5,100,118,60,66,10,10,60,20,20,16,10,6,38,4,10,18,200,12,10,108.4,34,10,20,4,10,7.2,10,16,8,12,62,16,15,56,36,28,12,4,40,41,31,12,145,12,30,38,60,40,44,20,10,198,22,36,10,14,30,8,4,20,10.8,5.4,4.5,119.5,5.6,32,4,10,2,30,32,8,56,6,12,12,2,40,50,48,50,2,176,30,22,20,20,15,32,6,5.6,21,80,30,8,20,12,360,52,82,271,8,20,10,43.8,54,3.5,110,44,200,100,10,18,4,16,100,12,28,5,4,30,6,40,48,66,60,10,10,40,20,2,200,36,30,8,44,66,474,22,24,10,2,32,100,16,4,128,15,162,20,20,12,14,16,120,6,24,128,20,100,62,6,72,18,90,10,76,164,271.5,31,2,20,108,54,48,20,30,24,10,6,8,38,100,28,280,87.5,144,36,32,6,120,20,248,20,738,60,6,2,34,12,4,20,16,8,50,12,12,20,38,20,3,30,30,54,60,48,50,20,4,6,30,18,20,50,44,20,38,20,6,24,20,20,8,4,10,120,40,16,12,20,12,4,58,40,4,8,14,4,138.6,78,5.4,10,3.6,60,24,22,46.2,202,70,40,26,20,218,3,20,40,24,4];
const seedAnomalies = {20:['多',2],24:['多',20],49:['多',0.6],115:['少',24],116:['多',24],145:['多',0.5],186:['少',0.6],219:['少',9],330:['多',0.3],345:['多',0.6]};
const makeSeedBets = () => seedBetAmounts.map((amount, i) => {
  const record = i + 1;
  const anomaly = seedAnomalies[record];
  const claimed = anomaly ? Number((anomaly[0] === '多' ? amount - anomaly[1] : amount + anomaly[1]).toFixed(2)) : amount;
  return { id: `bet-${record}`, record, original: '', amount, claimed };
});

const seedEntries = [
  ['24','福彩','850直选1元',950], ['25','福彩','850直选1元',950],
  ['28','福彩','805组选2元',310], ['44','福彩','012589六码组六10元',79],
  ['49','福彩','850直选0.3元',285], ['61','福彩','850直选2倍',3800],
  ['66','福彩','05双飞2倍',340], ['168','福彩','805组选1元',155],
  ['177','福彩','805组选1元（重复记录照算）',155], ['180','福彩','058组选1元',155],
  ['182','福彩','850直选1元',950], ['189','福彩','0124589七码组六10元',45],
  ['197','福彩','023589六码组六10倍',790], ['210','福彩','独胆5，20元',70],
  ['230','福彩','035678与023568组六各40元',632], ['236','福彩','01568五码组六30元',465],
  ['241','福彩','独胆5，50元',175], ['242','福彩','850直选0.5元',475],
  ['249','福彩','粘边赖组六胆58，胆5和胆8各中一次',600], ['276','福彩','850直选1元',950],
  ['277','福彩','独胆8，20元',70], ['290','福彩','02568五码组六20元',310],
  ['293','福彩','05789五码组六及045789六码组六',234],
  ['101','体彩','069直选0.2元',190], ['173','体彩','690组选0.3元',46.5],
  ['186','体彩','690组选0.2元',31], ['330','体彩','069直选0.3元',285],
  ['338','体彩','069直选0.1元',95], ['339','体彩','069直选1元；069、096组选各1元',1260]
].map(([record, lottery, match, prize], i) => ({ id: `seed-${i}`, record, lottery, match, prize }));

const plays = {
  direct: { name: '直选', base: 2, prize: 1900 },
  group6: { name: '组六单式', base: 2, prize: 310 },
  group3: { name: '组三单式', base: 2, prize: 620 },
  group6Multi: { name: '组六复式', base: 10, prizeBySize: {4:380,5:155,6:79,7:45,8:28,9:19,10:13} },
  group3Multi: { name: '组三复式', base: 10, prizeBySize: {2:1550,3:530,4:260,5:155,6:105,7:75,8:55,9:43,10:35} },
  directMulti: { name: '直选复式', base: 10, prizeBySize: {3:350,4:145,5:75,6:43,7:25,8:18,9:12} },
  leopardPack: { name: '豹子全包', base: 10, prize: 800 },
  singleDigit: { name: '独胆', base: 10, prize: 35 },
  doubleFly: { name: '双飞', base: 10, prize: 170 },
  pair: { name: '对子', base: 10, prize: 320 },
  pos1: { name: '一码定位', base: 10, prize: 95 },
  pos2: { name: '二码定位', base: 10, prize: 950 },
  sum: { name: '和值', base: 10, prizes: {0:8000,1:3100,2:1580,3:940,4:610,5:420,6:320,7:250,8:200,9:160,10:140,11:130,12:120,13:115,14:115,15:120,16:130,17:140,18:160,19:200,20:250,21:320,22:420,23:610,24:940,25:1580,26:3100,27:8000} },
  span: { name: '跨度', base: 10, prizes: {0:800,1:175,2:98,3:75,4:65,5:63,6:65,7:75,8:98,9:175} },
  circle6: { name: '转圈组六', prize: 1900, baseBySize: {3:12,4:48,5:120,6:240,7:420,8:672,9:1008,10:1440} },
  circle3: { name: '转圈组三', prize: 1900, baseBySize: {2:12,3:36,4:72,5:120,6:180,7:252,8:336,9:432,10:540} },
  group6Dan: { name: '组六胆拖', base: 10, prizeBySize: {2:1550,3:510,4:258,5:155,6:103,7:73,8:55,9:43} },
  group3Dan: { name: '组三胆拖', base: 10, prizeBySize: {2:770,3:515,4:385,5:310,6:258,7:215,8:190,9:170} },
  sticky6: { name: '粘边赖组六', prize: 300, baseByCount: {1:72,2:128,3:170,4:200,5:220,6:232,7:238} },
  sticky3: { name: '粘边赖组三', prize: 600, baseByCount: {1:36,2:68,3:96,4:120,5:140,6:156,7:168} },
  group3Pack: { name: '组三全包 / 打包组三', base: 180, prize: 600 },
  custom: { name: '自定义赔率' }
};

let entries = loadEntries();
let betEntries = loadBetEntries();
let betBatches = loadBetBatches();
let activeBetBatchId = loadActiveBetBatchId();
let currentBetBatchFilter = 'active';
let currentFilter = 'all';

const $ = (id) => document.getElementById(id);
const money = (value) => Number(value.toFixed(2)).toString();
const normalize3 = (value) => String(value).replace(/\D/g, '').slice(0, 3).padStart(3, '0');
const tokens = (value) => value.split(/[\s,，.。+\-\/\\*;；:：]+/).map(v => v.trim()).filter(Boolean);

function loadEntries() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return [];
    const actualEntries = saved.filter(entry => !String(entry.id || '').startsWith('seed-'));
    if (actualEntries.length !== saved.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(actualEntries));
    }
    return actualEntries;
  } catch { return []; }
}
function saveEntries() { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }
function loadBetEntries() {
  try {
    const saved = JSON.parse(localStorage.getItem(BET_STORAGE_KEY));
    // 加载只读取，不筛除、不重排、更不回写，避免代码更新影响用户历史记录。
    return Array.isArray(saved) ? saved : [];
  } catch { return []; }
}
function saveBetEntries() { localStorage.setItem(BET_STORAGE_KEY, JSON.stringify(betEntries)); }
function loadBetBatches() {
  try {
    const saved = JSON.parse(localStorage.getItem(BET_BATCH_STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch { return []; }
}
function saveBetBatches() { localStorage.setItem(BET_BATCH_STORAGE_KEY, JSON.stringify(betBatches)); }
function createBetBatch(label = '') {
  const batch = {
    id: `batch-${Date.now()}-${betBatches.length + 1}`,
    label: label || `第${betBatches.length + 1}批`,
    startedAt: new Date().toISOString(),
    endedAt: null
  };
  betBatches.push(batch);
  saveBetBatches();
  return batch;
}
function loadActiveBetBatchId() {
  const saved = localStorage.getItem(ACTIVE_BET_BATCH_KEY);
  const active = betBatches.find(batch => batch.id === saved);
  if (active) return active.id;
  const existing = betBatches[0];
  if (existing) {
    localStorage.setItem(ACTIVE_BET_BATCH_KEY, existing.id);
    return existing.id;
  }
  const created = createBetBatch();
  localStorage.setItem(ACTIVE_BET_BATCH_KEY, created.id);
  return created.id;
}
function activeBetBatch() {
  return betBatches.find(batch => batch.id === activeBetBatchId) || null;
}
function entryBatchId(entry) { return entry.batchId || activeBetBatchId; }
function entriesForBetBatch(filter = currentBetBatchFilter) {
  if (filter === 'all') return betEntries;
  const batchId = filter === 'active' ? activeBetBatchId : filter;
  return betEntries.filter(entry => entryBatchId(entry) === batchId);
}
function batchSummary(batchId) {
  const rows = betEntries.filter(entry => entryBatchId(entry) === batchId);
  return { count: rows.length, total: rows.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0) };
}
function batchLabel(batchId) {
  const batch = betBatches.find(item => item.id === batchId);
  return batch ? batch.label : '当前统计';
}
function assignLegacyEntriesToActiveBatch() {
  let changed = false;
  betEntries.forEach(entry => {
    if (!entry.batchId) { entry.batchId = activeBetBatchId; changed = true; }
  });
  return changed;
}

function totals() {
  return entries.reduce((a, e) => {
    a[e.lottery] += Number(e.prize) || 0;
    a.count[e.lottery] += 1;
    return a;
  }, { 福彩: 0, 体彩: 0, count: { 福彩: 0, 体彩: 0 } });
}

function render() {
  const sum = totals();
  const activeEntries = entriesForBetBatch('active');
  const betTotal = activeEntries.reduce((n, e) => n + (Number(e.amount) || 0), 0);
  const anomalyTotal = activeEntries.filter(e => anomalyFor(e)).length;
  $('betCount').textContent = activeEntries.length;
  $('betTotal').textContent = money(betTotal);
  $('anomalyCount').textContent = anomalyTotal;

  const q = $('searchInput').value.trim().toLowerCase();
  const visible = entries.filter(e => (currentFilter === 'all' || e.lottery === currentFilter) &&
    (!q || `${e.record} ${e.lottery} ${e.match}`.toLowerCase().includes(q)));
  $('ledgerBody').innerHTML = visible.length ? visible.map(e => `
    <tr>
      <td>第${escapeHtml(e.record)}条</td>
      <td><span class="tag ${e.lottery === '福彩' ? 'welfare' : 'sports'}">${e.lottery}</span></td>
      <td>${escapeHtml(e.match)}</td>
      <td class="win-number">${money(Number(e.stake) || 0)}</td>
      <td class="win-number">${money(Number(e.odds) || 0)}</td>
      <td class="win-number">${money(Number(e.prize) || 0)}</td>
      <td><button class="icon-btn delete" data-id="${e.id}" title="删除" aria-label="删除">×</button></td>
    </tr>`).join('') : '<tr><td colspan="5" class="empty-row">没有符合条件的记录</td></tr>';

  const formulaEntries = currentFilter === 'all' ? entries : entries.filter(e => e.lottery === currentFilter);
  const values = formulaEntries.map(e => money(Number(e.prize) || 0));
  const total = formulaEntries.reduce((n, e) => n + (Number(e.prize) || 0), 0);
  $('formulaText').textContent = values.length ? `${values.join(' + ')} = ${money(total)}` : '0';
  renderBetLedger();
  renderBetPreview();
}

function anomalyFor(entry) {
  if (entry.claimed === '' || entry.claimed == null || Number.isNaN(Number(entry.claimed))) return '';
  const diff = Number((Number(entry.claimed) - Number(entry.amount)).toFixed(2));
  if (!diff) return '';
  return `${diff > 0 ? '多' : '少'}${money(Math.abs(diff))}`;
}

function renderBetLedger() {
  const selectedEntries = entriesForBetBatch();
  const batchSelect = $('batchFilter');
  const entryBatchSelect = $('entryBatchFilter');
  if (batchSelect) {
    batchSelect.innerHTML = [
      `<option value="active">当前统计（${activeBetBatch()?.label || '未命名'}）</option>`,
      '<option value="all">全部统计</option>',
      ...betBatches.map(batch => {
        const summary = batchSummary(batch.id);
        return `<option value="${batch.id}">${batch.label}（${summary.count}条 / ${money(summary.total)}）</option>`;
      })
    ].join('');
    if (![...batchSelect.options].some(option => option.value === currentBetBatchFilter)) currentBetBatchFilter = 'active';
    batchSelect.value = currentBetBatchFilter;
  }
  if (entryBatchSelect) {
    entryBatchSelect.innerHTML = betBatches.map(batch => {
      return `<option value="${batch.id}">${batch.label}</option>`;
    }).join('');
    entryBatchSelect.value = activeBetBatchId;
  }
  const q = $('betSearchInput').value.trim().toLowerCase();
  const anomalyOnly = $('onlyAnomalies').checked;
  const visible = selectedEntries.filter(e => {
    const anomaly = anomalyFor(e);
    return (!anomalyOnly || anomaly) && (!q || `${e.record} ${e.original || ''} ${anomaly}`.toLowerCase().includes(q));
  }).sort((a, b) => Number(b.record) - Number(a.record));
  $('betLedgerBody').innerHTML = visible.length ? visible.map(e => {
    const anomaly = anomalyFor(e);
    const targets = entryLotteryTargets(e);
    return `<tr>
      <td>第${e.record}条</td>
      <td><span class="tag ${targets.length > 1 ? 'mixed' : targets[0] === '体彩' ? 'sports' : 'welfare'}">${targets.length > 1 ? '福+体' : targets[0]}</span></td>
      <td>${e.original ? escapeHtml(e.original) : '<span class="muted">历史金额记录</span>'}</td>
      <td><span class="readonly-amount">${money(Number(e.amount) || 0)}</span></td>
      <td><span class="readonly-amount ${e.claimed === '' || e.claimed == null ? 'muted' : ''}">${e.claimed === '' || e.claimed == null ? '--' : money(Number(e.claimed))}</span></td>
      <td class="${anomaly ? 'anomaly' : 'matched'}">${anomaly || '相符'}</td>
      <td><button class="icon-btn delete-bet" data-id="${e.id}" title="删除" aria-label="删除">×</button></td>
    </tr>`;
  }).join('') : '<tr><td colspan="7" class="empty-row">没有符合条件的记录</td></tr>';
  const terms = selectedEntries.map(e => money(Number(e.amount) || 0));
  const total = selectedEntries.reduce((n, e) => n + (Number(e.amount) || 0), 0);
  $('betFormulaText').textContent = `${terms.join('+')}=${money(total)}`;
}

function sequenceDifference(currentTerms, externalTerms) {
  const current = currentTerms.map(value => money(Number(value) || 0));
  const external = externalTerms.map(value => money(Number(value) || 0));
  const table = Array.from({ length: current.length + 1 }, () => Array(external.length + 1).fill(0));

  for (let i = current.length - 1; i >= 0; i -= 1) {
    for (let j = external.length - 1; j >= 0; j -= 1) {
      table[i][j] = current[i] === external[j]
        ? table[i + 1][j + 1] + 1
        : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }

  const currentFlags = new Set();
  const externalFlags = new Set();
  let i = 0;
  let j = 0;
  while (i < current.length && j < external.length) {
    if (current[i] === external[j]) {
      i += 1;
      j += 1;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      currentFlags.add(i);
      i += 1;
    } else {
      externalFlags.add(j);
      j += 1;
    }
  }
  while (i < current.length) currentFlags.add(i++);
  while (j < external.length) externalFlags.add(j++);
  return { currentFlags, externalFlags };
}

function renderComparedFormula(element, terms, total, flaggedIndexes = new Set(), totalMismatch = false) {
  element.replaceChildren();
  terms.forEach((value, index) => {
    if (index) {
      const operator = document.createElement('span');
      operator.className = 'formula-operator';
      operator.textContent = '+';
      element.append(operator);
    }
    const term = document.createElement('span');
    term.className = `formula-term${flaggedIndexes.has(index) ? ' diff' : ''}`;
    term.textContent = money(Number(value) || 0);
    element.append(term);
  });
  const equals = document.createElement('span');
  equals.className = 'formula-operator';
  equals.textContent = terms.length ? '=' : '';
  element.append(equals);
  const totalElement = document.createElement('span');
  totalElement.className = `formula-total${totalMismatch ? ' diff' : ''}`;
  totalElement.textContent = money(Number(total) || 0);
  element.append(totalElement);
}

function resetFormulaComparison() {
  $('dialogExternalTotal').textContent = '--';
  $('externalFormulaPreview').className = 'dialog-formula muted';
  $('externalFormulaPreview').textContent = '等待输入';
  $('currentTotalBox').classList.remove('diff');
  $('externalTotalBox').classList.remove('diff');
}

function formulaComparison() {
  const input = $('externalBetFormula').value.trim();
  const result = $('betCompareResult');
  const currentTerms = betEntries.map(entry => Number(entry.amount) || 0);
  const currentTotal = currentTerms.reduce((sum, value) => sum + value, 0);
  if (!input) {
    resetFormulaComparison();
    renderComparedFormula($('dialogBetFormula'), currentTerms, currentTotal);
    result.className = 'compare-result neutral';
    result.textContent = '请粘贴其他金额合计后再对比';
    return;
  }

  const normalized = input.replace(/[，,]/g, '').replace(/＋/g, '+');
  const [left, ...rightParts] = normalized.split(/[=＝]/);
  const leftNumbers = (left.match(/\d+(?:\.\d+)?/g) || []).map(Number);
  const hasTermList = /\+/.test(left) || leftNumbers.length > 1;
  let externalTerms = [];
  let externalTotal;
  let declaredTotal = null;

  if (hasTermList) {
    externalTerms = leftNumbers;
    externalTotal = externalTerms.reduce((sum, value) => sum + value, 0);
    const rightNumbers = rightParts.join('=').match(/\d+(?:\.\d+)?/g) || [];
    if (rightNumbers.length) declaredTotal = Number(rightNumbers[rightNumbers.length - 1]);
  } else {
    const allNumbers = (normalized.match(/\d+(?:\.\d+)?/g) || []).map(Number);
    if (!allNumbers.length) {
      resetFormulaComparison();
      renderComparedFormula($('dialogBetFormula'), currentTerms, currentTotal);
      result.className = 'compare-result warn';
      result.textContent = '没有识别到可比较的金额';
      return;
    }
    externalTotal = allNumbers[allNumbers.length - 1];
  }

  const lines = [`当前合计：${money(currentTotal)}　外部合计：${money(externalTotal)}`];
  const totalDiff = Number((externalTotal - currentTotal).toFixed(2));
  const totalsDiffer = totalDiff !== 0;
  $('dialogExternalTotal').textContent = money(externalTotal);
  $('currentTotalBox').classList.toggle('diff', totalsDiffer);
  $('externalTotalBox').classList.toggle('diff', totalsDiffer);
  lines.push(totalDiff === 0 ? '总金额一致' : `外部合计${totalDiff > 0 ? '多' : '少'}${money(Math.abs(totalDiff))}`);

  let termMismatch = false;
  if (hasTermList) {
    const { currentFlags, externalFlags } = sequenceDifference(currentTerms, externalTerms);
    renderComparedFormula($('dialogBetFormula'), currentTerms, currentTotal, currentFlags, totalsDiffer);
    $('externalFormulaPreview').className = 'dialog-formula';
    renderComparedFormula($('externalFormulaPreview'), externalTerms, externalTotal, externalFlags, totalsDiffer);
    const counts = values => values.reduce((map, value) => {
      const key = money(value);
      map.set(key, (map.get(key) || 0) + 1);
      return map;
    }, new Map());
    const currentCounts = counts(currentTerms);
    const externalCounts = counts(externalTerms);
    const missing = [];
    const extra = [];
    for (const [value, count] of currentCounts) {
      const difference = count - (externalCounts.get(value) || 0);
      if (difference > 0) missing.push(`${value}${difference > 1 ? `×${difference}` : ''}`);
    }
    for (const [value, count] of externalCounts) {
      const difference = count - (currentCounts.get(value) || 0);
      if (difference > 0) extra.push(`${value}${difference > 1 ? `×${difference}` : ''}`);
    }
    termMismatch = missing.length > 0 || extra.length > 0;
    lines.push(missing.length ? `外部缺少：${missing.join('、')}` : '外部没有缺少加数');
    lines.push(extra.length ? `外部多出：${extra.join('、')}` : '外部没有多出加数');
    if (declaredTotal != null && Number((declaredTotal - externalTotal).toFixed(2)) !== 0) {
      termMismatch = true;
      lines.push(`外部算式自身不一致：加数合计${money(externalTotal)}，等号后为${money(declaredTotal)}`);
    }
  } else {
    renderComparedFormula($('dialogBetFormula'), currentTerms, currentTotal, new Set(), totalsDiffer);
    $('externalFormulaPreview').className = 'dialog-formula';
    renderComparedFormula($('externalFormulaPreview'), [], externalTotal, new Set(), totalsDiffer);
  }

  result.className = `compare-result ${totalDiff === 0 && !termMismatch ? 'ok' : 'warn'}`;
  result.textContent = lines.join('\n');
}

function formatBetTime(value) {
  if (!value) return '历史记录';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '历史记录';
  const pad = number => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function renderBetPreview() {
  // 投注内容只显示当前统计；结束统计后此处会自然清空，历史记录仍保留在金额总表。
  const recent = entriesForBetBatch('active').filter(entry => entry.original).slice().reverse();
  $('betPreviewList').innerHTML = recent.length ? recent.map(entry => {
    const anomaly = anomalyFor(entry);
    const targets = entryLotteryTargets(entry);
    return `<article class="bet-preview-item">
      <div class="bet-preview-meta">
        <time>时间：${formatBetTime(entry.createdAt)}</time>
        <span class="batch-tag">${batchLabel(entryBatchId(entry))}</span>
        <span class="tag ${targets.length > 1 ? 'mixed' : targets[0] === '体彩' ? 'sports' : 'welfare'}">${targets.length > 1 ? '福+体' : targets[0]}</span>
      </div>
      <div class="bet-preview-copy">${escapeHtml(entry.original)}</div>
      <div class="bet-preview-result">
        <strong>${money(Number(entry.amount) || 0)}</strong>
        <span class="${anomaly ? 'preview-anomaly' : 'preview-ok'}">${anomaly || '金额相符'}</span>
        <button class="preview-detail" data-record="${entry.record}" type="button">详</button>
        <button class="preview-refund" data-id="${entry.id}" data-record="${entry.record}" type="button">退</button>
      </div>
    </article>`;
  }).join('') : '<div class="bet-preview-empty">计算并记录后，投注内容会显示在这里。</div>';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function switchTab(name) {
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === name));
}

function populatePlays() {
  $('playType').innerHTML = Object.entries(plays).map(([key, p]) => `<option value="${key}">${p.name}</option>`).join('');
}

function calculate({ playKey, draw, pickText, stake, customBase, customPrize, customHits }) {
  const play = plays[playKey];
  const drawDigits = draw.split('');
  const drawSet = new Set(drawDigits);
  const distinct = drawSet.size === 3;
  const items = tokens(pickText);
  let hits = [];
  let prize = 0;

  const scaled = (basePrize, amount = stake, base = play.base) => basePrize * amount / base;
  if (playKey === 'direct') {
    hits = items.filter(v => normalize3(v) === draw);
    prize = hits.length * scaled(play.prize);
  } else if (playKey === 'group6') {
    if (distinct) hits = items.filter(v => [...normalize3(v)].sort().join('') === [...draw].sort().join(''));
    prize = hits.length * scaled(play.prize);
  } else if (playKey === 'group3') {
    if (drawSet.size === 2) hits = items.filter(v => [...normalize3(v)].sort().join('') === [...draw].sort().join(''));
    prize = hits.length * scaled(play.prize);
  } else if (playKey === 'group6Multi') {
    for (const item of items) {
      const ds = [...new Set(item.replace(/\D/g, ''))];
      if (distinct && drawDigits.every(d => ds.includes(d)) && play.prizeBySize[ds.length]) {
        hits.push(item);
        prize += scaled(play.prizeBySize[ds.length]);
      }
    }
  } else if (playKey === 'group3Multi') {
    for (const item of items) {
      const ds = [...new Set(item.replace(/\D/g, ''))];
      if (drawSet.size === 2 && drawDigits.every(d => ds.includes(d)) && play.prizeBySize[ds.length]) {
        hits.push(item);
        prize += scaled(play.prizeBySize[ds.length]);
      }
    }
  } else if (playKey === 'directMulti') {
    for (const item of items) {
      const ds = [...new Set(item.replace(/\D/g, ''))];
      if (drawDigits.every(d => ds.includes(d)) && play.prizeBySize[ds.length]) {
        hits.push(item);
        prize += scaled(play.prizeBySize[ds.length]);
      }
    }
  } else if (playKey === 'leopardPack') {
    hits = drawSet.size === 1 ? ['豹子全包'] : [];
    prize = hits.length * scaled(play.prize);
  } else if (playKey === 'singleDigit') {
    const ds = pickText.replace(/\D/g, '').split('');
    hits = ds.filter(d => drawDigits.includes(d));
    prize = hits.length * scaled(play.prize);
  } else if (playKey === 'doubleFly') {
    hits = items.filter(item => {
      const ds = item.replace(/\D/g, '').split('');
      return ds.length >= 2 && ds.slice(0,2).every(d => drawDigits.includes(d));
    });
    prize = hits.length * scaled(play.prize);
  } else if (playKey === 'pair') {
    const repeated = drawDigits.find((d, i) => drawDigits.indexOf(d) !== i);
    hits = repeated ? items.filter(v => v.includes(repeated)) : [];
    prize = hits.length * scaled(play.prize);
  } else if (playKey === 'pos1' || playKey === 'pos2') {
    const pos = {百:0, 十:1, 个:2};
    hits = items.filter(item => {
      const checks = [...item.matchAll(/([百十个])(?:位)?(\d)/g)];
      const need = playKey === 'pos1' ? 1 : 2;
      return checks.length === need && checks.every(m => drawDigits[pos[m[1]]] === m[2]);
    });
    prize = hits.length * scaled(play.prize);
  } else if (playKey === 'span') {
    const actual = Math.max(...drawDigits.map(Number)) - Math.min(...drawDigits.map(Number));
    hits = items.filter(v => Number(v) === actual);
    prize = hits.length * scaled(play.prizes[actual]);
  } else if (playKey === 'sum') {
    const actual = drawDigits.map(Number).reduce((total, value) => total + value, 0);
    hits = items.filter(v => Number(v) === actual);
    prize = hits.length * scaled(play.prizes[actual]);
  } else if (playKey === 'circle6' || playKey === 'circle3') {
    for (const item of items) {
      const ds = [...new Set(item.replace(/\D/g, ''))];
      const correctType = playKey === 'circle6' ? drawSet.size === 3 : drawSet.size === 2;
      if (correctType && drawDigits.every(d => ds.includes(d)) && play.baseBySize[ds.length]) {
        hits.push(item);
        prize += play.prize * stake / play.baseBySize[ds.length];
      }
    }
  } else if (playKey === 'group6Dan' || playKey === 'group3Dan') {
    for (const item of items) {
      const ds = [...new Set(item.replace(/\D/g, ''))];
      const correctType = playKey === 'group6Dan' ? drawSet.size === 3 : drawSet.size === 2;
      if (correctType && drawDigits.every(d => ds.includes(d)) && play.prizeBySize[ds.length]) {
        hits.push(item);
        prize += scaled(play.prizeBySize[ds.length]);
      }
    }
  } else if (playKey === 'sticky6' || playKey === 'sticky3') {
    const ds = pickText.replace(/\D/g, '').split('');
    const correctType = playKey === 'sticky6' ? drawSet.size === 3 : drawSet.size === 2;
    hits = correctType ? ds.filter(d => drawDigits.includes(d)) : [];
    const stickyBase = play.baseByCount[ds.length];
    prize = stickyBase ? hits.length * play.prize * stake / stickyBase : 0;
  } else if (playKey === 'group3Pack') {
    hits = drawSet.size === 2 ? ['组三全包'] : [];
    prize = hits.length * scaled(play.prize);
  } else {
    hits = Array.from({length: Number(customHits) || 0}, (_, i) => `命中${i + 1}`);
    prize = hits.length * (Number(customPrize) || 0) * stake / (Number(customBase) || 1);
  }
  return { hits, prize: Number(prize.toFixed(2)), playName: play.name };
}

function showResult(result, values) {
  const box = $('calcResult');
  box.classList.remove('empty');
  box.innerHTML = result.hits.length ? `
    <div>中奖金额</div><strong>${money(result.prize)}</strong>
    <div class="result-detail">${escapeHtml(result.playName)} · 命中${result.hits.length}项：${escapeHtml(result.hits.join('、'))}</div>
    <div class="calc-actions"><button id="addResult" class="primary">加入中奖清单</button></div>` :
    `<strong>未中奖</strong><div class="result-detail">${escapeHtml(result.playName)}没有匹配开奖号码${values.draw}</div>`;
  if (result.hits.length) $('addResult').onclick = () => {
    const record = values.note.match(/第?(\d+)条?/)?.[1] || `新${entries.length + 1}`;
    const purchaseAmount = result.hits.length * values.stake;
    entries.push({ id: `custom-${Date.now()}`, record, lottery: values.lottery,
      match: values.note || `${result.playName}：${result.hits.join('、')}`,
      stake: purchaseAmount, odds: purchaseAmount ? Number((result.prize / purchaseAmount).toFixed(4)) : 0,
      prize: result.prize });
    saveEntries(); render(); switchTab('ledger'); toast('已加入中奖清单');
  };
}

function extractClaimedAmount(text) {
  const clean = text.replace(/&#x20;|&nbsp;/gi, ' ');
  const arithmeticTotal = [...clean.matchAll(/(?:^|\n)\s*(?:\d+(?:\.\d+)?\s*[+＋]\s*)+\d+(?:\.\d+)?\s*[=＝]\s*(\d+(?:\.\d+)?)\s*(毛|元|米|块)\s*(?=$|\n)/g)];
  if (arithmeticTotal.length) {
    const last = arithmeticTotal[arithmeticTotal.length - 1];
    return Number(last[1]) * (last[2] === '毛' ? 0.1 : 1);
  }
  const patterns = [
    /(?:合计|总计|共计|一共|共)\s*[：:]?\s*(\d+(?:\.\d+)?)\s*(?:元|米)?/g,
    /(?:计)\s*[：:]?\s*(\d+(?:\.\d+)?)\s*(?:元|米)/g
  ];
  let found = [];
  for (const pattern of patterns) found.push(...[...clean.matchAll(pattern)].map(m => Number(m[1])));
  return found.length ? found[found.length - 1] : '';
}

function rateFromText(text) {
  const digit = text.match(/(?:各(?:打)?|打)\s*(\d+(?:\.\d+)?)\s*(毛|元|米|块)/);
  if (digit) return Number(digit[1]) * (digit[2] === '毛' ? 0.1 : 1);
  const unitlessDecimal = text.match(/(?:每注|各(?:打)?|打)\s*(0?\.\d+)(?!\d)\s*(?:元|米|块)?/);
  if (unitlessDecimal) return Number(unitlessDecimal[1]);
  const cn = text.match(/(?:各(?:打)?|打)\s*([零〇一二两三四五六七八九十百]+)\s*(毛|元|米|块)/);
  if (!cn) return null;
  return chineseAmount(cn[1]) * (cn[2] === '毛' ? 0.1 : 1);
}

function calculateFlyingBet(text, claimed, lotteryFactor = 1) {
  if (!/双?飞/.test(text)) return null;

  const multiPairClause = text.match(/((?:\d{2}[\s,，、.。/\-]+)+\d{2})\s*双飞\s*(?:各(?:打)?|打)?\s*([零〇一二两三四五六七八九十百]+|\d+(?:\.\d+)?)\s*(毛|元|米|块)(?:钱)?/);
  if (multiPairClause) {
    const pairs = multiPairClause[1].match(/(?<!\d)\d{2}(?!\d)/g) || [];
    const stake = chineseAmount(multiPairClause[2]) * (multiPairClause[3] === '毛' ? 0.1 : 1);
    const amount = pairs.length * stake * lotteryFactor;
    return { amount: Number(amount.toFixed(2)), claimed, confident: true,
      reasons: [`${pairs.length}组双飞（${pairs.join('、')}） × 每组${stake}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
  }

  const explicitClauses = [...text.matchAll(/(?<!\d)(\d{2})(?!\d)\s*双?飞\s*(?:各(?:打)?|打)?\s*([零〇一二两三四五六七八九十百]+|\d+(?:\.\d+)?)\s*(毛|元|米|块)(?:钱)?/g)];
  if (explicitClauses.length) {
    const details = explicitClauses.map(match => {
      const stake = chineseAmount(match[2]) * (match[3] === '毛' ? 0.1 : 1);
      return { pair: match[1], stake };
    });
    const amount = details.reduce((sum, item) => sum + item.stake, 0) * lotteryFactor;
    return {
      amount: Number(amount.toFixed(2)),
      claimed,
      confident: true,
      reasons: [`飞号逐项计算：${details.map(item => `${item.pair}飞${money(item.stake)}元`).join(' + ')}${lotteryFactor === 2 ? '；福彩体彩两边' : ''}`]
    };
  }

  const withoutMetadata = text
    .replace(/\d{4}年\d{1,2}月\d{1,2}日\s+\d{1,2}:\d{2}/g, ' ')
    .replace(/(?:合计|总计|共计|一共|共)\s*[：:]?\s*\d+(?:\.\d+)?\s*(?:元|米)?/g, ' ')
    .replace(/[（(]\s*\d+(?:\.\d+)?\s*[）)]/g, ' ')
    .replace(/(?:各(?:打)?|打)?\s*(?:\d+(?:\.\d+)?|[一二两三四五六七八九十]+)\s*(?:倍|元|米|块|毛)/g, ' ');
  const pairs = withoutMetadata.match(/(?<!\d)\d{2}(?!\d)/g) || [];
  if (!pairs.length) return null;

  let rate = rateFromText(text);
  if (rate == null) {
    const times = text.match(/(?:各(?:打)?|打)?\s*([一二两三四五六七八九十]|\d+(?:\.\d+)?)\s*倍/);
    if (times) rate = numericValue(times[1]) * 10;
  }
  if (rate == null) {
    const flyMoney = text.match(/双?飞\D{0,6}(\d+(?:\.\d+)?)\s*(毛|元|米|块)/);
    if (flyMoney) rate = Number(flyMoney[1]) * (flyMoney[2] === '毛' ? 0.1 : 1);
  }
  if (rate == null) return null;

  return {
    amount: Number((pairs.length * rate * lotteryFactor).toFixed(2)),
    claimed,
    confident: true,
    reasons: [`${pairs.length}组飞号（${pairs.join('、')}） × 每组${rate}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`]
  };
}

function chineseAmount(value) {
  if (/^\d+(?:\.\d+)?$/.test(value)) return Number(value);
  const digits = { 零: 0, 〇: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  let total = 0;
  let rest = value;
  if (rest.includes('百')) {
    const [left, right = ''] = rest.split('百');
    total += (digits[left] || 1) * 100;
    rest = right;
  }
  if (rest.includes('十')) {
    const [left, right = ''] = rest.split('十');
    total += (digits[left] || 1) * 10 + (digits[right] || 0);
  } else if (rest) {
    total += digits[rest] || 0;
  }
  return total;
}

function multiplierStake(text, base) {
  const match = text.match(/([一二两三四五六七八九十]|\d+(?:\.\d+)?)\s*倍/);
  return match ? numericValue(match[1]) * base : null;
}

function explicitMoney(text) {
  const matches = [...text.matchAll(/([零〇一二两三四五六七八九十百]+|\d+(?:\.\d+)?)\s*(毛|元|米|块)/g)];
  if (!matches.length) return null;
  const match = matches[0];
  const value = chineseAmount(match[1]);
  return value * (match[2] === '毛' ? 0.1 : 1);
}

function calculateFixedAmountPlay(text, claimed, lotteryFactor) {
  const fixedMatch = text.match(/(复式|复试|转一?圈|打包组三|组三全包|组三包)/);
  if (!fixedMatch) return null;
  const keyword = fixedMatch[1];
  if (/^转一?圈$/.test(keyword)) {
    const numbers = text.match(/(?<!\d)\d{3}(?!\d)/g) || [];
    const wantsGroup3 = /组三/.test(text);
    const wantsGroup6 = /组六/.test(text);
    const times = multiplierStake(text, 1) || 1;
    if (numbers.length && (wantsGroup3 || wantsGroup6)) {
      let baseTotal = 0;
      const details = [];
      for (const number of numbers) {
        const size = new Set(number.split('')).size;
        if (wantsGroup3 && plays.circle3.baseBySize[size]) {
          baseTotal += plays.circle3.baseBySize[size];
          details.push(`${number}的${size}码组三${plays.circle3.baseBySize[size]}元`);
        }
        if (wantsGroup6 && plays.circle6.baseBySize[size]) {
          baseTotal += plays.circle6.baseBySize[size];
          details.push(`${number}的${size}码组六${plays.circle6.baseBySize[size]}元`);
        }
      }
      if (baseTotal) {
        const amount = baseTotal * times * lotteryFactor;
        return { amount: Number(amount.toFixed(2)), claimed, confident: true,
          reasons: [`转圈查表：${details.join(' + ')}；${times}倍${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
      }
    }
  }
  if (/复式|复试/.test(keyword)) {
    const sets = text.match(/(?<!\d)\d{3,10}(?!\d)/g) || [];
    const eachRate = rateFromText(text);
    const stake = multiplierStake(text, 10);
    if (sets.length && (eachRate != null || stake != null)) {
      const perSet = eachRate ?? stake;
      const amount = sets.length * perSet * lotteryFactor;
      return { amount: Number(amount.toFixed(2)), claimed, confident: true,
        reasons: [`直选复式${sets.length}组 × 每组${perSet}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
    }
  }
  const tail = text.slice((fixedMatch.index || 0) + keyword.length);
  const tailMoney = explicitMoney(tail);
  if (tailMoney != null) {
    const amount = tailMoney * lotteryFactor;
    return { amount: Number(amount.toFixed(2)), claimed, confident: true,
      reasons: [`${keyword}按原文明确金额${tailMoney}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
  }
  const stated = tail.match(/^\D{0,4}([零〇一二两三四五六七八九十百]+|\d+(?:\.\d+)?)\s*(毛|元|米|块)?\s*$/);
  if (stated && !/倍/.test(tail)) {
    const amount = chineseAmount(stated[1]) * (stated[2] === '毛' ? 0.1 : 1) * lotteryFactor;
    return { amount: Number(amount.toFixed(2)), claimed, confident: true,
      reasons: [`${keyword}按原文明确金额${chineseAmount(stated[1])}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
  }
  if (claimed !== '') {
    return { amount: claimed, claimed, confident: true,
      reasons: [`${fixedMatch[1]}已写总金额，按确认规则直接采用${claimed}元`] };
  }

  return null;
}

function calculateStickyBet(text, claimed, lotteryFactor) {
  const type = /粘边赖组三/.test(text) ? 'sticky3' : /粘边赖组六/.test(text) ? 'sticky6' : '';
  if (!type) return null;
  if (/全包/.test(text)) {
    if (type !== 'sticky3') return null;
    const amount = 180 * (multiplierStake(text, 1) || 1) * lotteryFactor;
    return { amount, claimed, confident: true, reasons: [`组三粘边赖全包${amount}元`] };
  }
  const selected = text.match(/(?:胆|组三|组六)\s*([0-9]+)/)?.[1] || '';
  const count = new Set(selected.split('').filter(Boolean)).size;
  const base = plays[type].baseByCount[count];
  if (!base) return null;
  const times = multiplierStake(text, 1) || 1;
  const amount = base * times * lotteryFactor;
  return { amount, claimed, confident: true,
    reasons: [`粘边赖${type === 'sticky3' ? '组三' : '组六'}${count}胆 × ${times}倍${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
}

function calculateMultiGroupBet(text, claimed, lotteryFactor) {
  const hasGroup6 = /组六/.test(text);
  const hasGroup3 = /组三/.test(text) && !/打包组三|组三全包|粘边赖组三/.test(text);
  if (!hasGroup6 && !hasGroup3) return null;
  const sets = text.match(/(?<!\d)\d{4,10}(?!\d)/g) || [];
  if (!sets.length) return null;

  const eachRate = rateFromText(text);
  const generalStake = eachRate != null ? eachRate : multiplierStake(text, 10);
  const stakeAfter = label => {
    const match = text.match(new RegExp(`${label}\\s*(?:各(?:打)?)?\\s*([零〇一二两三四五六七八九十百]+|\\d+(?:\\.\\d+)?)\\s*(毛|元|米|块)?`));
    if (!match) return null;
    const following = text.slice((match.index || 0) + match[0].length).trimStart();
    if (!match[2] && (/^\d/.test(match[1]) && match[1].replace(/\D/g, '').length >= 4 || following.startsWith('倍') || following.startsWith('码'))) return null;
    const value = chineseAmount(match[1]);
    return value * (match[2] === '毛' ? 0.1 : 1);
  };
  const group6Stake = hasGroup6 ? (stakeAfter('组六') ?? generalStake) : 0;
  const group3Stake = hasGroup3 ? (stakeAfter('组三') ?? generalStake) : 0;
  if ((hasGroup6 && group6Stake == null) || (hasGroup3 && group3Stake == null)) return null;
  const amount = sets.length * ((group6Stake || 0) + (group3Stake || 0)) * lotteryFactor;
  const labels = [hasGroup6 ? `组六${group6Stake}元` : '', hasGroup3 ? `组三${group3Stake}元` : ''].filter(Boolean).join(' + ');
  return { amount: Number(amount.toFixed(2)), claimed, confident: true,
    reasons: [`${sets.length}组复式号码 ×（${labels}）${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
}

function calculateSingleDigitBet(text, claimed, lotteryFactor) {
  if (!/(?:独胆|毒[胆但]?|扣|独|各掉)/.test(text)) return null;
  let selected = text.match(/(?:独胆|毒[胆但]?|扣|独)\s*([0-9](?:[\/、，,.。\-]*[0-9])*)/)?.[1] || '';
  if (!selected) selected = text.match(/([0-9](?:[\/、，,.。\-]*[0-9])*)\s*独/)?.[1] || '';
  if (!selected && /各掉/.test(text)) selected = text.split(/福|体|各掉/)[0];
  const digits = selected.match(/\d/g) || [];
  if (!digits.length) return null;
  const eachRate = rateFromText(text);
  const timesStake = multiplierStake(text, 10);
  const stated = explicitMoney(text);
  let amount;
  if (eachRate != null) amount = digits.length * eachRate;
  else if (timesStake != null) amount = digits.length * timesStake;
  else if (stated != null && digits.length === 1) amount = stated;
  else return null;
  amount *= lotteryFactor;
  return { amount: Number(amount.toFixed(2)), claimed, confident: true,
    reasons: [`${digits.length}个独胆 × ${money(amount / digits.length / lotteryFactor)}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
}

function calculatePositionBet(text, claimed, lotteryFactor) {
  if (!/(?:定位|百位?|十位?|个位?|个)/.test(text)) return null;
  const positionNames = { 百: '百位', 百位: '百位', 十: '十位', 十位: '十位', 个: '个位', 个位: '个位' };
  const positions = [...text.matchAll(/(百位?|十位?|个位?)\s*(全部|\d+)/g)]
    .map(match => ({ name: positionNames[match[1]], values: match[2] }));
  if (!positions.length) return null;
  const eachRate = rateFromText(text);
  const stated = explicitMoney(text);
  const allThree = ['百位', '十位', '个位'].every(label => positions.some(position => position.name === label));

  if (allThree) {
    const combinations = positions.reduce((total, position) => total * (position.values === '全部' ? 10 : position.values.length), 1);
    if (eachRate != null) {
      const amount = combinations * eachRate * lotteryFactor;
      return { amount: Number(amount.toFixed(2)), claimed, confident: true,
        reasons: [`三位定位${combinations}注 × 直选每注${eachRate}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
    }
    const playCount = /直.*组|组.*直/.test(text) ? 2 : 1;
    const times = multiplierStake(text, 1) || 1;
    const amount = combinations * playCount * 2 * times * lotteryFactor;
    return { amount, claimed, confident: true,
      reasons: [`三位定位${combinations}注 × ${playCount}种玩法 × 每注2元 × ${times}倍${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
  }
  if (eachRate != null || stated != null) {
    const amount = (eachRate != null ? positions.length * eachRate : stated) * lotteryFactor;
    return { amount: Number(amount.toFixed(2)), claimed, confident: true,
      reasons: [eachRate != null
        ? `定位${positions.length}项（${positions.map(position => `${position.name}${position.values}`).join('、')}） × 每项${eachRate}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`
        : `${positions.length >= 2 ? '定位' : '一码定位'}按明确总金额计算${lotteryFactor === 2 ? '，福彩体彩两边' : ''}`] };
  }
  return null;
}

function calculatePairOrSpanBet(text, claimed, lotteryFactor) {
  const pair = /对子/.test(text);
  const span = /跨度|\d\s*跨/.test(text);
  if (!pair && !span) return null;
  let count = 1;
  if (pair) {
    const pairText = text
      .replace(/(?:各(?:打)?\s*)?([零〇一二两三四五六七八九十百]+|\d+(?:\.\d+)?)\s*(毛|元|米|块)/g, ' ')
      .replace(/对子/g, ' ');
    count = (pairText.match(/(?<!\d)\d{2}(?!\d)/g) || []).length || 1;
  }
  if (span) {
    const beforeSpan = text.split(/跨度|跨/)[0];
    count = (beforeSpan.match(/(?<!\d)\d(?!\d)/g) || []).length || 1;
  }
  const eachRate = rateFromText(text);
  let stake = eachRate != null ? eachRate : multiplierStake(text, 10) ?? explicitMoney(text);
  if (stake == null && pair) {
    const naked = text.match(/对子\D{0,6}(\d+(?:\.\d+)?)/);
    if (naked) stake = Number(naked[1]);
  }
  if (stake == null) return null;
  const amount = count * stake * lotteryFactor;
  return { amount: Number(amount.toFixed(2)), claimed, confident: true,
    reasons: [`${count}项${pair ? '对子' : '跨度'} × 每项${stake}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
}

function calculateDanTuoBet(text, claimed, lotteryFactor) {
  const match = text.match(/(?:胆)?\s*(\d+)\s*拖\s*(\d+)/);
  if (!match || !/组六|组三/.test(text)) return null;
  const label = /组三/.test(text) ? '组三' : '组六';
  const stated = text.match(new RegExp(`([零〇一二两三四五六七八九十百]+|\\d+(?:\\.\\d+)?)\\s*${label}`));
  const stake = stated ? chineseAmount(stated[1]) : multiplierStake(text, 10);
  if (stake == null) return null;
  const amount = stake * lotteryFactor;
  return { amount: Number(amount.toFixed(2)), claimed, confident: true,
    reasons: [`胆${match[1]}拖${match[2]}${label}按明确投注${stake}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
}

function calculateAllDanTuoBet(text, claimed, lotteryFactor) {
  if (!/全胆拖/.test(text)) return null;
  const selections = [...text.matchAll(/(?<!\d)(\d+)\s*拖\s*(\d+)(?!\d)/g)];
  if (!selections.length) return null;
  const stake = rateFromText(text) ?? multiplierStake(text, 10);
  if (stake == null) return null;
  const amount = selections.length * stake * lotteryFactor;
  return { amount: Number(amount.toFixed(2)), claimed, confident: true,
    reasons: [`全胆拖${selections.length}组（${selections.map(match => `${match[1]}拖${match[2]}`).join('、')}） × 每组${stake}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
}

function calculateTwoCodeGroupBet(text, claimed, lotteryFactor) {
  if (!/二码组三/.test(text)) return null;
  const scrubbed = text
    .replace(/\d{4}年\d{1,2}月\d{1,2}日\s+\d{1,2}:\d{2}/g, ' ')
    .replace(/(?:合计|总计|共计|一共|共)\s*[：:]?\s*\d+(?:\.\d+)?\s*(?:元|米)?/g, ' ')
    .replace(/(?:各(?:打)?|打)?\s*(?:\d+(?:\.\d+)?|[一二两三四五六七八九十]+)\s*(?:倍|元|米|块|毛)/g, ' ');
  const pairs = scrubbed.match(/(?<!\d)\d{2}(?!\d)/g) || [];
  if (!pairs.length) return null;
  const stake = rateFromText(text) ?? multiplierStake(text, 10);
  if (stake == null) return null;
  const amount = pairs.length * stake * lotteryFactor;
  return { amount: Number(amount.toFixed(2)), claimed, confident: true,
    reasons: [`二码组三${pairs.length}组 × 每组${stake}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
}

function calculateSumOrLeopardBet(text, claimed, lotteryFactor) {
  const isSum = /和值/.test(text);
  const isLeopard = /豹子全包/.test(text);
  if (!isSum && !isLeopard) return null;
  let count = 1;
  if (isSum) {
    const scrubbed = text
      .replace(/\d{4}年\d{1,2}月\d{1,2}日\s+\d{1,2}:\d{2}/g, ' ')
      .replace(/(?:各(?:打)?|打)?\s*(?:\d+(?:\.\d+)?|[一二两三四五六七八九十]+)\s*(?:倍|元|米|块|毛)/g, ' ');
    const selected = (scrubbed.match(/(?<!\d)\d{1,2}(?!\d)/g) || []).filter(value => Number(value) <= 27);
    count = selected.length || 1;
  }
  const stake = rateFromText(text) ?? multiplierStake(text, 10) ?? explicitMoney(text);
  if (stake == null) return null;
  const amount = count * stake * lotteryFactor;
  return { amount: Number(amount.toFixed(2)), claimed, confident: true,
    reasons: [`${isSum ? `和值${count}项` : '豹子全包'} × ${stake}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
}

function calculateWildcardPositionCombination(text, claimed, lotteryFactor) {
  const positionCodes = text.match(/(?<![0-9Xx])(?:\d{2}[Xx]|\d[Xx]\d|[Xx]\d{2})(?![0-9Xx])/g) || [];
  if (!positionCodes.length || !/定位/.test(text)) return null;

  const reasons = [];
  let subtotal = 0;
  const positionTimes = text.match(/定位\s*([一二两三四五六七八九十]|\d+(?:\.\d+)?)\s*倍/);
  if (!positionTimes) return null;
  const positionStake = numericValue(positionTimes[1]) * 10;
  subtotal += positionCodes.length * positionStake;
  reasons.push(`二码定位${positionCodes.length}注（${positionCodes.join('、')}） × 每注${positionStake}元`);

  const flySelection = text.match(/((?:\d{2}\s*[、，,./\-]\s*)*\d{2})\s*双飞/);
  if (flySelection) {
    const flyPairs = flySelection[1].match(/(?<!\d)\d{2}(?!\d)/g) || [];
    const flyRateMatch = text.match(/双飞\s*(?:各(?:打)?)?\s*(\d+(?:\.\d+)?)\s*(毛|元|米|块)/);
    if (flyPairs.length && flyRateMatch) {
      const flyStake = Number(flyRateMatch[1]) * (flyRateMatch[2] === '毛' ? 0.1 : 1);
      subtotal += flyPairs.length * flyStake;
      reasons.push(`双飞${flyPairs.length}组（${flyPairs.join('、')}） × 每组${flyStake}元`);
    }
  }

  const directMatches = [...text.matchAll(/(?<!\d)(\d{3})(?!\d)\s*([一二两三四五六七八九十]|\d+(?:\.\d+)?)\s*直(?!组)/g)];
  for (const match of directMatches) {
    const directStake = numericValue(match[2]) * 2;
    subtotal += directStake;
    reasons.push(`${match[1]}直选${match[2]}倍 = ${directStake}元`);
  }

  const amount = subtotal * lotteryFactor;
  return {
    amount: Number(amount.toFixed(2)),
    claimed,
    confident: true,
    reasons: [`混合玩法分段计算：${reasons.join('；')}${lotteryFactor === 2 ? '；福彩体彩两边' : ''}`]
  };
}

function calculateMultilineCompound(text, claimed) {
  const rawLines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (rawLines.length < 2) return null;
  const playLine = /(飞|直选|直|单|组选|组|组六|组三|定位|独胆|对子|跨度|胆拖|复式|复试|转圈|粘边赖|豹子|和值)/;
  const isSummaryLine = line => /^(?:\d+(?:\.\d+)?\s*[+＋]\s*)+\d+(?:\.\d+)?\s*[=＝]\s*\d+(?:\.\d+)?\s*(?:毛|元|米|块)?$/.test(line.replace(/\s+/g, ''));
  const isNumbersOnlyLine = line => /^(?=.*(?<!\d)\d{3}(?!\d))[\d\s,，.。/、\-]+$/.test(line);
  const isPositionLine = line => /^(?:百位?|十位?|个位?)\s*(?:全部|\d+)\s*$/.test(line);
  const isWildcardFixedLine = line => /(?<![0-9Xx])[0-9Xx]{3}(?![0-9Xx])\s*[=＝]\s*\d/.test(line);
  const lines = [];
  for (let index = 0; index < rawLines.length; index += 1) {
    const line = rawLines[index];
    if (isSummaryLine(line) || /^(?:合计|总计|共计|一共|共)/.test(line)) continue;
    if (!playLine.test(line) && !isWildcardFixedLine(line)) continue;
    const nextLine = rawLines[index + 1];
    if (nextLine && isNumbersOnlyLine(nextLine)) {
      lines.push(`${line} ${nextLine}`);
      index += 1;
    } else if (nextLine && isPositionLine(nextLine)) {
      let combined = line;
      while (rawLines[index + 1] && isPositionLine(rawLines[index + 1])) {
        index += 1;
        combined += ` ${rawLines[index]}`;
      }
      lines.push(combined);
    } else if (/[\d零〇一二两三四五六七八九十百]/.test(line)) {
      lines.push(line);
    }
  }
  // 一段玩法可以跨多行（例如“直各0.2米”后接百、十、个位），
  // 合并后只剩一段时仍必须交给对应玩法计算，不能退回成逐个三位数计算。
  if (!lines.length) return null;

  const hasWelfareMarker = line => /福彩|[福褔]|3\s*[Dd]|三\s*[DdBb]|三弟/i.test(line);
  const hasSportsMarker = line => /体彩|[体體]|排列三|排三|排家|(?:^|[\s,，.。:：;；])排(?=$|[\s,，.。:：;；\d])/.test(line);
  const allTargets = lotteryTargets(text);
  // 首行“福+体”可只作为整条的盘别标记，后续每一行都应继承两边投注。
  let carriedPrefix = allTargets.length === 2
    ? '福体 '
    : allTargets.length === 1 ? (allTargets[0] === '福彩' ? '福 ' : '体 ') : '';
  const parts = [];
  for (const line of lines) {
    const welfare = hasWelfareMarker(line);
    const sports = hasSportsMarker(line);
    if (welfare || sports) carriedPrefix = welfare && sports ? '福体 ' : welfare ? '福 ' : '体 ';
    if (!carriedPrefix) return null;
    // 行尾合计只用于整条金额核对，不能把其中的三位数误认成投注号码。
    const calculationLine = line.replace(/(?:合计|总计|共计|一共|共)\s*\d+(?:\.\d+)?\s*(?:毛|元|米|块)?/g, '').trim();
    const result = autoCalculateBet(`${carriedPrefix}${calculationLine}`, false);
    if (result.amount === '' || !result.confident) return null;
    parts.push({ line, amount: Number(result.amount), reason: result.reasons.join('；') });
  }
  const amount = parts.reduce((sum, part) => sum + part.amount, 0);
  return {
    amount: Number(amount.toFixed(2)),
    claimed,
    confident: true,
    reasons: [`多段投注分别计算：${parts.map(part => `${part.line} = ${money(part.amount)}元`).join('；')}`]
  };
}

function calculateExplicitEachMoneyBet(text, claimed, lotteryFactor) {
  const numbers = text.match(/(?<!\d)\d{3}(?!\d)/g) || [];
  if (!numbers.length) return null;

  const readRate = match => {
    if (!match) return null;
    return chineseAmount(match[1]) * (match[2] === '毛' ? 0.1 : 1);
  };
  const moneyPattern = '([零〇一二两三四五六七八九十百]+|\\d+(?:\\.\\d+)?)\\s*(毛|元|米|块)';
  // “直组0.5”中的小数不是倍数，而是每个玩法的金额；
  // 倍数必须写“倍”，无单位的整数仍沿用倍数规则。
  const unitlessDecimalBoth = text.match(/(?:直\s*组|组\s*直|直\s*选?\s*组|一直一组|一单一组)\s*各?(\d+\.\d+)(?!\s*(?:毛|元|米|块))/);
  if (unitlessDecimalBoth) {
    const bothRate = Number(unitlessDecimalBoth[1]);
    const amount = numbers.length * bothRate * 2 * lotteryFactor;
    return { amount: Number(amount.toFixed(2)), claimed, confident: true,
      reasons: [`${numbers.length}个号码 ×（直${money(bothRate)}元 + 组${money(bothRate)}元）${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
  }
  const bothRate = readRate(text.match(new RegExp(`(?:直\\s*组|组\\s*直|直\\s*选?\\s*组|一直一组|一单一组)\\s*各(?:打)?\\s*${moneyPattern}`)));
  if (bothRate != null) {
    const amount = numbers.length * bothRate * 2 * lotteryFactor;
    return { amount: Number(amount.toFixed(2)), claimed, confident: true,
      reasons: [`${numbers.length}个号码 ×（直${bothRate}元 + 组${bothRate}元）${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
  }

  const directRate = readRate(text.match(new RegExp(`(?:直选|直(?!\\s*组))\\s*各(?:打)?\\s*${moneyPattern}`)));
  if (directRate != null) {
    const amount = numbers.length * directRate * lotteryFactor;
    return { amount: Number(amount.toFixed(2)), claimed, confident: true,
      reasons: [`${numbers.length}个号码 × 直${directRate}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
  }

  const groupRate = readRate(text.match(new RegExp(`(?:组选|组(?![三六]))\\s*各(?:打)?\\s*${moneyPattern}`)));
  if (groupRate != null) {
    const amount = numbers.length * groupRate * lotteryFactor;
    return { amount: Number(amount.toFixed(2)), claimed, confident: true,
      reasons: [`${numbers.length}个号码 × 组${groupRate}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
  }
  return null;
}

function calculateDirectGroupWithSingleDigit(text, claimed, lotteryFactor) {
  const countStyle = text.match(/(?:各\s*)?([一二两三四五六七八九十]|\d+)\s*(?:直|单)\s*([一二两三四五六七八九十]|\d+)\s*组/);
  const labelledStyle = text.match(/直\s*([一二两三四五六七八九十]|\d+)\s*倍?\s*组\s*([一二两三四五六七八九十]|\d+)\s*倍?/);
  const directGroup = countStyle || labelledStyle;
  const singleDigit = text.match(/(?<!\d)(\d)\s*(?:独胆|独|毒[胆但]?)\s*([零〇一二两三四五六七八九十百]+|\d+(?:\.\d+)?)\s*(毛|元|米|块)/);
  if (!directGroup && !singleDigit) return null;

  let amount = 0;
  const reasons = [];
  if (directGroup) {
    const numbers = text.match(/(?<!\d)\d{3}(?!\d)/g) || [];
    if (!numbers.length) return null;
    const directTimes = numericValue(directGroup[1]);
    const groupTimes = numericValue(directGroup[2]);
    const perNumber = (directTimes + groupTimes) * 2;
    amount += numbers.length * perNumber;
    reasons.push(`${numbers.length}个号码 ×（${directTimes}直${directTimes * 2}元 + ${groupTimes}组${groupTimes * 2}元）`);
  }
  if (singleDigit) {
    const stake = chineseAmount(singleDigit[2]) * (singleDigit[3] === '毛' ? 0.1 : 1);
    amount += stake;
    reasons.push(`独胆${singleDigit[1]}按明确金额${stake}元`);
  }
  amount *= lotteryFactor;
  return { amount: Number(amount.toFixed(2)), claimed, confident: true,
    reasons: [`组合玩法分段计算：${reasons.join('；')}${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
}

function calculateWildcardFixedAmount(text, claimed, lotteryFactor) {
  const selections = [...text.matchAll(/(?<![0-9Xx])([0-9Xx]{3})(?![0-9Xx])\s*[=＝]\s*(\d+(?:\.\d+)?)\s*(毛|元|米|块)?/g)];
  if (!selections.length) return null;
  const details = selections.map(match => ({
    code: match[1].toUpperCase(),
    amount: Number(match[2]) * (match[3] === '毛' ? 0.1 : 1)
  }));
  const subtotal = details.reduce((sum, item) => sum + item.amount, 0);
  const amount = subtotal * lotteryFactor;
  return { amount: Number(amount.toFixed(2)), claimed, confident: true,
    reasons: [`X码定位按等号固定金额：${details.map(item => `${item.code}=${money(item.amount)}元`).join(' + ')}${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`] };
}

function autoCalculateBet(text, allowCompound = true) {
  const clean = text.replace(/&#x20;|&nbsp;/gi, ' ').replace(/O/g, '0');
  const claimed = extractClaimedAmount(clean);
  const reasons = [];
  const lotteryFactor = lotteryTargets(clean).length;

  if (allowCompound) {
    const multilineCompound = calculateMultilineCompound(clean, claimed);
    if (multilineCompound) return multilineCompound;
  }
  // 定位含有三位数字集合时，必须先按百/十/个位做笛卡尔组合；
  // 不能先被“直各X元”的通用单式规则截获。
  const positionBet = calculatePositionBet(clean, claimed, lotteryFactor);
  if (positionBet) return positionBet;
  const explicitEachMoneyBet = calculateExplicitEachMoneyBet(clean, claimed, lotteryFactor);
  if (explicitEachMoneyBet) return explicitEachMoneyBet;
  const directGroupWithSingleDigit = calculateDirectGroupWithSingleDigit(clean, claimed, lotteryFactor);
  if (directGroupWithSingleDigit) return directGroupWithSingleDigit;
  const wildcardFixedAmount = calculateWildcardFixedAmount(clean, claimed, lotteryFactor);
  if (wildcardFixedAmount) return wildcardFixedAmount;
  const wildcardPositionCombination = calculateWildcardPositionCombination(clean, claimed, lotteryFactor);
  if (wildcardPositionCombination) return wildcardPositionCombination;
  const fixedAmountPlay = calculateFixedAmountPlay(clean, claimed, lotteryFactor);
  if (fixedAmountPlay) return fixedAmountPlay;
  const stickyBet = calculateStickyBet(clean, claimed, lotteryFactor);
  if (stickyBet) return stickyBet;
  const flyingBet = calculateFlyingBet(clean, claimed, lotteryFactor);
  if (flyingBet) return flyingBet;
  const singleDigitBet = calculateSingleDigitBet(clean, claimed, lotteryFactor);
  if (singleDigitBet) return singleDigitBet;
  const pairOrSpanBet = calculatePairOrSpanBet(clean, claimed, lotteryFactor);
  if (pairOrSpanBet) return pairOrSpanBet;
  const twoCodeGroupBet = calculateTwoCodeGroupBet(clean, claimed, lotteryFactor);
  if (twoCodeGroupBet) return twoCodeGroupBet;
  const sumOrLeopardBet = calculateSumOrLeopardBet(clean, claimed, lotteryFactor);
  if (sumOrLeopardBet) return sumOrLeopardBet;
  const allDanTuoBet = calculateAllDanTuoBet(clean, claimed, lotteryFactor);
  if (allDanTuoBet) return allDanTuoBet;
  const danTuoBet = calculateDanTuoBet(clean, claimed, lotteryFactor);
  if (danTuoBet) return danTuoBet;
  const multiGroupBet = calculateMultiGroupBet(clean, claimed, lotteryFactor);
  if (multiGroupBet) return multiGroupBet;

  if (/(复式|复试|转圈|打包组三)/.test(clean) && claimed !== '') {
    reasons.push('原文属于复式、转圈或打包组三，并已写总金额，按确认规则直接采用原文金额。');
    return { amount: claimed, claimed, confident: true, reasons };
  }

  const noteCount = clean.match(/(\d+)\s*注/);
  const perRate = rateFromText(clean);
  if (noteCount && perRate != null) {
    const amount = Number(noteCount[1]) * perRate * lotteryFactor;
    reasons.push(`${noteCount[1]}注 × 每注${perRate}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`);
    return { amount: Number(amount.toFixed(2)), claimed, confident: true, reasons };
  }

  const numbers = clean.match(/(?<!\d)\d{3}(?!\d)/g) || [];
  const count = numbers.length;
  if (count) {
    const both = /直组|直\s*选?\s*组|一直一组|一单一组|直选组选|组直/.test(clean);
    const direct = both || /直选|直|一直|一单|单挑|\d单/.test(clean);
    const group = both || /组选|组|组六|组三/.test(clean);
    if (direct && group) {
      const directStake = playStake(clean, 'direct');
      const groupStake = playStake(clean, 'group');
      const amount = count * (directStake + groupStake) * lotteryFactor;
      reasons.push(`${count}个号码 ×（直${directStake}元 + 组${groupStake}元）${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`);
      return { amount: Number(amount.toFixed(2)), claimed, confident: true, reasons };
    }
    if (direct || group) {
      const per = playStake(clean, direct ? 'direct' : 'group');
      const amount = count * per * lotteryFactor;
      reasons.push(`${count}个号码 × 每个${per}元${lotteryFactor === 2 ? ' × 福彩体彩两边' : ''}`);
      return { amount: Number(amount.toFixed(2)), claimed, confident: !/(胆码|拖|防|定位)/.test(clean), reasons };
    }
  }

  if (claimed !== '') {
    reasons.push('已识别原文金额，但无法从原文可靠拆出全部投注项目。');
    return { amount: '', claimed, confident: false, reasons,
      needs: requiredBetDetails(clean) };
  }
  reasons.push('未识别到可可靠计算的玩法和金额。');
  return { amount: '', claimed: '', confident: false, reasons,
    needs: requiredBetDetails(clean) };
}

function requiredBetDetails(text) {
  const needs = [];
  const hasLottery = /福彩|[福褔]|体彩|[体體]|排列三|排三|排家|3\s*[Dd]|三\s*[DdBb]|三弟/i.test(text);
  const hasNumber = /(?<!\d)\d{3}(?!\d)/.test(text) || /(?:百位?|十位?|个位?)\s*(?:全部|\d+)/.test(text) || /(?:独胆|毒|扣)\s*\d/.test(text);
  const hasPlay = /(直|组|单|飞|定位|独胆|毒|扣|对子|跨度|胆拖|复式|复试|转圈|粘边赖|豹子|和值)/.test(text);
  const hasRate = /(\d+(?:\.\d+)?|[零〇一二两三四五六七八九十百]+)\s*(?:倍|毛|元|米|块)|(?:直|组|单|飞|定位)\s*(?:各\s*)?\d+\.\d+|[=＝]\s*\d/.test(text);
  if (!hasLottery) needs.push('补充彩票类型：请注明“福/福彩”或“体/体彩”。');
  if (!hasNumber) needs.push('补充号码：请写明三位号码、定位数字或对应胆码。');
  if (!hasPlay) needs.push('补充玩法：例如直、组、组三、组六、定位、双飞等。');
  if (!hasRate) needs.push('补充金额或倍数：请写“×倍”或“×元/米/毛”。');
  if (!needs.length) needs.push('写法存在组合歧义：请改为“号码 + 玩法 + 金额/倍数”，或切换到手动录入填写计算金额。');
  return needs;
}

function numericValue(value) {
  const map = { 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
  return map[value] || Number(value) || 1;
}

function playStake(text, kind) {
  const keyword = kind === 'direct' ? '(?:直选|直|单)' : '(?:组选|组六|组三|组)';
  const moneyAfter = text.match(new RegExp(`${keyword}\\s*([零〇一二两三四五六七八九十百]+|\\d+(?:\\.\\d+)?)\\s*(毛|元|米|块)`));
  if (moneyAfter) return chineseAmount(moneyAfter[1]) * (moneyAfter[2] === '毛' ? 0.1 : 1);
  const moneyBefore = text.match(new RegExp(`([零〇一二两三四五六七八九十百]+|\\d+(?:\\.\\d+)?)\\s*(毛|元|米|块)\\s*${keyword}`));
  if (moneyBefore) return chineseAmount(moneyBefore[1]) * (moneyBefore[2] === '毛' ? 0.1 : 1);
  const timesAfter = text.match(new RegExp(`${keyword}\\s*([一二两三四五六七八九十]|\\d+(?:\\.\\d+)?)\\s*倍`));
  if (timesAfter) return numericValue(timesAfter[1]) * 2;
  const decimalBefore = text.match(new RegExp(`(\\d+\\.\\d+)\\s*${keyword}`));
  if (decimalBefore) return Number(decimalBefore[1]);
  const decimalAfter = text.match(new RegExp(`${keyword}\\s*(\\d+\\.\\d+)`));
  if (decimalAfter) return Number(decimalAfter[1]);
  if (kind === 'direct') {
    const beforeGroup = text.match(/直\s*(\d+(?:\.\d+)?)\s*(?=组)/);
    if (beforeGroup) return Number(beforeGroup[1]);
  }
  const timesBefore = text.match(new RegExp(`([一二两三四五六七八九十]|(?<!\\d)\\d{1,2})\\s*${keyword}`));
  if (timesBefore) return numericValue(timesBefore[1]) * 2;
  const eachRate = rateFromText(text);
  if (eachRate != null) return eachRate;
  const generalTimes = text.match(/([一二两三四五六七八九十]|\d+(?:\.\d+)?)\s*倍/);
  return generalTimes ? numericValue(generalTimes[1]) * 2 : 2;
}

function specialStake(text, base, entry, itemCount = 1) {
  const eachMoney = text.match(/各(?:打)?\s*(\d+(?:\.\d+)?)\s*(毛|元|米|块)/);
  if (eachMoney) return Number(eachMoney[1]) * (eachMoney[2] === '毛' ? 0.1 : 1);
  const times = text.match(/([一二两三四五六七八九十]|\d+(?:\.\d+)?)\s*倍/);
  if (times) return base * numericValue(times[1]);
  if (itemCount === 1 && Number(entry.amount) > 0) return Number(entry.amount);
  return base;
}

function lotteryTargets(text) {
  const welfare = /福彩|[福褔]|3\s*[Dd]|三\s*[DdBb]|三弟/i.test(text);
  const sports = /体彩|[体體]|排列三|排三|排家|(?:^|[\s,，.。:：;；])排(?=$|[\s,，.。:：;；\d])/.test(text);
  const targets = [];
  if (welfare) targets.push('福彩');
  if (sports) targets.push('体彩');
  if (!targets.length) {
    const sportsOnlyPlay = /转一?圈|跨度|\d\s*跨|粘边赖|全胆拖|胆\s*\d+\s*拖\s*\d+/.test(text);
    targets.push(sportsOnlyPlay ? '体彩' : '福彩');
  }
  return targets;
}

function entryLotteryTargets(entry) {
  return Array.isArray(entry.lotteries) && entry.lotteries.length
    ? entry.lotteries
    : lotteryTargets(entry.original || '');
}

function extractMultiSets(text, label) {
  const values = [];
  const before = new RegExp(`(?<!\\d)(\\d{4,10})(?!\\d)\\s*${label}`, 'g');
  const after = new RegExp(`${label}\\s*[:：]?\\s*(\\d{4,10})`, 'g');
  values.push(...[...text.matchAll(before)].map(match => match[1]));
  values.push(...[...text.matchAll(after)].map(match => match[1]));
  return values;
}

function makeWinningEntry(entry, lottery, playName, hit, stake, odds, index) {
  return {
    id: `auto-win-${entry.id}-${lottery}-${playName}-${index}`,
    record: entry.record,
    lottery,
    match: `${playName}：${hit}`,
    stake: Number(stake.toFixed(2)),
    odds: Number(odds.toFixed(4)),
    prize: Number((stake * odds).toFixed(2))
  };
}

function scanEntryForDraw(entry, lottery, draw) {
  const text = String(entry.original || '').replace(/&#x20;|&nbsp;/gi, ' ').replace(/O/g, '0');
  if (!entryLotteryTargets(entry).includes(lottery) || !/^\d{3}$/.test(draw)) return [];
  const wins = [];
  const drawDigits = draw.split('');
  const drawSet = new Set(drawDigits);
  const sortedDraw = [...drawDigits].sort().join('');
  const threeDigitNumbers = text.match(/(?<!\d)\d{3}(?!\d)/g) || [];
  const both = /直组|直\s*(?:和|加|与)?\s*组|一直一组|一单一组|直选组选|组直/.test(text);
  const wantsDirect = both || /直选|直|单挑|\d单/.test(text);
  const wantsGroup = both || /组选|组六|组三|\d组|一组|两组|三组|四组|五组/.test(text);
  const directStake = playStake(text, 'direct');
  const groupStake = playStake(text, 'group');
  let winIndex = 0;

  for (const number of threeDigitNumbers) {
    if (wantsDirect && number === draw) {
      wins.push(makeWinningEntry(entry, lottery, '直选', number, directStake, 950, winIndex++));
    }
    if (wantsGroup && [...number].sort().join('') === sortedDraw && drawSet.size > 1) {
      const explicitGroup3 = /组三/.test(text) && !/组六/.test(text);
      const explicitGroup6 = /组六/.test(text) && !/组三/.test(text);
      if ((!explicitGroup3 || drawSet.size === 2) && (!explicitGroup6 || drawSet.size === 3)) {
        const group3 = drawSet.size === 2;
        wins.push(makeWinningEntry(entry, lottery, group3 ? '组三' : '组六', number, groupStake, group3 ? 310 : 155, winIndex++));
      }
    }
  }

  const group6Sets = extractMultiSets(text, '组六');
  for (const digits of group6Sets) {
    const unique = [...new Set(digits)];
    if (drawSet.size === 3 && drawDigits.every(digit => unique.includes(digit)) && plays.group6Multi.prizeBySize[unique.length]) {
      const stake = specialStake(text, 10, entry, group6Sets.length);
      wins.push(makeWinningEntry(entry, lottery, `${unique.length}码组六`, digits, stake, plays.group6Multi.prizeBySize[unique.length] / 10, winIndex++));
    }
  }

  const group3Sets = extractMultiSets(text, '组三');
  for (const digits of group3Sets) {
    const unique = [...new Set(digits)];
    if (drawSet.size === 2 && drawDigits.every(digit => unique.includes(digit)) && plays.group3Multi.prizeBySize[unique.length]) {
      const stake = specialStake(text, 10, entry, group3Sets.length);
      wins.push(makeWinningEntry(entry, lottery, `${unique.length}码组三`, digits, stake, plays.group3Multi.prizeBySize[unique.length] / 10, winIndex++));
    }
  }

  if (/(独胆|毒|扣)/.test(text)) {
    const after = text.match(/(?:独胆|毒|扣)\s*([0-9](?:[、，,.。/\-]?[0-9])*)/);
    const before = text.match(/([0-9](?:[、，,.。/\-][0-9])*)\s*(?:独胆|毒|扣)/);
    const digits = (after?.[1] || before?.[1] || '').replace(/\D/g, '').split('').filter(Boolean);
    const stake = specialStake(text, 10, entry, digits.length);
    digits.forEach(digit => {
      if (drawDigits.includes(digit)) wins.push(makeWinningEntry(entry, lottery, '独胆', digit, stake, 3.5, winIndex++));
    });
  }

  if (/双飞/.test(text)) {
    const pairs = text.match(/(?<!\d)\d{2}(?!\d)/g) || [];
    const stake = specialStake(text, 10, entry, pairs.length);
    pairs.forEach(pair => {
      if ([...pair].every(digit => drawDigits.includes(digit))) wins.push(makeWinningEntry(entry, lottery, '双飞', pair, stake, 17, winIndex++));
    });
  }

  if (/对子/.test(text) && drawSet.size < 3) {
    const repeated = drawDigits.find((digit, index) => drawDigits.indexOf(digit) !== index);
    const selected = text.match(/(?<!\d)\d{1,2}(?!\d)/g) || [];
    const stake = specialStake(text, 10, entry, selected.length);
    selected.forEach(value => {
      if (value.includes(repeated)) wins.push(makeWinningEntry(entry, lottery, '对子', value, stake, 32, winIndex++));
    });
  }

  if (/跨度|\d跨/.test(text)) {
    const actualSpan = Math.max(...drawDigits.map(Number)) - Math.min(...drawDigits.map(Number));
    const spans = [...text.matchAll(/(\d)\s*跨|跨度\s*(\d)/g)].map(match => Number(match[1] ?? match[2]));
    const stake = specialStake(text, 10, entry, spans.length);
    spans.forEach(span => {
      if (span === actualSpan) wins.push(makeWinningEntry(entry, lottery, '跨度', String(span), stake, plays.span.prizes[span] / 10, winIndex++));
    });
  }

  if (/打包组三|组三全包/.test(text) && drawSet.size === 2) {
    const stake = specialStake(text, 180, entry, 1);
    wins.push(makeWinningEntry(entry, lottery, '组三全包', draw, stake, 600 / 180, winIndex++));
  }

  if (/和值/.test(text)) {
    const actualSum = drawDigits.map(Number).reduce((total, value) => total + value, 0);
    const selectedSums = [...text.matchAll(/(\d{1,2})\s*和值|和值\s*(\d{1,2})/g)]
      .map(match => Number(match[1] ?? match[2])).filter(value => value >= 0 && value <= 27);
    if (selectedSums.includes(actualSum)) {
      const stake = specialStake(text, 10, entry, selectedSums.length);
      wins.push(makeWinningEntry(entry, lottery, '和值', String(actualSum), stake, plays.sum.prizes[actualSum] / 10, winIndex++));
    }
  }

  if (/豹子全包/.test(text) && drawSet.size === 1) {
    const stake = specialStake(text, 10, entry, 1);
    wins.push(makeWinningEntry(entry, lottery, '豹子全包', draw, stake, 80, winIndex++));
  }

  if (lottery === '体彩' && /转一?圈/.test(text)) {
    const setMatch = text.match(/转一?圈[^\d]{0,8}(\d{2,10})|(?<!\d)(\d{2,10})(?!\d)[^\d]{0,8}转一?圈/);
    const circleDigits = [...new Set((setMatch?.[1] || setMatch?.[2] || '').split('').filter(Boolean))];
    const circlePlay = /组三/.test(text) ? plays.circle3 : plays.circle6;
    const correctType = /组三/.test(text) ? drawSet.size === 2 : drawSet.size === 3;
    const circleBase = circlePlay.baseBySize[circleDigits.length];
    if (correctType && circleBase && drawDigits.every(digit => circleDigits.includes(digit))) {
      const stake = specialStake(text, circleBase, entry, 1);
      wins.push(makeWinningEntry(entry, lottery, circlePlay.name, circleDigits.join(''), stake, 1900 / circleBase, winIndex++));
    }
  }

  if (lottery === '体彩' && /胆\s*\d+\s*拖\s*\d+/.test(text)) {
    const danMatch = text.match(/胆\s*(\d+)\s*拖\s*(\d+)/);
    const danDigits = [...new Set((danMatch?.[1] || '').split(''))];
    const dragDigits = [...new Set((danMatch?.[2] || '').split(''))];
    const allDigits = [...new Set([...danDigits, ...dragDigits])];
    const danPlay = /组三/.test(text) ? plays.group3Dan : plays.group6Dan;
    const correctType = /组三/.test(text) ? drawSet.size === 2 : drawSet.size === 3;
    const payout = danPlay.prizeBySize[allDigits.length];
    const matched = correctType && danDigits.every(digit => drawDigits.includes(digit)) &&
      drawDigits.every(digit => danDigits.includes(digit) || dragDigits.includes(digit));
    if (matched && payout) {
      const stake = specialStake(text, 10, entry, 1);
      wins.push(makeWinningEntry(entry, lottery, danPlay.name, `胆${danDigits.join('')}拖${dragDigits.join('')}`, stake, payout / 10, winIndex++));
    }
  }

  const stickyType = /粘边赖组三/.test(text) ? 'sticky3' : /粘边赖组六/.test(text) ? 'sticky6' : '';
  if (stickyType) {
    const selectedMatch = text.match(/(?:胆|组三|组六)\s*([0-9]+)/);
    const selectedDigits = [...new Set((selectedMatch?.[1] || '').split('').filter(Boolean))];
    const stickyPlay = plays[stickyType];
    const correctType = stickyType === 'sticky6' ? drawSet.size === 3 : drawSet.size === 2;
    const stickyBase = stickyPlay.baseByCount[selectedDigits.length];
    if (correctType && stickyBase) {
      selectedDigits.filter(digit => drawDigits.includes(digit)).forEach(digit => {
        wins.push(makeWinningEntry(entry, lottery, stickyPlay.name, `胆${digit}`, stickyBase, stickyPlay.prize / stickyBase, winIndex++));
      });
    }
  }
  return wins;
}

function rebuildWinningEntries() {
  const welfareDigits = $('welfareDraw').value.replace(/\D/g, '');
  const sportsDigits = $('sportsDraw').value.replace(/\D/g, '');
  const draws = {
    福彩: welfareDigits.length === 3 ? welfareDigits : '',
    体彩: sportsDigits.length === 3 ? sportsDigits : ''
  };
  const manualEntries = entries.filter(entry => !String(entry.id || '').startsWith('auto-win-'));
  const automaticEntries = [];
  for (const entry of betEntries) {
    automaticEntries.push(...scanEntryForDraw(entry, '福彩', draws.福彩));
    automaticEntries.push(...scanEntryForDraw(entry, '体彩', draws.体彩));
  }
  entries = [...manualEntries, ...automaticEntries];
  saveEntries();
  return automaticEntries.length;
}

function updateBetCheck() {
  const amountRaw = $('calculatedBetAmount').value;
  const claimedRaw = $('claimedBetAmount').value;
  const status = $('betCheckStatus');
  $('calculatedAmountDisplay').textContent = amountRaw === '' ? '--' : money(Number(amountRaw));
  $('claimedAmountDisplay').textContent = claimedRaw === '' ? '--' : money(Number(claimedRaw));
  status.className = 'check-status hidden';
  status.textContent = '';
  if (amountRaw === '' || claimedRaw === '') return;
  const diff = Number((Number(claimedRaw) - Number(amountRaw)).toFixed(2));
  if (!diff) return;
  status.className = 'check-status warn';
  status.textContent = `金额不一致：以计算金额${money(Number(amountRaw))}为准，原文${money(Number(claimedRaw))}（原文${diff > 0 ? '多' : '少'}${money(Math.abs(diff))}）`;
}

let lastAutoRecordedText = '';
let rawInputVersion = 0;
let autoClearInputTimer;

function appendCurrentBetRecord({ clearAfter = false, automatic = false } = {}) {
  const original = $('rawBetText').value.trim();
  const amount = $('calculatedBetAmount').value;
  if (!original || amount === '') return false;
  if (automatic && lastAutoRecordedText === original) return false;
  betEntries.push({ id: `bet-custom-${Date.now()}-${betEntries.length}`, record: betEntries.length + 1, original,
    amount: Number(amount), claimed: $('claimedBetAmount').value === '' ? '' : Number($('claimedBetAmount').value),
    lotteries: lotteryTargets(original), batchId: activeBetBatchId, createdAt: new Date().toISOString() });
  if (automatic) lastAutoRecordedText = original;
  saveBetEntries(); render();
  const savedRecord = betEntries.length;
  if (clearAfter) {
    $('rawBetText').value = ''; $('calculatedBetAmount').value = ''; $('claimedBetAmount').value = '';
    setPlainParseDetails('尚未试算'); updateBetCheck();
  }
  toast(`已自动记录第${savedRecord}条`);
  return true;
}

function setPlainParseDetails(text) {
  const details = $('parseDetails');
  details.closest('.parse-box')?.classList.remove('needs-attention');
  details.textContent = text;
}

function renderBetParseDetails(result, detectedLotteries, recordMessage = '') {
  const details = $('parseDetails');
  const box = details.closest('.parse-box');
  box?.classList.toggle('needs-attention', !result.confident);
  details.replaceChildren();
  const add = (text, className = '') => {
    const row = document.createElement('div');
    row.textContent = text;
    if (className) row.className = className;
    details.append(row);
  };
  add(result.confident ? '已完成试算' : '需要人工补充', result.confident ? 'parse-state-success' : 'parse-state-warning');
  add(`识别彩票：${detectedLotteries.length > 1 ? '福彩 + 体彩' : detectedLotteries[0]}`);
  result.reasons.forEach(reason => add(reason));
  if (!result.confident) {
    add('待补充信息', 'parse-needs-heading');
    add('请补充以下内容后再自动计算，或切换到“手动录入”直接填写金额：', 'parse-needs-title');
    (result.needs || ['请补充完整投注写法和计算金额。']).forEach(need => add(`• ${need}`, 'parse-need'));
  }
  if (recordMessage) add(recordMessage, 'parse-record-note');
}

function runAutoBetCalculation({ record = false } = {}) {
  const text = $('rawBetText').value.trim();
  if (!text) {
    lastAutoRecordedText = '';
    $('calculatedBetAmount').value = '';
    $('claimedBetAmount').value = '';
    setPlainParseDetails('尚未试算');
    updateBetCheck();
    return;
  }
  const result = autoCalculateBet(text);
  $('calculatedBetAmount').value = result.amount;
  $('claimedBetAmount').value = result.claimed;
  const detectedLotteries = lotteryTargets(text);
  renderBetParseDetails(result, detectedLotteries);
  updateBetCheck();
  if (record && result.amount !== '') {
    const recorded = appendCurrentBetRecord({ automatic: true });
    renderBetParseDetails(result, detectedLotteries, recorded
      ? `已自动记录为第${betEntries.length}条。`
      : '本条已在金额总表中。');
    if (recorded) {
      const recordedText = text;
      const recordedVersion = rawInputVersion;
      clearTimeout(autoClearInputTimer);
      autoClearInputTimer = setTimeout(() => {
        if (rawInputVersion !== recordedVersion || $('rawBetText').value.trim() !== recordedText) return;
        $('rawBetText').value = '';
        lastAutoRecordedText = '';
      }, 1000);
    }
  }
}

function renderOdds() {
  const cards = [
    ['福彩3D · 基础', [['直选','2 / 1900'],['组六','2 / 310'],['组三','2 / 620'],['豹子全包','10 / 800']]],
    ['福彩3D · 特殊玩法', [['独胆','10 / 35'],['双飞','10 / 170'],['对子','10 / 320'],['一码定位','10 / 95'],['二码定位','10 / 950']]],
    ['福彩3D · 组六复式', Object.entries(plays.group6Multi.prizeBySize).map(([n,p]) => [`${n === '10' ? '全包' : `${n}码`}`,`10 / ${p}`])],
    ['福彩3D · 组三复式', Object.entries(plays.group3Multi.prizeBySize).map(([n,p]) => [`${n === '10' ? '全包' : `${n}码`}`,`10 / ${p}`])],
    ['福彩3D · 直选复式', Object.entries(plays.directMulti.prizeBySize).map(([n,p]) => [`${n}码`,`10 / ${p}`])],
    ['福彩3D · 和值', Object.entries(plays.sum.prizes).slice(0, 14).map(([n,p]) => [`${n} / ${27 - Number(n)}`,`10 / ${p}`])],
    ['体彩排列三 · 跨度', Object.entries(plays.span.prizes).map(([n,p]) => [`跨度${n}`,`10 / ${p}`])],
    ['体彩排列三 · 转圈组六', Object.entries(plays.circle6.baseBySize).map(([n,base]) => [`${n === '10' ? '全包' : `${n}码`}`,`${base} / 1900`])],
    ['体彩排列三 · 转圈组三', Object.entries(plays.circle3.baseBySize).map(([n,base]) => [`${n === '10' ? '全包' : `${n}码`}`,`${base} / 1900`])],
    ['体彩排列三 · 组六胆拖', Object.entries(plays.group6Dan.prizeBySize).map(([n,p]) => [`1胆拖${n}码`,`10 / ${p}`])],
    ['体彩排列三 · 组三胆拖', Object.entries(plays.group3Dan.prizeBySize).map(([n,p]) => [`1胆拖${n}码`,`10 / ${p}`])],
    ['体彩排列三 · 粘边赖组六', Object.entries(plays.sticky6.baseByCount).map(([n,base]) => [`${n}胆组六`,`${base} / 300`])],
    ['体彩排列三 · 粘边赖组三', Object.entries(plays.sticky3.baseByCount).map(([n,base]) => [`${n}胆组三`,`${base} / 600`])],
    ['基础玩法', [['直选','2 → 1900'],['组六','2 → 310'],['组三','2 → 620']]],
    ['特殊玩法', [['独胆','10 → 35'],['双飞','10 → 170'],['对子','10 → 320'],['一码定位','10 → 95'],['二码定位','10 → 950']]],
    ['组六复式', Object.entries(plays.group6Multi.prizeBySize).map(([n,p]) => [`${n}码`,`10 → ${p}`])],
    ['组三复式', Object.entries(plays.group3Multi.prizeBySize).map(([n,p]) => [`${n}码`,`10 → ${p}`])],
    ['跨度', Object.entries(plays.span.prizes).map(([n,p]) => [`跨度${n}`,`10 → ${p}`])],
    ['粘边赖 / 全包', [['粘边赖组六1胆','72 → 300'],['粘边赖组六2胆','128 → 300/每个命中胆'],['组三全包','180 → 600']]]
  ];
  $('oddsGrid').innerHTML = cards.slice(0, 13).map(([title, rows]) => `<article class="odds-card"><h3>${title}</h3><dl>${rows.map(([k,v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></article>`).join('');
}

function toast(text) {
  const el = $('toast'); el.textContent = text; el.classList.add('show');
  clearTimeout(el.timer); el.timer = setTimeout(() => el.classList.remove('show'), 1800);
}

document.querySelectorAll('.tab').forEach(b => b.onclick = () => switchTab(b.dataset.tab));
document.querySelectorAll('.filter').forEach(b => b.onclick = () => {
  currentFilter = b.dataset.filter;
  document.querySelectorAll('.filter').forEach(x => x.classList.toggle('active', x === b));
  render();
});
$('searchInput').oninput = render;
$('betSearchInput').oninput = render;
$('onlyAnomalies').onchange = render;
const batchFilter = $('batchFilter');
if (batchFilter) batchFilter.onchange = event => {
  currentBetBatchFilter = event.target.value;
  render();
};
const entryBatchFilter = $('entryBatchFilter');
if (entryBatchFilter) entryBatchFilter.onchange = event => {
  activeBetBatchId = event.target.value;
  localStorage.setItem(ACTIVE_BET_BATCH_KEY, activeBetBatchId);
  currentBetBatchFilter = 'active';
  render();
  toast(`已切换至${batchLabel(activeBetBatchId)}`);
};
$('betPreviewList').onclick = event => {
  const detailButton = event.target.closest('.preview-detail');
  if (detailButton) {
    $('betSearchInput').value = detailButton.dataset.record;
    render();
    switchTab('betLedger');
    return;
  }
  const refundButton = event.target.closest('.preview-refund');
  if (!refundButton) return;
  if (!confirm(`确定退掉第${refundButton.dataset.record}条投注？`)) return;
  betEntries = betEntries
    .filter(entry => entry.id !== refundButton.dataset.id)
    .map((entry, index) => ({ ...entry, record: index + 1 }));
  saveBetEntries();
  render();
  toast('该条投注已退掉');
};
$('calculatedBetAmount').oninput = updateBetCheck;
$('claimedBetAmount').oninput = updateBetCheck;
let currentEntryMode = 'auto';
function setEntryMode(mode) {
  currentEntryMode = mode;
  const automatic = mode === 'auto';
  $('autoEntryTab').classList.toggle('active', automatic);
  $('manualEntryTab').classList.toggle('active', !automatic);
  $('autoEntryTab').setAttribute('aria-selected', String(automatic));
  $('manualEntryTab').setAttribute('aria-selected', String(!automatic));
  $('autoEntryPanel').classList.toggle('hidden', !automatic);
  $('manualEntryPanel').classList.toggle('hidden', automatic);
  $('rawBetText').placeholder = automatic
    ? '把一整条投注原文粘贴到这里'
    : '填写需要手动记录的投注原文';
  clearTimeout(autoCalcTimer);
  clearTimeout(pasteCalcTimer);
  pastePending = false;
  if (automatic && $('autoMode').checked && $('rawBetText').value.trim()) runAutoBetCalculation({ record: false });
}
$('autoEntryTab').onclick = () => setEntryMode('auto');
$('manualEntryTab').onclick = () => setEntryMode('manual');
$('autoMode').checked = localStorage.getItem('lottery-auto-mode') === '1';
$('autoMode').onchange = () => {
  localStorage.setItem('lottery-auto-mode', $('autoMode').checked ? '1' : '0');
  toast($('autoMode').checked ? '自动计算已开启' : '自动计算已关闭');
  if ($('autoMode').checked && currentEntryMode === 'auto') runAutoBetCalculation({ record: true });
};
let autoCalcTimer;
let pasteCalcTimer;
let pastePending = false;
$('rawBetText').oninput = event => {
  rawInputVersion += 1;
  if (!$('autoMode').checked || currentEntryMode !== 'auto') return;
  clearTimeout(autoCalcTimer);
  if (pastePending || event.inputType === 'insertFromPaste') return;
  autoCalcTimer = setTimeout(() => runAutoBetCalculation({ record: false }), 300);
};
$('rawBetText').onpaste = () => {
  if (!$('autoMode').checked || currentEntryMode !== 'auto') return;
  pastePending = true;
  clearTimeout(autoCalcTimer);
  clearTimeout(pasteCalcTimer);
  pasteCalcTimer = setTimeout(() => {
    pastePending = false;
    clearTimeout(autoCalcTimer);
    runAutoBetCalculation({ record: true });
  }, 120);
};
$('autoCalculate').onclick = () => {
  const text = $('rawBetText').value.trim();
  if (!text) { toast('请先粘贴投注原文'); return; }
  runAutoBetCalculation({ record: true });
};
let batchDialogMode = 'new';
function openBatchDialog(mode) {
  batchDialogMode = mode;
  const renaming = mode === 'rename';
  $('batchDialogTitle').textContent = renaming ? '重命名当前批次' : '新建批次';
  $('batchDialogSubtitle').textContent = renaming
    ? '名称变更不会影响本批投注记录和金额。'
    : '新投注会录入这个批次，已有批次仍可随时切换继续录入。';
  $('batchDialogConfirm').textContent = renaming ? '确认重命名' : '确认新建';
  $('newBatchName').value = renaming ? (activeBetBatch()?.label || '') : '';
  $('newBatchDialog').showModal();
  setTimeout(() => $('newBatchName').focus(), 0);
}
const newBetBatchButton = $('newBetBatch');
const newBetBatchFromLedgerButton = $('newBetBatchFromLedger');
const renameBetBatchButton = $('renameBetBatch');
const renameBetBatchFromLedgerButton = $('renameBetBatchFromLedger');
if (newBetBatchButton) newBetBatchButton.onclick = () => openBatchDialog('new');
if (newBetBatchFromLedgerButton) newBetBatchFromLedgerButton.onclick = () => openBatchDialog('new');
if (renameBetBatchButton) renameBetBatchButton.onclick = () => openBatchDialog('rename');
if (renameBetBatchFromLedgerButton) renameBetBatchFromLedgerButton.onclick = () => openBatchDialog('rename');
if ($('newBatchCancel')) $('newBatchCancel').onclick = () => $('newBatchDialog').close();
if ($('cancelNewBatch')) $('cancelNewBatch').onclick = () => $('newBatchDialog').close();
if ($('newBatchForm')) $('newBatchForm').onsubmit = event => {
  event.preventDefault();
  const name = $('newBatchName').value.trim();
  if (!name) { toast('请填写批次名称'); $('newBatchName').focus(); return; }
  if (batchDialogMode === 'rename') {
    const batch = activeBetBatch();
    if (!batch) { $('newBatchDialog').close(); toast('当前批次不存在，请刷新后重试'); return; }
    batch.label = name;
    saveBetBatches();
    $('newBatchDialog').close();
    render();
    toast(`已将当前批次重命名为${name}`);
    return;
  }
  const legacyChanged = assignLegacyEntriesToActiveBatch();
  if (legacyChanged) saveBetEntries();
  const nextBatch = createBetBatch(name);
  activeBetBatchId = nextBatch.id;
  localStorage.setItem(ACTIVE_BET_BATCH_KEY, activeBetBatchId);
  currentBetBatchFilter = 'active';
  $('newBatchDialog').close();
  render();
  toast(`已新建并切换到${name}`);
};
$('manualRecordBet').onclick = () => {
  const original = $('rawBetText').value.trim();
  const amountRaw = $('manualBetAmount').value.trim();
  const amount = Number(amountRaw);
  if (!original) { toast('请先填写投注原文'); return; }
  if (amountRaw === '' || !Number.isFinite(amount) || amount < 0) { toast('请填写正确的人工计算金额'); return; }

  betEntries.push({
    id: `bet-manual-${Date.now()}-${betEntries.length}`,
    record: betEntries.length + 1,
    original,
    amount,
    claimed: '',
    lotteries: lotteryTargets(original),
    batchId: activeBetBatchId,
    createdAt: new Date().toISOString(),
    manual: true
  });
  lastAutoRecordedText = original;
  saveBetEntries();
  $('calculatedBetAmount').value = amount;
  $('claimedBetAmount').value = '';
  setPlainParseDetails(`已人工录入\n识别彩票：${lotteryTargets(original).join(' + ')}\n人工计算金额：${money(amount)}元`);
  updateBetCheck();
  render();
  toast(`已手动记录第${betEntries.length}条`);

  const recordedText = original;
  const recordedVersion = rawInputVersion;
  clearTimeout(autoClearInputTimer);
  autoClearInputTimer = setTimeout(() => {
    if (rawInputVersion !== recordedVersion || $('rawBetText').value.trim() !== recordedText) return;
    $('rawBetText').value = '';
    $('manualBetAmount').value = '';
    $('calculatedBetAmount').value = '';
    $('claimedBetAmount').value = '';
    setPlainParseDetails('尚未试算');
    lastAutoRecordedText = '';
    updateBetCheck();
  }, 1000);
};
$('clearBetInput').onclick = () => {
  rawInputVersion += 1;
  clearTimeout(autoClearInputTimer);
  clearTimeout(pasteCalcTimer);
  pastePending = false;
  $('rawBetText').value = ''; $('calculatedBetAmount').value = ''; $('claimedBetAmount').value = '';
  $('manualBetAmount').value = '';
  setPlainParseDetails('尚未试算'); updateBetCheck();
};
$('betLedgerBody').onclick = e => {
  const btn = e.target.closest('.delete-bet');
  if (!btn) return;
  const entry = betEntries.find(item => item.id === btn.dataset.id);
  if (!entry || !confirm(`确定删除第${entry.record}条金额记录？\n金额：${money(Number(entry.amount) || 0)}\n删除后无法恢复。`)) return;
  betEntries = betEntries.filter(x => x.id !== btn.dataset.id).map((x, i) => ({...x, record: i + 1}));
  saveBetEntries(); render();
};
$('copyBetFormula').onclick = () => {
  const selectedEntries = entriesForBetBatch();
  const terms = selectedEntries.map(entry => Number(entry.amount) || 0);
  const total = selectedEntries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
  renderComparedFormula($('dialogBetFormula'), terms, total);
  $('dialogBetTotal').textContent = money(total);
  $('externalBetFormula').value = '';
  resetFormulaComparison();
  $('betCompareResult').className = 'compare-result neutral';
  $('betCompareResult').textContent = '等待输入其他金额合计';
  $('betFormulaDialog').showModal();
};
$('compareBetFormula').onclick = formulaComparison;
$('externalBetFormula').oninput = formulaComparison;
$('copyBetFormulaConfirm').onclick = async () => {
  try {
    await navigator.clipboard.writeText($('dialogBetFormula').textContent.replace(/\s+/g, ''));
    toast('投注加法合计已复制');
  } catch { toast('浏览器未允许复制'); }
};
$('exportBetData').onclick = () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(betEntries, null, 2)], {type:'application/json'}));
  a.download = `投注金额记录-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(a.href);
};
$('resetBetData').onclick = () => {
  if (!confirm('确定清空全部投注金额记录？此操作不能撤销。')) return;
  betEntries = []; saveBetEntries(); render(); toast('投注金额记录已清空');
};
$('ledgerBody').onclick = e => {
  const btn = e.target.closest('.delete');
  if (!btn) return;
  entries = entries.filter(x => x.id !== btn.dataset.id); saveEntries(); render();
};
$('copyFormula').onclick = async () => {
  try { await navigator.clipboard.writeText($('formulaText').textContent); toast('加法合计已复制'); }
  catch { toast('浏览器未允许复制'); }
};
$('exportData').onclick = () => {
  const payload = JSON.stringify({ draws: { 福彩: $('welfareDraw').value, 体彩: $('sportsDraw').value }, entries }, null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([payload], {type:'application/json'}));
  a.download = `核奖记录-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(a.href);
};
$('resetData').onclick = () => {
  if (!confirm('确定清空全部中奖记录？此操作不能撤销。')) return;
  entries = []; saveEntries(); render(); toast('中奖记录已清空');
};
$('applyDraws').onclick = () => {
  const welfareDigits = $('welfareDraw').value.replace(/\D/g, '').slice(0, 3);
  const sportsDigits = $('sportsDraw').value.replace(/\D/g, '').slice(0, 3);
  if (welfareDigits.length !== 3 && sportsDigits.length !== 3) {
    toast('请至少填写一个完整的三位开奖号');
    return;
  }
  $('welfareDraw').value = welfareDigits.length === 3 ? welfareDigits : '';
  $('sportsDraw').value = sportsDigits.length === 3 ? sportsDigits : '';
  $('drawNumber').value = $('lottery').value === '福彩' ? $('welfareDraw').value : $('sportsDraw').value;
  const winningCount = rebuildWinningEntries();
  render();
  switchTab('ledger');
  toast(`核奖完成，命中${winningCount}项`);
};
$('lottery').onchange = () => $('drawNumber').value = $('lottery').value === '福彩' ? $('welfareDraw').value : $('sportsDraw').value;
$('playType').onchange = () => $('customOdds').classList.toggle('hidden', $('playType').value !== 'custom');
$('calcForm').onsubmit = e => {
  e.preventDefault();
  const values = { lottery: $('lottery').value, playKey: $('playType').value, draw: normalize3($('drawNumber').value),
    pickText: $('picks').value, stake: Number($('stake').value), note: $('note').value.trim(),
    customBase: $('customBase').value, customPrize: $('customPrize').value, customHits: $('customHits').value };
  $('drawNumber').value = values.draw;
  showResult(calculate(values), values);
};
$('clearCalc').onclick = () => { $('picks').value = ''; $('note').value = ''; $('calcResult').className = 'result-box empty'; $('calcResult').textContent = '等待计算'; };

populatePlays(); renderOdds(); render();
