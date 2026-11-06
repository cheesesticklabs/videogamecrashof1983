(() => {
 'use strict';
 let game;try{game=JSON.parse(decodeURIComponent(location.hash.slice(1)));}catch{game={};}
 const es=game.lang==='es',t=(en,sp)=>es?sp:en,$=id=>document.getElementById(id);
 document.documentElement.lang=es?'es':'en';
 $('finish-shopping').hidden=!game.finishShopping;$('finish-shopping').textContent=t('Finish Shopping','Terminar las compras');document.querySelector('.buttons').append($('finish-shopping'));
 Javatari.AUTO_START=false;Javatari.SCREEN_OPENING_SIZE=1;Javatari.SCREEN_CONTROL_BAR=1;Javatari.CARTRIDGE_CHANGE_DISABLED=true;Javatari.SCREEN_FULLSCREEN_DISABLED=true;Javatari.SCREEN_RESIZE_DISABLED=true;Javatari.PADDLES_MODE=game.paddles?1:0;
 let started=false,loaded=false,paused=false,loading=false,timeout=null;
 $('opening').textContent=t('Press START to play.','Pulsa START para jugar.');$('status').textContent=t('Ready when you are.','Listo cuando quieras.');$('retry').textContent=t('Try again','Intentar otra vez');$('start').setAttribute('aria-label',t('Start game','Iniciar juego'));$('pause').setAttribute('aria-label',t('Pause game','Pausar juego'));$('reset').setAttribute('aria-label',t('Reset game','Reiniciar juego'));$('stage').setAttribute('aria-label',t('Atari game screen','Pantalla del juego Atari'));
 function status(message,error=false){$('status').textContent=message;$('status').classList.toggle('error',error);$('retry').hidden=!error;if(loaded)$('finish-shopping').disabled=false;}
 function fit(){if(!started)return;const screen=$('javatari-screen'),panel=$('javatari-console-panel'),width=Math.max(screen.offsetWidth,panel.offsetWidth),height=screen.offsetHeight+panel.offsetHeight;if(!width||!height)return;const scale=Math.min($('stage').clientWidth/width,$('stage').clientHeight/height);$('scaler').style.width=width+'px';$('scaler').style.height=height+'px';$('scaler').style.transform=`translate(-50%,-50%) scale(${scale})`;}
 const observer=new ResizeObserver(fit);['stage','javatari-screen','javatari-console-panel'].forEach(id=>observer.observe($(id)));
 function pulse(control){const socket=Javatari.room.console.getControlsSocket();socket.controlStateChanged(control,true);setTimeout(()=>socket.controlStateChanged(control,false),150);}
 function pause(value){if(!loaded||paused===value)return;pulse(jt.ConsoleControls.PAUSE);paused=value;$('pause').setAttribute('aria-pressed',String(paused));$('pause').setAttribute('aria-label',paused?t('Resume game','Reanudar juego'):t('Pause game','Pausar juego'));status(paused?t('Paused. Press START to resume.','En pausa. Pulsa START para continuar.'):t('Playing ','Jugando ')+game.title+(/[.!?]$/.test(game.title)?'':'.'));}
 function error(message){clearTimeout(timeout);loading=false;$('start').disabled=false;status(t('Could not load the game. Check the connection and school access to Wix file hosting. ','No se pudo cargar el juego. Comprueba la conexión y el acceso de la escuela a Wix. ')+String(message||''),true);}
 jt.Util.message=error;
 function start(){
  if(loading)return;if(loaded){pause(false);Javatari.room.screen.focus();return;}
  try{const u=new URL(game.url);if(u.protocol!=='https:')throw new Error(t('No game URL configured.','No se configuró la URL del juego.'));}catch(e){error(e.message);return;}
  loading=true;$('start').disabled=true;status(t('Loading ','Cargando ')+game.title+'…');
  try{
   if(!started){Javatari.start();started=true;const socket=Javatari.room.console.getCartridgeSocket(),originalInsert=socket.insert;socket.insert=function(...args){const result=originalInsert.apply(this,args);clearTimeout(timeout);loading=false;loaded=true;paused=false;$('cover').hidden=true;$('start').disabled=false;$('pause').disabled=false;$('reset').disabled=false;pulse(jt.ConsoleControls.RESET);status(t('Playing ','Jugando ')+game.title+(/[.!?]$/.test(game.title)?'':'.'));fit();Javatari.room.screen.focus();if(document.hidden)pause(true);parent.postMessage({type:'game-loaded'},location.origin);return result;};}
   timeout=setTimeout(()=>error(t('The request timed out. Try again.','La solicitud tardó demasiado. Inténtalo otra vez.')),20000);
   Javatari.loadROMFromURL(game.url);
  }catch(e){error(e.message);}
 }
 $('start').onclick=start;$('retry').onclick=start;$('pause').onclick=()=>{pause(!paused);Javatari.room.screen.focus();};$('reset').onclick=()=>{if(!loaded)return;pause(false);pulse(jt.ConsoleControls.RESET);status(t('Game reset.','Juego reiniciado.'));Javatari.room.screen.focus();};
 // Javatari 0.91 maps F4 to the left difficulty switch (DIFFICULTY0).
 $('finish-shopping').onclick=()=>{if(!loaded)return;pause(false);pulse(jt.ConsoleControls.DIFFICULTY0);status(t('Shopping finished.','Compras terminadas.'));Javatari.room.screen.focus();};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause(true);});
 window.addEventListener('blur',()=>{if(!document.hasFocus())pause(true);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();parent.postMessage({type:'close-game'},location.origin);}},true);
 window.addEventListener('pagehide',()=>{clearTimeout(timeout);if(started){Javatari.room.console.powerOff();Javatari.room.speaker.mute();}});
})();
