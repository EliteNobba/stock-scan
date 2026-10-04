const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);let current=JSON.parse(localStorage.getItem('currentScan')||'null'),saved=JSON.parse(localStorage.getItem('savedScans')||'[]'),parts=JSON.parse(localStorage.getItem('partsIndex')||'[]'),controls=null,reader=null,photoData='',activePart=null;

// v1.14 photo store: keep large photo data out of localStorage scan JSON.
const PHOTO_DB='stock-scan-photos-v1', PHOTO_STORE='photos';
function photoDb(){return new Promise((resolve,reject)=>{const r=indexedDB.open(PHOTO_DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(PHOTO_STORE))r.result.createObjectStore(PHOTO_STORE)};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function putPhoto(data){if(!data)return '';const id='photo-'+Date.now()+'-'+Math.random().toString(36).slice(2);const db=await photoDb();await new Promise((resolve,reject)=>{const tx=db.transaction(PHOTO_STORE,'readwrite');tx.objectStore(PHOTO_STORE).put(data,id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});db.close();return id}
async function getPhoto(id){if(!id)return '';const db=await photoDb();const v=await new Promise((resolve,reject)=>{const r=db.transaction(PHOTO_STORE).objectStore(PHOTO_STORE).get(id);r.onsuccess=()=>resolve(r.result||'');r.onerror=()=>reject(r.error)});db.close();return v}
async function deletePhoto(id){if(!id)return;try{const db=await photoDb();await new Promise((resolve,reject)=>{const tx=db.transaction(PHOTO_STORE,'readwrite');tx.objectStore(PHOTO_STORE).delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});db.close()}catch(e){console.warn('Photo delete failed',e)}}

function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),1800)}
function go(id){stopCamera();$$('.screen').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active');if(id==='current')renderCurrent();if(id==='saved')renderSaved();if(id==='datafiles')renderDataStatus();if(id==='stocktake')renderStocktake()}
$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));function persist(){localStorage.setItem('currentScan',JSON.stringify(current));localStorage.setItem('savedScans',JSON.stringify(saved));return true}function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function ensureScan(){if(!current)current={id:Date.now(),name:`Scan ${new Date().toLocaleString()}`,created:new Date().toISOString(),items:[]};try{persist();return true}catch(e){console.warn('Local storage unavailable; continuing current scan in memory',e);return false}}
function safePersist(){try{persist();return true}catch(e){console.error('Storage error',e);toast('STORAGE ERROR — item kept on screen');return false}}
function scannerNow(newSession=false){if(newSession){if(current&&current.items&&current.items.length&&!confirm('Start a new scan? The current unsaved scan will remain until replaced.'))return;current={id:Date.now(),name:`Scan ${new Date().toLocaleString()}`,created:new Date().toISOString(),items:[]};try{persist()}catch(e){console.warn('Local storage unavailable; new scan continuing in memory',e)}}else ensureScan();go('scanner');setTimeout(startCamera,120)}
$('#newScanNow').onclick=()=>scannerNow(true);$('#scanNext').onclick=()=>scannerNow(false);$('#scanFromCurrent').onclick=()=>scannerNow(false);$('#startNewAfterSave').onclick=()=>{current=null;persist();scannerNow(true)};
async function startCamera(){stopCamera();const status=$('#scanStatus'),diag=$('#scanDiag'),video=$('#video');status.textContent='Starting rear camera…';diag.textContent='';try{if(!window.ZXing){status.textContent='Scanner library did not load.';return}reader=new ZXing.BrowserMultiFormatReader();const onDecode=(result,err)=>{if(result&&result.getText){const code=result.getText();if(code)found(code)}else if(err&&!(err instanceof ZXing.NotFoundException))diag.textContent='Decoder error: '+(err.message||err)};try{const constraints={audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}}};controls=await reader.decodeFromConstraints(constraints,video,onDecode)}catch(primaryError){diag.textContent='Rear-camera mode fallback…';controls=await reader.decodeFromVideoDevice(null,video,onDecode)}const tr=video.srcObject&&video.srcObject.getVideoTracks()[0],st=tr&&tr.getSettings?tr.getSettings():{};status.textContent='SCANNING — hold barcode inside the box';diag.textContent='ZXing continuous • rear camera • '+(st.width||'?')+'×'+(st.height||'?')}catch(e){status.textContent='Scanner could not start';diag.textContent=(e.name?e.name+': ':'')+(e.message||e)}}
function stopCamera(){try{if(controls&&controls.stop)controls.stop()}catch(e){}controls=null;try{if(reader&&reader.reset)reader.reset()}catch(e){}reader=null;const v=$('#video');if(v&&v.srcObject){v.srcObject.getTracks().forEach(t=>t.stop());v.srcObject=null}}
$('#stopAndCurrent').onclick=()=>go('current');$('#useManual').onclick=()=>{const v=$('#manualBarcode').value.trim();if(v)found(v)};
function lookupBarcode(code){let p=parts.find(x=>x.barcode===code);if(!p&&/^\d{13}$/.test(code))p=parts.find(x=>x.barcode===code.slice(0,12));return p||null}
function found(code){if(!code)return;if(navigator.vibrate)navigator.vibrate(80);stopCamera();activePart=lookupBarcode(String(code).trim());$('#itemBarcode').textContent=code;$('#itemPart').textContent=activePart?activePart.part:'NOT FOUND';$('#itemDesc').textContent=activePart?activePart.description:'Unmatched item';$('#itemSupplier').textContent=activePart?activePart.supplier:'—';$('#itemPrice').textContent=activePart&&Number.isFinite(activePart.price)?'$'+activePart.price.toFixed(2):'—';$('#qty').value=1;photoData='';$('#photoPreview').hidden=true;$('#photo').value='';const addedBox=$('#itemAddedBox');if(addedBox)addedBox.hidden=true;$('#addItem').hidden=false;go('item')}
$('#minus').onclick=()=>$('#qty').value=Math.max(1,(+$('#qty').value||1)-1);$('#plus').onclick=()=>$('#qty').value=(+$('#qty').value||1)+1;$('#photo').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{photoData=r.result;$('#photoPreview').src=photoData;$('#photoPreview').hidden=false};r.readAsDataURL(f)};
$('#addItem').onclick=async()=>{try{if(!current)current={id:Date.now(),name:`Scan ${new Date().toLocaleString()}`,created:new Date().toISOString(),items:[]};const barcode=$('#itemBarcode').textContent.trim(),q=Math.max(1,+$('#qty').value||1),p=activePart||{};if(!barcode){toast('NO BARCODE — item not added');return}let photoId='';if(photoData){try{photoId=await putPhoto(photoData)}catch(e){console.error('Photo storage error',e);alert('PHOTO STORAGE ERROR — item was not added.');return}}let ex=current.items.find(x=>x.barcode===barcode&&!photoId&&!x.photoId&&!x.photo);if(ex)ex.qty+=q;else current.items.push({barcode,qty:q,part:p.part||'',description:p.description||'Unmatched item',supplier:p.supplier||'',price:p.price||0,photoId,added:new Date().toISOString()});const verified=current.items.some(x=>x.barcode===barcode);if(!verified){toast('ITEM WAS NOT ADDED');return}const stored=safePersist();const label=(p.part||barcode);$('#itemAddedSummary').innerHTML='<b>'+esc(label)+'</b><br>Quantity '+q+' added to Current Scan'+(photoId?'<br>Photo attached ✓':'')+(stored?'':'<br><b>Warning: scan data could not be saved locally.</b>');const box=$('#itemAddedBox');box.hidden=false;box.style.display='block';$('#addItem').hidden=true;requestAnimationFrame(()=>box.scrollIntoView({behavior:'smooth',block:'start'}));toast('ITEM ADDED TO SCAN ✓')}catch(e){console.error(e);alert('ADD TO SCAN ERROR\n'+(e.message||e))}};$('#scanAnotherItem').onclick=()=>scannerNow(false);$('#currentAfterItem').onclick=()=>go('current');$('#saveAfterItem').onclick=openSaveScreen;
async function renderCurrent(){const d=$('#currentList');if(!current){d.innerHTML='<p>No current scan.</p>';return}d.innerHTML=`<div class="card"><b>${esc(current.name)}</b><br><small>${current.items.length} item line(s)</small></div>`+current.items.map((x,i)=>`<div class="row scanRow"><span class="photoSlot" data-photo-index="${i}"></span><div class="grow"><b>${esc(x.part||x.barcode)}</b><br>${esc(x.description||'')}<br><small>${esc(x.barcode)} • Qty ${x.qty}</small></div><div class="stackBtns"><button onclick="editCurrentItem(${i})">EDIT</button><button class="danger" onclick="removeItem(${i})">REMOVE</button></div></div>`).join('');for(let i=0;i<current.items.length;i++){const x=current.items[i],slot=d.querySelector(`[data-photo-index="${i}"]`);let src=x.photo||'';if(!src&&x.photoId)try{src=await getPhoto(x.photoId)}catch(e){}if(src&&slot){slot.innerHTML=`<button type="button" class="thumbButton" aria-label="Open item photo"><img class="thumb" src="${src}" alt="Item photo"></button>`;const b=slot.querySelector('.thumbButton');if(b)b.addEventListener('click',()=>viewPhoto(i))}}}
let editCurrentIndex=-1,editCurrentPhotoData='';
window.editCurrentItem=async i=>{const x=current&&current.items[i];if(!x)return;editCurrentIndex=i;editCurrentPhotoData='';$('#editCurrentTitle').textContent=x.part||x.barcode;$('#editCurrentDesc').textContent=x.description||'';$('#editCurrentQty').value=Math.max(1,Number(x.qty)||1);$('#editCurrentPhoto').value='';$('#editCurrentMsg').textContent='';let src=x.photo||'';if(!src&&x.photoId)try{src=await getPhoto(x.photoId)}catch(e){};$('#editCurrentPreview').hidden=!src;$('#editCurrentPreview').src=src||'';go('editcurrentitem')};
$('#editCurrentPhoto').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{editCurrentPhotoData=r.result;$('#editCurrentPreview').src=editCurrentPhotoData;$('#editCurrentPreview').hidden=false};r.readAsDataURL(f)};
$('#saveCurrentItemEdit').onclick=async()=>{const x=current&&current.items[editCurrentIndex];if(!x){toast('Item not found');return}x.qty=Math.max(1,Number($('#editCurrentQty').value)||1);if(editCurrentPhotoData){let newId='';try{newId=await putPhoto(editCurrentPhotoData)}catch(e){$('#editCurrentMsg').textContent='Photo could not be saved.';return}const oldId=x.photoId;x.photoId=newId;delete x.photo;if(oldId)await deletePhoto(oldId)}safePersist();toast('ITEM UPDATED ✓');go('current')};
window.viewPhoto=async i=>{const x=current&&current.items[i];if(!x)return;let src=x.photo||'';if(!src&&x.photoId)try{src=await getPhoto(x.photoId)}catch(e){console.error('Photo read failed',e)};if(!src){toast('PHOTO NOT AVAILABLE');return}const viewer=$('#photoViewer'),img=$('#largePhoto');img.src=src;viewer.hidden=false;viewer.style.display='flex'};function closePhotoViewer(){const viewer=$('#photoViewer'),img=$('#largePhoto');viewer.hidden=true;viewer.style.display='none';img.src=''}$('#closePhotoViewer').onclick=closePhotoViewer;$('#photoViewer').onclick=e=>{if(e.target===$('#photoViewer'))closePhotoViewer()};window.removeItem=async i=>{const x=current.items[i];if(x&&x.photoId)await deletePhoto(x.photoId);current.items.splice(i,1);safePersist();renderCurrent()};function openSaveScreen(){if(!current){toast('Nothing to save');return}$('#saveName').value=current.name||'';go('saveconfirm')}$('#saveSession').onclick=openSaveScreen;$('#saveAfterAdd').onclick=openSaveScreen;
$('#confirmSave').onclick=()=>{if(!current){toast('Nothing to save');return}if(!current.items||!current.items.length){toast('Add an item before saving');return}current.name=$('#saveName').value.trim()||current.name;current.savedAt=new Date().toISOString();const copy=JSON.parse(JSON.stringify(current));const i=saved.findIndex(x=>x.id===current.id);if(i>=0)saved[i]=copy;else saved.unshift(copy);if(!safePersist()){toast('SCAN SAVE FAILED — storage error');return}const total=current.items.reduce((n,x)=>n+(+x.qty||0),0);$('#savedSummary').innerHTML=`<b>${esc(current.name)}</b><br><br>Items: <b>${current.items.length}</b><br>Total Quantity: <b>${total}</b><br><small>Saved ${new Date(current.savedAt).toLocaleString()}</small>`;go('savedconfirm');toast('SCAN SAVED ✓');setTimeout(()=>alert('SCAN SAVED ✓\n'+current.name+'\n'+current.items.length+' item line(s) • Total quantity '+total),80)};$('#viewSavedAfterSave').onclick=()=>go('current');
function renderSaved(){const d=$('#savedList');d.innerHTML=saved.length?saved.map((s,i)=>{const hasPhoto=(s.items||[]).some(x=>x.photoId||x.photo);return `<div class="row scanRow"><div class="grow"><b>${esc(s.name)}</b>${hasPhoto?' <small>📷</small>':''}<br><small>${s.items.length} line(s) • ${new Date(s.savedAt||s.created).toLocaleString()}</small></div><div class="stackBtns"><button onclick="openSaved(${i})">OPEN</button><button class="danger" onclick="deleteSaved(${i})">DELETE</button></div></div>`}).join(''):'<p>No saved scans.</p>'}window.openSaved=i=>{current=JSON.parse(JSON.stringify(saved[i]));persist();go('current')};window.deleteSaved=async i=>{const s=saved[i];if(!s)return;if(!confirm(`Delete saved scan “${s.name}”? This cannot be undone.`))return;for(const x of (s.items||[]))if(x.photoId)await deletePhoto(x.photoId);saved.splice(i,1);safePersist();renderSaved();toast('SAVED SCAN REMOVED')};
function renderDataStatus(){const meta=JSON.parse(localStorage.getItem('partsMeta')||'null');$('#partsStatus').textContent=meta?`${meta.name} • ${meta.count} parts loaded • ${new Date(meta.loaded).toLocaleString()}`:'No parts file loaded yet.'}
$('#partsFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;$('#partsStatus').textContent='Reading '+f.name+'…';try{const wb=XLSX.read(await f.arrayBuffer(),{type:'array'}),ws=wb.Sheets[wb.SheetNames[0]],rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});const out=[];for(let r=1;r<rows.length;r++){const a=rows[r];const barcode=String(a[4]??'').trim();if(!barcode)continue;out.push({part:String(a[1]??'').trim(),supplier:String(a[2]??'').trim(),barcode,description:String(a[6]??'').trim(),price:Number(a[10])||0})}parts=out;localStorage.setItem('partsIndex',JSON.stringify(parts));localStorage.setItem('partsMeta',JSON.stringify({name:f.name,count:parts.length,loaded:new Date().toISOString()}));renderDataStatus();toast(parts.length+' parts loaded')}catch(err){$('#partsStatus').textContent='Could not read file: '+err.message}};
$('#lomagFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;$('#lomagStatus').textContent='Reading '+f.name+'…';try{const wb=XLSX.read(await f.arrayBuffer(),{type:'array'}),ws=wb.Sheets[wb.SheetNames[0]],rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});if(!rows.length)throw Error('File is empty');const headers=rows[0].map(x=>String(x).toLowerCase().trim()),bi=headers.findIndex(x=>x.includes('barcode')),qi=headers.findIndex(x=>x.includes('qty')||x.includes('quantity'));if(bi<0||qi<0)throw Error('Could not find Barcode and Quantity columns');const s={id:Date.now(),name:f.name.replace(/\.xlsx?$/i,''),created:new Date().toISOString(),source:'LoMag',items:[]};for(let r=1;r<rows.length;r++){const code=String(rows[r][bi]??'').trim(),qty=Number(rows[r][qi])||0;if(!code||qty<=0)continue;const p=lookupBarcode(code)||{};s.items.push({barcode:code,qty,part:p.part||'',description:p.description||'Unmatched item',supplier:p.supplier||'',price:p.price||0,photo:'',added:new Date().toISOString()})}s.savedAt=new Date().toISOString();saved.unshift(s);localStorage.setItem('savedScans',JSON.stringify(saved));$('#lomagStatus').textContent=`${f.name} • ${s.items.length} item line(s) imported`;toast('LoMag scan imported')}catch(err){$('#lomagStatus').textContent='Could not read file: '+err.message}};
$('#doPartSearch').onclick=()=>{const q=$('#partSearch').value.trim().toLowerCase(),d=$('#searchResults');if(!q){d.innerHTML='';return}const hits=parts.filter(p=>p.part.toLowerCase().includes(q)||p.description.toLowerCase().includes(q)||p.barcode.includes(q)).slice(0,50);d.innerHTML=hits.length?hits.map(p=>`<div class="card"><b>${esc(p.part)}</b><br>${esc(p.description)}<br><small>${esc(p.supplier)} • ${esc(p.barcode)}</small></div>`).join(''):'<p>No matches.</p>'};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js?v=1.38');

// ===== v1.5 Direct OneDrive connection =====
// Uses Microsoft identity platform + Microsoft Graph delegated permission.
// Least privilege: Files.ReadWrite.AppFolder. Stock Scan can only access its own app folder.
const OD_CLIENT_KEY = 'stockscan_onedrive_client_id';
const OD_SCOPES = ['Files.ReadWrite.AppFolder'];
let odMsal = null;
let odAccount = null;

function odEl(id){ return document.getElementById(id); }
function odStatus(msg){ const e=odEl('oneDriveStatus'); if(e) e.textContent=msg; }

async function initOneDrive(){
  const input=odEl('oneDriveClientId');
  const saved=localStorage.getItem(OD_CLIENT_KEY)||'';
  if(input) input.value=saved;
  if(!saved){ odStatus('OneDrive not configured. Paste the Microsoft client ID after the one-time setup.'); return; }
  if(typeof msal==='undefined'){ odStatus('Microsoft sign-in library did not load. Check internet connection.'); return; }
  try{
    odMsal = new msal.PublicClientApplication({auth:{clientId:saved,authority:'https://login.microsoftonline.com/common',redirectUri:window.location.origin+window.location.pathname},cache:{cacheLocation:'localStorage'}});
    if(odMsal.initialize) await odMsal.initialize();
    const result = await odMsal.handleRedirectPromise();
    if(result && result.account) odMsal.setActiveAccount(result.account);
    odAccount = odMsal.getActiveAccount() || odMsal.getAllAccounts()[0] || null;
    if(odAccount){ odMsal.setActiveAccount(odAccount); odStatus('Connected account: '+(odAccount.username||'Microsoft account')); }
    else odStatus('OneDrive setup saved. Tap CONNECT ONEDRIVE.');
  }catch(e){ odStatus('OneDrive setup error: '+(e.message||e)); }
}

async function odConnect(){
  if(!odMsal){ await initOneDrive(); }
  if(!odMsal) return;
  try{
    // Redirect is more reliable than popup for iPhone/Home Screen PWAs.
    await odMsal.loginRedirect({scopes:OD_SCOPES});
  }catch(e){ odStatus('Sign-in error: '+(e.message||e)); }
}

async function odToken(){
  if(!odMsal) await initOneDrive();
  odAccount = odMsal && (odMsal.getActiveAccount() || odMsal.getAllAccounts()[0]);
  if(!odAccount) throw new Error('Connect OneDrive first.');
  try{
    const r=await odMsal.acquireTokenSilent({account:odAccount,scopes:OD_SCOPES});
    return r.accessToken;
  }catch(e){
    await odMsal.acquireTokenRedirect({account:odAccount,scopes:OD_SCOPES});
    throw new Error('Opening Microsoft sign-in…');
  }
}

async function graphFetch(path, options={}){
  const token=await odToken();
  const headers=Object.assign({},options.headers||{}, {Authorization:'Bearer '+token});
  return fetch('https://graph.microsoft.com/v1.0'+path,Object.assign({},options,{headers}));
}

async function refreshPartsFromOneDrive(){
  odStatus('Connecting to OneDrive and looking for export.xls…');
  try{
    // approot is the private OneDrive app folder granted to this application.
    const r=await graphFetch('/me/drive/special/approot:/export.xls:/content');
    if(!r.ok){
      if(r.status===404) throw new Error('export.xls was not found in the Stock Scan OneDrive app folder.');
      throw new Error('OneDrive returned '+r.status+'.');
    }
    const buf=await r.arrayBuffer();
    const wb=XLSX.read(buf,{type:'array'});
    const ws=wb.Sheets['Stocks'] || wb.Sheets[wb.SheetNames[0]];
    const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
    const parts=[];
    for(let i=1;i<rows.length;i++){
      const row=rows[i]||[];
      const part=String(row[1]??'').trim();
      const supplier=String(row[2]??'').trim();
      const barcode=String(row[4]??'').trim();
      const description=String(row[6]??'').trim();
      const price=Number(row[10]||0);
      if(part||barcode||description) parts.push({part,supplier,barcode,description,price});
    }
    if(!parts.length) throw new Error('export.xls opened but no Stocks rows were found.');
    localStorage.setItem('partsIndex',JSON.stringify(parts));
    localStorage.setItem('partsMeta',JSON.stringify({name:'OneDrive export.xls',count:parts.length,loaded:new Date().toISOString(),source:'OneDrive'}));
    odStatus('OneDrive export.xls loaded: '+parts.length+' parts. Reloading app…');
    setTimeout(()=>location.reload(),700);
  }catch(e){ odStatus(e.message||String(e)); }
}

function wireOneDrive(){
  const save=odEl('saveOneDriveSetup'); if(save) save.addEventListener('click',async()=>{ const v=(odEl('oneDriveClientId').value||'').trim(); if(!v){odStatus('Enter the Microsoft Application (client) ID first.');return;} localStorage.setItem(OD_CLIENT_KEY,v); odStatus('OneDrive setup saved. Initialising…'); await initOneDrive(); });
  const con=odEl('connectOneDrive'); if(con) con.addEventListener('click',odConnect);
  const dis=odEl('disconnectOneDrive'); if(dis) dis.addEventListener('click',async()=>{ try{ if(odMsal && (odMsal.getActiveAccount()||odMsal.getAllAccounts()[0])) await odMsal.logoutRedirect({account:odMsal.getActiveAccount()||odMsal.getAllAccounts()[0],postLogoutRedirectUri:window.location.origin+window.location.pathname}); }catch(e){odStatus('Disconnect error: '+(e.message||e));} });
  const ref=odEl('refreshOneDriveParts'); if(ref) ref.addEventListener('click',refreshPartsFromOneDrive);
  initOneDrive();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wireOneDrive); else wireOneDrive();

// v1.7 Stocktake foundation. Minimum quantities are user data stored separately from MechanicDesk parts.
let stockCfg=JSON.parse(localStorage.getItem('stocktakeConfig')||'{}');
function saveStockCfg(){localStorage.setItem('stocktakeConfig',JSON.stringify(stockCfg))}
function stockKey(p){return String(p.barcode||p.part||'').trim()}
function renderStocktake(filter=''){
 const d=$('#stocktakeList'); if(!d)return;
 const q=String(filter||$('#stocktakeSearch')?.value||'').trim().toLowerCase();
 let list=parts.filter(p=>!q||String(p.part).toLowerCase().includes(q)||String(p.description).toLowerCase().includes(q)||String(p.barcode).includes(q));
 if(!parts.length){d.innerHTML='<div class="card">Load your MechanicDesk export.xls in <b>DATA FILES</b> first.</div>';$('#stocktakeOrderSummary').innerHTML='';return}
 if(!q) list=list.filter(p=>stockCfg[stockKey(p)]?.selected).slice(0,200); else list=list.slice(0,80);
 d.innerHTML=list.length?list.map(p=>{const k=stockKey(p),c=stockCfg[k]||{},min=Number(c.min)||0,actual=(c.actual===''||c.actual==null)?'':Number(c.actual),order=actual===''?0:Math.max(0,min-actual);return `<div class="card stockItem"><label class="checkLine"><input type="checkbox" ${c.selected?'checked':''} onchange="stockChange('${encodeURIComponent(k)}','selected',this.checked)"><span><b>${esc(p.part||p.barcode)}</b><br>${esc(p.description||'')}<br><small>${esc(p.supplier||'')} • ${esc(p.barcode||'')}</small></span></label><div class="stockNums"><label>Minimum<input type="number" min="0" value="${min}" onchange="stockChange('${encodeURIComponent(k)}','min',this.value)"></label><label>Actual<input type="number" min="0" value="${actual}" placeholder="Count" onchange="stockChange('${encodeURIComponent(k)}','actual',this.value)"></label><div><small>ORDER</small><b>${order}</b></div></div></div>`}).join(''):'<div class="card">No selected stocktake items yet. Search above, then tick the parts you want to check.</div>';
 renderStockOrderSummary();
}
window.stockChange=(ek,field,value)=>{const k=decodeURIComponent(ek);stockCfg[k]=stockCfg[k]||{};stockCfg[k][field]=field==='selected'?!!value:(value===''?'':Math.max(0,Number(value)||0));saveStockCfg();renderStocktake()};
$('#stocktakeFind').onclick=()=>renderStocktake($('#stocktakeSearch').value);
function getStockOrders(){return parts.map(p=>{const c=stockCfg[stockKey(p)]||{};const min=Number(c.min)||0,actual=(c.actual===''||c.actual==null)?null:Number(c.actual);return {p,c,min,actual,order:actual==null?0:Math.max(0,min-actual)}}).filter(x=>x.c.selected&&x.actual!=null&&x.order>0)}
function renderStockOrderSummary(){const el=$('#stocktakeOrderSummary');if(!el)return;const o=getStockOrders();el.innerHTML=o.length?`<div class="card"><b>${o.length} item(s) below minimum</b><br><small>Total units to order: ${o.reduce((n,x)=>n+x.order,0)}</small></div>`:'<div class="card"><small>No shortages calculated yet.</small></div>'}
$('#createStocktakeOrder').onclick=()=>{const o=getStockOrders();if(!o.length){toast('No items below minimum');return}const by={};o.forEach(x=>{const s=x.p.supplier||'No Supplier';(by[s]??=[]).push(x)});$('#stocktakeOrderSummary').innerHTML='<div class="successBanner"><div class="successTick">✓</div><h2>ORDER LIST CREATED</h2></div>'+Object.entries(by).map(([sup,a])=>`<div class="card"><b>${esc(sup)}</b>${a.map(x=>`<div class="orderLine"><span>${esc(x.p.part||x.p.barcode)}<br><small>${esc(x.p.description||'')}</small></span><b>Qty ${x.order}</b></div>`).join('')}</div>`).join('');toast('ORDER LIST CREATED ✓')};

// ===== v1.20 local UI/data foundation: login, users, sections and result-field permissions =====
// This is intentionally device-local for prototype testing. Production employee security will be backend-enforced.
const AUTH_KEY='stockscan_auth_v117', USERS_KEY='stockscan_users_v117', SECTIONS_KEY='stockscan_sections_v117';
const SEARCH_FIELDS=['Part Number','Description','Photo','Barcode','Quantity','Location','Category','Buy Price','Sell Price','Supplier','Minimum Qty','Maximum Qty','Stock History'];
let sessionUser=null;
function readJ(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
function writeJ(k,v){localStorage.setItem(k,JSON.stringify(v))}
async function hashPass(v){const b=new TextEncoder().encode(v);const h=await crypto.subtle.digest('SHA-256',b);return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function authState(){return readJ(AUTH_KEY,null)}
function showLogin(){stopCamera();$$('.screen').forEach(x=>x.classList.remove('active'));$('#login').classList.add('active');const exists=!!authState();$('#firstRun').hidden=exists;$('#loginBox').hidden=!exists;$('#loginMsg').textContent=''}
async function createFirstAdmin(){const u=$('#setupUser').value.trim(),p=$('#setupPass').value;if(!u||p.length<4){toast('Enter username and password');return}const passHash=await hashPass(p);writeJ(AUTH_KEY,{created:true});writeJ(SECTIONS_KEY,[{id:'home',name:'Home',sells:false},{id:'work',name:'Work',sells:true}]);writeJ(USERS_KEY,[{id:'u-'+Date.now(),username:u,role:'admin',passHash,sections:['home','work'],fields:[...SEARCH_FIELDS]}]);$('#setupPass').value='';showLogin();toast('ADMIN CREATED ✓')}
async function doLogin(){const u=$('#loginUser').value.trim(),p=$('#loginPass').value,users=readJ(USERS_KEY,[]),h=await hashPass(p);const hit=users.find(x=>x.username.toLowerCase()===u.toLowerCase()&&x.passHash===h);if(!hit||hit.enabled===false){$('#loginMsg').textContent='Username or password is incorrect.';return}sessionUser=hit;$('#welcomeUser').textContent=hit.username+(hit.role==='admin'?' — Admin':'');$('#loginPass').value='';if(hit.mustChangePassword===true){$('#forcedNewPass').value='';$('#forcedConfirmPass').value='';$('#forcedPassMsg').textContent='';stopCamera();$$('.screen').forEach(x=>x.classList.remove('active'));$('#changepassword').classList.add('active');return}go('home')}
$('#saveForcedPassword').onclick=async()=>{if(!sessionUser)return showLogin();const p=$('#forcedNewPass').value,c=$('#forcedConfirmPass').value;if(p.length<4){$('#forcedPassMsg').textContent='Password must be at least 4 characters.';return}if(p!==c){$('#forcedPassMsg').textContent='Passwords do not match.';return}const users=readJ(USERS_KEY,[]),idx=users.findIndex(u=>u.id===sessionUser.id);if(idx<0)return showLogin();users[idx]={...users[idx],passHash:await hashPass(p),mustChangePassword:false};writeJ(USERS_KEY,users);sessionUser=users[idx];$('#forcedNewPass').value='';$('#forcedConfirmPass').value='';toast('PASSWORD CHANGED ✓');go('home')};
function logout(){sessionUser=null;showLogin()}
function renderSectionChecks(){const d=$('#sectionChecks');if(!d)return;const secs=readJ(SECTIONS_KEY,[]);d.innerHTML='<b>Section access</b>'+secs.map(s=>`<label class="sectionPerm"><input type="checkbox" class="newUserSection" value="${esc(s.id)}"><span>${esc(s.name)}</span></label>`).join('')}
function renderFieldChecks(){const d=$('#fieldChecks');if(!d)return;d.innerHTML=SEARCH_FIELDS.map(f=>`<label><input type="checkbox" class="newUserField" value="${esc(f)}" checked><span>${esc(f)}</span></label>`).join('')}
function renderUsers(){const d=$('#userList');if(!d)return;const users=readJ(USERS_KEY,[]),secs=readJ(SECTIONS_KEY,[]);d.innerHTML=users.map(u=>`<div class="card"><b>${esc(u.username)}</b> <span class="pill">${esc(u.role)}</span> ${u.enabled===false?'<span class="pill">DISABLED</span>':''}<br><small>Sections: ${esc((u.sections||[]).map(id=>secs.find(s=>s.id===id)?.name||id).join(', ')||'None')}</small><br><small>Find Part fields: ${esc((u.fields||[]).join(', ')||'None')}</small><button class="editUserBtn secondary" data-user-id="${esc(u.id)}">EDIT USER</button></div>`).join('');$$('.editUserBtn').forEach(b=>b.onclick=()=>openEditUser(b.dataset.userId))}

function renderEditChecks(user){
  const secs=readJ(SECTIONS_KEY,[]), selected=new Set(user.sections||[]), fields=new Set(user.fields||[]);
  $('#editSectionChecks').innerHTML='<b>Section access</b>'+secs.map(sec=>`<label class="sectionPerm"><input type="checkbox" class="editUserSection" value="${esc(sec.id)}" ${selected.has(sec.id)?'checked':''}><span>${esc(sec.name)}</span></label>`).join('');
  $('#editFieldChecks').innerHTML=SEARCH_FIELDS.map(f=>`<label><input type="checkbox" class="editUserField" value="${esc(f)}" ${fields.has(f)?'checked':''}><span>${esc(f)}</span></label>`).join('');
}
function openEditUser(id){
  const user=readJ(USERS_KEY,[]).find(u=>u.id===id);if(!user){toast('User not found');return}
  $('#editUserId').value=user.id;$('#editUsername').value=user.username;$('#editRole').value=user.role;$('#editEnabled').checked=user.enabled!==false;$('#editUserTitle').textContent='EDIT USER - '+user.username;$('#editUserMsg').textContent='';$('#resetTempPassword').value='';$('#resetTempPasswordConfirm').value='';renderEditChecks(user);go('edituser');
}
$('#saveUserChanges').onclick=()=>{
  const id=$('#editUserId').value,users=readJ(USERS_KEY,[]),idx=users.findIndex(u=>u.id===id);if(idx<0){toast('User not found');return}
  const role=$('#editRole').value,enabled=$('#editEnabled').checked;
  const otherActiveAdmins=users.filter((u,i)=>i!==idx&&u.role==='admin'&&u.enabled!==false).length;
  if(users[idx].role==='admin'&&users[idx].enabled!==false&&(role!=='admin'||!enabled)&&otherActiveAdmins===0){$('#editUserMsg').textContent='Keep at least one enabled Admin account.';return}
  users[idx]={...users[idx],role,enabled,sections:[...$$('.editUserSection:checked')].map(x=>x.value),fields:[...$$('.editUserField:checked')].map(x=>x.value)};
  writeJ(USERS_KEY,users);if(sessionUser?.id===id)sessionUser=users[idx];$('#editUserMsg').textContent='Permissions saved.';renderUsers();toast('USER PERMISSIONS UPDATED ✓');go('users');
};

$('#resetUserPassword').onclick=async()=>{
 const id=$('#editUserId').value,p=$('#resetTempPassword').value,c=$('#resetTempPasswordConfirm').value;
 if(p.length<4){$('#editUserMsg').textContent='Temporary password must be at least 4 characters.';return}
 if(p!==c){$('#editUserMsg').textContent='Temporary passwords do not match.';return}
 const users=readJ(USERS_KEY,[]),idx=users.findIndex(u=>u.id===id);if(idx<0){toast('User not found');return}
 users[idx]={...users[idx],passHash:await hashPass(p),mustChangePassword:true,enabled:true};writeJ(USERS_KEY,users);
 $('#resetTempPassword').value='';$('#resetTempPasswordConfirm').value='';$('#editUserMsg').textContent='Temporary password reset. User must change it at next login.';toast('PASSWORD RESET ✓');
};

$('#deleteUser').onclick=()=>{
  const id=$('#editUserId').value,users=readJ(USERS_KEY,[]),idx=users.findIndex(u=>u.id===id);
  if(idx<0){toast('User not found');return}
  const target=users[idx];
  if(sessionUser?.id===id){$('#editUserMsg').textContent='You cannot delete the account you are currently using.';return}
  const otherActiveAdmins=users.filter((u,i)=>i!==idx&&u.role==='admin'&&u.enabled!==false).length;
  if(target.role==='admin'&&target.enabled!==false&&otherActiveAdmins===0){$('#editUserMsg').textContent='Keep at least one enabled Admin account.';return}
  if(!confirm(`Delete user "${target.username}"?\n\nThis removes their Stock Scan login from this device prototype.`))return;
  users.splice(idx,1);writeJ(USERS_KEY,users);renderUsers();toast('USER DELETED ✓');go('users');
};

function renderSections(){const d=$('#sectionList');if(!d)return;const secs=readJ(SECTIONS_KEY,[]);d.innerHTML=secs.map(s=>`<div class="card"><b>${esc(s.name)}</b><br><small>${s.sells?'Sells parts — Buy and Sell prices available':'Does not sell parts — Sell price not required'}</small></div>`).join('')}
function setupAdminScreens(){renderSectionChecks();renderFieldChecks();renderUsers();renderSections()}
$('#createAdmin').onclick=createFirstAdmin;$('#loginBtn').onclick=doLogin;$('#logoutBtn').onclick=logout;
$('#createSection').onclick=()=>{const name=$('#newSectionName').value.trim();if(!name){toast('Enter section name');return}const secs=readJ(SECTIONS_KEY,[]);if(secs.some(s=>s.name.toLowerCase()===name.toLowerCase())){toast('Section already exists');return}const id=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+Date.now().toString(36);secs.push({id,name,sells:$('#sectionSells').checked});writeJ(SECTIONS_KEY,secs);$('#newSectionName').value='';$('#sectionSells').checked=false;setupAdminScreens();toast('SECTION CREATED ✓')};
$('#createUser').onclick=async()=>{const name=$('#newUsername').value.trim(),temp=$('#newTempPassword').value;if(!name){$('#userMsg').textContent='Enter a username.';return}if(temp.length<4){$('#userMsg').textContent='Enter a temporary password of at least 4 characters.';return}const users=readJ(USERS_KEY,[]);if(users.some(u=>u.username.toLowerCase()===name.toLowerCase())){$('#userMsg').textContent='That username already exists.';return}const passHash=await hashPass(temp);const sections=[...$$('.newUserSection:checked')].map(x=>x.value),fields=[...$$('.newUserField:checked')].map(x=>x.value);users.push({id:'u-'+Date.now(),username:name,role:$('#newRole').value,passHash,sections,fields,mustChangePassword:true,enabled:true});writeJ(USERS_KEY,users);$('#newUsername').value='';$('#newTempPassword').value='';$('#userMsg').textContent='User created. They must change the temporary password at first login.';renderUsers();toast('USER CREATED ✓')};
// Refresh admin screens whenever their pages are opened.
const oldGo=go;go=function(id){if(sessionUser?.mustChangePassword===true&&id!=='changepassword'&&id!=='login'){oldGo('changepassword');return}if((id==='users'||id==='sections'||id==='edituser'||id==='adminsettings'||id==='reviewedparts'||id==='editreviewedpart')&&sessionUser?.role!=='admin'){toast('Admin access required');return}oldGo(id);if(id==='users'||id==='sections'||id==='adminsettings')setupAdminScreens();if(id==='pendingparts')renderPendingParts();if(id==='reviewedparts')renderReviewedParts();if(id==='home'){updatePendingBadge();const rb=$('#homeReviewedBtn');if(rb)rb.hidden=sessionUser?.role!=='admin'}};
const APP_VERSION='1.38';

// ===== v1.29 Add Part -> Pending Admin Approval foundation =====
const PENDING_PARTS_KEY='stockscan_pending_parts_v129', APPROVED_PARTS_KEY='stockscan_approved_parts_v129';
let requestPhotoData='',reviewRequestId=null;
function pendingParts(){return readJ(PENDING_PARTS_KEY,[])}
function savePending(v){writeJ(PENDING_PARTS_KEY,v);updatePendingBadge()}
function allowedSectionsForUser(){
 const secs=readJ(SECTIONS_KEY,[]);
 if(sessionUser?.role==='admin')return secs;
 const allowed=new Set(sessionUser?.sections||[]);
 return secs.filter(s=>allowed.has(s.id));
}
function prepareAddPart(){
 const sel=$('#requestSection'),secs=allowedSectionsForUser();
 sel.innerHTML=secs.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('');
 $('#requestDescription').value='';$('#requestBarcode').value='';$('#requestPartNo').value='';$('#requestCategory').value='';$('#requestLocation').value='';
 $('#requestPhoto').value='';$('#requestPhotoPreview').hidden=true;$('#requestPhotoPreview').removeAttribute('src');$('#requestMsg').textContent='';requestPhotoData='';
}
$('#requestPhoto').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{requestPhotoData=r.result;$('#requestPhotoPreview').src=requestPhotoData;$('#requestPhotoPreview').hidden=false};r.readAsDataURL(f)};
$('#submitPartRequest').onclick=async()=>{
 if(!sessionUser){showLogin();return}
 const description=$('#requestDescription').value.trim(),sectionId=$('#requestSection').value;
 if(!description){$('#requestMsg').textContent='Description is required.';return}
 if(!requestPhotoData){$('#requestMsg').textContent='A photo is required.';return}
 let photoId='';try{photoId=await putPhoto(requestPhotoData)}catch(e){$('#requestMsg').textContent='Photo could not be saved.';return}
 const req={id:'pr-'+Date.now(),status:'pending',submittedByUserId:sessionUser.id,submittedByUsername:sessionUser.username,submittedAt:new Date().toISOString(),sectionId,
 description,photoId,barcode:$('#requestBarcode').value.trim(),suggestedPartNo:$('#requestPartNo').value.trim(),category:$('#requestCategory').value.trim(),location:$('#requestLocation').value.trim()};
 const p=pendingParts();p.unshift(req);savePending(p);toast('PART SENT FOR ADMIN REVIEW ✓');go('home');
};
function updatePendingBadge(){
 const b=$('#homePendingBtn'),t=$('#pendingHomeText');if(!b)return;
 const all=pendingParts().filter(x=>x.status==='pending'),mine=all.filter(x=>x.submittedByUserId===sessionUser?.id),n=sessionUser?.role==='admin'?all.length:mine.length;
 b.hidden=n===0;if(t)t.textContent=n?`${n} part${n===1?'':'s'} waiting for review`:'No parts waiting for review';
}
async function renderPendingParts(){
 const d=$('#pendingPartsList');if(!d)return;const secs=readJ(SECTIONS_KEY,[]),all=pendingParts().filter(x=>x.status==='pending');
 const p=sessionUser?.role==='admin'?all:all.filter(x=>x.submittedByUserId===sessionUser?.id);
 if(!p.length){d.innerHTML='<div class="card">✓ No parts waiting for review.</div>';return}
 d.innerHTML=p.map(x=>`<div class="card pendingCard" data-pending-id="${esc(x.id)}"><div class="pendingSummary"><span class="pendingThumbSlot"></span><div class="grow"><b>${esc(x.description)}</b><br><small>Submitted by: ${esc(x.submittedByUsername)}<br>Submitted: ${new Date(x.submittedAt).toLocaleString()}<br>Section: ${esc(secs.find(s=>s.id===x.sectionId)?.name||x.sectionId)}</small></div></div><button onclick="reviewPendingPart('${x.id}')">${sessionUser?.role==='admin'?'REVIEW':'VIEW / EDIT'}</button></div>`).join('');
 for(const x of p){if(!x.photoId)continue;try{const src=await getPhoto(x.photoId),card=d.querySelector(`[data-pending-id="${CSS.escape(x.id)}"] .pendingThumbSlot`);if(src&&card)card.innerHTML=`<img class="pendingThumb" src="${src}" alt="Part photo">`}catch(e){}}
}
window.reviewPendingPart=async id=>{
 const x=pendingParts().find(v=>v.id===id);if(!x)return;
 const own=x.submittedByUserId===sessionUser?.id,isAdmin=sessionUser?.role==='admin';if(!isAdmin&&!own){toast('You can only view your own pending parts.');return}
 reviewRequestId=id;const secs=isAdmin?readJ(SECTIONS_KEY,[]):allowedSectionsForUser();
 let src='';if(x.photoId)try{src=await getPhoto(x.photoId)}catch(e){}
 $('#reviewPartBody').innerHTML=`<div class="card">${src?`<img id="pendingEditPreview" class="preview" src="${src}" alt="Submitted part photo">`:'<img id="pendingEditPreview" class="preview" hidden alt="Submitted part photo">'}<div class="kv"><b>Submitted by</b><span>${esc(x.submittedByUsername)}</span><b>Submitted</b><span>${new Date(x.submittedAt).toLocaleString()}</span></div><label>Description *<input id="pendingEditDescription" value="${esc(x.description)}"></label><label class="photoBtn">CHANGE PHOTO<input id="pendingEditPhoto" type="file" accept="image/*" capture="environment" hidden></label><label>Barcode<input id="pendingEditBarcode" value="${esc(x.barcode||'')}"></label><label>Suggested Part No<input id="pendingEditPartNo" value="${esc(x.suggestedPartNo||'')}"></label><label>Category<input id="pendingEditCategory" value="${esc(x.category||'')}"></label><label>Location<input id="pendingEditLocation" value="${esc(x.location||'')}"></label><div id="pendingEditMsg" class="small"></div></div>`;
 const reviewSectionLabel=$('#reviewSection')?.closest('label');
 if(reviewSectionLabel)reviewSectionLabel.hidden=!isAdmin;
 $('#reviewSection').innerHTML=secs.map(s=>`<option value="${esc(s.id)}" ${s.id===x.sectionId?'selected':''}>${esc(s.name)}</option>`).join('');
 $('#reviewSection').disabled=!isAdmin;
 const approveBtn=$('#approvePartRequest'),rejectBtn=$('#rejectPartRequest');
 if(approveBtn){approveBtn.hidden=!isAdmin;approveBtn.style.display=isAdmin?'':'none'}
 if(rejectBtn){rejectBtn.hidden=!isAdmin;rejectBtn.style.display=isAdmin?'':'none'}
 let save=$('#saveOwnPending'),del=$('#deleteOwnPending');
 if(!save){save=document.createElement('button');save.id='saveOwnPending';$('#reviewPartBody').after(save)}
 if(!del){del=document.createElement('button');del.id='deleteOwnPending';del.className='danger';save.after(del)}
 save.hidden=false;save.textContent=isAdmin?'SAVE CHANGES':'SAVE CHANGES';
 del.hidden=isAdmin;del.textContent='DELETE PENDING PART';
 let newPhoto='';
 const photo=$('#pendingEditPhoto');if(photo)photo.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{newPhoto=r.result;const im=$('#pendingEditPreview');im.src=newPhoto;im.hidden=false};r.readAsDataURL(f)};
 save.onclick=async()=>{
   const p=pendingParts(),i=p.findIndex(v=>v.id===reviewRequestId);if(i<0)return;const y=p[i];
   if(!isAdmin&&y.submittedByUserId!==sessionUser?.id)return;
   const desc=$('#pendingEditDescription').value.trim();if(!desc){$('#pendingEditMsg').textContent='Description is required.';return}
   if(newPhoto){try{const nid=await putPhoto(newPhoto),old=y.photoId;y.photoId=nid;if(old)deletePhoto(old)}catch(e){$('#pendingEditMsg').textContent='Photo could not be saved.';return}}
   Object.assign(y,{description:desc,barcode:$('#pendingEditBarcode').value.trim(),suggestedPartNo:$('#pendingEditPartNo').value.trim(),category:$('#pendingEditCategory').value.trim(),location:$('#pendingEditLocation').value.trim(),lastEditedAt:new Date().toISOString(),lastEditedByUsername:sessionUser.username});
   if(isAdmin)y.sectionId=$('#reviewSection').value;
   savePending(p);toast('PENDING PART UPDATED ✓');go('pendingparts');
 };
 del.onclick=()=>{const p=pendingParts(),i=p.findIndex(v=>v.id===reviewRequestId);if(i<0||p[i].submittedByUserId!==sessionUser?.id)return;if(!confirm('Delete this pending part?'))return;const old=p[i].photoId;p.splice(i,1);savePending(p);if(old)deletePhoto(old);toast('PENDING PART DELETED');go('pendingparts')};
 go('reviewpart');
};
$('#approvePartRequest').onclick=()=>{
 if(sessionUser?.role!=='admin'||!reviewRequestId)return;
 const p=pendingParts(),i=p.findIndex(x=>x.id===reviewRequestId);if(i<0)return;
 const x=p[i];x.status='approved';x.sectionId=$('#reviewSection').value;x.approvedByUserId=sessionUser.id;x.approvedByUsername=sessionUser.username;x.approvedAt=new Date().toISOString();
 const a=readJ(APPROVED_PARTS_KEY,[]);a.unshift({...x});writeJ(APPROVED_PARTS_KEY,a);p.splice(i,1);savePending(p);toast('PART APPROVED ✓');renderPendingParts();go('pendingparts');
};
$('#rejectPartRequest').onclick=()=>{
 if(sessionUser?.role!=='admin'||!reviewRequestId)return;
 const p=pendingParts(),i=p.findIndex(x=>x.id===reviewRequestId);if(i<0)return;
 p[i].status='rejected';p[i].reviewedByUsername=sessionUser.username;p[i].reviewedAt=new Date().toISOString();
 const history=readJ(APPROVED_PARTS_KEY,[]);history.unshift({...p[i]});writeJ(APPROVED_PARTS_KEY,history);p.splice(i,1);savePending(p);toast('PART REJECTED');renderPendingParts();go('pendingparts');
};
$('#homeAddPartBtn').onclick=()=>{prepareAddPart();go('addpartrequest')};
$('#homePendingBtn').onclick=()=>{renderPendingParts();go('pendingparts')};


// ===== v1.34 Admin reviewed-part history =====
async function renderReviewedParts(){
 const d=$('#reviewedPartsList');if(!d)return;if(sessionUser?.role!=='admin'){d.innerHTML='';return}
 const status=$('#reviewedStatusFilter')?.value||'all',q=($('#reviewedSearch')?.value||'').trim().toLowerCase();
 let rows=readJ(APPROVED_PARTS_KEY,[]);
 if(status!=='all')rows=rows.filter(x=>x.status===status);
 if(q)rows=rows.filter(x=>[x.description,x.suggestedPartNo,x.barcode,x.submittedByUsername,x.approvedByUsername,x.reviewedByUsername].some(v=>String(v||'').toLowerCase().includes(q)));
 if(!rows.length){d.innerHTML='<div class="card">No reviewed parts found.</div>';return}
 const secs=readJ(SECTIONS_KEY,[]);
 d.innerHTML=rows.map(x=>`<div class="card reviewedCard" data-reviewed-id="${esc(x.id)}"><div class="pendingSummary"><span class="reviewedThumbSlot"></span><div class="grow"><b>${esc(x.description)}</b> <span class="pill">${esc((x.status||'').toUpperCase())}</span><br><small>Submitted by: ${esc(x.submittedByUsername||'—')}<br>Submitted: ${x.submittedAt?new Date(x.submittedAt).toLocaleString():'—'}<br>Section: ${esc(secs.find(s=>s.id===x.sectionId)?.name||x.sectionId||'—')}<br>${x.status==='approved'?`Approved by: ${esc(x.approvedByUsername||'—')}<br>Approved: ${x.approvedAt?new Date(x.approvedAt).toLocaleString():'—'}`:`Rejected by: ${esc(x.reviewedByUsername||'—')}<br>Rejected: ${x.reviewedAt?new Date(x.reviewedAt).toLocaleString():'—'}`}</small></div></div><button onclick="editReviewedPart('${x.id}')">RE-REVIEW / EDIT</button></div>`).join('');
 for(const x of rows){if(!x.photoId)continue;try{const src=await getPhoto(x.photoId),slot=d.querySelector(`[data-reviewed-id="${CSS.escape(x.id)}"] .reviewedThumbSlot`);if(src&&slot)slot.innerHTML=`<img class="pendingThumb" src="${src}" alt="Part photo">`}catch(e){}}
}

let editReviewedId=null,editReviewedPhotoData='';

function renderReviewAuditHistory(x){
 const d=$('#reviewAuditHistory');if(!d)return;
 const h=x.reviewHistory||[];
 if(!h.length){d.innerHTML='<div class="card"><b>Review History</b><br><small>No later review changes recorded yet.</small></div>';return}
 const labels={description:'Description',barcode:'Barcode',suggestedPartNo:'Part No',category:'Category',location:'Location',sectionId:'Section'};
 const secs=readJ(SECTIONS_KEY,[]);
 const val=(k,v)=>k==='sectionId'?(secs.find(s=>s.id===v)?.name||v||'—'):(v||'—');
 d.innerHTML=`<div class="card"><b>Review History</b>${h.map(e=>{
   const when=e.at?new Date(e.at).toLocaleString():'—',who=esc(e.byUsername||'—');
   if(e.action==='decision-change')return `<div class="auditEntry"><b>${esc(String(e.beforeStatus||'').toUpperCase())} → ${esc(String(e.afterStatus||'').toUpperCase())}</b><br><small>${when} by ${who}</small></div>`;
   const b=e.before||{},a=e.after||null;
   if(a){
     const rows=Object.keys(labels).filter(k=>String(b[k]??'')!==String(a[k]??'')).map(k=>`<div class="auditChange"><b>${labels[k]}</b><br><small>${esc(String(val(k,b[k])))} → ${esc(String(val(k,a[k])))}</small></div>`).join('');
     return `<div class="auditEntry"><b>Details edited</b><br><small>${when} by ${who}</small>${rows||'<div class="auditChange"><small>Photo or other record detail changed.</small></div>'}</div>`;
   }
   return `<div class="auditEntry"><b>Details edited</b><br><small>${when} by ${who}</small><div class="auditChange"><small>Earlier audit entry — previous values retained.</small></div></div>`;
 }).join('')}</div>`;
}
window.editReviewedPart=async id=>{
 if(sessionUser?.role!=='admin'){toast('Admin access required');return}
 const rows=readJ(APPROVED_PARTS_KEY,[]),x=rows.find(v=>v.id===id);if(!x)return;
 editReviewedId=id;editReviewedPhotoData='';
 const decisionBtn=$('#changeReviewedDecision');if(decisionBtn){decisionBtn.textContent=x.status==='approved'?'REJECT':'APPROVE';decisionBtn.className=x.status==='approved'?'danger':'';}
 let src='';if(x.photoId)try{src=await getPhoto(x.photoId)}catch(e){}
 $('#editReviewedBody').innerHTML=`<div class="card">${src?`<img id="editReviewedPreview" class="preview" src="${src}" alt="Part photo">`:'<img id="editReviewedPreview" class="preview" hidden alt="Part photo">'}<div class="kv"><b>Status</b><span>${esc((x.status||'').toUpperCase())}</span><b>Originally submitted by</b><span>${esc(x.submittedByUsername||'—')}</span><b>Submitted</b><span>${x.submittedAt?new Date(x.submittedAt).toLocaleString():'—'}</span></div><label>Description *<input id="editReviewedDescription" value="${esc(x.description||'')}"></label><label class="photoBtn">CHANGE PHOTO<input id="editReviewedPhoto" type="file" accept="image/*" capture="environment" hidden></label><label>Barcode<input id="editReviewedBarcode" value="${esc(x.barcode||'')}"></label><label>Suggested Part No<input id="editReviewedPartNo" value="${esc(x.suggestedPartNo||'')}"></label><label>Category<input id="editReviewedCategory" value="${esc(x.category||'')}"></label><label>Location<input id="editReviewedLocation" value="${esc(x.location||'')}"></label><div id="editReviewedMsg" class="small"></div></div>`;
 const secs=readJ(SECTIONS_KEY,[]);$('#editReviewedSection').innerHTML=secs.map(s=>`<option value="${esc(s.id)}" ${s.id===x.sectionId?'selected':''}>${esc(s.name)}</option>`).join('');
 renderReviewAuditHistory(x);
 const ph=$('#editReviewedPhoto');ph.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{editReviewedPhotoData=r.result;const im=$('#editReviewedPreview');im.src=editReviewedPhotoData;im.hidden=false};r.readAsDataURL(f)};
 go('editreviewedpart');
};
$('#saveReviewedChanges').onclick=async()=>{
 if(sessionUser?.role!=='admin'||!editReviewedId)return;
 const rows=readJ(APPROVED_PARTS_KEY,[]),i=rows.findIndex(v=>v.id===editReviewedId);if(i<0)return;const x=rows[i];
 const desc=$('#editReviewedDescription').value.trim();if(!desc){$('#editReviewedMsg').textContent='Description is required.';return}
 if(editReviewedPhotoData){try{const nid=await putPhoto(editReviewedPhotoData),old=x.photoId;x.photoId=nid;if(old)deletePhoto(old)}catch(e){$('#editReviewedMsg').textContent='Photo could not be saved.';return}}
 const before={description:x.description,barcode:x.barcode,suggestedPartNo:x.suggestedPartNo,category:x.category,location:x.location,sectionId:x.sectionId};
 Object.assign(x,{description:desc,barcode:$('#editReviewedBarcode').value.trim(),suggestedPartNo:$('#editReviewedPartNo').value.trim(),category:$('#editReviewedCategory').value.trim(),location:$('#editReviewedLocation').value.trim(),sectionId:$('#editReviewedSection').value,lastReReviewedAt:new Date().toISOString(),lastReReviewedByUserId:sessionUser.id,lastReReviewedByUsername:sessionUser.username});
 const after={description:x.description,barcode:x.barcode,suggestedPartNo:x.suggestedPartNo,category:x.category,location:x.location,sectionId:x.sectionId};
 x.reviewHistory=x.reviewHistory||[];x.reviewHistory.unshift({at:x.lastReReviewedAt,byUserId:sessionUser.id,byUsername:sessionUser.username,before,after,status:x.status,action:'details-edit'});
 writeJ(APPROVED_PARTS_KEY,rows);toast('REVIEWED PART UPDATED ✓');go('reviewedparts');
};

$('#changeReviewedDecision').onclick=()=>{
 if(sessionUser?.role!=='admin'||!editReviewedId)return;
 const rows=readJ(APPROVED_PARTS_KEY,[]),i=rows.findIndex(v=>v.id===editReviewedId);if(i<0)return;const x=rows[i];
 const next=x.status==='approved'?'rejected':'approved';
 if(!confirm(`Change this reviewed part from ${String(x.status).toUpperCase()} to ${next.toUpperCase()}?`))return;
 const now=new Date().toISOString(),beforeStatus=x.status;
 x.reviewHistory=x.reviewHistory||[];
 x.reviewHistory.unshift({at:now,byUserId:sessionUser.id,byUsername:sessionUser.username,beforeStatus,afterStatus:next,action:'decision-change'});
 x.status=next;
 if(next==='approved'){
   x.approvedAt=now;x.approvedByUserId=sessionUser.id;x.approvedByUsername=sessionUser.username;
   x.reviewedAt=now;x.reviewedByUserId=sessionUser.id;x.reviewedByUsername=sessionUser.username;
 }else{
   x.reviewedAt=now;x.reviewedByUserId=sessionUser.id;x.reviewedByUsername=sessionUser.username;
 }
 x.lastDecisionChangedAt=now;x.lastDecisionChangedByUserId=sessionUser.id;x.lastDecisionChangedByUsername=sessionUser.username;
 writeJ(APPROVED_PARTS_KEY,rows);
 toast(`DECISION CHANGED TO ${next.toUpperCase()} ✓`);
 go('reviewedparts');
};
$('#homeReviewedBtn').onclick=()=>{if(sessionUser?.role!=='admin'){toast('Admin access required');return}go('reviewedparts')};
$('#reviewedStatusFilter').onchange=renderReviewedParts;
$('#reviewedSearch').oninput=renderReviewedParts;

function setUpdateStatus(message){
 const a=$('#updateStatus'),b=$('#userUpdateStatus');if(a)a.textContent=message;if(b)b.textContent=message;
}
let availableUpdateVersion=null;
function setHeaderUpdateStatus(message){const h=$('#headerUpdateStatus');if(h)h.textContent=message}
function setHeaderUpdateButton(updateAvailable=false){
 const b=$('#headerUpdate');if(!b)return;
 b.textContent=updateAvailable?'UPDATE':'↻ CHECK UPDATE';
 b.dataset.mode=updateAvailable?'update':'check';
}
async function installAvailableUpdate(){
 if(!availableUpdateVersion)return checkForUpdate(true,'header');
 setHeaderUpdateStatus(`Updating to v${availableUpdateVersion}…`);
 const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('stock-scan-')).map(k=>caches.delete(k)));
 if('serviceWorker' in navigator){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.update()))}
 location.replace('./index.html?updated='+Date.now());
}
function compareVersions(a,b){
 const aa=String(a).trim().split('.').map(n=>parseInt(n,10)||0),bb=String(b).trim().split('.').map(n=>parseInt(n,10)||0);
 for(let i=0;i<Math.max(aa.length,bb.length);i++){const x=aa[i]||0,y=bb[i]||0;if(x>y)return 1;if(x<y)return -1}
 return 0;
}
async function fetchPublishedVersion(){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
 try{
  const r=await fetch('./version.json?ts='+Date.now(),{cache:'no-store',headers:{'Cache-Control':'no-cache, no-store, must-revalidate'},signal:controller.signal});
  if(!r.ok)throw new Error('HTTP '+r.status);
  const data=await r.json();
  if(!data||!/^\d+(\.\d+)*$/.test(String(data.version||'').trim()))throw new Error('Invalid version file');
  return String(data.version).trim();
 }finally{clearTimeout(timer)}
}
async function checkForUpdate(manual=true,source='auto'){
 if(source==='header')setHeaderUpdateStatus('Checking…');
 else if(source==='settings')setUpdateStatus(`Checking for update… Current: v${APP_VERSION}`);
 try{
  const remote=await fetchPublishedVersion(),cmp=compareVersions(remote,APP_VERSION);
  if(cmp>0){
   availableUpdateVersion=remote;
   setUpdateStatus(`NEW VERSION AVAILABLE — v${remote}`);setHeaderUpdateStatus(`Update available — v${remote}`);setHeaderUpdateButton(true);
  }else{
   availableUpdateVersion=null;setHeaderUpdateButton(false);
   // Same or older published version means this running build is current; never offer a downgrade.
   setUpdateStatus(`✓ v${APP_VERSION} IS UP TO DATE`);setHeaderUpdateStatus('✓ Up to date');
   if(manual&&source==='settings')toast(`v${APP_VERSION} IS UP TO DATE ✓`);
  }
 }catch(e){
  setUpdateStatus(`UPDATE CHECK FAILED — current v${APP_VERSION}`);setHeaderUpdateStatus('Check failed');if(!availableUpdateVersion)setHeaderUpdateButton(false);
  if(manual&&source==='settings')toast('UPDATE CHECK FAILED');
 }
}
$('#checkUpdate').onclick=()=>checkForUpdate(true,'settings');
$('#userCheckUpdate').onclick=()=>checkForUpdate(true,'settings');
$('#headerUpdate').onclick=()=>{if($('#headerUpdate').dataset.mode==='update')installAvailableUpdate();else checkForUpdate(true,'header')};
$('#homeSettingsBtn').onclick=()=>{if(sessionUser?.role==='admin')go('adminsettings');else{const n=$('#userSettingsName');if(n)n.textContent=sessionUser?.username||'';go('usersettings')}};
$('#userChangePassword').onclick=()=>{if(!sessionUser)return;$('#forcedNewPass').value='';$('#forcedConfirmPass').value='';$('#forcedPassMsg').textContent='';go('changepassword')};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkForUpdate(false,'auto')});
setTimeout(()=>checkForUpdate(false,'auto'),700);

// Start at Login instead of bypassing authentication.
showLogin();
