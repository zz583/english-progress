const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const path = require('node:path');
const html = fs.readFileSync(process.argv[2] || path.join(__dirname, 'index.html'), 'utf8');
let checks = 0;
function eq(actual, expected, message) { assert.deepEqual(actual, expected, message); checks++; }
function open(seed) {
  return new JSDOM(html, {url:'http://localhost/', runScripts:'dangerously', pretendToBeVisual:true,
    beforeParse(w) {
      w.HTMLElement.prototype.scrollIntoView = function(){};
      w.HTMLMediaElement.prototype.pause = function(){};
      if(seed) w.localStorage.setItem('english-book-v2', JSON.stringify(seed));
    }});
}
const read = d => JSON.parse(d.window.localStorage.getItem('english-book-v2'));
const click = (d,id) => d.window.document.getElementById(id).click();
const rate = (d,status) => d.window.document.querySelector('#card-c1-0 [data-rate="'+status+'"]').click();
function paste(d,data) {
  const t=d.window.document.getElementById('exportText');t.hidden=false;t.value=JSON.stringify(data);
  click(d,'btnPasteImport');
  eq(d.window.document.getElementById('importOverlay').hidden,false,'import preview');
  click(d,'btnMergeImport');
}
const base={cards:{'c1-0':{status:'independent',streak:1,interval:4,last_review:'2020-01-01',next_review:'2020-01-05'}},position:{chapter:0,cardId:'c1-0'}};
for(const sequence of [['independent','hint','independent'],['independent','unknown','independent'],['unknown','hint','independent'],['hint','unknown','independent']]) {
 const d=open(base);
 for(const status of sequence) {rate(d,status);eq(read(d).cards['c1-0'].status,status,'correction updates visible status');}
 let r=read(d).cards['c1-0'];eq(r.streak,2,'only one due-review increment');eq(r.interval,8,'4 to 8 days');
 const before=JSON.stringify(r);rate(d,'independent');eq(JSON.stringify(read(d).cards['c1-0']),before,'identical rating is idempotent');
 rate(d,'unknown');eq(read(d).cards['c1-0'].streak,0,'unknown clears streak');eq(read(d).cards['c1-0'].interval,1,'unknown is due tomorrow');
 const reopened=open(read(d));d.window.close();rate(reopened,'independent');eq(read(reopened).cards['c1-0'].streak,2,'reload preserves baseline');
 click(reopened,'btnExport');const backup=JSON.parse(reopened.window.document.getElementById('exportText').value);
 eq(backup.cards[0].rating_base.streak,1,'export preserves baseline');
 const restored=open();paste(restored,backup);
 eq(read(restored).cards['c1-0'],read(reopened).cards['c1-0'],'full card roundtrip');eq(read(restored).position,read(reopened).position,'position roundtrip');
 rate(restored,'hint');rate(restored,'independent');eq(read(restored).cards['c1-0'].streak,2,'correction after import cannot inflate streak');
 paste(restored,{schema_version:2,cards:[{id:'c1-0',status:'new'}]});eq(read(restored).cards['c1-0'].status,'independent','old empty backup cannot erase learning');
 restored.window.close();reopened.window.close();
}
const fresh=open();rate(fresh,'unknown');rate(fresh,'independent');eq(read(fresh).cards['c1-0'].streak,1,'first learning correction counts once');fresh.window.close();
console.log('PASS: '+checks+' assertions (real page handlers; isolated jsdom storage).');
