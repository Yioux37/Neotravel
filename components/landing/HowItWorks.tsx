const STEPS = [
  {
    n: "01",
    title: "Vous décrivez le trajet",
    body: "Départ, destination, date, nombre de passagers. À l'écrit, comme un message.",
  },
  {
    n: "02",
    title: "L'agent calcule le devis",
    body: "Les règles de tarification s'appliquent automatiquement : saison, capacité, urgence, options.",
  },
  {
    n: "03",
    title: "Vous recevez le PDF",
    body: "Le devis chiffré arrive par e-mail. Sans réponse, une relance vous est envoyée au bon moment.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-mist bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Trois étapes, zéro formulaire
        </h2>

        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.n} className="relative">
              <span className="font-mono text-sm font-semibold text-route-deep">
                {step.n}
              </span>
              <span
                aria-hidden
                className="mt-3 block h-px w-10 bg-route"
              />
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
