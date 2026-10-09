const fs = require('fs');
const element = () => ({ value: '', checked: false, options: [], style: {}, className: '', textContent: '',
  classList: { toggle() {}, add() {}, remove() {} }, closest() { return null; }, replaceChildren() {}, append() {},
  setAttribute() {}, showModal() {}, close() {} });
const calculate = Function('localStorage', 'document', 'confirm', 'navigator',
  fs.readFileSync('app.js', 'utf8') + '; return autoCalculateBet;')(
    { getItem() { return null; }, setItem() {} },
    { getElementById: element, querySelectorAll() { return []; }, createElement: element },
    () => false, { clipboard: { writeText() {} } });

const cases = [
  ['直加双飞', '福123 456直各1元\n双飞12 34各10元', 22],
  ['双飞加直', '福双飞12 34各10元\n123 456直各1元', 22],
  ['不同号码直选组选', '排列三直选123 456各一倍\n组选789 987各一倍', 8],
  ['组选先于直选', '排三组选789 987各一倍\n直选123 456各一倍', 8],
  ['胆码加双飞', '体独胆2 4各10元\n双飞24 26各10元', 40],
  ['双飞加胆码', '体双飞24 26各10元\n独胆2 4各10元', 40],
  ['和值加双飞', '福和值13 17各10元\n飞29各10元', 30],
  ['组六复式加双飞', '福01234组六20元\n飞29各10元', 30],
  ['双飞加组六复式', '福飞29各10元\n01234组六20元', 30],
  ['直选组选再飞', '福123 456直组各1元\n飞12各10元', 14],
  ['飞再直选组选', '福飞12各10元\n123 456直组各1元', 14],
  ['跨彩票各行独立', '福123 456直各1元\n体789 987组各2元', 6],
  ['盘别单独成行', '福\n123 456直各1元\n飞12各10元', 12],
  ['号码单独成行', '福\n123 456\n直各1元\n飞12各10元', 12],
  ['金额单独成行', '福\n123 456直\n各1元\n飞12各10元', 12],
  ['行尾小计和末尾总计', '福\n123 456直各1元 合计2元\n飞12各10元 合计10元\n共12元', 12]
];

cases.push(['slash-delimited multi group lines', '\u798f01469/\u7ec4\u4e09\u7ec4\u516d\u540410\u5143\n1469/\u7ec4\u516d\u7ec4\u4e0910\u5143\n\u517140', 40]);
cases.push(['fullwidth slash multi group lines', '\u4f5312345\uff0f\u7ec4\u516d\u7ec4\u4e09\u54045\u7c73\n6789/\u7ec4\u4e09\u7ec4\u516d5\n\u517120', 20]);
cases.push(['slash multi group multipliers', '\u798f1234/\u7ec4\u4e09\u7ec4\u516d\u54042\u500d\n5678/\u7ec4\u516d\u7ec4\u4e09\u4e00\u500d\n\u517160', 60]);
cases.push(['leading multipliers with trailing number', '\u798f\u4e24\u76f4\u4e00\u7ec4386', 6]);
cases.push(['reversed leading plays with trailing number', '\u4f53\u4e09\u7ec4\u4e24\u76f4579', 10]);
cases.push(['leading plays and multipliers with trailing number', '\u798f\u76f4\u4e24\u7ec4\u4e00386', 6]);
cases.push(['priced group block with fly and two-code group', '3D\u7ec4\u9009\n677+667\n\u540410\u5143\u540820\u5143\u3002\n\u7ec4\u516d\u53cc\u98de67\uff0c\n\u540810\u5143\u3002\n\u7ec4\u4e09\u4e24\u780167\uff0c\n\u540810\u5143\u3002\n\u603b\u8ba1\u6b3e40\u5143\u3002', 40]);
cases.push(['play then number list then multiplier', '\u798f\u76f4\n421 152 254 815 420 462 604 342 583 341\u4e00\u500d\n\u517120', 20]);
cases.push(['number list then note count lottery and group rate', '309 304 048 704 705 741 745 748 743 439 419 416 415 485 459 195 951 956 958 986 168 158 156 867 865 850 809 860 619 609\n\u6ce830\uff0c\u798f\uff0c\u7ec40.5\uff0c\u4e00\u517115', 15]);
cases.push(['multiple fixed-money group-three lines', '\u798f189\u7ec4\u4e0950\n\u798f2489\u7ec4\u4e0950', 100]);
cases.push(['repeated numbers with each before direct and group rates', '548 548\u4f53\u76f4\u54042\u7c73\u7ec4\u54041\u7c73 2\u6ce8 \u51716\u7c73', 6]);
cases.push(['plus separated spans with shared stake', '\u8de81+\u8de88\u540410\u5143\n\u540820\u5143', 20]);
cases.push(['shared direct list with one specified group pick', '\u798f440\uff0c044\uff0c404\u4e00\u76f4044\u4e00\u7ec4\u5408\u8ba18', 8]);
cases.push(['multiple wildcard positions with shared money', '\u798fx09\uff0c90x\u540410\u5143\u5408\u8ba120', 20]);
cases.push(['leading unit price before direct with subtotal', '\u4f53623.621.614.613\u4e00\u5143\u76f44\u5143', 4]);
cases.push(['itemized digit dan fixed amounts', '\u798f\uff0c2\u7684\u80c6\uff0c200\n\u798f\uff0c3\u7684\u80c6\uff0c50\n\u798f\uff0c1\u7684\u80c6\uff0c50\n\u798f\uff0c0\u7684\u80c6\uff0c50\n\u5408\u8ba1350', 350]);
cases.push(['sports shared direct list with distinct group pick', '\u4f53\uff0c324\uff0c432\u4e00\u76f4234\u4e00\u7ec4\u5408\u8ba16', 6]);
cases.push(['dan before dual lottery shared fixed amount', '\u80c69\uff0c\u798f\u4f53\u5404100\uff0c\u5408\u8ba1200', 200]);
cases.push(['leading digit set for all three positions', '\u798f0124579\u767e\u5341\u4e2a\u5b9a\u4f4d2\u6bdb\u5408\u8ba168.6', 68.6]);
cases.push(['rotor play and money before number', '\u798f\u8f6c\u5708\u76f41\u7c73572\u5408\u8ba16', 6]);
cases.push(['poison-dan alias with punctuation and money', '\u798f\uff1a\u6bd2\u80c64\u300120\u5143', 20]);
cases.push(['all-drag group-three with mixed listed plays', '\u80c66\u5168\u6258\u7ec4\u4e09\u4e00\u500d\n336\uff0c688\u7ec4\u4e09\u4e00\u500d\n369\uff0c690\uff0c697\u7ec4\u516d\u4e00\u500d\n26\uff0c86\uff0c96\u98de\u4e00\u500d\n\u798f\u5408\u8ba150', 50]);
cases.push(['multi-lottery number lines with shared direct-group rates', '\u798f423\u3002425\u3002428\u3002426\u3002427\n\u798f517.616.805.418.\n\n\u4f53338.388.668.688\n\u76f40.2\u7ec40.5\u54089.1', 9.1]);
cases.push(['compound group-six multiplier and fixed group-three amount', '\u798f\n\u4e94\u7801 61943\u7ec4\u516d1\u500d\u7ec4\u4e095\u7c73\n413\t317\t916\u76f4\u7ec41\u7c73\n\u5408\u8ba121', 21]);
cases.push(['labeled multi-pick mixed multiplier and fixed money', '\u798f \u4e94\u7801 61943\u7ec4\u516d1\u500d\u7ec4\u4e095\u7c73', 15]);
cases.push(['rotor money before number without direct label', '\u798f\u8f6c\u57081\u7c73109\u5408\u8ba16', 6]);
cases.push(['duplicate welfare aliases are one lottery', '\u798f\u5f693D\uff0c\u4e09\u5730\uff0c123\u76f41\u500d\u5408\u8ba12', 2]);
cases.push(['sum span and leopard blocks', '\u798f\u548c\u503c0-1-2-24-25-26-27\u5404\u4e00\u500d\n\u8de8\u5ea61-2-9\u5404\u4e00\u500d\n\n\u4f5301234\u4e94\u500d\n\u8c79\u5b5020\n\u5171170', 170]);
cases.push(['multi-lottery group-six sets with shared trailing multiplier', '\u798f124679\uff0c124589\n\n\u4f53134679\uff0c134568\n\u7ec4\u516d\u5404\u4e00\u500d\u300240\u7c73', 40]);
cases.push(['direct-group money plus group-six dantuo fixed amount', '\u798f734\u53556\u5143\u7ec44\u5143\n\u7ec4\u516d\u80c6\u62d6\n3\u62d64796\u300210\u5143', 20]);
cases.push(['multiline number grid with postfixed lottery and direct-group multipliers', '014.024.034.045\n046.047.048+049\n124.134.145.146\n147.148.149.234\n245.246.247.248\n249.345.346.347\n348.349.564.458\n457.459.467.468\n469.478.479.489\u798f\u5f691\u76f41\u7ec4\n\u5171144', 144]);
cases.push(['multiline welfare number list with trailing each direct multiplier', '\u798f\n103 189 198 236 256 263 265 268 286 301 326 356 362 365 368 369 386 396 506 526 536 586 596 605 623 625 628 632 635 638 639 652 653 658 659 678 682 683 685 687 689 693 695 698 768 786 826 836 856 862 863 865 867 869 876 891 896 936 956 963 965 968 981 986\u5404\u4e00\u5355128\u7c73', 128]);
cases.push(['group-six header with itemized dash money lines', '\u6392\u7ec4\u516d\n123457\u4e0030\u7c73\n023569\u4e0030\u7c73\n013479\u4e0010\u7c73', 70]);
cases.push(['sports itemized positions with slash fixed money', '\u6392\u5217\u5341\u4f4d7/700\uff0c\u6392\u5217\u4e2a\u4f4d1/300', 1000]);
cases.push(['multiline sports number list with trailing each direct multiplier', '\u4f53\n189 198 236 263 268 286 326 362 365 368 369 386 396 623 628 632 635 653 682 683 685 687 689 693 695 698 768 786 826 836 862 863 865 867 869 876 891 896 963 965\u5404\u4e00\u535580\u7c73', 80]);
cases.push(['multiline numbers then shared direct-group multiplier and trailing lottery total', '570\n327\n\u76f4\u9009\u7ec4\u9009\u54041\u500d\n\u798f\u5408\u8ba18', 8]);

const independentSegments = [
  ['直选', '福123 456直各1元', 2],
  ['组选', '福789 987组各1元', 2],
  ['双飞', '福飞12 34各10元', 20],
  ['独胆', '福独胆2 4各10元', 20],
  ['和值', '福和值13 17各10元', 20],
  ['组六复式', '福01234组六20元', 20],
  ['一码定位', '福百位1十位2个位345直各1元', 3],
  ['两码定位', '福X37两码定位10元', 10]
];
for (const [name, input, amount] of independentSegments) cases.push([`独立段${name}`, input, amount]);
for (let first = 0; first < independentSegments.length; first += 1) {
  for (let second = 0; second < independentSegments.length; second += 1) {
    if (first === second) continue;
    const a = independentSegments[first];
    const b = independentSegments[second];
    cases.push([`${a[0]}→${b[0]}`, `${a[1]}\n${b[1]}`, a[2] + b[2]]);
    cases.push([`${a[0]}→${b[0]}首行标盘`, `${a[1]}\n${b[1].replace(/^福/, '')}`, a[2] + b[2]]);
    for (let third = 0; third < independentSegments.length; third += 1) {
      if (third === first || third === second) continue;
      const c = independentSegments[third];
      cases.push([`${a[0]}→${b[0]}→${c[0]}首行标盘`,
        `${a[1]}\n${b[1].replace(/^福/, '')}\n${c[1].replace(/^福/, '')}`, a[2] + b[2] + c[2]]);
    }
  }
}

let failed = 0;
for (const [name, input, expected] of cases) {
  const result = calculate(input);
  if (!result.confident || result.amount !== expected) {
    failed += 1;
    console.log(`FAIL ${name}: expected ${expected}, got ${result.amount}; ${JSON.stringify(result)}`);
  } else console.log(`PASS ${name}: ${result.amount}`);
}
const mustClarify = [
  ['后段飞号没有额度', '福123直各1元\n飞12'],
  ['后段存在未识别玩法', '福123直各1元\n未知456各5元'],
  ['末尾未识别号码段', '福123直各1元\n飞12各10元\n乱码789'],
  ['三位号码列表混入四位数字', '483 482 487 480 493 492 497 490 703 702 783 782 787 780 793 792 797 790 5507 583 582 580 593 592 597 590福直一组一\n共104']
];
for (const [name, input] of mustClarify) {
  const result = calculate(input);
  if (result.confident || result.amount !== '' || !result.needs?.length) {
    failed += 1;
    console.log(`FAIL ${name}: should request clarification; ${JSON.stringify(result)}`);
  } else console.log(`PASS ${name}: blocked with reason`);
}
console.log(`MULTILINE_SUMMARY passed=${cases.length + mustClarify.length - failed} failed=${failed}`);
process.exitCode = failed ? 1 : 0;
