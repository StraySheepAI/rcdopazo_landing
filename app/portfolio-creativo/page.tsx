import { redirect } from "next/navigation";

/**
 * Canonical entry point for the creative portfolio.
 * The portfolio catalogue is maintained in /obras; this legacy-facing route
 * keeps the public menu URL stable while opening the complete catalogue.
 */
export default function PortfolioCreativoPage() {
  redirect("/obras?filtro=todas");
}
