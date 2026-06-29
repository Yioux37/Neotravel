import { Bus, Plus, MessageSquare, MoreHorizontal, CheckCircle2, Clock, Edit2 } from "lucide-react";
import Link from "next/link";

export default function ChatSidebar({ history = [], onNewChat, activeChatId, onSelectChat }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "devis_envoye":
        return <span className="text-amber-600 bg-amber-50 border border-amber-100 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> En cours</span>;
      case "valide":
        return <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> Validé</span>;
      case "brouillon":
        return <span className="text-slate-500 bg-slate-100 border border-slate-200 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1"><Edit2 className="w-2.5 h-2.5" /> Brouillon</span>;
      default:
        return null;
    }
  };

  return (
    // Sidebar claire : bg-[#FAFAFA], texte sombre, bordure discrète
    <aside className="w-64 md:w-72 bg-[#FAFAFA] flex flex-col border-r border-slate-200 shrink-0 h-full">
      
      {/* HEADER SIDEBAR */}
      <div className="h-14 flex items-center px-5 border-b border-slate-200 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="bg-slate-900 p-1.5 rounded-lg shadow-sm">
            <Bus className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-sm text-slate-900">NeoTravel</span>
        </Link>
      </div>

      {/* BOUTON NOUVEAU CHAT */}
      <div className="p-4">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-between gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg transition-all text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          <span>Nouveau projet</span>
          <Plus className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* LISTE HISTORIQUE */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <p className="px-2 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Récents</p>
        
        {history.map(chat => {
          const isActive = activeChatId === chat.id;
          return (
            <button 
              key={chat.id} 
              onClick={() => onSelectChat(chat.id)}
              className={`w-full flex flex-col gap-1.5 px-3 py-2.5 rounded-lg transition-all text-left group relative ${
                isActive 
                  ? "bg-white shadow-sm border border-slate-200/60 ring-1 ring-slate-900/5 z-10" 
                  : "hover:bg-slate-100 border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`flex items-center gap-2 ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                  <span className={`text-[13px] truncate pr-2 ${isActive ? "font-medium" : "font-normal"}`}>
                    {chat.title}
                  </span>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="flex items-center justify-between w-full pl-5.5">
                <span className="text-[10px] text-slate-400">{chat.date}</span>
                {getStatusBadge(chat.status)}
              </div>
            </button>
          );
        })}
      </div>

      {/* PROFIL UTILISATEUR */}
      <div className="p-4 border-t border-slate-200 bg-[#FAFAFA]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-[10px] shrink-0">
            YD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">Yrieix D.</p>
            <p className="text-[10px] text-slate-500 truncate">Espace Pro</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
