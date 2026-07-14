-- Store only salted IP hashes used by the contact form rate limiter.
-- Anonymous and authenticated clients receive no privileges or RLS policies.
CREATE TABLE public.contact_submission_attempts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submission_attempts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.contact_submission_attempts FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.contact_submission_attempts_id_seq FROM anon, authenticated;

GRANT SELECT, INSERT, DELETE ON TABLE public.contact_submission_attempts TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.contact_submission_attempts_id_seq TO service_role;

CREATE INDEX contact_submission_attempts_ip_created_idx
  ON public.contact_submission_attempts (ip_hash, created_at DESC);

COMMENT ON TABLE public.contact_submission_attempts IS
  'Private rate-limit events for the public contact form; ip_hash is salted and irreversible.';
