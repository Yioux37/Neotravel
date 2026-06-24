import { REVIEWS } from "@/lib/landing/content";

export function Reviews() {
  return (
    <section className="border-t border-gray-100 bg-white px-6 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-left">
          Ils nous font confiance
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <div
              key={r.auteur}
              className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-sm"
            >
              <p className="mb-6 text-sm italic leading-relaxed text-gray-600">
                “{r.text}”
              </p>
              <div className="flex items-center justify-between border-t border-gray-200/60 pt-4">
                <div>
                  <p className="text-sm font-bold text-gray-900">{r.auteur}</p>
                  <p className="text-xs text-gray-400">{r.entreprise}</p>
                </div>
                <div
                  className="flex text-sm text-amber-400"
                  aria-label={`${r.note} sur 5`}
                >
                  {"★".repeat(r.note)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
