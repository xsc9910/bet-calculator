const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, scanEntryForDraw};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const numbers = `000 001 002 004 006 007 010 012 015 016 018 020 021 022 023 024 025 026 027 028 029 032 036 040 042 044 045 046 048 051 052 054 056 057 060 061 062 063 064 065 066 067 068 069 070 072 075 076 078 081 082 084 086 087 092 096 100 102 105 106 108 120 125 128 145 148 150 152 154 155 156 158 160 165 168 180 182 184 185 186 188 200 201 202 203 204 205 206 207 208 209 210 215 218 220 222 223 225 228 229 230 232 234 235 236 238 240 243 245 248 249 250 251 252 253 254 255 256 257 258 259 260 263 265 268 269 270 275 278 280 281 282 283 284 285 286 287 288 289 290 292 294 295 296 298 302 306 320 322 324 325 326 328 342 344 345 346 348 352 354 356 360 362 364 365 366 368 382 384 386 400 402 404 405 406 408 415 418 420 423 425 428 429 432 434 435 436 438 440 443 444 445 448 449 450 451 452 453 454 455 456 457 458 459 460 463 465 468 469 475 478 480 481 482 483 484 485 486 487 488 489 492 494 495 496 498 501 502 504 506 507 510 512 514 515 516 518 520 521 522 523 524 525 526 527 528 529 532 534 536 540 541 542 543 544 545 546 547 548 549 551 552 554 555 556 557 560 561 562 563 564 565 566 567 568 569 570 572 574 575 576 578 581 582 584 586 587 592 594 596 600 601 602 603 604 605 606 607 608 609 610 615 618 620 623 625 628 629 630 632 634 635 636 638 640 643 645 648 649 650 651 652 653 654 655 656 657 658 659 660 663 665 666 668 669 670 675 678 680 681 682 683 684 685 686 687 688 689 690 692 694 695 696 698 700 702 705 706 708 720 725 728 745 748 750 752 754 755 756 758 760 765 768 780 782 784 785 786 788 801 802 804 806 807 810 812 814 815 816 818 820 821 822 823 824 825 826 827 828 829 832 834 836 840 841 842 843 844 845 846 847 848 849 851 852 854 856 857 860 861 862 863 864 865 866 867 868 869 870 872 874 875 876 878 881 882 884 886 887 888 892 894 896 902 906 920 922 924 925 926 928 942 944 945 946 948 952 954 956 960 962 964 965 966 968 982 984 986`;
const selections = numbers.split(/\s+/);
const original = `${numbers}\n\n福【468】注直选一米`;
const result = api.autoCalculateBet(original);
console.log(JSON.stringify({ count: selections.length, uniqueCount: new Set(selections).size, amount: result.amount }));
assert.equal(selections.length, 468);
assert.deepEqual([result.amount, result.confident], [468, true]);
const hundredNumbers = Array.from({ length: 100 }, (_, index) => String(index).padStart(3, '0')).join(' ');
let count = 1;
for (const [left, right] of [['【', '】'], ['[', ']'], ['［', '］'], ['（', '）'], ['(', ')']]) {
  for (const amount of ['1元', '五毛']) {
    const expected = amount === '1元' ? 100 : 50;
    for (const source of [`${hundredNumbers}\n福${left} 100 ${right} 注直选${amount}`, `福${left}100${right}注直选${amount}\n${hundredNumbers}`]) {
      const actual = api.autoCalculateBet(source);
      assert.deepEqual([actual.amount, actual.confident], [expected, true], JSON.stringify(actual));
      assert.deepEqual(api.scanEntryForDraw({ id: 'count-not-pick', original: source, amount: expected }, '福彩', '100'), []);
      count++;
    }
  }
}
const wins = api.scanEntryForDraw({ id: 'count-and-real-pick', original, amount: 468 }, '福彩', '468');
assert.deepEqual(wins.map(win => [win.stake, win.prize]), [[1, 950]], JSON.stringify(wins));
console.log(`BRACKETED_DIRECT_COUNT passed=${count} plus payout checks`);
