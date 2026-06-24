import { NextResponse } from "next/server";
import type { StructuredChatResponse } from "@/lib/devis/types";

interface ChatErrorBody {
  error: string;
}

// POST n'est jamais mis en cache ; runtime explicite (variables serveur + fetch Node).
export const runtime = "nodejs";

const TIMEOUT_MS = 30_000;

/**
 * Unique rôle réseau du front : relayer le message du prospect vers le webhook
 * n8n et renvoyer la réponse de l'agent. Aucune logique métier ici.
 *
 * La réponse est désormais STRUCTURÉE : { reply, itineraire?, devis? }.
 *  - reply      : texte affiché dans le fil
 *  - itineraire : pilote la carte vectorielle du funnel /devis
 *  - devis      : carte récapitulative injectée dans le chat
 * La landing, qui ne lit que `reply`, reste compatible.
 */
export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return json<ChatErrorBody>(
      { error: "Le service de conversation n'est pas configuré." },
      500,
    );
  }

  // 1. Validation de l'entrée — jamais confiance au payload client.
  let body: { message?: unknown; sessionId?: unknown };
  try {
    body = await request.json();
  } catch {
    return json<ChatErrorBody>({ error: "Requête illisible." }, 400);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";

  if (!message) return json<ChatErrorBody>({ error: "Le message est vide." }, 400);
  if (message.length > 2000) return json<ChatErrorBody>({ error: "Message trop long." }, 413);

  // 2. Relais vers n8n avec timeout.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_WEBHOOK_SECRET
          ? { "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify({ sessionId, message }),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      return json<ChatErrorBody>(
        { error: "L'agent est momentanément indisponible. Réessayez." },
        502,
      );
    }

    return json<StructuredChatResponse>(await normalize(upstream));
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    return json<ChatErrorBody>(
      {
        error: aborted
          ? "L'agent met trop de temps à répondre. Réessayez."
          : "La conversation a été interrompue. Réessayez.",
      },
      aborted ? 504 : 502,
    );
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Normalise la sortie n8n. On accepte le texte sous reply/output/text/message,
 * et on laisse passer itineraire/devis s'ils sont présents (la validation fine
 * de leur forme reste la responsabilité du workflow n8n).
 */
async function normalize(res: Response): Promise<StructuredChatResponse> {
  const raw = await res.text();
  try {
    const data = JSON.parse(raw);
    const reply =
      [data?.reply, data?.output, data?.text, data?.message].find(
        (v) => typeof v === "string" && v.trim(),
      ) ?? "Je n'ai pas reçu de réponse exploitable.";

    return {
      reply: String(reply).trim(),
      ...(data?.itineraire ? { itineraire: data.itineraire } : {}),
      ...(data?.devis ? { devis: data.devis } : {}),
    };
  } catch {
    return { reply: raw.trim() || "Je n'ai pas reçu de réponse exploitable." };
  }
}

function json<T>(payload: T, status = 200) {
  return NextResponse.json<T>(payload, { status });
}
