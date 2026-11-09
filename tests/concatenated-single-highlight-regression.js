const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,findConcatenatedSingleNumbers};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
for(const [text,values] of [
 ['123 345 567 234456 234 567 678一直一组',['234456']],
 ['福001 002 003004 005 006007008 009一直一组',['003004','006007008']],
 ['福123 345\n234456\n567 678一直一组',['234456']],
 ['体123 5507 456直一倍',['5507']],
 ['福123 234456 567组一倍',['234456']],
 ['2026年09月30日 15:59\n福123 234456 567直组1米',['234456']]
]){
 const found=api.findConcatenatedSingleNumbers(text);assert.deepEqual(found.map(v=>v.value),values,JSON.stringify({text,found}));
 for(const item of found)assert.equal(text.slice(item.start,item.end),item.value);
 const result=api.autoCalculateBet(text);assert.equal(result.confident,false,JSON.stringify({text,result}));
}
for(const [text,amount] of [
 ['福123 345 567 234 456 234 567 678一直一组',32],
 ['福012345组六20\n123 456一直一组',28],
 ['福123 456一直一组\n1拖234567组六10',18],
 ['福百位012345十位123个456一倍',108],
 ['福123 456直1000元',2000]
 ,['福012479组三组六各10元724三单两组\n体1457 3471组六组三各10元145 457 347 471各一组共78元',78]
]){
 const found=api.findConcatenatedSingleNumbers(text);assert.deepEqual(found,[],JSON.stringify({text,found}));
 const result=api.autoCalculateBet(text);assert.equal(result.amount,amount,JSON.stringify({text,result}));
}
console.log('CONCATENATED_SINGLE_HIGHLIGHT passed');
