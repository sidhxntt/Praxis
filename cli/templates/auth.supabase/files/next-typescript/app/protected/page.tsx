"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProtectedPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  return <main className="p-8">{email ? `Signed in as ${email}` : "Sign in to view this page."}</main>;
}
