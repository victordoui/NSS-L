-- Fix function search paths for security compliance
CREATE OR REPLACE FUNCTION public.inserir_3x_e_parar()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  i int := 0;
begin
  while i < 3 loop
    insert into bd_ativo(num) values (1);
    i := i + 1;
    if i < 3 then
      perform pg_sleep(5);
    end if;
  end loop;
end;
$function$;

-- Add RLS policies for bd_ativo table to fix security warning
ALTER TABLE public.bd_ativo ENABLE ROW LEVEL SECURITY;

-- Create policies for bd_ativo table (making it admin-only for security)
CREATE POLICY "Only admins can manage bd_ativo" 
ON public.bd_ativo 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());