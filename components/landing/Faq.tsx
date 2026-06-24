"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS, type Faq as FaqType } from "@/lib/landing/content";

function FaqItem({ faq }: { faq: FaqType }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-2 text-left font-bold text-gray-900 transition-colors hover:text-lime-600"
      >
        <span>{faq.q}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-500">
          {faq.a}
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  return (
    <section className="border-t border-gray-100 bg-gray-50 px-6 py-20 md:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-900 md:text-3xl">
          Questions fréquentes
        </h2>
        <p className="mb-8 text-center text-sm text-gray-500">
          Tout savoir sur notre modèle hybride IA et humain.
        </p>
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
