import { DevisShell } from "../../components/devis/DevisShell";

export default function DevisPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  // On récupère la question posée depuis la page d'accueil (le fameux ?q=)
  const initialQuery = searchParams.q || null;

  return (
    <main className="h-screen w-full overflow-hidden bg-white">
      <DevisShell initialQuery={initialQuery} />
    </main>
  );
}