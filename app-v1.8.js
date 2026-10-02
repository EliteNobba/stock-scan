const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);let current=JSON.parse(localStorage.getItem('currentScan')||'null'),saved=JSON.parse(localStorage.getItem('savedScans')||'[]'),parts=JSON.parse(localStorage.getItem('partsIndex')||'[]'),controls=null,reader=null,photoData='',activePart=null;
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),1800)}
function go(id){stopCamera();$$('.screen').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active');if(id==='current')renderCurrent();if(id==='saved')renderSaved();if(id==='datafiles')renderDataStatus();if(id==='stocktake')renderStocktake()}
$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));function persist(){localStorage.setItem('currentScan',JSON.stringify(current));localStorage.setItem('savedScans',JSON.stringify(saved))}function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function ensureScan(){if(!current)current={id:Date.now(),name:`Scan ${new Date().toLocaleString()}`,created:new Date().toISOString(),items:[]};persist()}
function scannerNow(newSession=false){if(newSession){if(current&&current.items&&current.items.length&&!confirm('Start a new scan? The current unsaved scan will remain until replaced.'))return;current={id:Date.now(),name:`Scan ${new Date().toLocaleString()}`,created:new Date().toISOString(),items:[]};persist()}else ensureScan();go('scanner');setTimeout(startCamera,120)}
$('#newScanNow').onclick=()=>scannerNow(true);$('#scanNext').onclick=()=>scannerNow(false);$('#scanFromCurrent').onclick=()=>scannerNow(false);$('#startNewAfterSave').onclick=()=>{current=null;persist();scannerNow(true)};
async function startCamera(){stopCamera();const status=$('#scanStatus'),diag=$('#scanDiag');status.textContent='Starting rear camera…';diag.textContent='';try{if(!window.ZXing){status.textContent='Scanner library did not load.';return}reader=new ZXing.BrowserMultiFormatReader();controls=await reader.decodeFromVideoDevice(null,$('#video'),(result,err)=>{if(result)found(result.getText());else if(err&&!(err instanceof ZXing.NotFoundException))diag.textContent='Decoder error: '+(err.message||err)});const tr=$('#video').srcObject&&$('#video').srcObject.getVideoTracks()[0],st=tr&&tr.getSettings?tr.getSettings():{};status.textContent='SCANNING — hold barcode inside the box';diag.textContent='ZXing continuous • '+(st.width||'?')+'×'+(st.height||'?')}catch(e){status.textContent='Scanner could not start';diag.textContent=(e.name?e.name+': ':'')+(e.message||e)}}
function stopCamera(){try{if(controls&&controls.stop)controls.stop()}catch(e){}controls=null;try{if(reader&&reader.reset)reader.reset()}catch(e){}reader=null;const v=$('#video');if(v&&v.srcObject){v.srcObject.getTracks().forEach(t=>t.stop());v.srcObject=null}}
$('#stopAndCurrent').onclick=()=>go('current');$('#useManual').onclick=()=>{const v=$('#manualBarcode').value.trim();if(v)found(v)};
function lookupBarcode(code){let p=parts.find(x=>x.barcode===code);if(!p&&/^\d{13}$/.test(code))p=parts.find(x=>x.barcode===code.slice(0,12));return p||null}
function found(code){if(!code)return;if(navigator.vibrate)navigator.vibrate(80);stopCamera();activePart=lookupBarcode(String(code).trim());$('#itemBarcode').textContent=code;$('#itemPart').textContent=activePart?activePart.part:'NOT FOUND';$('#itemDesc').textContent=activePart?activePart.description:'Unmatched item';$('#itemSupplier').textContent=activePart?activePart.supplier:'—';$('#itemPrice').textContent=activePart&&Number.isFinite(activePart.price)?'$'+activePart.price.toFixed(2):'—';$('#qty').value=1;photoData='';$('#photoPreview').hidden=true;$('#photo').value='';go('item')}
$('#minus').onclick=()=>$('#qty').value=Math.max(1,(+$('#qty').value||1)-1);$('#plus').onclick=()=>$('#qty').value=(+$('#qty').value||1)+1;$('#photo').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{photoData=r.result;$('#photoPreview').src=photoData;$('#photoPreview').hidden=false};r.readAsDataURL(f)};
$('#addItem').onclick=()=>{ensureScan();const barcode=$('#itemBarcode').textContent,q=Math.max(1,+$('#qty').value||1),p=activePart||{};let ex=current.items.find(x=>x.barcode===barcode&&!photoData&&!x.photo);if(ex)ex.qty+=q;else current.items.push({barcode,qty:q,part:p.part||'',description:p.description||'Unmatched item',supplier:p.supplier||'',price:p.price||0,photo:photoData,added:new Date().toISOString()});persist();const label=(p.part||barcode);$('#addedSummary').innerHTML='<b>'+esc(label)+'</b><br>Quantity '+q+' added to Current Scan'+(photoData?'<br>Photo attached ✓':'');go('afteradd');toast('ITEM ADDED ✓')};
function renderCurrent(){const d=$('#currentList');if(!current){d.innerHTML='<p>No current scan.</p>';return}d.innerHTML=`<div class="card"><b>${esc(current.name)}</b><br><small>${current.items.length} item line(s)</small></div>`+current.items.map((x,i)=>`<div class="row scanRow">${x.photo?`<img class="thumb" src="${x.photo}" onclick="viewPhoto(${i})">`:''}<div class="grow"><b>${esc(x.part||x.barcode)}</b><br>${esc(x.description||'')}<br><small>${esc(x.barcode)} • Qty ${x.qty}</small></div><button onclick="removeItem(${i})">REMOVE</button></div>`).join('')}
window.viewPhoto=i=>{const x=current&&current.items[i];if(x&&x.photo)window.open(x.photo,'_blank')};window.removeItem=i=>{current.items.splice(i,1);persist();renderCurrent()};function openSaveScreen(){if(!current){toast('Nothing to save');return}$('#saveName').value=current.name||'';go('saveconfirm')}$('#saveSession').onclick=openSaveScreen;$('#saveAfterAdd').onclick=openSaveScreen;
$('#confirmSave').onclick=()=>{if(!current){toast('Nothing to save');return}if(!current.items||!current.items.length){toast('Add an item before saving');return}current.name=$('#saveName').value.trim()||current.name;current.savedAt=new Date().toISOString();const copy=JSON.parse(JSON.stringify(current));const i=saved.findIndex(x=>x.id===current.id);if(i>=0)saved[i]=copy;else saved.unshift(copy);persist();const total=current.items.reduce((n,x)=>n+(+x.qty||0),0);$('#savedSummary').innerHTML=`<b>${esc(current.name)}</b><br><br>Items: <b>${current.items.length}</b><br>Total Quantity: <b>${total}</b><br><small>Saved ${new Date(current.savedAt).toLocaleString()}</small>`;go('savedconfirm');toast('SCAN SAVED ✓');setTimeout(()=>alert('SCAN SAVED ✓\n'+current.name+'\n'+current.items.length+' item line(s) • Total quantity '+total),80)};$('#viewSavedAfterSave').onclick=()=>go('current');
function renderSaved(){const d=$('#savedList');d.innerHTML=saved.length?saved.map((s,i)=>{const ph=(s.items||[]).find(x=>x.photo);return `<div class="row scanRow">${ph?`<img class="thumb" src="${ph.photo}">`:''}<div class="grow"><b>${esc(s.name)}</b><br><small>${s.items.length} line(s) • ${new Date(s.savedAt||s.created).toLocaleString()}</small></div><div class="stackBtns"><button onclick="openSaved(${i})">OPEN</button><button class="danger" onclick="deleteSaved(${i})">DELETE</button></div></div>`}).join(''):'<p>No saved scans.</p>'}window.openSaved=i=>{current=JSON.parse(JSON.stringify(saved[i]));persist();go('current')};window.deleteSaved=i=>{const s=saved[i];if(!s)return;if(!confirm(`Delete saved scan “${s.name}”? This cannot be undone.`))return;saved.splice(i,1);persist();renderSaved();toast('SAVED SCAN REMOVED')};
function renderDataStatus(){const meta=JSON.parse(localStorage.getItem('partsMeta')||'null');$('#partsStatus').textContent=meta?`${meta.name} • ${meta.count} parts loaded • ${new Date(meta.loaded).toLocaleString()}`:'No parts file loaded yet.'}
$('#partsFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;$('#partsStatus').textContent='Reading '+f.name+'…';try{const wb=XLSX.read(await f.arrayBuffer(),{type:'array'}),ws=wb.Sheets[wb.SheetNames[0]],rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});const out=[];for(let r=1;r<rows.length;r++){const a=rows[r];const barcode=String(a[4]??'').trim();if(!barcode)continue;out.push({part:String(a[1]??'').trim(),supplier:String(a[2]??'').trim(),barcode,description:String(a[6]??'').trim(),price:Number(a[10])||0})}parts=out;localStorage.setItem('partsIndex',JSON.stringify(parts));localStorage.setItem('partsMeta',JSON.stringify({name:f.name,count:parts.length,loaded:new Date().toISOString()}));renderDataStatus();toast(parts.length+' parts loaded')}catch(err){$('#partsStatus').textContent='Could not read file: '+err.message}};
$('#lomagFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;$('#lomagStatus').textContent='Reading '+f.name+'…';try{const wb=XLSX.read(await f.arrayBuffer(),{type:'array'}),ws=wb.Sheets[wb.SheetNames[0]],rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});if(!rows.length)throw Error('File is empty');const headers=rows[0].map(x=>String(x).toLowerCase().trim()),bi=headers.findIndex(x=>x.includes('barcode')),qi=headers.findIndex(x=>x.includes('qty')||x.includes('quantity'));if(bi<0||qi<0)throw Error('Could not find Barcode and Quantity columns');const s={id:Date.now(),name:f.name.replace(/\.xlsx?$/i,''),created:new Date().toISOString(),source:'LoMag',items:[]};for(let r=1;r<rows.length;r++){const code=String(rows[r][bi]??'').trim(),qty=Number(rows[r][qi])||0;if(!code||qty<=0)continue;const p=lookupBarcode(code)||{};s.items.push({barcode:code,qty,part:p.part||'',description:p.description||'Unmatched item',supplier:p.supplier||'',price:p.price||0,photo:'',added:new Date().toISOString()})}s.savedAt=new Date().toISOString();saved.unshift(s);localStorage.setItem('savedScans',JSON.stringify(saved));$('#lomagStatus').textContent=`${f.name} • ${s.items.length} item line(s) imported`;toast('LoMag scan imported')}catch(err){$('#lomagStatus').textContent='Could not read file: '+err.message}};
$('#doPartSearch').onclick=()=>{const q=$('#partSearch').value.trim().toLowerCase(),d=$('#searchResults');if(!q){d.innerHTML='';return}const hits=parts.filter(p=>p.part.toLowerCase().includes(q)||p.description.toLowerCase().includes(q)||p.barcode.includes(q)).slice(0,50);d.innerHTML=hits.length?hits.map(p=>`<div class="card"><b>${esc(p.part)}</b><br>${esc(p.description)}<br><small>${esc(p.supplier)} • ${esc(p.barcode)}</small></div>`).join(''):'<p>No matches.</p>'};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js?v=1.8');

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
