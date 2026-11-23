import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { localReviewAllowed } from "@/lib/dima/review";
import BaseView from "./BaseView";

export const dynamic = "force-dynamic";
export default async function DimaBasePage() {
  if (!localReviewAllowed((await headers()).get("host") || "", process.env)) notFound();
  return <BaseView />;
}
