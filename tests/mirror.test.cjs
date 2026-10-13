const test=require('node:test');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

test('anonymization preserves executable inline and translated LuCI scripts',()=>{
 const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../preview/mirror/responses.json'),'utf8'));
 let checked=0;
 for(const [url,record] of Object.entries(data.records)){
  if(record.mime.includes('javascript')){new vm.Script(record.body,{filename:url});checked++;}
  if(record.mime==='text/html'){
   for(const match of record.body.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
    if(/\bsrc\s*=/.test(match[1]))continue;
    new vm.Script(match[2],{filename:url});checked++;
   }
  }
 }
 if(checked<100)throw Error('Expected the complete native-page script fixture');
});
