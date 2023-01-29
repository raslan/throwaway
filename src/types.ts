export enum View {
  Email = 'email',
  Identity = 'identity',
  Settings = 'settings',
}

export type Email = {
  from: string;
  subject: string;
  body_text: string;
  body_html: string;
};
