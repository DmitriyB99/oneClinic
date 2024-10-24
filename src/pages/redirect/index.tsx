import { useEffect } from "react";

import { useRouter } from "next/router";

import { APP_STORE_APP_LINK, PLAY_MARKET_APP_LINK } from "@/shared/constants";
import { getMobileOperatingSystem } from "@/shared/utils";

export default function RedirectPage() {
  const router = useRouter();
  useEffect(() => {
    const os = getMobileOperatingSystem();
    if (os === "ios") {
      router.replace(APP_STORE_APP_LINK);
    } else if (os === "android") {
      router.replace(PLAY_MARKET_APP_LINK);
    }
  }, [router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-Regular16">Redirect Page</div>
    </div>
  );
}
