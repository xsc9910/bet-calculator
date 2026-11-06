const fs = require('fs');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet,scanEntryForDraw};')(
  { getItem() { return null; }, setItem() {} },
  { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {}
);
let checks = 0;
const failures = [];
function verify(text, parts) {
  const expected = parts.reduce((sum, part) => sum + part.numbers.length * (part.direct + part.group) * part.games.length, 0);
  const result = api.autoCalculateBet(text + '\n共999');
  checks++;
  if (result.amount !== expected || !result.confident || result.claimed !== 999) failures.push({ type: 'amount', text, expected, result });
  const draws = [...new Set(['001', '112', '123', '321', '456', ...parts.flatMap(part => part.numbers.slice(0, 2).flatMap(number => [number, [...number].reverse().join('')]))])];
  for (const lottery of ['福彩', '体彩']) {
    for (const draw of draws) {
      let prize = 0;
      for (const part of parts) {
        if (!part.games.includes(lottery)) continue;
        for (const number of part.numbers) {
          if (number === draw) prize += part.direct * 950;
          if (new Set(draw).size > 1 && [...number].sort().join('') === [...draw].sort().join('')) prize += part.group * (new Set(draw).size === 2 ? 310 : 155);
        }
      }
      const wins = api.scanEntryForDraw({ id: 'matrix', original: text + '\n共999', amount: 999 }, lottery, draw);
      const actual = wins.reduce((sum, win) => sum + win.prize, 0);
      checks++;
      if (actual !== prize) failures.push({ type: 'prize', text, lottery, draw, expected: prize, actual });
    }
  }
}
const numbers = ['001', '112', '123', '001'];
const headers = [
  ['1 单 1 组', 2, 2], ['一 单 两 组', 2, 4], ['3 组 2 直', 4, 6],
  ['1个单 2个组', 2, 4], ['1单，2组', 2, 4], ['1单+2组', 2, 4],
  ['1单\n2组', 2, 4], ['直选1元 组选2元', 1, 2], ['组0.5米 单1米', 1, .5],
  ['直组各5毛', .5, .5], ['一组一直', 2, 2], ['2直选 3组选', 4, 6]
];
for (const [header, direct, group] of headers) {
  for (const [marker, games] of [['福', ['福彩']], ['体', ['体彩']], ['福体', ['福彩', '体彩']]]) {
    for (const separator of [' ', '，', '-\n', '\n\n']) {
      const picks = numbers.join(separator);
      for (const text of [`${marker} ${header}\n${picks}`, `${marker}\n${header}\n${picks}`, `${picks}\n${marker} ${header}`, `${marker} ${header} ${picks}`]) {
        verify(text, [{ numbers, games, direct, group }]);
      }
    }
  }
  for (const separator of ['\n', '\n\n', '；', ' ']) {
    verify(`福 ${header}\n001 112${separator}体 1 单 1 组\n123 456`, [
      { numbers: ['001', '112'], games: ['福彩'], direct, group },
      { numbers: ['123', '456'], games: ['体彩'], direct: 2, group: 2 }
    ]);
  }
}
let seed = 1106;
function nextNumber() {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return String(seed % 1000).padStart(3, '0');
}
for (let round = 0; round < 60; round++) {
  const first = Array.from({ length: 2 + round % 11 }, nextNumber);
  first.push(first[0]);
  const second = Array.from({ length: 2 + round % 7 }, nextNumber);
  const direct = 1 + round % 6;
  const group = 1 + round % 4;
  const space = [' ', '\t', '　'][round % 3];
  const separator = [' ', '，', '\n', '-\n\n'][round % 4];
  const header = `${group}${space}组选${space}${direct}${space}直选`;
  const firstPart = { numbers: first, games: ['福彩'], direct: 2 * direct, group: 2 * group };
  const secondPart = { numbers: second, games: ['体彩'], direct: 2, group: 4 };
  verify(`福彩${header}\n${first.join(separator)}\n体彩1个单2个组\n${second.join(separator)}`, [firstPart, secondPart]);
  verify(`福${header} ${first.join(' ')}；体1单，2组 ${second.join(' ')}`, [firstPart, secondPart]);
  verify(`${first.join(separator)}\n福彩${header}`, [firstPart]);
}
verify('福1单1组\n001 112\n计8\n2组3单\n123 123', [
  { numbers: ['001', '112'], games: ['福彩'], direct: 2, group: 2 },
  { numbers: ['123', '123'], games: ['福彩'], direct: 6, group: 4 }
]);
fs.mkdirSync('tests/reports', { recursive: true });
fs.writeFileSync('tests/reports/basic-header-layout-matrix.json', JSON.stringify({ checks, failures }, null, 2));
console.log(JSON.stringify({ checks, failureCount: failures.length, examples: failures.slice(0, 12) }, null, 2));
if (failures.length) process.exitCode = 1;
