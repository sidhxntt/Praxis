import { atom } from "recoil";

export const LoginState = atom({
  key: "LoginState", // Unique ID for this atom
  default: false, // Default value
});
