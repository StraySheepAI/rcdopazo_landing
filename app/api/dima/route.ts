import { createDimaHandlers } from "@/lib/dima/service";

const handlers = createDimaHandlers({ fetch: (...args) => fetch(...args), env: process.env });

export async function GET(request: Request) { return handlers.GET(request); }
export const POST = handlers.POST;
