import { MessageSquare, Zap, Users } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquare,
    title: "Discutez",
    desc: "Décrivez votre besoin en langage naturel à notre assistant. Finis les formulaires interminables.",
  },
  {
    icon: Zap,
    title: "Devis instantané",
    desc: "Notre moteur déterministe calcule le prix en temps réel. Un calcul transparent, jamais inventé par l'IA.",
  },
  {
    icon: Users,
    title: "Validation humaine",
    desc: "Un expert Neotravel prend la main sur votre dossier pour sécuriser la logistique et valider l'autocariste.",
  },
];

export function Process() {
  return (
    <section
      id="processus"
      className="border-b border-t border-gray-100 bg-white px-6 py-20 md:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            La fluidité de l&apos;IA, la fiabilité de nos experts.
          </h2>
          <p className="text-gray-500">
            Un processus transparent où la technologie automatise le répétitif et
            l&apos;humain sécurise l&apos;essentiel.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center p-4 text-center">
              <div className="mb-5 rounded-2xl bg-gray-900 p-4 text-lime-400 shadow-lg">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mb-2 text-xl font-bold">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
