// GitHub Pages stays static. Apps Script accepts the POST and confirms its receipt separately.
window.LAB_SUBMIT=(()=>{
 'use strict';
 function endpoint(value){try{const u=new URL(value);return u.protocol==='https:'&&u.hostname==='script.google.com'&&/^\/(?:a\/macros\/[A-Za-z0-9.-]+|macros)\/s\/[A-Za-z0-9_-]+\/exec$/.test(u.pathname)?u.href:'';}catch{return '';}}
 const ready=settings=>!!endpoint(settings?.endpoint);
 function send(packet,settings){
  const url=endpoint(settings?.endpoint);if(!url)return Promise.reject(new Error('Submission is not connected yet.'));
  return new Promise((resolve,reject)=>{
   const id=packet.submissionId,token=crypto.randomUUID().replace(/-/g,''),callback='__atariReceipt_'+token;
   const iframe=document.createElement('iframe'),form=document.createElement('form');
   iframe.name='atariSubmit_'+token;iframe.hidden=true;iframe.title='Submission transport';
   form.method='POST';form.action=url;form.target=iframe.name;form.hidden=true;
   for(const [name,value] of Object.entries({payload:JSON.stringify(packet),classCode:settings.classCode||''})){const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;form.append(input);}
   let done=false,timer,attempts=0,script=null;
   function cleanup(){done=true;clearTimeout(timer);script?.remove();form.remove();iframe.remove();delete window[callback];}
   function fail(){cleanup();reject(new Error('Google did not confirm the save. Check your connection or ask your teacher.'));}
   function poll(){
    if(done)return;if(++attempts>20){fail();return;}
    script?.remove();const query=new URL(url);query.searchParams.set('action','receipt');query.searchParams.set('id',id);query.searchParams.set('callback',callback);query.searchParams.set('classCode',settings.classCode||'');query.searchParams.set('_',String(Date.now()));
    script=document.createElement('script');script.src=query.href;script.referrerPolicy='no-referrer';document.body.append(script);timer=setTimeout(poll,2000);
   }
   window[callback]=receipt=>{if(done||receipt?.submissionId!==id)return;if(receipt.ok===true&&receipt.receipt){cleanup();resolve({id:receipt.receipt,submissionId:id,savedAt:receipt.savedAt});}else if(receipt.error){cleanup();reject(new Error(receipt.error));}};
   document.body.append(iframe,form);form.submit();timer=setTimeout(poll,1500);
  });
 }
 return {ready,send};
})();
