const fs = require('fs');
const element = () => ({ value: '', checked: false, options: [], style: {}, className: '', textContent: '',
  classList: { toggle() {}, add() {}, remove() {} }, closest() { return null; }, replaceChildren() {}, append() {},
  setAttribute() {}, showModal() {}, close() {} });
const { calculate, actualNoteCount } = Function('localStorage', 'document', 'confirm', 'navigator',
  fs.readFileSync('app.js', 'utf8') + '; return { calculate: autoCalculateBet, actualNoteCount: calculateActualNoteCount };')(
    { getItem() { return null; }, setItem() {} },
    { getElementById: element, querySelectorAll() { return []; }, createElement: element },
    () => false, { clipboard: { writeText() {} } });

const cases = [
  ['福排 means 福体', '\u798f\u6392\u0031\u0032-\u0033\u0034\u53cc\u98de\u5404\u0031\u0030\u5143', 40],
  ['全倒 means 转圈', '\u4f53\u5168\u5012\u0031\u0032\u0033\u0034\u7ec4\u516d\u4e00\u500d', 48],
  ['组三复试 shared amount', '1234\u7ec4\u4e09\u590d\u8bd5\u540420', 40],
  ['组六复试 shared amount', '1234\u7ec4\u516d\u590d\u8bd5\u540420', 40],
  ['direct only does not add group', '\u798f123 456\u76f4\u5404\u4e00\u500d', 4],
  ['group only does not add direct', '\u798f123 456\u7ec4\u5404\u4e00\u500d', 4],
  ['group6 multi only', '\u798f1234\u7ec4\u516d20\u5143', 20],
  ['direct multi only', '\u798f1234\u590d\u8bd5\u540420\u5143', 20],
  ['group3 multi only with each', '\u798f1234\u7ec4\u4e09\u590d\u5f0f\u540420\u5143', 20],
  ['group6 multi only with each', '\u798f1234\u7ec4\u516d\u590d\u5f0f\u540420\u5143', 20],
  ['direct only amount', '\u798f123 456\u76f4\u54041\u5143', 2],
  ['group only amount', '\u798f123 456\u7ec4\u54041\u5143', 2],
  ['direct only multiplier', '\u798f123 456\u76f41\u500d', 4],
  ['group only multiplier', '\u798f123 456\u7ec4\u4e001\u500d', 4],
  ['separate direct and group segments', '\u798f123 456\u76f4\u54041\u5143，789\u7ec4\u54041\u5143', 3],
  ['组三复试 changed digits and amount', '\u798f5678\u7ec4\u4e09\u590d\u8bd5\u540425\u5143', 50],
  ['reverse order and multiplier', '\u4f539876\u590d\u8bd5\u4e0e\u7ec4\u4e09\u54042\u500d', 40],
  ['组三复式 is one play', '\u798f1234\u7ec4\u4e09\u590d\u5f0f20\u5143', 20],
  ['position field lists independent digits', '\u798f\u767e\u4f4d14\u540420\u5143', 40],
  ['position fields sum their listed digits', '\u798f\u767e\u4f4d5\u5341\u4f4d5\u5404\u625340\u5143', 80]
  ,['short dan-tuo notation is not a plain number', '\u4f530\u62d6125\u516d\u7ec410\u5143', 10]
  ,['short dan-tuo without leading marker', '0\u62d6125\u4f53\u516d\u7ec410\u5143', 10]
  ,['bare each ten on fly is money', '\u798f12 34\u53cc\u98de\u540410', 20]
  ,['bare each twenty on group six is money', '\u798f1234 5678\u7ec4\u516d\u540420', 40]
  ,['bare each twenty on direct and group is money per play', '\u4f53123 456\u76f4\u7ec4\u540420', 80]
  ,['bare each one on direct and group is multiplier', '\u798f123 456\u76f4\u7ec4\u5404\u4e00', 8]
  ,['one direct one group is multiplier', '\u798f123 456\u76f4\u4e00\u7ec4\u4e00', 8]
  ,['two direct three group is multiplier', '\u4f53123 456\u76f4\u4e8c\u7ec4\u4e09', 20]
  ,['explicit times overrides bare amount convention', '\u798f12 34\u53cc\u98de\u540410\u500d', 200]
  ,['转圈组三组六各一倍查表', '\u4f53\u8f6c\u57081234\u7ec4\u4e09\u7ec4\u516d\u5404\u4e00\u500d', 120]
  ,['组三组六转圈各一倍查表', '\u4f53\u7ec4\u4e09\u7ec4\u516d\u8f6c\u57081234\u5404\u4e00\u500d', 120]
  ,['组六组三转圈各一倍查表', '\u4f53\u7ec4\u516d\u7ec4\u4e09\u8f6c\u57081234\u5404\u4e00\u500d', 120]
  ,['沾边赖组三组六一胆各一倍查表', '\u4f53\u6cbe\u8fb9\u8d56\u7ec4\u4e09\u7ec4\u516d\u80c65\u5404\u4e00\u500d', 108]
  ,['沾边赖组三组六两胆各一倍查表', '\u4f53\u6cbe\u8fb9\u8d56\u7ec4\u4e09\u7ec4\u516d\u80c658\u5404\u4e00\u500d', 196]
  ,['组六号码各一组总额', '\u4f53149 176 309 349 509 549 569 576 659 670 671 675 706 749 756 760 761 765 834 835 845 854 859 875\u5404\u4e00\u7ec448\u7c73', 48]
  ,['直号码各一直总额', '\u4f53149 176\u5404\u4e00\u76f48\u7c73', 4]
  ,['福彩体彩表示两边', '\u798f\u5f69\u4f53\u5f69123\u76f4\u5404\u4e00\u500d', 4]
  ,['一码两码定位与直选混合', '体。百0。个0一码定位各10元。\n0*0两码定位20元。\n*90两码定位10元。\n090三直。\n009 900各一直\n共60', 60]
  ,['一码定位换码各一倍', '体十位4个位7一码定位各一倍', 20]
  ,['两码定位换码一倍', '体X37两码定位一倍', 10]
  ,['两码定位换码明确金额', '体8X2两码定位30元', 30]
  ,['两码定位与直选换码混合', '福1X6两码定位10元\n654二直\n412 214各一直\n合计18', 18]
  ,['五码组六无单位按金额', '福02378组六20', 20]
  ,['六码组六无单位换码换金额', '体124589组六35', 35]
  ,['五码组三组六分别无单位金额', '福13579组六20组三10', 30]
  ,['两套完整选码共享无单位金额', '34285 32457福组六10合计20', 20]
  ,['四码组三无单位换金额', '体0258组三50', 50]
  ,['五码组六明写倍数仍按倍率', '福02378组六2倍', 20]
  ,['跨行和值组六飞共用末尾金额', '福\n和值13  17\n组六034679\n飞29各10\n共40', 40]
  ,['跨行共用金额换码换额度', '体\n和值6  9\n组六125789\n飞47各20\n共80', 80]
  ,['跨行共用金额换顺序', '福\n飞47\n组六125789\n和值6 9各10元\n共40', 40]
  ,['盘别与首项同一行', '福彩和值13 17\n组六034679\n飞29各10\n共40', 40]
  ,['重复三位号码与后置注数单价', '362,890,541,470,290,291,292,590,592,459,650,859,820,659,702,402,502,436,536,736,470,570,702,570福直\n24注一注4元\n共96', 96]
  ,['组单式重复号码每注金额', '体123.456.123组\n3注每注2元\n共6', 6]
  ,['前置盘别与小数每注金额', '福\n123 456 123直\n每注0.5元\n共1.5', 1.5]
  ,['跨行直组分别金额括号小计和飞号', '体\n952  929\n直（3元）组（2元）（10元）\n飞29（10元）', 20]
  ,['括号直组金额单段', '体952 929直（3元）组（2元）（10元）', 10]
  ,['括号飞号金额单段', '体飞29（10元）', 10]
  ,['跨行前直选后组选不重复套玩法', '排列三直选 322 070\n组选 322 070各一倍\n共8', 8]
  ,['排列三单独直选未写倍率默认一倍', '排列三直选 321 080', 4]
  ,['排三单独直选未写倍率默认一倍', '排三直选 456 909', 4]
  ,['跨行组选先于直选分别计价', '排三组选 246 428各一倍\n直选 246 428\n共8', 8]
  ,['排列三明写三倍直选仍按三倍', '排列三直选 321 080各三倍', 12]
  ,['跨行不同号码直选组选各算本段', '排列三直选 123 456\n组选 789 989各一倍\n共8', 8]
  ,['跨行直选与组选各用本段倍率', '排列三直选 322 070各二倍\n组选 322 070各一倍\n共12', 12]
  ,['同一行福体各自号码共享直组倍率', '福429，420，428，427，426，425，423，421，424体920，820，720，620，520，420，320，220，120直组各一倍', 72]
  ,['同一行两盘号码数量不同不互相翻倍', '福129 428体930 027 581直组各一倍', 20]
  ,['同一行两盘号码共享金额而非双盘翻倍', '体930 027 581福129 428直组各一元', 10]
  ,['同一行福体各自号码只打直选', '福129 428体930 027 581直各一倍', 10]
  ,['同一行福体各自号码只打组选', '福129 428体930 027 581组各一倍', 10]
  ,['同一行福体交替三段仍各自归属', '福129体930 027福428直组各一倍', 16]
  ,['后置彩票与前置倍数直组', '356.637.659.3倍直组合计36元福', 36]
  ,['后置彩票与前置倍数直组换码换倍数', '481、205、736、927，2倍直组共计32元体', 32]
  ,['前置彩票与前置倍数直组', '福481、205、736、927，2倍直组共计32元', 32]
  ,['后置彩票与前置倍数只打直', '481、205、736、927，2倍直合计16元体', 16]
  ,['后置彩票与前置倍数只打组', '481、205、736、927，2倍组合计16元体', 16]
];
let failed = 0;
for (const [name, text, expected] of cases) {
  const result = calculate(text);
  if (!result.confident || result.amount !== expected) {
    failed += 1;
    console.log(`FAIL ${name}: expected ${expected}, got ${result.amount}; ${JSON.stringify(result)}`);
  } else console.log(`PASS ${name}: ${result.amount}`);
}
const ambiguous = calculate('福\n和值13 17\n组六034679\n飞29各10\n共30');
if (ambiguous.confident || ambiguous.amount !== '' || !ambiguous.needs?.length) {
  failed += 1;
  console.log(`FAIL 跨行共享范围与原文合计冲突必须提示: ${JSON.stringify(ambiguous)}`);
} else console.log('PASS 跨行共享范围与原文合计冲突必须提示');
const noSummary = calculate('福\n和值13 17\n组六034679\n飞29各10');
if (noSummary.confident || noSummary.amount !== '' || !noSummary.needs?.length) {
  failed += 1;
  console.log(`FAIL 跨行共享范围没有合计必须提示: ${JSON.stringify(noSummary)}`);
} else console.log('PASS 跨行共享范围没有合计必须提示');
const countMismatch = calculate('福123 456 123直\n2注一注4元\n共12');
if (countMismatch.confident || countMismatch.amount !== '' || !countMismatch.needs?.length) {
  failed += 1;
  console.log(`FAIL 标注注数与实际号码项数不符必须提示: ${JSON.stringify(countMismatch)}`);
} else console.log('PASS 标注注数与实际号码项数不符必须提示');
const subtotalMismatch = calculate('体\n952 929\n直（3元）组（2元）（11元）\n飞29（10元）');
if (subtotalMismatch.confident || subtotalMismatch.amount !== '' || !subtotalMismatch.needs?.length) {
  failed += 1;
  console.log(`FAIL 跨行括号小计不符必须提示: ${JSON.stringify(subtotalMismatch)}`);
} else console.log('PASS 跨行括号小计不符必须提示');
const longNumbers = Array.from({ length: 378 }, (_, index) => String(index + 100).padStart(3, '0')).join(' ');
const longCount = calculate(`${longNumbers}福家378直一米`);
if (!longCount.confident || longCount.amount !== 378 || actualNoteCount(`${longNumbers}福家378直一米`) !== 378) {
  failed += 1;
  console.log(`FAIL 福家后置注数不作为号码: expected 378, got ${longCount.amount}; ${JSON.stringify(longCount)}`);
} else console.log('PASS 福家后置注数不作为号码');
const reportedNumbers = `025 027 029 052 057 058 059 072 075 078 085 087 089 092 095 098 126 127 128 129 157 158 159 162 167 168 169 172 175 176 178 179 182 185 186 187 189 192 195 196 197 198 205 207 209 216 217 218 219 235 237 239 246 247 248 249 250 253 256 257 258 259 261 264 265 267 269 270 271 273 274 275 276 278 279 281 284 285 287 289 290 291 293 294 295 296 297 298 325 327 329 352 357 358 359 367 369 372 375 376 378 379 385 387 389 392 395 396 397 398 426 427 428 429 457 458 459 462 467 468 469 472 475 476 478 479 482 485 486 487 489 492 495 496 497 498 502 507 508 509 517 518 519 520 523 526 527 528 529 532 537 538 539 547 548 549 562 567 568 569 570 571 572 573 574 576 578 579 580 581 582 583 584 586 587 589 590 591 592 593 594 596 597 598 612 617 618 619 621 624 625 627 629 637 639 642 647 648 649 652 657 658 659 671 672 673 674 675 678 681 684 685 687 689 691 692 693 694 695 698 702 705 708 712 715 716 718 719 720 721 723 724 725 726 728 729 732 735 736 738 739 742 745 746 748 749 750 751 752 753 754 756 758 759 761 762 763 764 765 768 780 781 782 783 784 785 786 789 791 792 793 794 795 798 805 807 809 812 815 816 817 819 821 824 825 827 829 835 837 839 842 845 846 847 849 850 851 852 853 854 856 857 859 861 864 865 867 869 870 871 872 873 874 875 876 879 890 891 892 893 894 895 896 897 902 905 908 912 915 916 917 918 920 921 923 924 925 926 927 928 932 935 936 937 938 942 945 946 947 948 950 951 952 953 954 956 957 958 961 962 963 964 965 968 971 972 973 974 975 978 980 981 982 983 984 985 986 987`;
const reportedBet = `${reportedNumbers}\n福家378直一米`;
const reportedResult = calculate(reportedBet);
if (reportedNumbers.split(/\s+/).length !== 378 || !reportedResult.confident || reportedResult.amount !== 378 || actualNoteCount(reportedBet) !== 378) {
  failed += 1;
  console.log(`FAIL 用户原文378注不把标注当号码: ${JSON.stringify(reportedResult)}`);
} else console.log('PASS 用户原文378注不把标注当号码');
const sportsMarkedCount = calculate('体123 456 789 012体彩家4直一米');
if (!sportsMarkedCount.confident || sportsMarkedCount.amount !== 4 || actualNoteCount('体123 456 789 012体彩家4直一米') !== 4) {
  failed += 1;
  console.log(`FAIL 体彩家换注数仍按实际号码计算: ${JSON.stringify(sportsMarkedCount)}`);
} else console.log('PASS 体彩家换注数仍按实际号码计算');
const dotMultiplierBet = '356.637.659.3倍直组合计36元福';
if (actualNoteCount(dotMultiplierBet) !== 3) {
  failed += 1;
  console.log(`FAIL 点号末尾倍率不能吞掉注数: expected 3, got ${actualNoteCount(dotMultiplierBet)}`);
} else console.log('PASS 点号末尾倍率保留3注');
const parentheticalCountBet = '福：002 006 007 008 014 016 018 020 026 028 032 034 041 044 046 060 061 062 064 070 078 080 081 082 087 088 104 106 108 114 116 118 140 141 144 160 161 167 176 178 180 181 187 188 200 206 208 226 230 260 262 266 280 288 302 304 330 331 338 340 348 366 384 388 401 404 406 411 414 430 438 440 441 446 447 448 460 464 466 467 474 476 478 484 487 488 600 601 602 604 610 611 617 620 622 626 636 640 644 646 662 664 671 674 688 700 708 716 718 744 746 748 761 764 780 781 784 800 801 802 807 808 810 811 817 818 820 828 834 838 844 847 848 868 870 871 880 881 882 884 886（141注直各五毛141*0.5=70.5）';
const parentheticalCountResult = calculate(parentheticalCountBet);
if (!parentheticalCountResult.confident || parentheticalCountResult.amount !== 70.5 || parentheticalCountResult.claimed !== 70.5 || actualNoteCount(parentheticalCountBet) !== 141) {
  failed += 1;
  console.log(`FAIL 括号标注注数及算式不可充当号码: expected 141注70.5元, got ${actualNoteCount(parentheticalCountBet)}注 ${JSON.stringify(parentheticalCountResult)}`);
} else console.log('PASS 括号标注注数及算式不可充当号码');
const changedParentheticalCountBet = '体：107 208 309 410（4注直各两毛4×0.2＝0.8）';
const changedParentheticalCountResult = calculate(changedParentheticalCountBet);
if (!changedParentheticalCountResult.confident || changedParentheticalCountResult.amount !== 0.8 || changedParentheticalCountResult.claimed !== 0.8 || actualNoteCount(changedParentheticalCountBet) !== 4) {
  failed += 1;
  console.log(`FAIL 换号码注数单价与全角算式: ${JSON.stringify(changedParentheticalCountResult)}`);
} else console.log('PASS 换号码注数单价与全角算式');
const wrongParentheticalCount = calculate('福：107 208 309（4注直各两毛4*0.2=0.8）');
if (wrongParentheticalCount.confident || wrongParentheticalCount.amount !== '' || !wrongParentheticalCount.needs?.length) {
  failed += 1;
  console.log(`FAIL 括号标注注数不符必须提示: ${JSON.stringify(wrongParentheticalCount)}`);
} else console.log('PASS 括号标注注数不符必须提示');
const wrongMarkedCount = calculate('福123 456 789福家378直一米');
if (wrongMarkedCount.confident || wrongMarkedCount.amount !== '' || !wrongMarkedCount.needs?.length) {
  failed += 1;
  console.log(`FAIL 福家标注注数与实际不符须阻止: ${JSON.stringify(wrongMarkedCount)}`);
} else console.log('PASS 福家标注注数与实际不符须阻止');
process.exitCode = failed ? 1 : 0;
