"use client";
import { useRouter } from "next/router";
import { useEffect } from "react";

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
      };
    };
  }
}

export function useTelegramBackButton() {
  const router = useRouter();

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const tg = window.Telegram.WebApp;

      // Show back button if not on home page
      if (router.pathname === "/") {
        tg.BackButton.hide();
      } else {
        tg.BackButton.show();
      }

      // Handle back button click
      tg.BackButton.onClick(() => {
        router.back();
      });
    }
  }, [router.pathname]);
}
