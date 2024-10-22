"use client";

import { type PropsWithChildren } from "react";
import { SDKProvider } from "@telegram-apps/sdk-react";

import { useTelegramMock } from "@/hooks/useTgMock";
import { useDidMount } from "@/hooks/useDidMount";
//import Image from "next/image";
import { Loading } from "@/components/LoadingScreen";
import { useTelegramBackButton } from "@/lib/telegram.lib";

// function App(props: PropsWithChildren) {
//   const lp = useLaunchParams();
//   const miniApp = useMiniApp();
//   const themeParams = useThemeParams();
//   const viewport = useViewport();

//   useEffect(() => {
//     return bindMiniAppCSSVars(miniApp, themeParams);
//   }, [miniApp, themeParams]);

//   useEffect(() => {
//     return bindThemeParamsCSSVars(themeParams);
//   }, [themeParams]);

//   useEffect(() => {
//     return viewport && bindViewportCSSVars(viewport);
//   }, [viewport]);

//   return (
//     <
//     >
//       {props.children}
//     </>
//   );
// }

function RootInner({ children }: PropsWithChildren) {
  // Mock Telegram environment in development mode if needed.
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  useTelegramBackButton();
  // Enable debug mode to see all the methods sent and events received.

  return <SDKProvider acceptCustomStyles>{children}</SDKProvider>;
}

export function TelegramProvider(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of the Server Side
  // Rendering. That's why we are showing loader on the server side.
  const didMount = useDidMount();

  return didMount ? <RootInner {...props} /> : <Loading />;
}
