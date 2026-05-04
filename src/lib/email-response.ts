type NormalizedEmail = {
  from: string;
  to: string;
  subject: string;
  body_text: string;
  body_html: string;
  created_at?: string;
  [key: string]: unknown;
};

type RawEmail = Partial<NormalizedEmail> & Record<string, unknown>;

export type InboxResponse = {
  email?: string;
  emails?: RawEmail[];
  [key: string]: unknown;
};

export const inferEmailFromInboxUrl = (url: string) => {
  try {
    const pathname = new URL(url).pathname.replace(/\/$/, '');
    const encodedEmail = pathname.split('/').pop() || '';
    return decodeURIComponent(encodedEmail);
  } catch {
    return '';
  }
};

export const normalizeInboxEmail = (
  entry: RawEmail,
  fallbackRecipient = ''
): NormalizedEmail => ({
  ...entry,
  from: `${entry.from || entry.sender || entry.from_email || ''}`,
  to: `${entry.to || entry.recipient || fallbackRecipient || ''}`,
  subject: `${entry.subject || entry.title || ''}`,
  body_text: `${entry.body_text || entry.text || entry.body || entry.content || entry.message || entry.plain || ''}`,
  body_html: `${entry.body_html || entry.html || entry.htmlBody || ''}`,
  created_at: `${entry.created_at || entry.createdAt || entry.date || entry.time || entry.receivedAt || ''}`,
});

export const normalizeInboxResponse = (
  payload: InboxResponse,
  fallbackRecipient = ''
) => {
  const emails = Array.isArray(payload?.emails) ? payload.emails : [];
  const recipient = `${payload?.email || fallbackRecipient || ''}`;

  return {
    ...payload,
    email: recipient || payload?.email,
    emails: emails.map((entry) => normalizeInboxEmail(entry, recipient)),
  };
};
