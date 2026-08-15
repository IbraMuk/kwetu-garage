"use client";

import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900">
        <div className="text-center">
          <div className="relative mx-auto">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
            <div className="absolute inset-0 mx-auto h-16 w-16 animate-ping rounded-full border-4 border-transparent border-t-blue-400/30" />
          </div>
          <p className="mt-4 font-medium text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
