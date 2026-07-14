# Operação em produção

## Publicação

- Repositório: `victordoui/NSS-L`
- Branch de publicação: `main`
- Hospedagem: Netlify
- Comando de validação e build: `npm run check`
- Pasta publicada: `dist`

Toda atualização autorizada deve ser enviada para a `main`. O Netlify executa lint, verificação de tipos e build antes de disponibilizar uma nova versão; se qualquer etapa falhar, o deploy não deve substituir a versão estável.

## Variáveis necessárias no Netlify

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_TURNSTILE_SITE_KEY`, somente quando o Turnstile estiver habilitado

Nunca cadastre no frontend chaves `service_role`, senhas ou segredos de Edge Functions. Segredos do formulário de contato permanecem configurados exclusivamente no Supabase.

## Verificações depois de uma publicação

1. Abrir a página inicial e navegar pelas rotas de serviços, obras, informativo e contato.
2. Confirmar que o formulário de contato apresenta sucesso ou uma mensagem de erro clara.
3. Confirmar que `/auth` permite somente login e que `/admin` exige uma conta autorizada.
4. Verificar no Netlify se o deploy foi concluído sem erro.
5. Verificar no GitHub se a validação da `main` foi aprovada.

## Reversão

Se uma publicação apresentar problema, restaure o último deploy estável pelo painel do Netlify e reverta o commit correspondente na `main`. Evite reescrever o histórico com push forçado.
