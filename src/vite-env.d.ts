/// <reference types="vite/client" />
declare module 'parse-otp-message' {
  export default function parseOtpMessage(
    message: string,
    opts?: {
      isGlobal?: boolean;
      cleanCode?: (code: string) => string;
    }
  ): {
    code: string | undefined;
  };
}
