/** @format */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

const coreTestnet = {
  id: 1115, // Core Testnet chain ID
  name: "Core Blockchain Testnet",
  network: "testnet",
  nativeCurrency: {
    name: "Core",
    symbol: "tCORE",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.test.btcs.network"],
    },
    public: {
      http: ["https://rpc.test.btcs.network"],
    },
  },
  blockExplorers: {
    default: { name: "CoreScan", url: "https://scan.test.btcs.network" },
  },
  testnet: true,
};
const chains = [coreTestnet];
const projectId = "80905c9ef60ad3a846f5355a32a04781";
const queryClient = new QueryClient();

const metadata = {
  name: "Google",
  description: "Google",
  url: "https://google.com/",
  icons: [
    "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png",
  ],
};
const config = defaultWagmiConfig({
  chains, // required
  projectId, // required
  metadata, // required
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
