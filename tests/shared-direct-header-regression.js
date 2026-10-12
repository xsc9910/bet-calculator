const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});
const first = `122 133 166 177 212 221 223 224 225 226
227 228 232 233 242 244 252 255 262 266
272 277 282 288 313 322 323 331 332 334
335 336 337 338 343 344 353 355 363 366
373 377 383 388 422 424 433 434 442 443
447 474 477 522 525 533 535 552 553 557
575 577 616 622 626 633 636 661 662 663
667 676 677 717 722 727 733 737 744 747
755 757 766 767 771 772 773 774 775 776
778 787 788 822 828 833 838 877 878 882
883 887`;
const second = `125 152 168 186 215 235 237 245 247 251
253 254 257 273 274 275 325 327 347 348
352 367 368 372 374 376 378 384 386 387
425 427 437 438 452 457 472 473 475 478
483 487 512 521 523 524 532 542 572 574
673 681 683 723 724 732 734 742 743 752
754 763 783 784 834 843 861 863 873 874`;
const original = `福，直选一倍\n${first}\n计204米\n${second}\n计140米\n204+140=344`;
assert.equal(first.split(/\s+/).length, 102);
assert.equal(second.split(/\s+/).length, 70);
const result = api.autoCalculateBet(original);
console.log(JSON.stringify({counts:[102,70],result}));
assert.deepEqual([result.amount,result.claimed,result.confident],[344,344,true]);
let passed = 1;
for (let shift = 0; shift < 10; shift += 1) {
  const change = text => text.replace(/\d/g, digit => String((Number(digit) + shift) % 10));
  for (const play of ['直选', '组选']) {
    for (const [rate, per] of [['两倍', 4], ['0.5米', 0.5], ['3元', 3]]) {
      const input = `体，${play}${rate}\n${change(first)}\n计999米\n${change(second)}\n计999米\n合计9999`;
      const actual = api.autoCalculateBet(input);
      assert.deepEqual([actual.amount,actual.claimed,actual.confident], [172 * per,9999,true], input);
      passed += 1;
    }
  }
}
for (const [text, expected] of [
  ['福直选一倍\n123 123\n计4米\n456\n共6', 6],
  ['福直选一倍\n123\n计2米\n体组选3元\n456\n共5', 5],
  ['福体直选一倍\n123\n计4米\n456\n共8', 8]
]) {
  const actual = api.autoCalculateBet(text);
  assert.equal(actual.amount, expected);
  assert.equal(actual.confident, true);
  passed += 1;
}
assert.equal(api.autoCalculateBet('福直选一倍\n123\n未知内容999元\n456').confident, false);
console.log(`SHARED_DIRECT_HEADER_SUMMARY passed=${passed + 1} failed=0`);
