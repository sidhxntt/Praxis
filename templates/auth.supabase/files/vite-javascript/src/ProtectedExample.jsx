import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function ProtectedExample() {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  return <p className="mt-4 text-sm">{email ? `Signed in as ${email}` : "Sign in to access protected content."}</p>;
}
