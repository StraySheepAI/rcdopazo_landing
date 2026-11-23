type Env = Record<string, string | undefined>;

// Preserve direct-provider deployments; Gateway uses the deployment's identity.
export function dimaProvider(env: Env) {
  if (env.ANTHROPIC_API_KEY) return {
    model: env.DIMA_MODEL || "claude-haiku-4-5-20251001",
    url: "https://api.anthropic.com/v1/messages",
    headers: { "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" } as Record<string, string>,
  };
  const token = env.AI_GATEWAY_API_KEY || (env.VERCEL ? env.VERCEL_OIDC_TOKEN : undefined);
  if (env.DIMA_GATEWAY_MODEL && token) return {
    model: env.DIMA_GATEWAY_MODEL,
    url: "https://ai-gateway.vercel.sh/v1/messages",
    headers: { Authorization: `Bearer ${token}`, "anthropic-version": "2023-06-01" } as Record<string, string>,
  };
  return undefined;
}
