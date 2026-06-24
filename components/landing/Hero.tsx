import { ChatPanel } from "@/components/chat/ChatPanel";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Halo discret derrière le chat */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-[36rem] w-[36rem] rounded-full bg-route/10 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        {/* Colonne texte — la "thèse" : un trajet devient un prix */}
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-route-deep">
            Devis autocar en ligne
          </p>

          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            De votre point de départ
            <br />
            à votre devis,
            <span className="text-route-deep"> en une conversation.</span>
          </h1>

          {/* Signature : la ligne d'itinéraire départ ● — — ● destination */}
          <div className="route-line mt-7 max-w-sm" aria-hidden>
            <span className="route-track route-track--animated" />
          </div>
          <div className="mt-2 flex max-w-sm justify-between font-mono text-xs text-slate">
            <span>Départ</span>
            <span>Devis PDF</span>
          </div>

          <p className="mt-7 text-lg leading-relaxed text-slate">
            Pas de formulaire à rallonge. Décrivez votre trajet à l&apos;agent
            NeoTravel&nbsp;: il calcule le tarif, prépare le devis et vous
            l&apos;envoie. Vous gardez la main, à l&apos;écrit.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-ink">
            <span>● Réponse immédiate</span>
            <span>● Devis chiffré</span>
            <span>● PDF par e-mail</span>
          </div>
        </div>

        {/* Colonne chat — la démo vivante, pas une capture */}
        <div className="lg:pl-6">
          <ChatPanel />
        </div>
      </div>
    </section>
  );
}
