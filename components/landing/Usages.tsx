import Link from "next/link";
import { USAGES } from "@/lib/landing/content";

export function Usages() {
  return (
    <section id="usages" className="bg-gray-50 px-6 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Ils se déplacent avec nous
          </h2>
          <p className="text-sm text-gray-500 md:text-base">
            Chaque profil a ses exigences. L&apos;IA adapte l&apos;accompagnement.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {USAGES.map((c) => (
            <Link
              key={c.title}
              href={`/devis?q=${encodeURIComponent(c.title)}`}
              className="group flex flex-col gap-4 rounded-[2rem] border border-gray-100 bg-white p-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.title}
                  className="aspect-video w-full bg-gray-200 object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="px-2">
                <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-lime-600">
                  {c.title}
                </h3>
                <p className="mb-4 mt-1 line-clamp-2 text-sm text-gray-500">
                  {c.desc}
                </p>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-lime-500" />
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    {c.tag}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
