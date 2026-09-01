"use client";

import { FormEvent, useState } from "react";

type ContactFormCopy = {
  heading: string;
  subheading: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  success: string;
  successDetail: string;
  error: string;
};

export function ContactForm({ copy }: { copy: ContactFormCopy }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const response = await fetch("https://formspree.io/f/mwvyapvb", {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    setStatus(response.ok ? "success" : "error");
    if (response.ok) form.reset();
  }

  return (
    <div className="contact-form-shell reveal">
      <p className="contact-form-mark">✦ R.C. Dopazo</p>
      <h3>{copy.heading}</h3>
      <p className="contact-form-subtitle">{copy.subheading}</p>
      {status === "success" ? (
        <div className="contact-form-success" role="status">
          <strong>{copy.success}</strong>
          <span>{copy.successDetail}</span>
        </div>
      ) : (
        <form className="contact-form" onSubmit={submit}>
          <label>
            <span>{copy.name}</span>
            <input name="nombre" type="text" placeholder={copy.namePlaceholder} required />
          </label>
          <label>
            <span>{copy.email}</span>
            <input name="email" type="email" placeholder={copy.emailPlaceholder} required />
          </label>
          <label>
            <span>{copy.message}</span>
            <textarea name="mensaje" placeholder={copy.messagePlaceholder} required />
          </label>
          {status === "error" && <p className="contact-form-error">{copy.error}</p>}
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? copy.sending : `${copy.send} →`}
          </button>
        </form>
      )}
    </div>
  );
}
