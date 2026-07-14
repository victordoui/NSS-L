import { useEffect, useRef } from "react";

type TurnstileOptions = {
  sitekey: string;
  action: string;
  theme: "light" | "dark" | "auto";
  appearance: "always" | "execute" | "interaction-only";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileWidgetProps {
  siteKey: string;
  resetKey: number;
  onVerify: (token: string | null) => void;
}

const SCRIPT_ID = "cloudflare-turnstile-script";

const TurnstileWidget = ({ siteKey, resetKey, onVerify }: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>();
  const onVerifyRef = useRef(onVerify);

  onVerifyRef.current = onVerify;

  useEffect(() => {
    if (!siteKey) return;

    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action: "contact_form",
        theme: "light",
        appearance: "interaction-only",
        callback: (token) => onVerifyRef.current(token),
        "expired-callback": () => onVerifyRef.current(null),
        "error-callback": () => onVerifyRef.current(null),
      });
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    if (window.turnstile) renderWidget();
    else script.addEventListener("load", renderWidget);

    return () => {
      script?.removeEventListener("load", renderWidget);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, [siteKey]);

  useEffect(() => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      onVerifyRef.current(null);
    }
  }, [resetKey]);

  if (!siteKey) {
    return (
      <p className="text-sm text-destructive" role="alert">
        A proteção anti-spam ainda não foi configurada para este ambiente.
      </p>
    );
  }

  return <div ref={containerRef} aria-label="Verificação de segurança" />;
};

export default TurnstileWidget;
