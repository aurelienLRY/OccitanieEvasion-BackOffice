import { NextResponse } from "next/server";

type CallbackResponse = {
  success: boolean;
  data: any;
  feedback: string[] | null;
  error: string | null;
};

/**
 * Crée un objet de réponse formaté
 * @template T - Type de callback (ICallback ou ICallbackForUser etc.)
 */
export const createResponse = <T extends CallbackResponse>(
  success: boolean,
  data: T["data"] = null,
  feedback: T["feedback"] = null,
  error: string | null = null,
  status: number
): NextResponse<T> => {
  return NextResponse.json(
    {
      success,
      data,
      feedback,
      error,
    } as T,
    { status }
  );
};
