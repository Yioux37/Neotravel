// Types partagés entre le client (hook + composants) et la route API.
// Aucun "use client" : ce sont des types purs, effacés à la compilation.

export type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

/** Corps envoyé par le navigateur vers /api/chat */
export interface ChatRequestBody {
  sessionId: string;
  message: string;
}

/** Réponse normalisée renvoyée par /api/chat au navigateur */
export interface ChatResponseBody {
  reply: string;
}

/** Forme d'erreur normalisée renvoyée par /api/chat */
export interface ChatErrorBody {
  error: string;
}
