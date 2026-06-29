import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Bus, ArrowRight, Shield, Clock, Sparkles, MapPin, Paperclip, Send, Check, Loader2, Route } from "lucide-react";
import ChatSidebar from "../components/ChatSidebar"; 

// Import dynamique Leaflet
const RouteMap = dynamic(() => import("../components/RouteMap"), { ssr: false });

const INITIAL_HISTORY = [
  { id: "c1", title: "Séminaire Annecy", date: "Il y a 2h", status: "devis_envoye", data: { villeDepart: "Lyon", villeArrivee: "Annecy", typeDeplacement: "Aller-Retour", trancheVoyageurs: "20-50", step: "final", log: [{ sender: "ia", text: "Voici le récapitulatif de votre demande." }, { sender: "ia", type: "component-final" }] } }
];

export default function DevisAgentPage() {
  const router = useRouter();
  const { q } = router.query;

  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [activeChatId, setActiveChatId] = useState(null); 
  const [chatLog, setChatLog] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState("type");
  
  const [formDetails, setFormDetails] = useState({ villeDepart: "Lyon", villeArrivee: "", dateDepart: "2026-06-30", dateRetour: "2026-07-02" });
  const [typeDeplacement, setTypeDeplacement] = useState("Aller-Retour");
  const [trancheVoyageurs, setTrancheVoyageurs] = useState("");
  const [formCoordonnees, setFormCoordonnees] = useState({ nom: "", tel: "", email: "" });
  
  // ÉTATS DE LA CARTE OSRM
  const [routeData, setRouteData] = useState({ coords: [], distance: 0, duration: 0, start: null, end: null, isCalculating: false });
  const chatBottomRef = useRef(null);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatLog]);

  // INITIALISATION
  useEffect(() => {
    if (!router.isReady || activeChatId) return;
    const queryText = q ? decodeURIComponent(q) : "";
    if(!queryText) { handleNewChat(); return; }
    
    let destName = queryText;
    let detectedType = (queryText.toLowerCase().includes("circuit") || queryText.includes(",")) ? "Circuit" : "Aller-Retour";
    
    setTypeDeplacement(detectedType);
    setFormDetails(f => ({ ...f, villeArrivee: destName }));

    setChatLog([
      { sender: "ia", text: `Bonjour, j'ai bien reçu votre demande pour ${destName}. Configurons ensemble votre itinéraire routier.` },
      { sender: "ia", type: "component-type" }
    ]);
  }, [q, router.isReady]);

  // LA FONCTION MAGIQUE QUI CALCULE LE VRAI TRAJET (CORRIGÉE)
  const calculateRealRoute = async (depart, arrivee) => {
    setRouteData(prev => ({ ...prev, isCalculating: true }));
    try {
      // 1. Convertir les Villes en Coordonnées GPS (Nominatim SANS restriction pays)
      const startRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${depart}&format=json&limit=1`);
      const startData = await startRes.json();
      
      const endDest = arrivee.split(',')[0].trim();
      const endRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${endDest}&format=json&limit=1`);
      const endData = await endRes.json();

      if (startData.length > 0 && endData.length > 0) {
        const start = { lat: parseFloat(startData[0].lat), lon: parseFloat(startData[0].lon) };
        const end = { lat: parseFloat(endData[0].lat), lon: parseFloat(endData[0].lon) };

        // 2. Tracer la route réelle sur les routes (OSRM)
        const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`);
        const osrmData = await osrmRes.json();

        if (osrmData.routes && osrmData.routes.length > 0) {
          const route = osrmData.routes[0];
          // OSRM donne [lon, lat], on inverse pour Leaflet [lat, lon]
          const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

          setRouteData({
            coords: coordinates,
            distance: (route.distance / 1000).toFixed(0), // Distance en km
            duration: Math.round(route.duration / 60), // Temps en minutes
            start: { name: depart, coords: [start.lat, start.lon] },
            end: { name: endDest, coords: [end.lat, end.lon] },
            isCalculating: false
          });
          return true;
        } else {
             // Si OSRM ne trouve pas de route (ex: un océan au milieu), on trace une ligne droite
            setRouteData({
                coords: [[start.lat, start.lon], [end.lat, end.lon]],
                distance: "N/A",
                duration: "N/A",
                start: { name: depart, coords: [start.lat, start.lon] },
                end: { name: endDest, coords: [end.lat, end.lon] },
                isCalculating: false
            })
        }
      } else {
          // Si Nominatim ne trouve pas les villes
          console.error("Villes non trouvées par Nominatim");
      }
    } catch (error) {
      console.error("Erreur de calcul de route:", error);
    }
    setRouteData(prev => ({ ...prev, isCalculating: false }));
    return false;
  };

  // ACTIONS
  const handleNewChat = () => {
    setActiveChatId(null);
    setChatLog([{ sender: "ia", text: "Nouvelle configuration démarrée." }, { sender: "ia", type: "component-type" }]);
    setCurrentStep("type");
    setFormDetails({ villeDepart: "Lyon", villeArrivee: "", dateDepart: "", dateRetour: "" });
    setRouteData({ coords: [], distance: 0, duration: 0, start: null, end: null, isCalculating: false });
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    const selected = history.find(h => h.id === id);
    if(selected && selected.data) {
      setFormDetails(f => ({ ...f, villeDepart: selected.data.villeDepart, villeArrivee: selected.data.villeArrivee }));
      setTypeDeplacement(selected.data.typeDeplacement);
      setTrancheVoyageurs(selected.data.trancheVoyageurs);
      setCurrentStep(selected.data.step);
      setChatLog(selected.data.log);
      calculateRealRoute(selected.data.villeDepart, selected.data.villeArrivee);
    }
  };

  const selectType = (type) => {
    setTypeDeplacement(type);
    setCurrentStep("voyageurs");
    setChatLog(prev => [...prev, { sender: "user", text: `Je choisis : ${type}` }, { sender: "ia", type: "component-voyageurs", text: "Parfait. Combien de passagers prévoyez-vous ?" }]);
  };

  const selectVoyageurs = (tranche) => {
    setTrancheVoyageurs(tranche);
    setCurrentStep("details");
    setChatLog(prev => [...prev, { sender: "user", text: `${tranche} passagers.` }, { sender: "ia", type: "component-details", text: "Veuillez confirmer les dates et lieux exacts ci-dessous :" }]);
  };

  const submitDetails = async (e) => {
    e.preventDefault();
    setCurrentStep("loading");
    setChatLog(prev => [...prev, { sender: "user", text: `Adresses et dates validées.` }, { sender: "ia", type: "component-loading" }]);
    
    await calculateRealRoute(formDetails.villeDepart, formDetails.villeArrivee);

    setCurrentStep("coordonnees");
    setChatLog(prev => [...prev, { sender: "ia", type: "component-coordonnees", text: "Itinéraire RSE calculé avec succès. Laissez vos coordonnées pour découvrir le tarif." }]);
  };

  const submitCoordonnees = (e) => {
    e.preventDefault();
    setCurrentStep("final");
    const finalLog = [...chatLog, { sender: "user", text: `Coordonnées envoyées.` }, { sender: "ia", type: "component-final" }];
    setChatLog(finalLog);

    const newId = `c${Date.now()}`;
    setHistory([{ id: newId, title: `${formDetails.villeDepart} → ${formDetails.villeArrivee}`, date: "À l'instant", status: "valide", data: { ...formDetails, typeDeplacement, trancheVoyageurs, step: "final", log: finalLog } }, ...history]);
    setActiveChatId(newId);
  };

  const handleManualSend = () => {
    if (!inputValue.trim()) return;
    setChatLog(prev => [...prev, { sender: "user", text: inputValue }]);
    if (currentStep === "details" || currentStep === "type") setFormDetails(f => ({ ...f, villeArrivee: inputValue }));
    setInputValue("");
    setTimeout(() => setChatLog(prev => [...prev, { sender: "ia", text: "Mise à jour en cours..." }]), 600);
  };

  const formatDuration = (mins) => {
     if(mins === "N/A" || !mins) return '--';
     if(mins < 60) return `${mins} min`;
     return `${Math.floor(mins/60)}h${(mins%60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans text-slate-900 overflow-hidden">
      <ChatSidebar history={history} onNewChat={handleNewChat} activeChatId={activeChatId} onSelectChat={handleSelectChat} />

      {/* CENTRE : CHAT */}
      <section className="flex-1 flex flex-col relative z-10 border-r border-slate-200 min-w-0 bg-white">
        <header className="h-14 flex items-center justify-between px-6 shrink-0 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
             <span className="font-medium text-sm">Agent Logistique IA</span>
             <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide flex items-center gap-1">
                <Check className="w-3 h-3" /> Connecté OSRM
             </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-32 py-10 space-y-10 scroll-smooth">
          {chatLog.map((msg, i) => (
            <div key={i} className={`flex flex-col w-full animate-fadeIn`}>
              {msg.sender === "user" && (
                <div className="flex justify-end mb-2">
                  <div className="bg-slate-100 border border-slate-200/50 text-slate-800 px-5 py-3 rounded-2xl text-[14px] leading-relaxed max-w-[80%] font-medium">
                    {msg.text}
                  </div>
                </div>
              )}
              {msg.sender === "ia" && (
                <div className="flex gap-4 w-full">
                  <div className="w-8 h-8 rounded-lg bg-lime-100/50 border border-lime-200/50 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-lime-600" />
                  </div>
                  <div className="flex-1 space-y-4 pt-1">
                    {msg.text && <p className="text-slate-800 text-[15px] leading-relaxed">{msg.text}</p>}

                    {msg.type === "component-type" && currentStep === "type" && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mt-4">
                        {[{ id: "Aller-Retour", t: "Aller-Retour" }, { id: "Aller simple", t: "Aller Simple" }, { id: "Circuit", t: "Circuit" }].map(btn => (
                          <button key={btn.id} onClick={() => selectType(btn.id)} className="flex flex-col items-start bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-400 transition-all text-left shadow-sm">
                            <span className="font-semibold text-sm text-slate-900">{btn.t}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.type === "component-voyageurs" && currentStep === "voyageurs" && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {["10-20", "20-50", "50-75", "100+"].map(t => (
                          <button key={t} onClick={() => selectVoyageurs(t)} className="bg-white border border-slate-200 hover:border-slate-400 text-slate-700 font-medium text-sm rounded-lg px-5 py-2.5 transition-colors shadow-sm">{t} pax</button>
                        ))}
                      </div>
                    )}

                    {msg.type === "component-details" && currentStep === "details" && (
                      <form onSubmit={submitDetails} className="w-full max-w-2xl border border-slate-200 rounded-xl p-6 space-y-6 mt-4 shadow-sm bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2">Ville de départ</label>
                            <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" value={formDetails.villeDepart} onChange={e => setFormDetails({...formDetails, villeDepart: e.target.value})} />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2">Destination</label>
                            <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" value={formDetails.villeArrivee} onChange={e => setFormDetails({...formDetails, villeArrivee: e.target.value})} />
                          </div>
                          <div><label className="block text-xs font-semibold text-slate-700 mb-2">Date Aller</label><input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none text-slate-600" value={formDetails.dateDepart} onChange={e => setFormDetails({...formDetails, dateDepart: e.target.value})} /></div>
                          <div><label className="block text-xs font-semibold text-slate-700 mb-2">Date Retour</label><input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none text-slate-600" value={formDetails.dateRetour} onChange={e => setFormDetails({...formDetails, dateRetour: e.target.value})} /></div>
                        </div>
                        <div className="pt-2">
                           <button type="submit" disabled={routeData.isCalculating} className="bg-slate-900 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-slate-800 transition-colors w-max disabled:opacity-50">Valider l'itinéraire</button>
                        </div>
                      </form>
                    )}

                    {msg.type === "component-loading" && currentStep === "loading" && (
                      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex items-center gap-4">
                        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                        <span className="text-sm font-medium text-slate-600">Recherche de la route réelle et calcul RSE...</span>
                      </div>
                    )}

                    {msg.type === "component-coordonnees" && currentStep === "coordonnees" && (
                      <form onSubmit={submitCoordonnees} className="w-full max-w-sm border border-slate-200 rounded-xl p-5 space-y-4 mt-4 bg-white shadow-sm">
                        <input type="text" required placeholder="Votre nom" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400" value={formCoordonnees.nom} onChange={e => setFormCoordonnees({...formCoordonnees, nom: e.target.value})} />
                        <input type="email" required placeholder="Email pro" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400" value={formCoordonnees.email} onChange={e => setFormCoordonnees({...formCoordonnees, email: e.target.value})} />
                        <button type="submit" className="w-full bg-slate-900 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-slate-800 transition-colors">Découvrir mon devis</button>
                      </form>
                    )}

                    {msg.type === "component-final" && (
                      <div className="w-full max-w-xl border border-slate-200 rounded-xl p-6 mt-4 shadow-sm bg-white">
                        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                          <div>
                            <span className="font-semibold text-base text-slate-900">Devis RSE Neotravel</span>
                          </div>
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold px-2 py-1 rounded uppercase flex items-center gap-1"><Shield className="w-3 h-3" /> Sécurisé</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                           <div>
                              <p className="text-[10px] font-semibold text-slate-500 uppercase mb-1">Configuration</p>
                              <p className="text-sm font-medium text-slate-900">{typeDeplacement}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-semibold text-slate-500 uppercase mb-1">Distance de route</p>
                              <p className="text-sm font-medium text-slate-900">{routeData.distance > 0 ? `${routeData.distance} km` : "..."}</p>
                           </div>
                           <div className="col-span-2">
                              <p className="text-[10px] font-semibold text-slate-500 uppercase mb-1">Itinéraire</p>
                              <p className="text-sm font-medium text-slate-900">{formDetails.villeDepart} → {formDetails.villeArrivee}</p>
                           </div>
                        </div>

                        <div className="flex justify-between items-end bg-slate-50 rounded-lg p-4 border border-slate-100">
                          <div>
                             <p className="text-[11px] font-semibold text-slate-500 uppercase mb-0.5">Total estimé HT</p>
                             <p className="text-2xl font-bold text-slate-900">1 420 €</p>
                          </div>
                          <button className="bg-lime-400 text-slate-900 text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-lime-500 transition-colors">Réserver</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Textuel */}
        <div className="p-4 bg-white border-t border-slate-200/60 sticky bottom-0">
           <div className="max-w-3xl mx-auto flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 shadow-sm focus-within:border-slate-400 transition-all">
              <textarea 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if(e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleManualSend(); }}}
                placeholder="Discutez avec l'agent..." 
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-slate-800 placeholder:text-slate-400 resize-none py-2.5 ml-2 min-h-[44px]"
                rows={1}
              />
              <button onClick={handleManualSend} className="bg-slate-900 text-white p-2.5 mb-0.5 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50" disabled={!inputValue.trim()}>
                <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </section>

      {/* 3. DROITE : VRAIE CARTE */}
      <section className="hidden lg:flex flex-1 max-w-[450px] relative flex-col shrink-0 border-l border-slate-200 bg-[#f9fafb]">
        
        {/* Télémétrie OSRM */}
        <div className="absolute top-6 left-6 right-6 z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-xl px-5 py-4 border border-slate-200 shadow-md">
             <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <Route className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-xs text-slate-700">Télémétrie Routière</span>
             </div>
             <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Distance réelle</p>
                  <p className="text-base font-black text-slate-900">
                    {routeData.isCalculating ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : (routeData.distance !== "N/A" && routeData.distance > 0 ? `${routeData.distance} km` : '--')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Conduite pure</p>
                  <p className="text-base font-black text-slate-900">
                     {routeData.isCalculating ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : (routeData.duration !== "N/A" && routeData.duration > 0 ? formatDuration(routeData.duration) : '--')}
                  </p>
                </div>
             </div>
          </div>
        </div>

        {/* COMPOSANT LEAFLET DYNAMIQUE */}
        <div className="flex-1 w-full h-full relative">
          <RouteMap routeCoords={routeData.coords} startPoint={routeData.start} endPoint={routeData.end} />
        </div>
        
      </section>

      <style jsx global>{`
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
