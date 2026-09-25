import { ClerkProvider } from "@clerk/clerk-react";
export function AuthProvider({ children }: { children: React.ReactNode }) { return <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>{children}</ClerkProvider>; }
