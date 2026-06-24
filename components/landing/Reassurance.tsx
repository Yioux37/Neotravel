import { REASSURANCE } from "@/lib/landing/content";

export function Reassurance() {
  return (
    <section className="bg-gray-50 px-6 md:px-8">
      <div className="relative z-10 mx-auto -mt-16 w-full max-w-7xl rounded-[2rem] border border-gray-100 bg-white p-6 text-gray-900 shadow-xl md:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASSURANCE.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors duration-300 hover:bg-gray-50"
            >
              <div className="rounded-lg bg-lime-100 p-2 text-lime-700">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <span className="text-sm font-semibold text-gray-700">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
