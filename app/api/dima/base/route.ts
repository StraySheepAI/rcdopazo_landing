import { createReviewHandlers } from "@/lib/dima/review";
import { getDimaStore } from "@/lib/dima/store";

export const runtime = "nodejs";
const handlers = createReviewHandlers(process.env, getDimaStore);
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
