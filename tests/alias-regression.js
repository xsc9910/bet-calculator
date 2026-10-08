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
  ['unit amount before note count', '001 002\n福直各0.5元2注\n合计1', 1],
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
  ,['前置两胆沾边组六一倍', '体13沾边组六1倍合计128', 128]
  ,['前置两胆沾边组三两倍', '福24沾边组三2倍', 136]
  ,['前置三胆沾边组六一倍', '体135沾边组六1倍', 170]
  ,['后置两胆沾边组六一倍', '体沾边组六胆13一倍', 128]
  ,['号码列表后缀一倍组选与总金额', '024 026 028 036 037 046 047 048 068 135 137 139 147 148 157 158 159 179 246 248 258 259 268 269 357 359 369 379 468 579福彩一倍组60米', 60]
  ,['号码在玩法之后加合计', '福彩组六一倍：024、026、028，共6米', 6]
  ,['盘别和玩法先写且换行列号码', '福彩\n组六一倍\n024 026 028\n共计6元', 6]
  ,['换号码数量与双倍合计', '福012、123、234组六2倍共12元', 12]
  ,['换分隔符和长号码列表合计', '福012/123-234 345 456 567 678 789 890 901组六1倍 总计20米', 20]
  ,['转子别名转圈组合玩法', '体转子1234组三组六各一倍', 120]
  ,['转圈组六玩法词在号码前', '体转圈组六1234各一倍', 48]
  ,['转圈组三玩法词在号码前', '体转圈组三1234各一倍', 72]
  ,['号码在前单组六转圈', '体1234转圈组六各一倍', 48]
  ,['号码在前单组三转圈', '体1234转圈组三各一倍', 72]
  ,['转圈与玩法词夹在号码后', '体1234转圈组三组六各一倍', 120]
  ,['转圈简称“转”覆盖复合玩法', '体转1234组三组六各一倍', 120]
  ,['后置体彩转圈直选一倍', '056，转圈一倍体', 12]
  ,['组三号码转圈直选两倍', '体112转圈两倍', 12]
  ,['豹子号码转圈直选三倍', '转圈三倍111体彩', 6]
  ,['多个号码转圈直选各两倍', '056、112转圈各两倍体', 36]
  ,['全倒别名使用转圈直选倍率', '体彩056全倒两倍', 24]
  ,['福彩3D转子跨行号码各一倍', '福彩3D转子\n303\n203\n304各一倍\n共30', 30]
  ,['组选括号中的号码复式按码集合计算', '排列三买一倍组六（03578）合计10', 10]
  ,['括号号码前置玩法和中文括号同样识别', '排三组六一倍(02468)共10元', 10]
  ,['方括号里的组选号码按复式码处理', '体彩组六[01357]一倍共10元', 10]
  ,['金额号码玩法顺序：玩法金额号码直选', '排列三直选2元456', 2]
  ,['金额号码玩法顺序：号码玩法金额直选', '排三456直选一倍', 2]
  ,['金额号码玩法顺序：金额玩法号码直选', '体彩2元直选456', 2]
  ,['金额号码玩法顺序：号码金额玩法组选', '福456 2元组选', 2]
  ,['同一行直选组选号码额度分段', '排三123直一倍 456组一倍', 6]
  ,['同一行玩法额度号码交错完整计算', '排三直一倍123组一倍456', 6]
  ,['同一行一单一组作用于前后号码', '福123 456各一单一组', 8]
  ,['玩法号码换行后第二行号码继承玩法', '福123 456\n789组六一倍', 6]
  ,['玩法标注行回收此前换行的号码', '福\n123\n456组六一倍\n合计4', 4]
  ,['同一胆拖多行按赔率表基数逐行计价', '胆0拖134568组六两倍\n胆0拖345689组六一倍\n胆3拖014568组六一倍\n福合计40', 40]
  ,['单个数字未定位按独胆固定金额', '福7 20元', 20]
  ,['单个数字未定位按独胆买入金额', '福3买70', 70]
  ,['两位数字未定位按双飞固定金额', '福27 20元', 20]
  ,['两位数字未定位按双飞一倍', '福27一倍', 10]
  ,['前置转字别名转圈组合玩法', '体转1234组三组六各一倍', 120]
  ,['后置转字别名转圈组合玩法', '体1234组三组六转各一倍', 120]
  ,['直选全称按直选识别', '福024 026直选一倍', 4]
  ,['组选全称按组选识别', '福024 026组选一倍', 4]
  ,['跨行号码两单与两单一组按段分别计价', '965.两单\n956.796两单一组福合计16', 16]
  ,['换号码和三单组合换行不串用玩法', '482.三单\n507-519三单一组福合计22', 22]
  ,['顿号分隔和各两直短写分段计价', '福012各两直\n034、056两单一组共16元', 16]
  ,['玩法在号码前标注及显式共计', '福组选一倍：024、026、028，共计6元', 6]
  ,['换行号码和末尾金额不当倍率', '福组选一倍\n024 026 028\n合计6米', 6]
  ,['点号分隔与末尾金额单位', '024.026.028福组六一倍共6元', 6]
  ,['组六号码各一组总额', '\u4f53149 176 309 349 509 549 569 576 659 670 671 675 706 749 756 760 761 765 834 835 845 854 859 875\u5404\u4e00\u7ec448\u7c73', 48]
  ,['直号码各一直总额', '\u4f53149 176\u5404\u4e00\u76f48\u7c73', 4]
  ,['福彩体彩表示两边', '\u798f\u5f69\u4f53\u5f69123\u76f4\u5404\u4e00\u500d', 4]
  ,['一码两码定位与直选混合', '体。百0。个0一码定位各10元。\n0*0两码定位20元。\n*90两码定位10元。\n090三直。\n009 900各一直\n共60', 60]
  ,['一码定位换码各一倍', '体十位4个位7一码定位各一倍', 20]
  ,['两码定位换码一倍', '体X37两码定位一倍', 10]
  ,['两码定位换码明确金额', '体8X2两码定位30元', 30]
  ,['两码定位与直选换码混合', '福1X6两码定位10元\n654二直\n412 214各一直\n合计18', 18]
  ,['五码组六无单位按金额', '福02378组六20', 20]
  ,['无单位金额五码组六与后续单式玩法组合', '12478福组六30\n748一单一组\n合计34', 34]
  ,['换数字的复式组六金额与一单一组组合', '03679福组六25\n369一单一组\n共29', 29]
  ,['复式组选无单位额度仍按金额', '12478福组六30', 30]
  ,['后续单式一单一组分别计算', '748一单一组', 4]
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
  ,['排列三逐行直选不同倍数', '排三直\n246三倍\n247两倍\n782三倍\n764三倍\n896三倍\n315三倍\n268三倍\n都是直\n共34', 40]
  ,['体彩逐行组选不同倍数', '体组\n123一倍\n456二倍\n789四倍\n都是组\n共14', 14]
  ,['福彩逐行直选换号码和倍数', '福直\n015两倍\n037五倍\n共14', 14]
  ,['逐行直选重复号码各按本行倍率', '排三直\n246三倍\n246两倍\n共10', 10]
  ,['单号一组只算组选一倍', '福123一组', 2]
  ,['单号一直只算直选一倍', '福123一直', 2]
  ,['多号各一组只算组选', '体123 456各一组', 4]
  ,['多号各一直只算直选', '体123 456各一直', 4]
  ,['一直一组才是直选组选两种', '福123 456一直一组', 8]
  ,['单号组一只算组选一倍', '福123组一', 2]
  ,['单号直一只算直选一倍', '福123直一', 2]
  ,['多号各组一只算组选', '体123 456各组一', 4]
  ,['多号各直一只算直选', '体123 456各直一', 4]
  ,['组一和直一才是两种玩法', '福123 456组一直一', 8]
  ,['组1只算组选一倍', '福123 456组1', 4]
  ,['直1只算直选一倍', '体123 456直1', 4]
  ,['点号号码列表前置单价后置直选小计', '体097.680.681.687.682.880.881.882.一元直8元', 8]
  ,['点号号码列表换码换单价后置直选小计', '福013.204.315.426.两元直8元', 8]
  ,['点号号码列表前置角价后置组选小计', '体013.204.315.426.五毛组2元', 2]
  ,['顿号号码列表前置小数单价后置直选小计', '体101、202、303 0.5元直选1.5元', 1.5]
  ,['体彩独胆买无单位默认金额', '体彩独胆3买70', 70]
  ,['福彩独胆换胆号换金额', '福彩独胆8买25', 25]
  ,['福彩胆简写买金额', '福胆7买40', 40]
  ,['体彩独简写买小数金额', '体独5买0.5', 0.5]
  ,['福彩独胆买中文金额', '福独胆4买七十', 70]
  ,['明确元单位的买金额不重复计入', '体独胆6买30元', 30]
  ,['明写倍数的买入仍按倍率', '体彩独胆3买2倍', 20]
  ,['后置彩票独胆买无单位金额', '独胆9买18福', 18]
  ,['一位数字省略独胆买金额', '体彩3买70', 70]
  ,['一位数字省略独胆换码换金额', '福8买25', 25]
  ,['一位数字省略独胆明确元金额', '体5 20元', 20]
  ,['一位数字省略独胆各金额', '福9各10米', 10]
  ,['一位数字省略独胆明写倍数', '体彩2一倍', 10]
  ,['一位数字省略独胆福体两边', '福体7买20', 40]
  ,['多组一位数字省略独胆各金额', '体2、4、6各10米', 30]
  ,['多组一位数字省略独胆换码换金额', '福1 5 9各20元', 60]
  ,['二定前置两注固定金额', '福二定x09，90x各5元合计10', 10]
  ,['二码定位前置换码换金额', '体两码定位X38、83X各7元共14', 14]
  ,['两码定位后置换码换金额', '福X46、64X二码定位各12米共24', 24]
  ,['二定省略合计换码', '福二定X27、72X各8元', 16]
  ,['二定明确倍数按每注十元', '体二定X27、72X各一倍', 20]
  ,['吊表示独胆且点号隔开每个固定金额', '福吊5.0.2个50合计150', 150]
  ,['吊换胆码与顿号换金额', '体吊6、8、1个20元共60', 60]
  ,['吊换分隔符与各金额', '福吊9/3/7各8米', 24]
  ,['吊明写倍数仍按独胆倍率', '福吊2、4个一倍', 20]
  ,['双飞分档个打与后续号码继承玩法', '福飞24/27个打50元47打20合计120', 120]
  ,['双飞分档换号码金额', '体双飞13、18各打30元38打15米共75', 75]
  ,['双飞分档换顺序和分隔符', '福飞69打12元，46/49各20元合计52', 52]
  ,['双飞分档跨行继承玩法', '福飞24/27各50元\n47打20\n合计120', 120]
  ,['双飞分档均未写元的大额按金额', '体飞14/17各30，47打20共80', 80]
  ,['直组无单位小数两种玩法各按金额', '330-331-339-031-389-333福单组0.5合计6', 6]
  ,['直组无单位小数换号码单价', '体123 456直组各0.7共2.8', 2.8]
  ,['直选无单位小数只算直选', '福135 246直0.4合计0.8', 0.8]
  ,['组选无单位小数只算组选', '福135 246组各0.6共1.2', 1.2]
  ,['三位定位复式无单位小数', '福百12十34个56各0.3合计2.4', 2.4]
  ,['无单位小数在直组前且福体两边', '福体437 470 526各0.3直组合计3.6', 3.6]
  ,['无单位小数在直选前也按金额', '福135 246 0.5直', 1]
  ,['明确小数倍仍按倍数', '福135 246直组0.5倍', 4]
  ,['大于一的无单位小数也按金额', '体123 456组各1.5合计3', 3]
  ,['多行混合整单不能漏掉未识别行', `福645.609.366.636.627.672两单一组
393.933..924.429一单一组
915.519.474.447.438.583.538.584.827.728.直组一米
325.523.424.604.631.316.613直组一米
929.922.833.838.335.225.626.676.696.686.377.224.322.332组选一米
242.422.224.243.324.423直组一米
227.224.225.229.422.433.424.直组一米
999.777.444.000一倍
0和值一倍
321.303.030.309.336.327.381组选一倍
300.030.303.330.402.420.413.430.421一单一组
426.453.435.660.606.633.336直组一米
合计208`, 208]
  ,['多只豹子只写一倍按直选', '福999.777.444.000一倍直', 8]
  ,['裸写豹子各一米按十个号码', '福豹子各1米合计10', 10]
  ,['跨行直选与双飞各用本段号码', '734 135 137 138 357\n三倍直选福\n37.47\n各一倍双飞福', 50]
  ,['跨行直选与双飞金额分段', '123 456\n直两倍福\n12、34、56\n双飞各20米福', 68]
  ,['三组双飞列表后置金额', '12、34、56双飞各20米福', 60]
  ,['独立彩票行与双飞前置倍率分段', '福\n789直选一倍\n12/34\n各两倍飞', 42]
  ,['多个飞标题分段各自计算', '福飞\n67，27各打300，\n福飞\n28，29，38，78各打100\n合计1000', 1000]
  ,['重复双飞标题换分隔符继续分段', '体双飞\n13/18各打30元；\n双飞\n38打15米\n共75', 75]
  ,['定位直选组选双飞和值混合分段', '体个位定9打1倍，629，269各打1倍直选，467组选2倍，278组选1倍，2和3双飞1倍，17合值1倍\n共40', 40]
  ,['百位定多码按定位倍数', '福百位定14打2倍', 40]
  ,['单码和单码双飞组成两位飞号', '体6和8双飞两倍', 20]
  ,['合值作为和值通用别名', '福19合值两倍', 20]
  ,['号码前置百十个定位复式', '248百\n268十\n057个\n体直2倍\n共计108', 108]
  ,['号码前置百十个位同一行定位复式', '12百，34十，56个位，福直一倍', 16]
  ,['直选倍数与组六胆拖固定金额混合', '福\n709  729  479直二\n7拖139组六50\n共62', 62]
  ,['中文直选倍数省略倍字', '体123 456直三', 12]
  ,['中文组选倍数省略倍字', '福789组二', 4]
  ,['合值组选单码和双飞混合分段', '福17合值1倍，467组选1倍，4和7双飞1倍', 22]
  ,['3D独胆逗号后置倍率', '3D 独胆8，2倍', 20]
  ,['多胆码与逗号后置倍率分离', '福独胆8、6，2倍', 40]
  ,['连写独胆与中文后置倍率分离', '体独269三倍', 90]
  ,['两段福直组与飞号分别小计', '福\n914\n823\n732\n641\n550\n直组1米合计10\n  \n福\n19\n28\n37\n46\n55\n飞5米合计25\n合计35', 35]
  ,['沾边号码与组三倍率跨行简写', '福沾边2\n组三1倍', 36]
  ,['组六倍率与沾边胆码逆序跨行', '体组六两倍\n沾边35', 256]
  ,['直选组选连写各一倍', '福123 456直选组选各一倍', 8]
  ,['同行四玩法完整分号分段', '福135 246直组各1米；福12 34双飞各1元；福独胆5打1元；福01234组六1米', 8]
  ,['同行四玩法逆序英文分号分段', '体12345组六2米;体独胆6打2元;体23 45双飞各2元;体246 357直组各2米', 16]
  ,['同行多玩法只写一次彩票标记', '福135 246直组各1米；12 34双飞各1元；独胆5打1元；01234组六1米', 8]
  ,['一定个位与不定位固定金额分段', '福一定\n个位8打50元\n不定位50元合计100', 100]
  ,['一位不定位按独胆倍率', '福8不定位2倍', 20]
  ,['两位不定位按双飞倍率', '体47不定位一倍', 10]
  ,['不定位玩法号码金额前置', '福不定位8打30元', 30]
  ,['不定位金额号码玩法前置', '体20元47不定位', 20]
  ,['多行组六复式无单位数字按固定金额', '01369  福组六30\n12478福组六10\n合计40', 40]
  ,['多行单式夹复式组六固定金额', '501，2单2组，\n508，3单2组，\n0158，组六10，\n570，578，1单1组，\n福合计36', 36]
  ,['组选号码列表各打三组', '体彩组选\n337\n357\n367\n347\n377\n448\n458\n468\n478\n488各打3组合计60', 60]
  ,['直选号码列表各打两单', '福彩直选\n123\n456各打2单合计8', 8]
  ,['复式组选固定金额与单挑直组混合', '福 256789组六20组三5，\n单挑562直3元组2元\n合计30', 30]
  ,['两码列表双飞与组三共享固定金额', '福15，05，双飞各10，组三各10合计40', 40]
  ,['两码列表组三与双飞逆序固定金额', '体12 34组三各5，双飞各8合计26', 26]
  ,['两码列表双飞与组三明确倍数', '福12 34双飞2倍组三1倍合计60', 60]
  ,['直组分别后置不同小数金额', '福068。082。942。422。622。967。480。968。649。504。724直0.2组0.5合计7.7', 7.7]
  ,['直组分别前置不同小数金额', '体123 456 0.3直0.7组合计2', 2]
  ,['福体分段直组五毛与组六五快', '福\n231  514 519 594 914\n314,513 913,534,934,593\n直组5毛\n13459\n组六5快\n体\n723 726 763 623\n923,629,729,693,793,769\n直组5毛\n23679\n组六5快\n合计31', 31]
  ,['买倍数玩法前置号码后置', '排列三买一倍选，买三倍直选：013合计8', 8]
  ,['玩法买倍数号码前置逆序', '013 体彩组选买1倍，直选买3倍合计8', 8]
  ,['福体多段百十个位定位小数金额', '福彩\n百位258\n十位23456\n个位01234\n0.5米 合计37.5\n体彩\n百位45678\n十位01239\n个位01234\n0.5米 合计62.5\n合计100', 100]
  ,['福体共用多段定位才逐段乘两边', '福体百1十2个3各0.5米\n百4十5个6各0.5米\n合计2', 2]
  ,['两码列表后置组三两码各金额', '福：36.39组三两码各20米合计40', 40]
  ,['两码组三玩法前置列表金额', '体两码组三12，34各15元合计30', 30]
  ,['多行组六后置福标记固定金额', '1569组六200\n1259组六100福合计300', 300]
];
const circle3BySize = {2:12,3:36,4:72,5:120,6:180,7:252,8:336,9:432,10:540};
const circle6BySize = {3:12,4:48,5:120,6:240,7:420,8:672,9:1008,10:1440};
for (const [play, table] of [['组三', circle3BySize], ['组六', circle6BySize]]) {
  for (const [size, base] of Object.entries(table)) {
    const digits = '0123456789'.slice(0, Number(size));
    cases.push([`转圈${play}${size}码赔率表`, `体转圈${digits}${play}各一倍`, base]);
    cases.push([`转圈${play}${size}码号码前置`, `体彩${digits}转圈${play}一倍`, base]);
  }
}
let failed = 0;
for (const [name, text, expected] of cases) {
  const result = calculate(text);
  if (!result.confident || result.amount !== expected) {
    failed += 1;
    console.log(`FAIL ${name}: expected ${expected}, got ${result.amount}; ${JSON.stringify(result)}`);
  } else console.log(`PASS ${name}: ${result.amount}`);
}

const danTuoClaimCheck = calculate('胆0拖134568组六两倍\n胆0拖345689组六一倍\n胆3拖014568组六一倍\n福合计40');
if (danTuoClaimCheck.amount !== 40 || Number(danTuoClaimCheck.claimed) !== 40) {
  failed += 1;
  console.log(`FAIL 胆拖金额只作核对: ${JSON.stringify(danTuoClaimCheck)}`);
} else console.log('PASS 胆拖组合金额独立计算且保留原文40核对');
const ambiguous = calculate('福\n和值13 17\n组六034679\n飞29各10\n共30');
const perLineMismatch = calculate('排三直\n246三倍\n247两倍\n都是直\n共8');
if (!perLineMismatch.confident || perLineMismatch.amount !== 10 || perLineMismatch.claimed !== 8) {
  failed += 1;
  console.log(`FAIL 逐行倍数独立计算且原文总额仅核对: ${JSON.stringify(perLineMismatch)}`);
} else console.log('PASS 逐行倍数独立计算且原文总额仅核对');
const perLineUnknown = calculate('排三直\n246三倍\n247待确认\n共6');
if (perLineUnknown.confident || perLineUnknown.amount !== '' || !perLineUnknown.needs?.length) {
  failed += 1;
  console.log(`FAIL 逐行倍数存在未知行不可按首行倍率兜底: ${JSON.stringify(perLineUnknown)}`);
} else console.log('PASS 逐行倍数存在未知行不可按首行倍率兜底');
const leadingPriceBet = '体097.680.681.687.682.880.881.882.一元直8元';
const leadingPriceResult = calculate(leadingPriceBet);
if (!leadingPriceResult.confident || leadingPriceResult.amount !== 8 || leadingPriceResult.claimed !== 8 || actualNoteCount(leadingPriceBet) !== 8) {
  failed += 1;
  console.log(`FAIL 前置单价与后置小计应分开计算核对: ${actualNoteCount(leadingPriceBet)}注 ${JSON.stringify(leadingPriceResult)}`);
} else console.log('PASS 前置单价与后置小计按8注核对');
const leadingPriceMismatch = calculate('福101.202.303.两元直8元');
if (!leadingPriceMismatch.confident || leadingPriceMismatch.amount !== 6 || leadingPriceMismatch.claimed !== 8) {
  failed += 1;
  console.log(`FAIL 前置单价小计不符仍按号码独立计算: ${JSON.stringify(leadingPriceMismatch)}`);
} else console.log('PASS 前置单价小计不符仍按号码独立计算');
const explicitDanMultiplier = calculate('体彩独胆3买70倍');
if (!explicitDanMultiplier.confident || explicitDanMultiplier.amount !== 700) {
  failed += 1;
  console.log(`FAIL 明写倍不能按买70元处理: ${JSON.stringify(explicitDanMultiplier)}`);
} else console.log('PASS 明写70倍按700元而非买70元');
const implicitDanMismatch = calculate('体3买70共60');
if (!implicitDanMismatch.confident || implicitDanMismatch.amount !== 70 || implicitDanMismatch.claimed !== 60) {
  failed += 1;
  console.log(`FAIL 省略独胆时原文金额仍只核对: ${JSON.stringify(implicitDanMismatch)}`);
} else console.log('PASS 省略独胆时原文金额仍只核对');
const hangingDanMismatch = calculate('福吊5.0.2个50合计140');
if (!hangingDanMismatch.confident || hangingDanMismatch.amount !== 150 || hangingDanMismatch.claimed !== 140) {
  failed += 1;
  console.log(`FAIL 吊独胆原文合计不反推金额: ${JSON.stringify(hangingDanMismatch)}`);
} else console.log('PASS 吊独胆原文合计仅用于核对');
const tieredFlyMismatch = calculate('福飞24/27个打50元47打20合计110');
if (!tieredFlyMismatch.confident || tieredFlyMismatch.amount !== 120 || tieredFlyMismatch.claimed !== 110) {
  failed += 1;
  console.log(`FAIL 双飞分档原文合计不反推金额: ${JSON.stringify(tieredFlyMismatch)}`);
} else console.log('PASS 双飞分档原文合计仅用于核对');
const unrecognizedLine = calculate('福123一直\n456 789各一倍\n合计10');
if (unrecognizedLine.confident || unrecognizedLine.amount !== '' || !unrecognizedLine.needs?.some(need => need.includes('456 789'))) {
  failed += 1;
  console.log(`FAIL 多行未知玩法须提示具体原文行: ${JSON.stringify(unrecognizedLine)}`);
} else console.log('PASS 多行未知玩法提示具体原文行');
for (const text of ['福123一直\n456 789各0.5元\n合计3', '福123一直\n456 789各20\n合计42']) {
  const result = calculate(text);
  if (result.confident || result.amount !== '' || !result.needs?.some(need => need.includes('456 789'))) {
    failed += 1;
    console.log(`FAIL 多行未知玩法的金额行不能跳过: ${JSON.stringify(result)}`);
  } else console.log('PASS 多行未知玩法的金额行提示具体原文');
}
const ambiguousMultiDan = calculate('体2 4买70');
if (ambiguousMultiDan.confident || ambiguousMultiDan.amount !== '' || !ambiguousMultiDan.needs?.length) {
  failed += 1;
  console.log(`FAIL 多胆买70未写各不能擅自分配: ${JSON.stringify(ambiguousMultiDan)}`);
} else console.log('PASS 多胆买70未写各须确认范围');
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
for (const {count, lottery, play, rateText, unitPrice, operator, equals, brackets} of [
  {count: 3, lottery: '福', play: '直', rateText: '一元', unitPrice: 1, operator: '*', equals: '=', brackets: '（）'},
  {count: 4, lottery: '体', play: '组', rateText: '五毛', unitPrice: 0.5, operator: '×', equals: '＝', brackets: '()'},
  {count: 5, lottery: '福', play: '直', rateText: '2米', unitPrice: 2, operator: 'x', equals: '=', brackets: '（）'},
  {count: 6, lottery: '体', play: '组', rateText: '0.2元', unitPrice: 0.2, operator: 'X', equals: '＝', brackets: '()'}
]) {
  const numbers = Array.from({length: count}, (_, index) => String(101 + index * 7).padStart(3, '0')).join(' ');
  const expected = Number((count * unitPrice).toFixed(2));
  const bet = `${lottery}：${numbers}${brackets[0]}${count}注${play}各${rateText}${count}${operator}${unitPrice}${equals}${expected}${brackets[1]}`;
  const result = calculate(bet);
  if (!result.confident || result.amount !== expected || result.claimed !== expected || actualNoteCount(bet) !== count) {
    failed += 1;
    console.log(`FAIL 参数化括号注数算式 ${bet}: ${actualNoteCount(bet)}注 ${JSON.stringify(result)}`);
  } else console.log(`PASS 参数化括号注数算式 ${count}注${play} ${expected}元`);
}
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
