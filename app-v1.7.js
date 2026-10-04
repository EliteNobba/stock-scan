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
function renderCurrent(){const d=$('#currentList');if(!current){d.innerHTML='<p>No current scan.</p>';return}d.innerHTML=`<div class="card"><b>${esc(current.name)}</b><br><small>${current.items.length} item line(s)</small></div>`+current.items.map((x,i)=>`<div class="row"><div class="itemMain">${x.photo?`<img class="thumb" src="${x.photo}" alt="Item photo">`:''}<div><b>${esc(x.part||x.barcode)}</b><br>${esc(x.description||'')}<br><small>${esc(x.barcode)} • Qty ${x.qty}</small></div></div><button onclick="removeItem(${i})">REMOVE</button></div>`).join('')}
window.removeItem=i=>{current.items.splice(i,1);persist();renderCurrent()};function openSaveScreen(){if(!current){toast('Nothing to save');return}$('#saveName').value=current.name||'';go('saveconfirm')}$('#saveSession').onclick=openSaveScreen;$('#saveAfterAdd').onclick=openSaveScreen;
$('#confirmSave').onclick=()=>{if(!current){toast('Nothing to save');return}if(!current.items||!current.items.length){toast('Add an item before saving');return}current.name=$('#saveName').value.trim()||current.name;current.savedAt=new Date().toISOString();const copy=JSON.parse(JSON.stringify(current));const i=saved.findIndex(x=>x.id===current.id);if(i>=0)saved[i]=copy;else saved.unshift(copy);persist();const total=current.items.reduce((n,x)=>n+(+x.qty||0),0);$('#savedSummary').innerHTML=`<b>${esc(current.name)}</b><br><br>Items: <b>${current.items.length}</b><br>Total Quantity: <b>${total}</b><br><small>Saved ${new Date(current.savedAt).toLocaleString()}</small>`;go('savedconfirm');toast('SCAN SAVED ✓')};$('#viewSavedAfterSave').onclick=()=>go('current');
function renderSaved(){const d=$('#savedList');d.innerHTML=saved.length?saved.map((s,i)=>{const pic=(s.items||[]).find(x=>x.photo);return `<div class="row"><div class="itemMain">${pic?`<img class="thumb" src="${pic.photo}" alt="Scan photo">`:''}<div><b>${esc(s.name)}</b><br><small>${s.items.length} line(s)${s.savedAt?' • '+new Date(s.savedAt).toLocaleString():''}</small></div></div><div class="savedActions"><button onclick="openSaved(${i})">OPEN</button><button class="danger" onclick="deleteSaved(${i})">DELETE</button></div></div>`}).join(''):'<p>No saved scans.</p>'}window.openSaved=i=>{current=JSON.parse(JSON.stringify(saved[i]));persist();go('current')};window.deleteSaved=i=>{const s=saved[i];if(!s)return;if(!confirm(`Delete saved scan “${s.name}”? This cannot be undone.`))return;saved.splice(i,1);localStorage.setItem('savedScans',JSON.stringify(saved));renderSaved();toast('SCAN DELETED')};
function renderDataStatus(){const meta=JSON.parse(localStorage.getItem('partsMeta')||'null');$('#partsStatus').textContent=meta?`${meta.name} • ${meta.count} parts loaded • ${new Date(meta.loaded).toLocaleString()}`:'No parts file loaded yet.'}
$('#partsFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;$('#partsStatus').textContent='Reading '+f.name+'…';try{const wb=XLSX.read(await f.arrayBuffer(),{type:'array'}),ws=wb.Sheets[wb.SheetNames[0]],rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});const out=[];for(let r=1;r<rows.length;r++){const a=rows[r];const barcode=String(a[4]??'').trim();if(!barcode)continue;out.push({part:String(a[1]??'').trim(),supplier:String(a[2]??'').trim(),barcode,description:String(a[6]??'').trim(),price:Number(a[10])||0})}parts=out;localStorage.setItem('partsIndex',JSON.stringify(parts));localStorage.setItem('partsMeta',JSON.stringify({name:f.name,count:parts.length,loaded:new Date().toISOString()}));renderDataStatus();toast(parts.length+' parts loaded')}catch(err){$('#partsStatus').textContent='Could not read file: '+err.message}};
$('#lomagFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;$('#lomagStatus').textContent='Reading '+f.name+'…';try{const wb=XLSX.read(await f.arrayBuffer(),{type:'array'}),ws=wb.Sheets[wb.SheetNames[0]],rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});if(!rows.length)throw Error('File is empty');const headers=rows[0].map(x=>String(x).toLowerCase().trim()),bi=headers.findIndex(x=>x.includes('barcode')),qi=headers.findIndex(x=>x.includes('qty')||x.includes('quantity'));if(bi<0||qi<0)throw Error('Could not find Barcode and Quantity columns');const s={id:Date.now(),name:f.name.replace(/\.xlsx?$/i,''),created:new Date().toISOString(),source:'LoMag',items:[]};for(let r=1;r<rows.length;r++){const code=String(rows[r][bi]??'').trim(),qty=Number(rows[r][qi])||0;if(!code||qty<=0)continue;const p=lookupBarcode(code)||{};s.items.push({barcode:code,qty,part:p.part||'',description:p.description||'Unmatched item',supplier:p.supplier||'',price:p.price||0,photo:'',added:new Date().toISOString()})}s.savedAt=new Date().toISOString();saved.unshift(s);localStorage.setItem('savedScans',JSON.stringify(saved));$('#lomagStatus').textContent=`${f.name} • ${s.items.length} item line(s) imported`;toast('LoMag scan imported')}catch(err){$('#lomagStatus').textContent='Could not read file: '+err.message}};
$('#doPartSearch').onclick=renderPartSearch;function renderPartSearch(){const q=$('#partSearch').value.trim().toLowerCase(),d=$('#searchResults');if(!q){d.innerHTML='';return}const hits=parts.filter(p=>p.part.toLowerCase().includes(q)||p.description.toLowerCase().includes(q)||p.barcode.includes(q)).slice(0,50),sel=getStocktake();d.innerHTML=hits.length?hits.map(p=>{const key=partKey(p),checked=!!sel[key];return `<div class="card stockPick"><input type="checkbox" ${checked?'checked':''} onchange="toggleStocktake('${escAttr(key)}',this.checked)"><div><b>${esc(p.part)}</b><br>${esc(p.description)}<br><small>${esc(p.supplier)} • ${esc(p.barcode)}</small></div></div>`}).join(''):'<p>No matches.</p>'};
function escAttr(s){return String(s??'').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\r?\n/g,' ')}
const STOCK_KEY='stocktakeData_v1';
function getStocktake(){try{return JSON.parse(localStorage.getItem(STOCK_KEY)||'{}')}catch(e){return {}}}
function saveStocktake(v){localStorage.setItem(STOCK_KEY,JSON.stringify(v))}
function partKey(p){return p.barcode||('PART:'+p.part)}
window.toggleStocktake=(key,on)=>{const data=getStocktake();if(on){const p=parts.find(x=>partKey(x)===key);if(p)data[key]={part:p.part||'',description:p.description||'',supplier:p.supplier||'',barcode:p.barcode||'',minimum:Number(data[key]?.minimum)||0,actual:Number(data[key]?.actual)||0}}else delete data[key];saveStocktake(data);toast(on?'ADDED TO STOCKTAKE ✓':'REMOVED FROM STOCKTAKE')};
function renderStocktake(){const d=$('#stocktakeList'),data=getStocktake(),entries=Object.entries(data);if(!entries.length){d.innerHTML='<p>No stocktake items selected yet.</p>';$('#stockOrderResult').innerHTML='';return}d.innerHTML='<div class="stockHead"><span>Item</span><span>Minimum</span><span>Actual</span><span>Order</span></div>'+entries.map(([key,x])=>{const order=Math.max(0,(Number(x.minimum)||0)-(Number(x.actual)||0));return `<div class="card stockRow"><div><b>${esc(x.part||x.barcode)}</b><br><small>${esc(x.description)}<br>${esc(x.supplier)}</small><button class="danger" onclick="removeStocktake('${escAttr(key)}')">REMOVE</button></div><label><input type="number" min="0" value="${Number(x.minimum)||0}" onchange="setStockQty('${escAttr(key)}','minimum',this.value)"></label><label><input type="number" min="0" value="${Number(x.actual)||0}" onchange="setStockQty('${escAttr(key)}','actual',this.value)"></label><div class="orderQty">${order}</div></div>`}).join('')}
window.setStockQty=(key,field,value)=>{const data=getStocktake();if(!data[key])return;data[key][field]=Math.max(0,Number(value)||0);saveStocktake(data);renderStocktake()};
window.removeStocktake=key=>{const data=getStocktake();delete data[key];saveStocktake(data);renderStocktake();toast('REMOVED FROM STOCKTAKE')};
$('#createStockOrder').onclick=()=>{const data=getStocktake(),short=Object.values(data).map(x=>({...x,order:Math.max(0,(Number(x.minimum)||0)-(Number(x.actual)||0))})).filter(x=>x.order>0);const d=$('#stockOrderResult');if(!short.length){d.innerHTML='<div class="successBanner"><div class="successTick">✓</div><h2>NO ORDER REQUIRED</h2><div>All selected items meet their minimum quantity.</div></div>';return}const groups={};short.forEach(x=>(groups[x.supplier||'No Supplier']??=[]).push(x));d.innerHTML='<div class="successBanner"><h2>ORDER LIST CREATED</h2><div>'+short.length+' item(s) below minimum</div></div>'+Object.entries(groups).map(([supplier,items])=>`<div class="card orderLine"><b>${esc(supplier)}</b>${items.map(x=>`<div><br><b>${esc(x.part||x.barcode)}</b> — Order <b>${x.order}</b><br><small>${esc(x.description)} • Min ${Number(x.minimum)||0} • Actual ${Number(x.actual)||0}</small></div>`).join('')}</div>`).join('');d.scrollIntoView({behavior:'smooth',block:'start'})};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js?v=1.7');

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
