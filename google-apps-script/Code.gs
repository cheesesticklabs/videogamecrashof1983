// Bind this script to a Google Sheet. Only this file runs on Google; never put Sheet credentials in the website.
const QUESTION_IDS=['appeal','expectation','reflection','risk','quality','brand-before','brand-after','et','crash','roblox-copies','roblox-choice','roblox-ai','exit-decision'];
const HEADERS=['Submission ID','Receipt','Saved at','Lesson','Student name','Class / period','Language','First game','Familiar brand game',...QUESTION_IDS];

function configureSubmission(){
  const sheet=SpreadsheetApp.getActiveSpreadsheet();
  if(!sheet)throw new Error('Open Apps Script from the response spreadsheet first.');
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID',sheet.getId());
  // Change this classroom code before running setup. It limits accidental submissions; it is not a password protecting Sheet access.
  PropertiesService.getScriptProperties().setProperty('CLASS_CODE','atari-class');
  responseSheet_();
}

function responseSheet_(){
 const id=PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');if(!id)throw new Error('Run configureSubmission first.');
 const book=SpreadsheetApp.openById(id);let tab=book.getSheetByName('Atari responses');
 if(!tab){tab=book.insertSheet('Atari responses');tab.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);tab.setFrozenRows(1);tab.getRange(1,1,1,HEADERS.length).setFontWeight('bold').setBackground('#253a54').setFontColor('#ffffff');tab.setColumnWidths(1,HEADERS.length,180);tab.setColumnWidths(10,QUESTION_IDS.length,320);}
 const actual=tab.getRange(1,1,1,HEADERS.length).getValues()[0];if(actual.join('\n')!==HEADERS.join('\n'))throw new Error('Response sheet columns were changed. Restore the header row before accepting submissions.');
 return tab;
}

function classAllowed_(code){const expected=PropertiesService.getScriptProperties().getProperty('CLASS_CODE');return !!expected&&code===expected;}
function validId_(id){return typeof id==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);}
function text_(value,max){const string=String(value==null?'':value);if(string.length>max)throw new Error('A response is too long.');return string;}
function cell_(value){const string=String(value==null?'':value);return /^[\s]*[=+\-@]/.test(string)?"'"+string:string;}
function existing_(sheet,id){const last=sheet.getLastRow();if(last<2)return null;const found=sheet.getRange(2,1,last-1,1).createTextFinder(id).matchEntireCell(true).findNext();if(!found)return null;const row=sheet.getRange(found.getRow(),1,1,3).getValues()[0];return {ok:true,submissionId:id,receipt:String(row[1]),savedAt:new Date(row[2]).toISOString()};}
function receiptKey_(id){return 'receipt:'+id;}

function saveSubmission_(packet){
 if(!validId_(packet.submissionId))throw new Error('Invalid submission ID.');
 if(packet.lesson!=='The Video Game Crash of 1983')throw new Error('Wrong lesson.');
 const name=text_(packet.name,150).trim(),period=text_(packet.period,60).trim();if(!name||!period)throw new Error('Add a name and class.');
 if(!Array.isArray(packet.responses)||packet.responses.length>50)throw new Error('Invalid responses.');
 const responses={};packet.responses.forEach(r=>{if(QUESTION_IDS.indexOf(r.id)>=0)responses[r.id]=text_(r.answer,10000);});
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try{
  const sheet=responseSheet_(),previous=existing_(sheet,packet.submissionId);if(previous)return previous;
  const savedAt=new Date(),receipt=Utilities.getUuid();
  const values=[packet.submissionId,receipt,savedAt,packet.lesson,name,period,packet.lang==='es'?'es':'en',text_(packet.choices&&packet.choices.now,100),text_(packet.choices&&packet.choices.brands,100),...QUESTION_IDS.map(id=>responses[id]||'')];
  sheet.getRange(sheet.getLastRow()+1,1,1,values.length).setValues([values.map(value=>value instanceof Date?value:cell_(value))]);SpreadsheetApp.flush();
  return {ok:true,submissionId:packet.submissionId,receipt:receipt,savedAt:savedAt.toISOString()};
 }finally{lock.releaseLock();}
}

function doPost(e){
 let id='';
 try{if(!classAllowed_(e.parameter.classCode))throw new Error('The class submission code does not match. Ask your teacher.');
  const raw=e.parameter.payload||'';if(raw.length>100000)throw new Error('Submission is too large.');const packet=JSON.parse(raw);id=packet.submissionId;
  const receipt=saveSubmission_(packet);CacheService.getScriptCache().put(receiptKey_(id),JSON.stringify(receipt),21600);
  return ContentService.createTextOutput('Saved. Return to the lesson.');
 }catch(error){if(validId_(id))CacheService.getScriptCache().put(receiptKey_(id),JSON.stringify({ok:false,submissionId:id,error:String(error.message||error)}),600);return ContentService.createTextOutput('Not saved. Return to the lesson and ask your teacher.');}
}

function doGet(e){
 const p=e.parameter||{},callback=p.callback||'',id=p.id||'';
 if(p.action!=='receipt'||!/^__atariReceipt_[a-f0-9]{32}$/.test(callback)||!validId_(id))return ContentService.createTextOutput('Atari lesson submission receiver.');
 let response={ok:false,submissionId:id};
 if(!classAllowed_(p.classCode))response.error='The class submission code does not match. Ask your teacher.';
 else {const cached=CacheService.getScriptCache().get(receiptKey_(id));if(cached)response=JSON.parse(cached);else{const stored=existing_(responseSheet_(),id);if(stored)response=stored;}}
 // Only a random receipt and timestamp are returned. Student names and answers are never served here.
 const json=JSON.stringify(response).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 return ContentService.createTextOutput(callback+'('+json+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
}
