const DEFAULT_UPSTREAM = 'https://throwaway.raslan.dev/api/email';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type,x-rapidapi-key,x-rapidapi-host',
};

const memoryStore = new Map<string, string>();

const createHeaders = (status = 200) => ({
  ...corsHeaders,
  'content-type': 'application/json',
  'cache-control': 'no-store',
});

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: createHeaders(status),
  });

const randomToken = (): string =>
  crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const randomPhone = () => `+1${Math.floor(2e9 + Math.random() * 7e9)}`;

const normalizeEmail = (value: string) => (value || '').trim().toLowerCase();

const normalizeProvider = (provider?: string): 'throwaway' | 'gmailnator' | 'emailnator' | 'custom' => {
  if (provider === 'gmailnator' || provider === 'emailnator' || provider === 'custom') {
    return provider;
  }
  return 'throwaway';
};

const parseJson = async (request: Request) => {
  try {
    return (await request.json()) as Record<string, any>;
  } catch (error) {
    return {} as Record<string, any>;
  }
};

const normalizeCredentials = (
  credentials?: Record<string, any>
): { apiHost?: string; apiKey?: string } => {
  if (!credentials || typeof credentials !== 'object') return {};

  const apiHost = (credentials.apiHost || credentials.api_base || credentials.host || '')
    .toString()
    .trim();
  const apiKey = (credentials.apiKey || credentials.api_key || credentials.key || '')
    .toString()
    .trim();

  return { ...(apiHost ? { apiHost } : {}), ...(apiKey ? { apiKey } : {}) };
};

const resolveProviderCredentials = (
  provider: ReturnType<typeof normalizeProvider>,
  payload?: Record<string, any> | null
) => {
  if (!payload || typeof payload !== 'object') return {};
  const direct = payload?.providerCredentials;
  if (!direct || typeof direct !== 'object') return {};
  const providerScoped =
    direct?.[provider] && typeof direct[provider] === 'object'
      ? direct[provider]
      : undefined;

  return normalizeCredentials(providerScoped || direct);
};

const sanitizePhone = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const normalizeHost = (value?: string) => {
  if (!value) return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  try {
    return new URL(trimmed).toString().replace(/\/$/, '');
  } catch {
    return '';
  }
};

const parseEmailFromProviderPayload = (body: any): string | null => {
  if (!body) return null;
  if (typeof body.email === 'string' && body.email.includes('@')) return body.email;
  if (typeof body.data?.email === 'string') return body.data.email;
  if (typeof body.result?.email === 'string') return body.result.email;
  if (Array.isArray(body.data) && body.data[0]?.email) return body.data[0].email;
  return null;
};

const parseTokenFromProviderPayload = (body: any): string | null => {
  if (!body) return null;
  if (typeof body.token === 'string' && body.token.length > 0) return body.token;
  if (typeof body.result?.token === 'string') return body.result.token;
  if (typeof body.data?.token === 'string') return body.data.token;
  return null;
};

const parseEmailsFromPayload = (body: any): Array<Record<string, any>> => {
  if (!body) return [];
  if (Array.isArray(body.emails)) return body.emails;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.messages)) return body.messages;
  if (Array.isArray(body.result)) return body.result;
  return [];
};

const normalizeInboxEntry = (
  entry: Record<string, any>,
  email: string,
  detail: Record<string, any> = {}
) => {
  const merged = { ...entry, ...detail };
  const bodyText =
    merged.body_text ||
    merged.text ||
    merged.body ||
    merged.content ||
    merged.message ||
    merged.plain ||
    '';
  const bodyHtml = merged.body_html || merged.html || merged.htmlBody || '';

  return {
    ...merged,
    from: merged.from || merged.sender || merged.from_email || '',
    to: merged.to || merged.recipient || email,
    subject: merged.subject || merged.title || '',
    body_text: bodyText,
    body_html: bodyHtml,
    created_at:
      merged.created_at ||
      merged.createdAt ||
      merged.date ||
      merged.time ||
      merged.receivedAt ||
      '',
  };
};

const parseProviderMessageId = (entry: Record<string, any>) => {
  const id =
    entry.id ||
    entry.messageID ||
    entry.messageId ||
    entry.message_id ||
    entry.mid ||
    '';
  return typeof id === 'string' || typeof id === 'number' ? String(id) : '';
};

const readRecord = async (env: Env, key: string): Promise<Record<string, any> | null> => {
  if (!key) return null;
  const storeKey = `mail:${key}`;
  if (env?.THROWAWAY_EMAIL_DB) {
    const entry = await env.THROWAWAY_EMAIL_DB.get(storeKey);
    if (!entry) return null;
    try {
      return JSON.parse(entry) as Record<string, any>;
    } catch {
      return null;
    }
  }

  const payload = memoryStore.get(storeKey);
  if (!payload) return null;
  try {
    return JSON.parse(payload) as Record<string, any>;
  } catch {
    return null;
  }
};

const writeRecord = async (
  env: Env,
  key: string,
  record: Record<string, any>
): Promise<void> => {
  if (!key) return;
  const storeKey = `mail:${key}`;
  const body = JSON.stringify(record);
  if (env?.THROWAWAY_EMAIL_DB) {
    await env.THROWAWAY_EMAIL_DB.put(storeKey, body, {
      expirationTtl: 86400,
    });
    return;
  }
  memoryStore.set(storeKey, body);
};

const callThrowawayUpstream = async (
  email: string,
  token?: string,
  env?: Env
) => {
  const upstream = normalizeHost((env as any)?.THROWAWAY_UPSTREAM_BASE) || DEFAULT_UPSTREAM;

  if (!token || !email) {
    const response = await fetch(upstream, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const nextEmail = parseEmailFromProviderPayload(payload);
    const nextToken = parseTokenFromProviderPayload(payload);
    return { email: nextEmail, token: nextToken };
  }

  const response = await fetch(`${upstream}/${encodeURIComponent(email)}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return { emails: parseEmailsFromPayload(payload) };
};

const callRapidProvider = async (
  mode: 'gmailnator' | 'emailnator',
  action: 'generate' | 'inbox' | 'message',
  email?: string,
  credentials?: {
    apiHost?: string;
    apiApiKey?: string;
    apiKey?: string;
  },
  options: Record<string, any> = {}
) => {
  const host = normalizeHost(credentials?.apiHost) || normalizeHost(
    mode === 'gmailnator'
      ? 'https://gmailnator.p.rapidapi.com'
      : 'https://emailnator.p.rapidapi.com'
  );
  const apiKey = credentials?.apiKey || credentials?.apiApiKey || '';

  if (!host || !apiKey) {
    return null;
  }

  const endpoint =
    action === 'generate'
      ? `${host}/api/emails/generate`
      : action === 'message' && email
        ? `${host}/api/inbox/${encodeURIComponent(email)}`
        : `${host}/api/inbox/`;

  const response = await fetch(endpoint, {
    method: action === 'message' ? 'GET' : 'POST',
    headers: {
      'content-type': 'application/json',
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': host.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    },
    ...(action === 'message'
      ? {}
      : {
          body: JSON.stringify({
            ...(action === 'inbox' && email ? { email } : {}),
            ...options,
          }),
        }),
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};

const getRapidProviderInbox = async (
  provider: 'gmailnator' | 'emailnator',
  email: string,
  credentials: { apiHost?: string; apiKey?: string }
) => {
  const response = await callRapidProvider(provider, 'inbox', email, credentials, {
    limit: 20,
  });
  if (!response) return null;

  const entries = parseEmailsFromPayload(response);
  const hydrated = await Promise.all(
    entries.map(async (entry) => {
      const messageId = parseProviderMessageId(entry);
      if (!messageId) return normalizeInboxEntry(entry, email);
      const detail = await callRapidProvider(
        provider,
        'message',
        messageId,
        credentials
      );
      return normalizeInboxEntry(entry, email, detail || {});
    })
  );

  return hydrated;
};

const createFallbackEmail = (provider: ReturnType<typeof normalizeProvider>, request: Record<string, any>) => {
  const domain =
    provider === 'custom'
      ? request.customDomain || 'throwaway.local'
      : provider === 'gmailnator'
        ? 'gmailnator.com'
        : provider === 'emailnator'
          ? 'emailnator.com'
          : 'disposable.email';

  const token = randomToken();
  return {
    email: `${Math.random().toString(36).slice(2, 12)}@${domain}`,
    token,
  };
};

const parsePhoneProviderPayload = (body: any): string | null => {
  if (!body) return null;
  if (typeof body.phone === 'string' && body.phone.length > 0) return body.phone;
  if (typeof body.data?.phone === 'string') return body.data.phone;
  return null;
};

const handleCreateEmail = async (request: Request, env: Env) => {
  const payload = await parseJson(request);
  const requestedProvider = normalizeProvider(payload?.provider);
  const providerCredentials = resolveProviderCredentials(
    requestedProvider,
    payload
  );
  const requestedPhone = sanitizePhone(payload?.phone);

  let email = '';
  let token = randomToken();

  if (requestedProvider === 'gmailnator' || requestedProvider === 'emailnator') {
    const result = await callRapidProvider(
      requestedProvider,
      'generate',
      undefined,
      providerCredentials,
      { count: 1 }
    );
    if (result) {
      email = parseEmailFromProviderPayload(result) || '';
      token = parseTokenFromProviderPayload(result) || token;
    }
  } else if (requestedProvider === 'custom' && payload?.customDomain) {
    const created = createFallbackEmail('custom', payload);
    email = created.email;
    token = created.token;
  } else {
    const result = await callThrowawayUpstream('', undefined, env);
    if (result && result.email) {
      email = result.email;
      token = result.token || token;
    }
  }

  if (!email) {
    const fallback = createFallbackEmail(requestedProvider, payload);
    email = fallback.email;
    token = fallback.token;
  }

  const record = {
    token,
    provider: requestedProvider,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    customDomain: payload?.customDomain || undefined,
    phone: requestedPhone || undefined,
    providerCredentials,
  };

  await writeRecord(env, email.toLowerCase(), record);

  return json({
    email,
    token,
    provider: requestedProvider,
    phone: requestedPhone || null,
    createdAt: record.createdAt,
  });
};

const handleGetEmails = async (request: Request, env: Env, email: string) => {
  const payload = await parseJson(request);
  const normalizedEmail = normalizeEmail(email);
  const record = await readRecord(env, normalizedEmail);

  if (!normalizedEmail || !record) {
    return json({ emails: [] }, 404);
  }

  const token =
    payload?.token || new URL(request.url).searchParams.get('token') || '';
  if (token && record.token !== token) {
    return json({ error: 'invalid token' }, 403);
  }
  const storedCredentials = normalizeCredentials(record?.providerCredentials);
  const requestCredentials = resolveProviderCredentials(
    record.provider,
    payload
  );
  const credentials = Object.keys(requestCredentials).length
    ? requestCredentials
    : storedCredentials;

  if (record.provider === 'gmailnator' || record.provider === 'emailnator') {
    const emails = await getRapidProviderInbox(
      record.provider,
      normalizedEmail,
      credentials
    );
    if (emails) {
      return json({
        email: normalizedEmail,
        emails,
        provider: record.provider,
        phone: record.phone || null,
      });
    }
  }

  if (record.provider === 'throwaway') {
    const upstreamResult = await callThrowawayUpstream(normalizedEmail, token, env);
    if (upstreamResult?.emails) {
      return json({
        email: normalizedEmail,
        emails: upstreamResult.emails.map((entry) =>
          normalizeInboxEntry(entry, normalizedEmail)
        ),
        provider: record.provider,
        phone: record.phone || null,
      });
    }
  }

  return json({
    email: normalizedEmail,
    emails: (record.emails || []).map((entry: Record<string, any>) =>
      normalizeInboxEntry(entry, normalizedEmail)
    ),
    provider: record.provider,
    token: record.token,
    phone: record.phone || null,
  });
};

const handlePhoneAllocation = async () => {
  const phone = randomPhone();
  const token = randomToken();

  return json({
    phone,
    token,
    provider: 'throwaway',
    createdAt: Date.now(),
  });
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '');

    if (path === '/api/email' && request.method === 'POST') {
      return handleCreateEmail(request, env);
    }

    if (path.startsWith('/api/email/')) {
      const email = decodeURIComponent(path.replace('/api/email/', ''));
      if (!email) {
        return json({ error: 'email required' }, 400);
      }
      if (request.method === 'POST' || request.method === 'GET') {
        return handleGetEmails(request, env, email);
      }
      return json({ error: 'method not allowed' }, 405);
    }

    if (path === '/api/phone' && request.method === 'POST') {
      return handlePhoneAllocation();
    }

    return new Response('Not found', {
      status: 404,
      headers: corsHeaders,
    });
  },
};

interface Env {
  THROWAWAY_UPSTREAM_BASE?: string;
  THROWAWAY_EMAIL_DB?: KVNamespace;
}
