const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s); let current=JSON.parse(localStorage.getItem('currentScan')||'null'); let saved=JSON.parse(localStorage.getItem('savedScans')||'[]'); let controls=null, reader=null, photoData='';
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),1800)}
function go(id){stopCamera();$$('.screen').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active');if(id==='current')renderCurrent();if(id==='saved')renderSaved()}
$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
function persist(){localStorage.setItem('currentScan',JSON.stringify(current));localStorage.setItem('savedScans',JSON.stringify(saved))}
$('#startSession').onclick=()=>{const n=$('#scanName').value.trim()||`Scan ${new Date().toLocaleString()}`;current={id:Date.now(),name:n,created:new Date().toISOString(),items:[]};persist();go('scanner')};
async function startCamera(){
 stopCamera(); const status=$('#scanStatus'), diag=$('#scanDiag'); status.textContent='Starting rear camera…'; diag.textContent='';
 try{
   if(!window.ZXing){status.textContent='ZXing scanner library did not load.';diag.textContent='Check internet connection, then close and reopen the app.';return;}
   reader=new ZXing.BrowserMultiFormatReader();
   diag.textContent='Decoder: ZXing continuous scan • requesting rear camera';
   controls=await reader.decodeFromVideoDevice(null,$('#video'),(result,err)=>{
     if(result){ status.textContent='Barcode found: '+result.getText(); found(result.getText()); return; }
     // NotFoundException is normal while searching; only expose unusual errors.
     if(err && !(err instanceof ZXing.NotFoundException)){ diag.textContent='Decoder error: '+(err.message||err); }
   });
   const track=$('#video').srcObject && $('#video').srcObject.getVideoTracks()[0];
   const settings=track&&track.getSettings?track.getSettings():{};
   status.textContent='SCANNING — hold barcode inside the box';
   diag.textContent='Decoder: ZXing continuous • camera: '+(settings.label||'rear camera')+' • '+(settings.width||'?')+'×'+(settings.height||'?');
 }catch(e){status.textContent='Scanner could not start';diag.textContent=(e&&e.name?e.name+': ':'')+(e&&e.message?e.message:e);}
}
function stopCamera(){try{if(controls&&controls.stop)controls.stop()}catch(e){} controls=null; try{if(reader&&reader.reset)reader.reset()}catch(e){} reader=null; const v=$('#video'); if(v&&v.srcObject){v.srcObject.getTracks().forEach(t=>t.stop());v.srcObject=null}}
$('#startCamera').onclick=startCamera; $('#stopCamera').onclick=()=>{stopCamera();$('#scanStatus').textContent='Camera stopped';$('#scanDiag').textContent=''};
function found(code){if(!code)return; if(navigator.vibrate)navigator.vibrate(80); stopCamera(); $('#itemBarcode').textContent=code;$('#itemPart').textContent='NOT FOUND';$('#itemDesc').textContent='Unmatched item';$('#itemSupplier').textContent='—';$('#qty').value=1;photoData='';$('#photoPreview').hidden=true;go('item')}
$('#useManual').onclick=()=>{const v=$('#manualBarcode').value.trim();if(v)found(v)};
$('#minus').onclick=()=>$('#qty').value=Math.max(1,(+$('#qty').value||1)-1); $('#plus').onclick=()=>$('#qty').value=(+$('#qty').value||1)+1;
$('#photo').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{photoData=r.result;$('#photoPreview').src=photoData;$('#photoPreview').hidden=false};r.readAsDataURL(f)};
$('#addItem').onclick=()=>{if(!current){toast('Start a scan first');go('newscan');return}const barcode=$('#itemBarcode').textContent,q=Math.max(1,+$('#qty').value||1);let existing=current.items.find(x=>x.barcode===barcode&&!photoData);if(existing)existing.qty+=q;else current.items.push({barcode,qty:q,part:'',description:'Unmatched item',supplier:'',photo:photoData,added:new Date().toISOString()});persist();toast('Added to scan');go('scanner')};
function renderCurrent(){const d=$('#currentList');if(!current){d.innerHTML='<p>No current scan.</p>';return}d.innerHTML=`<div class="card"><b>${esc(current.name)}</b><br><small>${current.items.length} item line(s)</small></div>`+current.items.map((x,i)=>`<div class="row"><div><b>${esc(x.barcode)}</b><br>Qty ${x.qty}</div><button onclick="removeItem(${i})">REMOVE</button></div>`).join('')}
window.removeItem=i=>{current.items.splice(i,1);persist();renderCurrent()};
$('#saveSession').onclick=()=>{if(!current){toast('Nothing to save');return}const i=saved.findIndex(x=>x.id===current.id);if(i>=0)saved[i]=current;else saved.unshift(current);persist();toast('Scan saved')};
function renderSaved(){const d=$('#savedList');d.innerHTML=saved.length?saved.map((s,i)=>`<div class="row"><div><b>${esc(s.name)}</b><br><small>${s.items.length} line(s)</small></div><button onclick="openSaved(${i})">OPEN</button></div>`).join(''):'<p>No saved scans.</p>'}
window.openSaved=i=>{current=saved[i];persist();go('current')}; function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js?v=1.1');
