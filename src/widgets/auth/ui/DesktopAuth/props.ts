import type { Dispatch, SetStateAction } from "react";

export interface DesktopAuthProps {
  isLogin: boolean;
  setLogin: Dispatch<SetStateAction<boolean>>;
  setSubtitle: Dispatch<SetStateAction<string>>;
}

export interface DesktopAuthLoginProps {
  handleRegForm: () => void;
  onSubmit: (data: { email: string; pass: string }) => void;
}
