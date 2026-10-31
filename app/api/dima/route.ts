import { createDimaHandlers } from "@/lib/dima/service";

const handlers = createDimaHandlers({ fetch: (...args) => fetch(...args), env: process.env });

export const GET = handlers.GET;
export const POST = handlers.POST;
