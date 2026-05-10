import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "https://immo-ci-scrap-api.onrender.com";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--bg:#070c14;--surface:#0d1520;--s2:#111f30;--border:#1a2d42;--b2:#223347;--accent:#f97316;--gold:#f59e0b;--green:#10b981;--red:#ef4444;--blue:#3b82f6;--violet:#8b5cf6;--text:#e2eaf4;--muted:#4a6580;--muted2:#64748b;--card:#0c1827}
  body{background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
  .hdr{position:sticky;top:0;z-index:100;background:rgba(7,12,20,.93);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:0 20px;height:60px;display:flex;align-items:center;justify-content:space-between;gap:12px}
  .logo{display:flex;align-items:center;gap:10px}
  .logo-mark{width:34px;height:34px;border-radius:8px;background:linear-gradient(135deg,var(--accent),var(--gold));display:flex;align-items:center;justify-content:center;font-size:17px}
  .logo-name{font-family:'Syne',sans-serif;font-weight:800;font-size:16px}
  .logo-tag{font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--accent);background:rgba(249,115,22,.12);border:1px solid rgba(249,115,22,.25);padding:2px 6px;border-radius:20px;margin-left:3px}
  .hdr-r{display:flex;align-items:center;gap:8px}
  .pill{display:flex;align-items:center;gap:5px;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:20px;padding:4px 10px;font-size:11px;color:var(--green);font-weight:600}
  .dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;transition:all .18s;white-space:nowrap}
  .btn:disabled{opacity:.4;cursor:not-allowed}
  .btn-prime{background:linear-gradient(135deg,var(--accent),var(--gold));color:#fff;box-shadow:0 4px 14px rgba(249,115,22,.3)}
  .btn-prime:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(249,115,22,.4)}
  .btn-ghost{background:var(--s2);color:var(--text);border:1px solid var(--border)}
  .btn-ghost:hover:not(:disabled){background:var(--b2)}
  .btn-sm{padding:5px 10px;font-size:12px}
  .btn-xs{padding:3px 7px;font-size:11px;border-radius:6px}
  .page{padding:18px 20px;display:flex;flex-direction:column;gap:16px}
  .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}
  .stat{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px 16px;position:relative;overflow:hidden}
  .stat::after{content:'';position:absolute;top:0;left:0;right:0;height:2px}
  .s-or::after{background:linear-gradient(90deg,var(--accent),var(--gold))}.s-gr::after{background:var(--green)}.s-bl::after{background:var(--blue)}.s-vi::after{background:var(--violet)}
  .stat-l{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
  .stat-v{font-family:'Syne',sans-serif;font-weight:800;font-size:24px;line-height:1}
  .stat-s{font-size:11px;color:var(--muted);margin-top:3px}
  .pb{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px}
  .pb-h{display:flex;justify-content:space-between;margin-bottom:8px}
  .pb-t{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;color:var(--accent)}
  .pb-p{font-size:18px;font-weight:700;color:var(--accent)}
  .bw{background:var(--card);border-radius:99px;height:6px;overflow:hidden;margin-bottom:10px}
  .bar{height:100%;background:linear-gradient(90deg,var(--accent),var(--gold));border-radius:99px;transition:width .4s}
  .fb{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .srch{display:flex;align-items:center;gap:7px;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:7px 10px;flex:1;min-width:160px}
  .srch input{background:none;border:none;outline:none;color:var(--text);font-size:13px;width:100%;font-family:'Plus Jakarta Sans',sans-serif}
  .srch input::placeholder{color:var(--muted)}
  .fsel{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:7px 10px;color:var(--text);font-size:12px;outline:none;cursor:pointer}
  .fsel:focus{border-color:var(--accent)}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:12px}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .card{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;cursor:pointer;transition:transform .2s,box-shadow .2s,border-color .2s;animation:fadeIn .3s ease both}
  .card:hover{transform:translateY(-3px);border-color:rgba(249,115,22,.4);box-shadow:0 12px 40px rgba(249,115,22,.12)}
  .cthumb{height:165px;background:linear-gradient(135deg,#162236,var(--bg));display:flex;align-items:center;justify-content:center;font-size:48px;position:relative;overflow:hidden}
  .cthumb img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}
  .cbx{position:absolute;top:9px;left:9px;padding:3px 7px;border-radius:5px;font-size:10px;font-weight:700;text-transform:uppercase}
  .cbx-v{background:var(--accent);color:#fff}.cbx-l{background:var(--blue);color:#fff}
  .cnew{position:absolute;top:9px;right:9px;background:var(--green);color:#fff;padding:2px 6px;border-radius:5px;font-size:9px;font-weight:700}
  .csrc{position:absolute;bottom:6px;right:6px;background:rgba(0,0,0,.65);color:#bbb;padding:2px 6px;border-radius:4px;font-size:10px;max-width:110px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .cbody{padding:12px}
  .cprice{font-family:'Syne',sans-serif;font-weight:800;font-size:16px;color:var(--accent);margin-bottom:3px}
  .cttl{font-weight:600;font-size:13px;margin-bottom:5px;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .cloc{font-size:11px;color:var(--muted2);margin-bottom:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .cfeats{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px}
  .feat{background:var(--s2);border:1px solid var(--border);border-radius:4px;padding:2px 6px;font-size:10px;color:var(--muted2)}
  .cfoot{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border);padding-top:8px}
  .ctime{font-size:11px;color:var(--muted)}
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}
  .modal{background:var(--surface);border:1px solid var(--b2);border-radius:18px;padding:20px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;animation:popIn .25s ease}
  @keyframes popIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
  .modal-h{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:14px}
  .modal-ttl{font-family:'Syne',sans-serif;font-weight:800;font-size:17px}
  .modal-close{background:var(--s2);border:1px solid var(--border);border-radius:7px;width:28px;height:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:15px;flex-shrink:0}
  .modal-img{width:100%;height:200px;background:var(--card);border-radius:10px;margin-bottom:12px;display:flex;align-items:center;justify-content:center;font-size:64px;overflow:hidden}
  .modal-img img{width:100%;height:100%;object-fit:cover;border-radius:10px}
  .dg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
  .di{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:10px}
  .di-l{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:3px}
  .di-v{font-weight:600;font-size:13px}
  .desc{font-size:12px;color:var(--muted2);line-height:1.7;margin:10px 0}
  .modal-acts{display:flex;gap:8px;margin-top:12px}
  .tabs{display:flex;gap:4px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:4px}
  .tab{padding:7px 14px;border-radius:7px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:600;background:none;color:var(--muted2);transition:all .15s}
  .tab.active{background:var(--accent);color:#fff}
  .tab:hover:not(.active){color:var(--text);background:var(--s2)}
  .log-box{background:#040b12;border:1px solid var(--border);border-radius:10px;padding:12px;font-family:monospace;font-size:11px;max-height:280px;overflow-y:auto;line-height:1.9}
  .ll.ok{color:#10b981}.ll.warn{color:#f59e0b}.ll.err{color:#ef4444}.ll.info{color:#60a5fa}.ll.dim{color:#4a6580}
  .toast{position:fixed;bottom:18px;right:18px;z-index:999;background:var(--s2);border:1px solid var(--b2);border-radius:10px;padding:11px 16px;display:flex;align-items:center;gap:8px;box-shadow:0 16px 50px rgba(0,0,0,.6);animation:slideUp .3s ease;font-size:13px;font-weight:500}
  @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  .toast.ok{border-color:var(--green)}.toast.err{border-color:var(--red)}
  .empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:60px 20px;color:var(--muted);text-align:center}
  .cfg{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:12px}
  .cfg-ttl{font-family:'Syne',sans-serif;font-weight:700;font-size:14px}
  .cfg-row{display:flex;gap:10px;flex-wrap:wrap}
  .cfg-grp{display:flex;flex-direction:column;gap:4px;flex:1;min-width:150px}
  .cfg-lbl{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted)}
  .ifield{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:7px 10px;color:var(--text);font-size:13px;outline:none;width:100%}
  .ifield:focus{border-color:var(--accent)}
  .tags{display:flex;flex-wrap:wrap;gap:5px}
  .tag{display:inline-flex;align-items:center;gap:3px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid var(--border);background:var(--card);color:var(--muted2);transition:all .13s}
  .tag.on{background:rgba(249,115,22,.14);border-color:rgba(249,115,22,.38);color:var(--accent)}
  .hint{background:rgba(249,115,22,.07);border:1px solid rgba(249,115,22,.18);border-radius:10px;padding:11px 13px;font-size:12px;color:#fdba74;line-height:1.7}
`;

const DEFAULT_ZONES = ["Cocody","Riviera","Riviera Golf","Marcory","Zone 4","Bietry","2 Plateaux","Angre"];
const ALL_ZONES = [...DEFAULT_ZONES,"Plateau","Treichville","Yopougon","Koumassi","Adjame","Abobo","Bingerville","Grand-Bassam","Djibi","Palmeraie"];
const ALL_TYPES = ["Villa","Appartement","Studio","Duplex","Terrain","Immeuble","Bureau","Local commercial","Magasin","Entrepot","Chambre","Maison"];
const EMOJIS = {"Villa":"🏡","Appartement":"🏢","Studio":"🛏️","Duplex":"🏘️","Terrain":"🌿","Immeuble":"🏗️","Bureau":"💼","Local commercial":"🏬","Magasin":"🏪","Entrepot":"🏭","Maison":"🏠"};
const getEmoji = t => EMOJIS[t] || "🏠";
const timeSince = d => { if(!d) return "—"; const h=Math.floor((Date.now()-new Date(d))/3600000); if(h<1) return "Quelques min"; if(h<24) return `${h}h`; return `${Math.floor(h/24)}j`; };

export default function App() {
  const [annonces, setAnnonces] = useState([]);
  const [stats, setStats] = useState(null);
  const [apiOk, setApiOk] = useState(null);
  const [tab, setTab] = useState("annonces");
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState({});
  const [search, setSearch] = useState("");
  const [fTx, setFTx] = useState("Tous");
  const [fZone, setFZone] = useState("Toutes");
  const [fType, setFType] = useState("Tous");
  const [sortBy, setSortBy] = useState("date");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeZones, setActiveZones] = useState(new Set(DEFAULT_ZONES));
  const [activeTypes, setActiveTypes] = useState(new Set(ALL_TYPES));
  const [minLoyer, setMinLoyer] = useState(1000000);
  const [minVente, setMinVente] = useState(100000000);
  const [dateDays, setDateDays] = useState(7);
  const pollRef = useRef(null);
  const logRef = useRef(null);

  const showToast = (msg, type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const checkApi = useCallback(async()=>{ try{ const r=await fetch(`${API_BASE}/`); setApiOk(r.ok); }catch{ setApiOk(false); } },[]);
  const fetchStats = useCallback(async()=>{ try{ const r=await fetch(`${API_BASE}/api/stats`); const d=await r.json(); setStats(d); }catch{} },[]);

  const fetchAnnonces = useCallback(async()=>{
    setLoading(true);
    try{
      const p=new URLSearchParams({days:dateDays,sort:sortBy,limit:200,...(fTx!=="Tous"?{transaction:fTx}:{}),...(fZone!=="Toutes"?{zone:fZone}:{}),...(fType!=="Tous"?{type:fType}:{}),...(search?{search}:{})});
      const r=await fetch(`${API_BASE}/api/annonces?${p}`);
      const d=await r.json();
      setAnnonces(d.annonces||[]);
    }catch{ showToast("Erreur connexion API","err"); }
    finally{ setLoading(false); }
  },[dateDays,sortBy,fTx,fZone,fType,search]);

  const pollScrape = useCallback(async()=>{
    try{
      const r=await fetch(`${API_BASE}/api/scrape/status`);
      const d=await r.json();
      setScrapeStatus(d);
      if(!d.running){ setIsScraping(false); clearInterval(pollRef.current); fetchAnnonces(); fetchStats(); showToast("Scraping termine !","ok"); }
    }catch{}
  },[fetchAnnonces,fetchStats]);

  const launchScrape = async()=>{
    if(isScraping) return;
    setIsScraping(true);
    try{
      const r=await fetch(`${API_BASE}/api/scrape`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({zones:[...activeZones],types:[...activeTypes],min_loyer:minLoyer,min_vente:minVente,days:dateDays})});
      if(!r.ok){ const d=await r.json(); showToast(d.error||"Erreur","err"); setIsScraping(false); return; }
      showToast("Scraping lance !","ok");
      pollRef.current=setInterval(pollScrape,3000);
    }catch{ showToast("API non joignable","err"); setIsScraping(false); }
  };

  useEffect(()=>{ checkApi(); fetchStats(); fetchAnnonces(); },[]);
  useEffect(()=>{ fetchAnnonces(); },[fTx,fZone,fType,sortBy,dateDays]);
  useEffect(()=>{ if(logRef.current) logRef.current.scrollTop=logRef.current.scrollHeight; },[scrapeStatus.log]);

  const toggleZone = z=>setActiveZones(p=>{const s=new Set(p);s.has(z)?s.delete(z):s.add(z);return s;});
  const toggleType = t=>setActiveTypes(p=>{const s=new Set(p);s.has(t)?s.delete(t):s.add(t);return s;});
  const logs = scrapeStatus.log||[];

  return(
    <>
      <style>{STYLE}</style>
      <header className="hdr">
        <div className="logo">
          <div className="logo-mark">🏡</div>
          <div><span className="logo-name">ImmoScraper</span><span className="logo-tag">CI</span></div>
        </div>
        <div className="hdr-r">
          {apiOk===true&&<div className="pill"><div className="dot"/>Live</div>}
          {apiOk===false&&<div style={{fontSize:11,color:"var(--red)"}}>⚠️ API off</div>}
          <button className="btn btn-ghost btn-sm" onClick={()=>window.open(`${API_BASE}/api/annonces/export`,"_blank")} disabled={!annonces.length}>⬇ CSV</button>
          <button className="btn btn-prime btn-sm" onClick={launchScrape} disabled={isScraping||apiOk===false}>
            {isScraping?`⏳${scrapeStatus.progress||0}%`:"⚡ Scraper"}
          </button>
        </div>
      </header>

      <div className="page">
        {isScraping&&(
          <div className="pb">
            <div className="pb-h"><div className="pb-t">⚡ {scrapeStatus.current||"Scraping..."}</div><div className="pb-p">{scrapeStatus.progress||0}%</div></div>
            <div className="bw"><div className="bar" style={{width:`${scrapeStatus.progress||0}%`}}/></div>
          </div>
        )}

        <div className="stats">
          <div className="stat s-or"><div className="stat-l">Total</div><div className="stat-v">{(stats?.total||0).toLocaleString()}</div><div className="stat-s">{stats?.sources?.length||0} sources</div></div>
          <div className="stat s-gr"><div className="stat-l">Nouveaux</div><div className="stat-v" style={{color:"var(--green)"}}>{stats?.new_24h||0}</div><div className="stat-s">24h</div></div>
          <div className="stat s-bl"><div className="stat-l">Ventes</div><div className="stat-v" style={{color:"var(--blue)"}}>{stats?.ventes||0}</div><div className="stat-s">≥{(minVente/1e6).toFixed(0)}M</div></div>
          <div className="stat s-vi"><div className="stat-l">Locations</div><div className="stat-v" style={{color:"var(--violet)"}}>{stats?.locations||0}</div><div className="stat-s">≥{(minLoyer/1e6).toFixed(1)}M</div></div>
        </div>

        <div className="tabs">
          {[{id:"annonces",label:"📋 Annonces"},{id:"config",label:"⚙️ Config"},{id:"logs",label:"📟 Logs"}].map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {tab==="annonces"&&(<>
          <div className="fb">
            <div className="srch"><span>🔍</span><input placeholder="Zone, type, description..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchAnnonces()}/></div>
            <select className="fsel" value={fTx} onChange={e=>setFTx(e.target.value)}><option>Tous</option><option>Vente</option><option>Location</option></select>
            <select className="fsel" value={fZone} onChange={e=>setFZone(e.target.value)}><option value="Toutes">Toutes zones</option>{[...activeZones].map(z=><option key={z}>{z}</option>)}</select>
            <select className="fsel" value={fType} onChange={e=>setFType(e.target.value)}><option value="Tous">Tous types</option>{[...activeTypes].map(t=><option key={t}>{t}</option>)}</select>
            <select className="fsel" value={sortBy} onChange={e=>setSortBy(e.target.value)}><option value="date">📅 Récents</option><option value="price_asc">💰 Prix ↑</option><option value="price_desc">💰 Prix ↓</option></select>
            <button className="btn btn-ghost btn-sm" onClick={fetchAnnonces}>🔄</button>
          </div>
          {loading?<div className="empty"><div style={{fontSize:36}}>⏳</div><div>Chargement...</div></div>
          :annonces.length===0?<div className="empty"><div style={{fontSize:44}}>🏚️</div><div>Aucune annonce — cliquez ⚡ Scraper</div>{apiOk===false&&<div style={{fontSize:11,color:"var(--red)"}}>API non joignable</div>}</div>
          :<div className="grid">{annonces.slice(0,80).map((a,i)=>{
            const photos=Array.isArray(a.photos)?a.photos:(typeof a.photos==="string"?JSON.parse(a.photos||"[]"):[]);
            return(<div key={a.id} className="card" style={{animationDelay:`${Math.min(i,20)*.025}s`}} onClick={()=>setSelected({...a,photos})}>
              <div className="cthumb">{photos[0]&&<img src={photos[0]} alt="" onError={e=>e.target.style.display="none"}/>}<span>{getEmoji(a.type_bien)}</span>
                <div className={`cbx ${a.tx_type==="Vente"?"cbx-v":"cbx-l"}`}>{a.tx_type}</div>
                {a.is_new===1&&<div className="cnew">🆕</div>}
                <div className="csrc">{a.source}</div>
              </div>
              <div className="cbody">
                <div className="cprice">{a.prix}</div>
                <div className="cttl">{a.type_bien} · {a.zone}</div>
                <div className="cloc">📍 {a.quartier}</div>
                <div className="cfeats">{a.surface&&<div className="feat">📐{a.surface}</div>}{a.pieces&&<div className="feat">🚪{a.pieces}p</div>}</div>
                <div className="cfoot"><div className="ctime">🕐{timeSince(a.scraped_at)}</div>
                  <div style={{display:"flex",gap:4}}>
                    <button className="btn btn-ghost btn-xs" onClick={e=>{e.stopPropagation();window.open(a.url,"_blank")}}>🔗</button>
                    <button className="btn btn-ghost btn-xs" onClick={e=>{e.stopPropagation();navigator.clipboard?.writeText(a.contact||a.url);showToast("Copie !","ok")}}>📋</button>
                  </div>
                </div>
              </div>
            </div>);
          })}</div>}
        </>)}

        {tab==="config"&&(<>
          <div className="cfg">
            <div className="cfg-ttl">💰 Prix & fenêtre</div>
            <div className="cfg-row">
              <div className="cfg-grp"><div className="cfg-lbl">Loyer min (FCFA)</div><input type="number" className="ifield" value={minLoyer} step={100000} onChange={e=>setMinLoyer(parseInt(e.target.value)||0)}/><div style={{fontSize:11,color:"var(--accent)"}}>{(minLoyer/1e6).toFixed(1)}M FCFA/mois</div></div>
              <div className="cfg-grp"><div className="cfg-lbl">Vente min (FCFA)</div><input type="number" className="ifield" value={minVente} step={5000000} onChange={e=>setMinVente(parseInt(e.target.value)||0)}/><div style={{fontSize:11,color:"var(--accent)"}}>{(minVente/1e6).toFixed(0)}M FCFA</div></div>
              <div className="cfg-grp"><div className="cfg-lbl">Fenêtre</div><select className="ifield" value={dateDays} onChange={e=>setDateDays(parseInt(e.target.value))}><option value={1}>24h</option><option value={3}>3 jours</option><option value={7}>7 jours</option><option value={14}>14 jours</option><option value={30}>30 jours</option></select></div>
            </div>
          </div>
          <div className="cfg"><div className="cfg-ttl">📍 Zones — {activeZones.size} actives</div><div className="tags">{ALL_ZONES.map(z=><div key={z} className={`tag ${activeZones.has(z)?"on":""}`} onClick={()=>toggleZone(z)}>{activeZones.has(z)&&"✓ "}{z}</div>)}</div></div>
          <div className="cfg"><div className="cfg-ttl">🏗️ Types — {activeTypes.size} actifs</div><div className="tags">{ALL_TYPES.map(t=><div key={t} className={`tag ${activeTypes.has(t)?"on":""}`} onClick={()=>toggleType(t)}>{activeTypes.has(t)&&"✓ "}{t}</div>)}</div></div>
          <div className="hint">💡 Après modification, cliquez <b>⚡ Scraper</b> pour appliquer.</div>
        </>)}

        {tab==="logs"&&(<>
          <div className="log-box" ref={logRef}>
            {logs.length===0?<div style={{color:"var(--muted)"}}>Lancez un scraping pour voir les logs.</div>
            :logs.map((l,i)=><div key={i} className={`ll ${l.level}`}>[{l.t}] {l.msg}</div>)}
          </div>
        </>)}
      </div>

      {selected&&(<div className="overlay" onClick={()=>setSelected(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-h"><div className="modal-ttl">{selected.type_bien} · {selected.zone}</div><button className="modal-close" onClick={()=>setSelected(null)}>✕</button></div>
        <div className="modal-img">{selected.photos?.[0]?<img src={selected.photos[0]} alt="" onError={e=>e.target.style.display="none"}/>:<span>{getEmoji(selected.type_bien)}</span>}</div>
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          <span className={`cbx ${selected.tx_type==="Vente"?"cbx-v":"cbx-l"}`} style={{position:"static",borderRadius:5}}>{selected.tx_type}</span>
          {selected.is_new===1&&<span style={{background:"var(--green)",color:"#fff",padding:"2px 7px",borderRadius:5,fontSize:10,fontWeight:700}}>🆕 Nouveau</span>}
        </div>
        <div className="cprice" style={{fontSize:20,marginBottom:5}}>{selected.prix}</div>
        <div className="cloc" style={{marginBottom:10,fontSize:12}}>📍 {selected.quartier}, {selected.zone}</div>
        <div className="dg">
          <div className="di"><div className="di-l">Type</div><div className="di-v">{selected.type_bien}</div></div>
          <div className="di"><div className="di-l">Surface</div><div className="di-v">{selected.surface||"N/A"}</div></div>
          <div className="di"><div className="di-l">Pièces</div><div className="di-v">{selected.pieces||"N/A"}</div></div>
          <div className="di"><div className="di-l">Contact</div><div className="di-v" style={{fontSize:12}}>{selected.contact||"Voir annonce"}</div></div>
          <div className="di"><div className="di-l">Source</div><div className="di-v" style={{fontSize:12}}>{selected.source}</div></div>
          <div className="di"><div className="di-l">Scrapé</div><div className="di-v" style={{fontSize:12}}>{timeSince(selected.scraped_at)}</div></div>
        </div>
        <div className="desc">{selected.description}</div>
        <div className="modal-acts">
          <button className="btn btn-prime" style={{flex:1}} onClick={()=>window.open(selected.url,"_blank")}>🔗 Voir l'annonce</button>
          <button className="btn btn-ghost" onClick={()=>{navigator.clipboard?.writeText(selected.contact||selected.url);showToast("Copie !","ok")}}>📋</button>
        </div>
      </div></div>)}

      {toast&&<div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
