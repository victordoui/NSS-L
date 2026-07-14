import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MINUTES = 15;
const MAX_REQUEST_BYTES = 16_384;

type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  message: string;
  turnstileToken: string;
  website: string;
};

type TurnstileOutcome = {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

type ContactDatabase = {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string;
          message: string;
          is_read: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_submission_attempts: {
        Row: {
          id: number;
          ip_hash: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          ip_hash: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          ip_hash?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

const json = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

const readString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const parsePayload = (value: unknown): ContactPayload | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const input = value as Record<string, unknown>;
  const payload: ContactPayload = {
    name: readString(input.name).replace(/\s+/g, " "),
    phone: readString(input.phone),
    email: readString(input.email).toLowerCase(),
    message: readString(input.message),
    turnstileToken: readString(input.turnstileToken),
    website: readString(input.website),
  };

  const phoneDigits = payload.phone.replace(/\D/g, "");
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);

  if (
    payload.name.length < 2 || payload.name.length > 100 ||
    phoneDigits.length < 8 || phoneDigits.length > 15 ||
    !validEmail || payload.email.length > 255 ||
    payload.message.length < 10 || payload.message.length > 2_000 ||
    payload.turnstileToken.length > 2_048 ||
    payload.website.length > 255
  ) {
    return null;
  }

  return payload;
};

const getClientIp = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    forwarded ||
    "unknown";
};

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const verifyTurnstile = async (token: string, ip: string, secret: string) => {
  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  formData.append("remoteip", ip);
  formData.append("idempotency_key", crypto.randomUUID());

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) return null;
  return await response.json() as TurnstileOutcome;
};

export default {
  fetch: withSupabase<ContactDatabase>({
    auth: "none",
    env: {
      publishableKeys: { default: Deno.env.get("SUPABASE_ANON_KEY") || "" },
      secretKeys: { default: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "" },
    },
  }, async (request, context) => {
    if (request.method !== "POST") {
      return json({ ok: false, code: "METHOD_NOT_ALLOWED" }, 405);
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_REQUEST_BYTES) {
      return json({ ok: false, code: "PAYLOAD_TOO_LARGE" }, 413);
    }

    let rawPayload: unknown;
    try {
      rawPayload = await request.json();
    } catch {
      return json({ ok: false, code: "INVALID_INPUT" }, 400);
    }

    const payload = parsePayload(rawPayload);
    if (!payload) {
      return json({ ok: false, code: "INVALID_INPUT" }, 400);
    }

    const rateLimitSalt = Deno.env.get("CONTACT_RATE_LIMIT_SALT");
    if (!rateLimitSalt) {
      console.error("Contact rate-limit secret is not configured");
      return json({ ok: false, code: "SERVICE_UNAVAILABLE" }, 503);
    }
    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");

    const clientIp = getClientIp(request);
    const ipHash = await sha256(`${rateLimitSalt}:${clientIp}`);
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000).toISOString();

    const { count, error: countError } = await context.supabaseAdmin
      .from("contact_submission_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", windowStart);

    if (countError) {
      console.error("Contact rate-limit lookup failed", countError.code);
      return json({ ok: false, code: "SERVICE_UNAVAILABLE" }, 503);
    }

    if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return json({ ok: false, code: "RATE_LIMITED" }, 429);
    }

    const { error: attemptError } = await context.supabaseAdmin
      .from("contact_submission_attempts")
      .insert({ ip_hash: ipHash });

    if (attemptError) {
      console.error("Contact rate-limit insert failed", attemptError.code);
      return json({ ok: false, code: "SERVICE_UNAVAILABLE" }, 503);
    }

    await context.supabaseAdmin
      .from("contact_submission_attempts")
      .delete()
      .eq("ip_hash", ipHash)
      .lt("created_at", new Date(Date.now() - 86_400_000).toISOString());

    if (payload.website) {
      return json({ ok: true });
    }

    if (turnstileSecret) {
      if (!payload.turnstileToken) {
        return json({ ok: false, code: "BOT_REJECTED" }, 400);
      }

      let turnstile: TurnstileOutcome | null = null;
      try {
        turnstile = await verifyTurnstile(payload.turnstileToken, clientIp, turnstileSecret);
      } catch (error) {
        console.error("Turnstile request failed", error instanceof Error ? error.name : "unknown");
      }

      if (!turnstile?.success) {
        return json({ ok: false, code: "BOT_REJECTED" }, 400);
      }

      const allowedHostnames = (Deno.env.get("TURNSTILE_ALLOWED_HOSTNAMES") || "")
        .split(",")
        .map((hostname) => hostname.trim().toLowerCase())
        .filter(Boolean);

      if (
        allowedHostnames.length > 0 &&
        (!turnstile.hostname || !allowedHostnames.includes(turnstile.hostname.toLowerCase()))
      ) {
        return json({ ok: false, code: "BOT_REJECTED" }, 400);
      }
    }

    const { error: insertError } = await context.supabaseAdmin
      .from("contact_messages")
      .insert({
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        message: payload.message,
      });

    if (insertError) {
      console.error("Contact message insert failed", insertError.code);
      return json({ ok: false, code: "SERVICE_UNAVAILABLE" }, 503);
    }

    return json({ ok: true });
  }),
};
