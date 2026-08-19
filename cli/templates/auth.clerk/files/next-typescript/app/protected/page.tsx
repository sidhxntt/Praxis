import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function ProtectedPage() {
  return <main className="p-8"><SignedIn><UserButton /><h1>Protected content</h1></SignedIn><SignedOut><SignInButton /></SignedOut></main>;
}
