const $ = id => document.getElementById(id);
const KEY = "autoweb_traffic_booster_v1";
let state = JSON.parse(localStorage.getItem(KEY) || '{"sites":[],"campaigns":[],"shares":0}');
function persist(){localStorage.setItem(KEY,JSON.stringify(state));render();}
function safeUrl(value){try{const u=new URL(value);return ["http:","https:"].includes(u.protocol)?u.href:null}catch{return null}}
function toast(msg){$("toast").textContent=msg;setTimeout(()=>$("toast").textContent="",3500)}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function render(){
  $("statSites").textContent=state.sites.length;
  $("statCampaigns").textContent=state.campaigns.length;
  $("statShares").textContent=state.shares;
  const current=$("siteSelect").value;
  $("siteSelect").innerHTML='<option value="">Pilih website</option>'+state.sites.map((s,i)=>`<option value="${i}">${esc(s.name)}</option>`).join("");
  if(state.sites[current])$("siteSelect").value=current;
  $("siteList").innerHTML=state.sites.length?state.sites.map((s,i)=>`<div class="item"><div><strong>${esc(s.name)}</strong><small>${esc(s.url)} · ${esc(s.kind)}</small></div><div class="item-actions"><button class="mini" data-open-site="${i}">Buka</button><button class="mini" data-del-site="${i}">Hapus</button></div></div>`).join(""):'<div class="empty">Belum ada website. Tambahkan website milik Anda di atas.</div>';
  $("campaignList").innerHTML=state.campaigns.length?state.campaigns.slice().reverse().map((c,rev)=>{const i=state.campaigns.length-1-rev;return `<div class="item"><div><strong>${esc(c.title||"Kampanye tanpa judul")}</strong><small>${esc(c.url)} · ${esc(c.type)} · ${new Date(c.date).toLocaleDateString("id-ID")}</small></div><div class="item-actions"><button class="mini" data-load-campaign="${i}">Gunakan</button><button class="mini" data-del-campaign="${i}">Hapus</button></div></div>`}).join(""):'<div class="empty">Belum ada kampanye tersimpan.</div>';
}
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b===btn));document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.id==="panel-"+btn.dataset.tab));}));
$("addSiteBtn").addEventListener("click",()=>{
 const name=$("siteName").value.trim(),url=safeUrl($("siteUrl").value.trim()),kind=$("siteKind").value;
 if(!name||!url){alert("Isi nama website dan alamat website yang valid (diawali https://).");return;}
 state.sites.push({name,url,kind});$("siteName").value="";$("siteUrl").value="";persist();
});
$("generateBtn").addEventListener("click",()=>{
 const title=$("assetTitle").value.trim(),url=safeUrl($("pageUrl").value.trim()),desc=$("assetDesc").value.trim(),tags=$("hashtags").value.trim(),type=$("assetType").value;
 if(!title||!url){alert("Isi judul dan link halaman yang valid terlebih dahulu.");return;}
 const tagText=tags? " #"+tags.split(/[,\s]+/).filter(Boolean).map(t=>t.replace(/^#/,"")).join(" #"):"";
 $("caption").value=`Temukan ${type.toLowerCase()} menarik: ${title}.\n\n${desc}\n\nLihat selengkapnya di sini: ${url}\n\nJelajahi, gunakan, dan bagikan jika bermanfaat.${tagText}`;
 toast("Caption berhasil dibuat. Silakan periksa sebelum dibagikan.");
});
$("saveBtn").addEventListener("click",()=>{
 const url=safeUrl($("pageUrl").value.trim());
 if(!$("assetTitle").value.trim()||!url||!$("caption").value.trim()){alert("Buat caption dan isi judul serta link halaman terlebih dahulu.");return;}
 state.campaigns.push({title:$("assetTitle").value.trim(),url,type:$("assetType").value,desc:$("assetDesc").value,caption:$("caption").value,date:new Date().toISOString()});
 persist();toast("Kampanye disimpan di browser ini.");
});
const shareBuilders={
 whatsapp:(t,u)=>`https://wa.me/?text=${encodeURIComponent(t+" "+u)}`,
 facebook:(t,u)=>`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}&quote=${encodeURIComponent(t)}`,
 telegram:(t,u)=>`https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
 pinterest:(t,u)=>`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(u)}&description=${encodeURIComponent(t)}`,
 x:(t,u)=>`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
 reddit:(t,u)=>`https://www.reddit.com/submit?url=${encodeURIComponent(u)}&title=${encodeURIComponent(t.slice(0,250))}`,
 linkedin:(t,u)=>`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
 email:(t,u)=>`mailto:?subject=${encodeURIComponent($("assetTitle").value||"Rekomendasi aset digital")}&body=${encodeURIComponent(t+" "+u)}`
};
document.querySelectorAll("[data-platform]").forEach(btn=>btn.addEventListener("click",()=>{
 const url=safeUrl($("pageUrl").value.trim()),caption=$("caption").value.trim();
 if(!url||!caption){alert("Isi link halaman dan buat caption terlebih dahulu.");return;}
 const target=shareBuilders[btn.dataset.platform](caption,url);
 window.open(target,"_blank","noopener,noreferrer");
 state.shares++;localStorage.setItem(KEY,JSON.stringify(state));render();
}));
$("siteList").addEventListener("click",e=>{
 const open=e.target.dataset.openSite,del=e.target.dataset.delSite;
 if(open!==undefined)window.open(state.sites[+open].url,"_blank","noopener,noreferrer");
 if(del!==undefined&&confirm("Hapus website ini dari daftar?")){state.sites.splice(+del,1);persist();}
});
$("campaignList").addEventListener("click",e=>{
 const load=e.target.dataset.loadCampaign,del=e.target.dataset.delCampaign;
 if(load!==undefined){const c=state.campaigns[+load];$("assetTitle").value=c.title;$("pageUrl").value=c.url;$("assetType").value=c.type;$("assetDesc").value=c.desc;$("caption").value=c.caption;document.querySelector('[data-tab="promote"]').click();}
 if(del!==undefined){state.campaigns.splice(+del,1);persist();}
});
$("clearCampaigns").addEventListener("click",()=>{if(confirm("Hapus seluruh riwayat kampanye?")){state.campaigns=[];persist();}});
$("seoBtn").addEventListener("click",()=>{
 const topic=$("seoTopic").value.trim();if(!topic){alert("Masukkan topik terlebih dahulu.");return;}
 $("seoResult").textContent=`CONTOH JUDUL SEO\n${topic} Gratis untuk Diunduh – Koleksi Berkualitas\n\nCONTOH DESKRIPSI\nTemukan koleksi ${topic.toLowerCase()} yang mudah dijelajahi. Lihat detail, periksa ketentuan penggunaan, dan kunjungi halaman untuk informasi selengkapnya.\n\nIDE KATA KUNCI\n${topic.toLowerCase()}, download ${topic.toLowerCase()}, ${topic.toLowerCase()} gratis, koleksi ${topic.toLowerCase()}, aset digital`;
});
render();
