export enum View {
  Email = 'email',
  Identity = 'identity',
  Settings = 'settings',
  Advanced = 'advanced',
}

export type Email = {
  from: string;
  to: string;
  subject: string;
  body_text: string;
  body_html: string;
  created_at: string;
};
