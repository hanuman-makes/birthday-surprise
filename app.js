const $ = (id) => document.getElementById(id);

const music = { audio:null, started:false, muted:false, pausedForVideo:false, fadeTimer:null };
const screens = { pin:$('pinScreen'), choice:$('choiceScreen'), cupid:$('cupidScreen'), envelope:$('envelopeScreen'), candle:$('candleScreen'), intro:$('introScreen'), memories:$('memoriesScreen') };

function ageFromBirthDate(dateString){
  const b=new Date(dateString+'T00:00:00'); const now=new Date();
  let age=now.getFullYear()-b.getFullYear();
  const before=(now.getMonth()<b.getMonth())||(now.getMonth()===b.getMonth()&&now.getDate()<b.getDate());
  if(before) age--;
  return Math.max(0,age);
}
function fillPersonalDetails(){
  const age=ageFromBirthDate(CONFIG.birthDate);
  document.querySelectorAll('.name-slot').forEach(e=>e.textContent=CONFIG.personName);
  document.querySelectorAll('.age-slot').forEach(e=>e.textContent=age);
  $('personName').textContent=CONFIG.personName;
  $('revealAge').textContent=age;
}

function setupMusic(){
  music.audio=new Audio(CONFIG.music.file); music.audio.loop=CONFIG.music.loop; music.audio.preload='auto'; music.audio.volume=0;
}
function fadeMusicTo(target,duration=1000){
  if(!music.audio) return; clearInterval(music.fadeTimer);
  const start=music.audio.volume, steps=Math.max(1,Math.floor(duration/50)); let step=0;
  music.fadeTimer=setInterval(()=>{ step++; const p=Math.min(step/steps,1); music.audio.volume=start+(target-start)*p; if(p>=1)clearInterval(music.fadeTimer); },50);
}
function startMusic(){
  if(!music.audio) return; if(music.started){ if(music.audio.paused && !music.pausedForVideo) music.audio.play().catch(()=>{}); return; }
  music.started=true; music.audio.play().then(()=>fadeMusicTo(CONFIG.music.volume,CONFIG.music.fadeInMs)).catch(()=>{music.started=false;});
  $('musicToggle').classList.remove('hidden');
}
function pauseMusicForVideo(){ if(!music.audio)return; music.pausedForVideo=true; music.audio.pause(); }
function resumeMusicAfterVideo(){ if(!music.audio)return; music.pausedForVideo=false; if(!music.muted && music.started) music.audio.play().catch(()=>{}); }
function createMusicButton(){
  const b=document.createElement('button'); b.id='musicToggle'; b.className='music-toggle hidden'; b.type='button'; b.textContent='🔊'; b.setAttribute('aria-label','Mute music');
  b.addEventListener('click',()=>{ music.muted=!music.muted; if(music.audio)music.audio.muted=music.muted; b.textContent=music.muted?'🔇':'🔊'; b.setAttribute('aria-label',music.muted?'Turn music on':'Mute music'); if(!music.muted && !music.pausedForVideo)music.audio?.play().catch(()=>{}); });
  document.body.appendChild(b);
}

function showScreen(name){ Object.values(screens).forEach(s=>{s.classList.remove('active');s.classList.add('hidden')}); screens[name].classList.remove('hidden'); screens[name].classList.add('active'); window.scrollTo({top:0,behavior:'instant'}); }

function setCharacter(element){
  if(!element)return; const src=CONFIG.character?.image;
  if(src){ const img=document.createElement('img'); img.src=src; img.alt=CONFIG.character.alt||'Cute birthday character'; img.className='custom-character'; img.onerror=()=>{element.textContent=CONFIG.character.emoji||'🐰'; element.classList.remove('custom-character-holder')}; element.textContent=''; element.appendChild(img); element.classList.add('custom-character-holder'); }
  else element.textContent=CONFIG.character?.emoji||'🐰';
}
function applyCharacter(){ document.querySelectorAll('.character-slot').forEach(setCharacter); }

fillPersonalDetails(); setupMusic(); createMusicButton(); applyCharacter();

// PIN gate
let pinValue=''; const pinDots=[...document.querySelectorAll('#pinDots span')];
function updateDots(){pinDots.forEach((d,i)=>d.classList.toggle('filled',i<pinValue.length));}
function pinPress(key){
  if(key==='back')pinValue=pinValue.slice(0,-1); else if(key==='clear')pinValue=''; else if(/^\d$/.test(key)&&pinValue.length<CONFIG.birthdayPin.length)pinValue+=key;
  updateDots(); if(pinValue.length===CONFIG.birthdayPin.length)setTimeout(unlock,120);
}
document.querySelectorAll('.dial-key').forEach(b=>b.addEventListener('click',()=>pinPress(b.dataset.key)));
$('unlockBtn').addEventListener('click',unlock);
function unlock(){
  if(pinValue===CONFIG.birthdayPin){ $('pinError').textContent=''; startMusic(); showScreen('choice'); }
  else { $('pinError').textContent='Hmm... that is not the birthday PIN 😌'; $('pinDots').animate([{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration:260}); }
}

// YES / NO
let noPresses=0;
$('noBtn').addEventListener('click',()=>{ noPresses++; $('yesBtn').style.transform=`scale(${Math.min(1+noPresses*.22,2.9)})`; $('noBtn').style.transform=`scale(${Math.max(1-noPresses*.12,.35)})`; const m=['Are you sure? 🥺','Really really sure? 👀','The bunny is getting sad... 🐰💔','YES is getting bigger! 😭','You know you want to press YES 😌💕','Okay, I give up. YES wins. 😂']; $('choiceMessage').textContent=m[Math.min(noPresses-1,m.length-1)]; $('noCounter').textContent=`NO has been pressed ${noPresses} time${noPresses===1?'':'s'} 🙈`; });
$('yesBtn').addEventListener('click',()=>{showScreen('cupid'); resetCupid();});

// Cupid
function resetCupid(){ $('heartTarget').classList.remove('hit'); $('arrow').classList.remove('shoot'); $('shootBtn').classList.remove('hidden'); $('afterCupidBtn').classList.add('hidden'); $('cupidHint').textContent='Tap the bow and send the love arrow 💕'; }
$('shootBtn').addEventListener('click',()=>{
  $('shootBtn').disabled=true; $('arrow').classList.remove('shoot'); void $('arrow').offsetWidth; $('arrow').classList.add('shoot');
  setTimeout(()=>{ $('heartTarget').classList.add('hit'); burstHearts($('heartTarget')); $('cupidHint').textContent='Direct hit! 💘💗'; $('shootBtn').classList.add('hidden'); $('afterCupidBtn').classList.remove('hidden'); $('shootBtn').disabled=false; },760);
});
$('heartTarget').addEventListener('click',()=>{ if(!$('heartTarget').classList.contains('hit'))$('shootBtn').click(); });
$('afterCupidBtn').addEventListener('click',()=>{showScreen('envelope'); $('envelope').classList.remove('open'); $('openEnvelopeBtn').classList.remove('hidden'); $('continueLetterBtn').classList.add('hidden');});
function burstHearts(origin){ const rect=origin.getBoundingClientRect(); for(let i=0;i<18;i++){const s=document.createElement('span');s.className='spark';s.textContent=['💗','💕','✨','🌸','💖'][i%5];s.style.left=(rect.left+rect.width/2)+'px';s.style.top=(rect.top+rect.height/2)+'px';s.style.setProperty('--dx',`${(Math.random()-.5)*240}px`);s.style.setProperty('--dy',`${(Math.random()-.5)*240}px`);$('sparkleLayer').appendChild(s);setTimeout(()=>s.remove(),1400);} }

// Premium envelope
let letterReadingTimer=null;
function openEnvelope(){
  if($('envelope').classList.contains('open'))return;
  $('envelope').classList.add('open');
  $('openEnvelopeBtn').classList.add('hidden');
  $('continueLetterBtn').classList.remove('hidden');
  $('continueLetterBtn').disabled=true;
  let seconds=10;
  $('continueLetterBtn').textContent=`Keep going in ${seconds}s`;
  clearInterval(letterReadingTimer);
  letterReadingTimer=setInterval(()=>{
    seconds--;
    if(seconds<=0){
      clearInterval(letterReadingTimer);
      letterReadingTimer=null;
      $('continueLetterBtn').disabled=false;
      $('continueLetterBtn').textContent='Keep going ✨';
      return;
    }
    $('continueLetterBtn').textContent=`Keep going in ${seconds}s`;
  },1000);
}
$('openEnvelopeBtn').addEventListener('click',openEnvelope);
$('envelope').querySelector('.wax-seal').addEventListener('click',openEnvelope);
$('envelope').querySelector('.wax-seal').addEventListener('keydown',(event)=>{if(event.key==='Enter'||event.key===' ') {event.preventDefault();openEnvelope();}});
$('continueLetterBtn').addEventListener('click',startCandle);

// Candle + microphone
let candleTimer=null,micStream=null,audioContext=null,analyser=null,dataArray=null,raf=null,candleCountdownTimer=null,candleDone=false;
async function startCandle(){
  showScreen('candle'); candleDone=false; $('flame').classList.remove('out'); $('blowText').textContent='Blow into your microphone 🌬️'; let seconds=5; $('candleCountdown').textContent=seconds;
  clearInterval(candleCountdownTimer); candleCountdownTimer=setInterval(()=>{seconds--; $('candleCountdown').textContent=Math.max(seconds,0); if(seconds<=0)clearInterval(candleCountdownTimer)},1000);
  clearTimeout(candleTimer); candleTimer=setTimeout(blowOutCandle,5000);
  try{if(navigator.mediaDevices?.getUserMedia){micStream=await navigator.mediaDevices.getUserMedia({audio:true}); listenForBlow();}}catch(e){console.log('Microphone unavailable; manual/timer fallback remains active.');}
}
$('fakeBlowBtn').addEventListener('click',blowOutCandle);
function listenForBlow(){
  if(!micStream)return; audioContext=new(window.AudioContext||window.webkitAudioContext)(); const source=audioContext.createMediaStreamSource(micStream); analyser=audioContext.createAnalyser(); analyser.fftSize=512; source.connect(analyser); dataArray=new Uint8Array(analyser.fftSize);
  const check=()=>{if(!analyser||candleDone)return; analyser.getByteTimeDomainData(dataArray); let sum=0;for(const v of dataArray){const x=(v-128)/128;sum+=x*x} const rms=Math.sqrt(sum/dataArray.length); if(rms>.16){blowOutCandle();return} raf=requestAnimationFrame(check)}; check();
}
function stopMic(){if(raf)cancelAnimationFrame(raf);if(micStream)micStream.getTracks().forEach(t=>t.stop());if(audioContext)audioContext.close().catch(()=>{});raf=null;micStream=null;audioContext=null;analyser=null;}
function blowOutCandle(){if(candleDone)return;candleDone=true;clearTimeout(candleTimer);clearInterval(candleCountdownTimer);stopMic();$('flame').classList.add('out');$('blowText').textContent='Wish made! ✨';burstHearts($('flame'));setTimeout(runBirthdayReveal,1000);}

// Torch reveal
function runBirthdayReveal(){
  showScreen('intro'); fillPersonalDetails(); $('walkingCharacter').classList.remove('walk');$('torchBeam').classList.remove('on');$('birthdayReveal').classList.remove('show');void $('walkingCharacter').offsetWidth;$('walkingCharacter').classList.add('walk');$('torchBeam').classList.add('on');
  setTimeout(()=>$('birthdayReveal').classList.add('show'),4200); setTimeout(()=>{showScreen('memories');loadDriveMedia();},7800);
}

// Google Drive configuration
const STORAGE_KEY='birthdayDriveConfigV2';
function normalizeDriveId(value=''){
  const text=value.trim();
  const folderMatch=text.match(/\/folders\/([^/?]+)/);
  const id=decodeURIComponent(folderMatch?.[1]||text.split('?')[0]);
  return /^[A-Za-z0-9_-]{10,}$/.test(id)?id:'';
}
function getDriveConfig(){
  let saved={};try{saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{}
  const config={...CONFIG.googleDrive,...saved};
  config.parentFolderId=normalizeDriveId(saved.parentFolderId)||normalizeDriveId(CONFIG.googleDrive.parentFolderId);
  config.photosFolderId=normalizeDriveId(saved.photosFolderId)||normalizeDriveId(CONFIG.googleDrive.photosFolderId);
  config.videosFolderId=normalizeDriveId(saved.videosFolderId)||normalizeDriveId(CONFIG.googleDrive.videosFolderId);
  if(saved.photosFolderId&&!normalizeDriveId(saved.photosFolderId)&&config.photosFolderId){
    localStorage.setItem(STORAGE_KEY,JSON.stringify({...saved,photosFolderId:config.photosFolderId,videosFolderId:config.videosFolderId}));
  }
  return config;
}
function hasDriveConfig(c){return c.apiKey && !c.apiKey.includes('PASTE_') && ((c.photosFolderId&&!c.photosFolderId.includes('PASTE_'))||(c.parentFolderId&&!c.parentFolderId.includes('PASTE_')));}
async function driveList(folderId,mimePrefix){
  const c=getDriveConfig(); if(!folderId)throw new Error('Folder ID is missing.'); if(!c.apiKey||c.apiKey.includes('PASTE_'))throw new Error('Google Drive API key is missing.');
  const q=`'${folderId}' in parents and trashed = false and mimeType contains '${mimePrefix}'`;
  const url=new URL('https://www.googleapis.com/drive/v3/files'); url.searchParams.set('key',c.apiKey);url.searchParams.set('q',q);url.searchParams.set('fields','files(id,name,mimeType,createdTime,thumbnailLink,webContentLink)');url.searchParams.set('pageSize','100');url.searchParams.set('orderBy','createdTime desc');
  const r=await fetch(url);if(!r.ok){let detail='';try{detail=await r.text()}catch{}throw new Error(`Google Drive API ${r.status}: ${detail.slice(0,180)}`)}return (await r.json()).files||[];
}
async function driveFile(fileId){
  const c=getDriveConfig(); const url=new URL(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`);
  url.searchParams.set('key',c.apiKey); url.searchParams.set('fields','id,name,mimeType,createdTime,thumbnailLink,webContentLink');
  const r=await fetch(url); if(!r.ok)return null; return await r.json();
}
async function driveVideos(folderOrFileId){
  if(!folderOrFileId)return [];
  const files=await driveList(folderOrFileId,'video/');
  if(files.length)return files;
  const file=await driveFile(folderOrFileId);
  return file?.mimeType?.startsWith('video/')?[file]:[];
}
async function findSubfolder(parentId,name){
  const c=getDriveConfig();const q=`'${parentId}' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder' and name = '${name.replace(/'/g,"\\'")}'`;const u=new URL('https://www.googleapis.com/drive/v3/files');u.searchParams.set('key',c.apiKey);u.searchParams.set('q',q);u.searchParams.set('fields','files(id,name)');u.searchParams.set('pageSize','10');const r=await fetch(u);if(!r.ok)throw new Error(`Folder lookup failed: ${r.status}`);const d=await r.json();return d.files?.[0]?.id||'';
}
function driveImageUrl(file){return file.thumbnailLink?.replace(/=s\d+$/, '=s800')||`https://drive.google.com/thumbnail?id=${encodeURIComponent(file.id)}&sz=w800`}
function driveVideoUrl(file){const c=getDriveConfig();return `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(file.id)}?alt=media&key=${encodeURIComponent(c.apiKey)}`}

let memoryFiles=[];let memoryIndex=-1;
async function loadDriveMedia(){
  $('photoLoading').classList.remove('hidden');$('videoLoading').classList.remove('hidden');$('photoEmpty').classList.add('hidden');$('videoEmpty').classList.add('hidden');
  const c=getDriveConfig();
  if(!hasDriveConfig(c)){ $('photoLoading').textContent='The memory box is not configured yet. ☁️';$('videoLoading').textContent='Videos are not configured yet. 🎬';$('photoEmpty').classList.remove('hidden');$('videoEmpty').classList.remove('hidden');return; }
  try{
    let photosId=c.photosFolderId, videosId=c.videosFolderId;
    if(c.parentFolderId){if(!photosId)photosId=await findSubfolder(c.parentFolderId,'Photos');if(!videosId)videosId=await findSubfolder(c.parentFolderId,'Videos');}
    const [photos,videos]=await Promise.all([driveList(photosId,'image/'),videosId?driveVideos(videosId):Promise.resolve([])]);
    memoryFiles=photos.slice(0,CONFIG.maxPhotos);memoryIndex=-1;renderNextPhoto();renderVideos(videos.slice(0,CONFIG.maxVideos));
  }catch(e){console.error(e);$('photoLoading').textContent=`Could not fetch photos: ${e.message}`;$('videoLoading').textContent='Could not fetch videos. Please check the Drive configuration. 🎬';}
}

function renderNextPhoto(){
  $('photoLoading').classList.add('hidden');const stage=$('photoStage');
  if(!memoryFiles.length){$('photoEmpty').classList.remove('hidden');$('pullPhotoBtn').classList.add('hidden');$('photoCounter').textContent='No memories';return}
  if(memoryIndex>=memoryFiles.length-1){$('pullPhotoBtn').textContent='All memories revealed 💗';$('pullPhotoBtn').disabled=true;$('photoCounter').textContent=`${memoryFiles.length} / ${memoryFiles.length}`;return}
  $('pullPhotoBtn').classList.remove('hidden');$('pullPhotoBtn').disabled=false;
  const file=memoryFiles[memoryIndex+1]; const wrap=document.createElement('div');wrap.className=`photo-reveal ${memoryIndex>5?'right-stack':'left-stack'}`;wrap.dataset.index=memoryIndex+1;wrap.style.setProperty('--stack-x',`${Math.min(memoryIndex%6,5)*24}px`);wrap.style.setProperty('--stack-rotate',`${memoryIndex%2===0?-6:7}deg`);const frame=document.createElement('div');frame.className='photo-frame';const img=document.createElement('img');img.src=driveImageUrl(file);img.alt=file.name;img.loading='lazy';const cap=document.createElement('div');cap.className='photo-caption';cap.textContent=file.name.replace(/\.[^/.]+$/,'');img.onerror=()=>{img.alt='Photo could not be loaded';cap.textContent='Could not load this photo';};frame.append(img,cap);wrap.append(frame);wrap.addEventListener('click',()=>{if(wrap.classList.contains('revealed')){stage.querySelectorAll('.photo-reveal').forEach(card=>card.classList.remove('selected'));wrap.classList.add('selected');}});stage.appendChild(wrap);
}
$('pullPhotoBtn').addEventListener('click',()=>{if(!memoryFiles.length||memoryIndex>=memoryFiles.length-1)return;const stage=$('photoStage');stage.querySelectorAll('.photo-reveal.selected').forEach(card=>card.classList.remove('selected'));memoryIndex++;const card=stage.querySelector(`.photo-reveal[data-index="${memoryIndex}"]`);card.classList.add('visible');$('photoCounter').textContent=`Memory ${memoryIndex+1} / ${memoryFiles.length}`;burstHearts(card);setTimeout(()=>{card.classList.add('revealed');renderNextPhoto();},850);});

function renderVideos(files){
  $('videoLoading').classList.add('hidden');const list=$('videoList');list.innerHTML='';if(!files.length){$('videoEmpty').textContent='No public video was found. Check the Videos folder ID, sharing permission, and that the upload is a video file. 🎬';$('videoEmpty').classList.remove('hidden');$('finalMessage').classList.remove('hidden');return}$('videoEmpty').classList.add('hidden');
  files.forEach((file)=>{const card=document.createElement('article');card.className='video-card';const preview=document.createElement('video');preview.className='video-preview';preview.playsInline=true;preview.preload='metadata';preview.muted=true;preview.src=driveVideoUrl(file);const playBadge=document.createElement('span');playBadge.className='video-play-badge';playBadge.textContent='▶';playBadge.setAttribute('aria-hidden','true');const title=document.createElement('div');title.className='video-title';title.textContent=file.name.replace(/\.[^/.]+$/,'');const subtitle=document.createElement('span');subtitle.className='video-subtitle';subtitle.textContent='Tap to play full screen';const open=()=>openVideoPlayer(file);card.append(preview,playBadge,title,subtitle);card.addEventListener('click',open);list.appendChild(card);});
  $('finalMessage').classList.remove('hidden');
}

function openVideoPlayer(file){
  const modal=$('videoPlayerModal'),player=$('videoPlayer');
  $('videoPlayerTitle').textContent=file.name.replace(/\.[^/.]+$/,''); player.src=driveVideoUrl(file); modal.classList.remove('hidden'); document.body.classList.add('video-modal-open');
  player.play().then(()=>{if(window.matchMedia('(max-width: 700px)').matches&&player.requestFullscreen)player.requestFullscreen().catch(()=>{});}).catch(()=>{});
}
function closeVideoPlayer(){const player=$('videoPlayer');if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});player.pause();player.removeAttribute('src');player.load();$('videoPlayerModal').classList.add('hidden');document.body.classList.remove('video-modal-open');resumeMusicAfterVideo();}
$('closeVideoPlayer').addEventListener('click',closeVideoPlayer);$('videoPlayerModal').addEventListener('click',(event)=>{if(event.target===$('videoPlayerModal'))closeVideoPlayer()});$('videoPlayer').addEventListener('play',pauseMusicForVideo);$('videoPlayer').addEventListener('ended',()=>{resumeMusicAfterVideo();$('finalMessage').classList.remove('hidden')});document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&!$('videoPlayerModal').classList.contains('hidden'))closeVideoPlayer()});

document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMic()});
