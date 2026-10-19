import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.keypowergrailmystery.wallet",
  appName: "MYSTERYUM WALLET",
  webDir: "dist/client",
  server: {
    url: "https://mysteryum-wallet.lovable.app",
    cleartext: false,
  },
  backgroundColor: "#0f131c",
  android: { allowMixedContent: false, webContentsDebuggingEnabled: false },
};

export default config;