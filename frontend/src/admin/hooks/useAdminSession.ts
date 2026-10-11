"use client";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { checkAdmin, subscribeAuth } from "@/services/firebase/auth-service";
import { errorText } from "../utils/errors";

export function useAdminSession(report: (text: string, error?: boolean) => void) {
  const [user, setUser] = useState<User | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    let active = true;
    let generation = 0;
    const unsubscribe = subscribeAuth(async (next) => {
      const request = ++generation;
      setUser(next);
      setAuthorized(false);
      setAuthLoading(true);
      if (!next) {
        setAuthLoading(false);
        return;
      }
      try {
        const allowed = await checkAdmin(next);
        if (!active || request !== generation) return;
        setAuthorized(allowed);
        if (!allowed) report("هذا الحساب غير مصرح له بإدارة الموقع.");
      } catch (error) {
        if (active && request === generation) report(errorText(error));
      } finally {
        if (active && request === generation) setAuthLoading(false);
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [report]);

  return { user, authorized, authLoading };
}
