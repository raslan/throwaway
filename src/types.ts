export enum View {
  Main = "Main",
  Identity = "Identity",
  Settings = "Settings",
}

export type Email = {
  from: string;
  subject: string;
  body_text: string;
  body_html: string;
};
