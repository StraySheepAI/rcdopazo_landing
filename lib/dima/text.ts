export const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
export const cleanText = (value: unknown) => typeof value === "string" ? value.replace(/[\u200B-\u200D\uFEFF]/g, "").trim() : "";
export const hasText = (value: unknown) => Boolean(cleanText(value).replace(/^[—–\-\s]+$/, ""));
