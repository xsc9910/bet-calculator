const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const original=`福
056 059 049
转圈各5米90米
064  514 253 254 248 473 943 563 935 574 548 764 579 515 448 588 443
一直一组68米
共158米`;
console.log(JSON.stringify(api.autoCalculateBet(original)));
const cases=[[original,158,158]];
for(const lottery of ['福','体'])for(const [codes,count] of [['056 059 049',18],['112 123',9],['000 005',4]])for(const rate of [.5,1,5])for(const sep of [' ','\n']){
 const amount=count*rate;
 cases.push([`${lottery}${codes}${sep}转圈各${rate}米${amount}米`,amount,amount]);
 cases.push([`${lottery}${codes}${sep}转圈各${rate}米${amount}米\n123 234一直一组8米\n共${amount+8}米`,amount+8,amount+8]);
}
let checks=0;for(const [text,amount,claimed] of cases){const result=api.autoCalculateBet(text);assert.deepEqual([result.amount,result.claimed,result.confident],[amount,claimed,true],JSON.stringify({text,result}));checks++;}
for(const [draw,expected] of [['056',4750],['650',4750],['059',4750],['064',2210],['515',2520],['666',0]]){
 const wins=api.scanEntryForDraw({id:'rotor',original,amount:158},'福彩',draw);assert.equal(wins.reduce((s,w)=>s+w.prize,0),expected,JSON.stringify({draw,wins}));checks++;
}
assert.equal(api.autoCalculateBet(original.replace('共158米','共999米')).amount,158);
assert.equal(api.autoCalculateBet(original.replace('共158米','共999米')).claimed,999);
for(const [text,draw,prize] of [['福112 123转圈各5米45米','121',4750],['福000 005转圈各1米4米','000',950],['福005 005转圈各1米6米','050',1900]]){
 const wins=api.scanEntryForDraw({id:'rotor-extra',original:text,amount:api.autoCalculateBet(text).amount},'福彩',draw);assert.equal(wins.reduce((s,w)=>s+w.prize,0),prize);checks++;
}
assert.equal(api.scanEntryForDraw({id:'wrong-game',original,amount:158},'体彩','056').length,0);
assert.equal(api.autoCalculateBet(original+'\n未知玩法99元').confident,false);
console.log(JSON.stringify({checks:checks+4,failures:0}));
