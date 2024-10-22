"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        ready: () => void;
        isExpanded: boolean;
        expand: () => void;
      };
    };
  }
}

export function useTelegramBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Make sure we're in the browser and Telegram WebApp is available
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // Let Telegram know the Mini App is ready
      tg.ready();

      // Expand the Mini App to full height
      if (!tg.isExpanded) {
        tg.expand();
      }

      // Function to handle back button click
      const handleBackClick = () => {
        router.back();
      };

      // Show/hide back button based on current path
      if (pathname === "/") {
        tg.BackButton.hide();
      } else {
        tg.BackButton.show();
      }

      // Set up back button click handler
      tg.BackButton.onClick(handleBackClick);

      // Cleanup
      return () => {
        tg.BackButton.offClick(handleBackClick);
      };
    }
  }, [pathname, router]);
}
