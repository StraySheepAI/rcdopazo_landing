import { createDimaHandlers } from "@/lib/dima/service";

export const runtime = "nodejs";
export const maxDuration = 120;

const handlers = createDimaHandlers({ fetch: (...args) => fetch(...args), env: process.env });

export async function GET(request: Request) { return handlers.GET(request); }
export const POST = handlers.POST;
