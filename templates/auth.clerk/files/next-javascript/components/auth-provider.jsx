"use client";
import { ClerkProvider } from "@clerk/nextjs";
export function AuthProvider({ children }) { return <ClerkProvider>{children}</ClerkProvider>; }
