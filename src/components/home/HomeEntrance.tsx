"use client";

import { useCallback, useEffect, useState } from "react";
import { HomeDashboard } from "@/components/home/HomeDashboard";
import { SplashScreen } from "@/components/ui/SplashScreen";

type HomeEntranceProps = {
  isAuthenticated: boolean;
};

export function HomeEntrance({ isAuthenticated }: HomeEntranceProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [splashMounted, setSplashMounted] = useState(true);

  const handleDismiss = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleExitComplete = useCallback(() => {
    setSplashMounted(false);
  }, []);

  useEffect(() => {
    if (!splashMounted) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [splashMounted]);

  return (
    <>
      <HomeDashboard isAuthenticated={isAuthenticated} />
      {splashMounted && (
        <SplashScreen
          show={showSplash}
          onDismiss={handleDismiss}
          onExitComplete={handleExitComplete}
        />
      )}
    </>
  );
}
