import { createDimaAccessHandlers } from "@/lib/dima/access";

const handlers = createDimaAccessHandlers(process.env);
export const GET = handlers.GET;
export const POST = handlers.POST;
export const DELETE = handlers.DELETE;
