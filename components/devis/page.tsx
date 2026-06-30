import { DevisShell } from "./DevisShell";

export default async function DevisPage({
  searchParams,
}: {
  // Dans Next.js 15, searchParams est une Promise
  searchParams: Promise<{ q?: string }>;
}) {
  // On "attend" la résolution de l'URL
  const resolvedParams = await searchParams;
  const initialQuery = resolvedParams?.q || null;

  return (
    <main className="h-screen w-full overflow-hidden bg-white">
      <DevisShell initialQuery={initialQuery} />
    </main>
  );
}