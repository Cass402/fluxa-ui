"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define supported wallet types
type WalletType = "phantom" | "solflare" | "metamask" | "walletconnect" | "coinbase";

interface WalletContextType {
  connected: boolean;
  address: string | null;
  walletType: WalletType | null;
  connect: (type: WalletType) => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: null,
  walletType: null,
  connect: async () => {},
  disconnect: () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);

  // Check local storage for previously connected wallet
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    const savedWalletType = localStorage.getItem("walletType") as WalletType;
    if (savedAddress && savedWalletType) {
      setAddress(savedAddress);
      setWalletType(savedWalletType);
      setConnected(true);
    }
  }, []);

  const connect = async (type: WalletType) => {
    try {
      let connectedAddress: string;

      switch (type) {
        case "phantom": {
          // Check if Phantom is installed
          const { solana } = window as any;
          if (!solana?.isPhantom) {
            window.open("https://phantom.app/", "_blank");
            throw new Error("Please install Phantom wallet");
          }

          // Connect to Phantom
          const response = await solana.connect();
          connectedAddress = response.publicKey.toString();
          break;
        }

        case "solflare": {
          // Check if Solflare is installed
          const { solana } = window as any;
          if (!solana?.isSolflare) {
            window.open("https://solflare.com/", "_blank");
            throw new Error("Please install Solflare wallet");
          }

          // Connect to Solflare
          const response = await solana.connect();
          connectedAddress = response.publicKey.toString();
          break;
        }

        case "metamask": {
          // Check if MetaMask is installed
          const { ethereum } = window as any;
          if (!ethereum?.isMetaMask) {
            window.open("https://metamask.io/download/", "_blank");
            throw new Error("Please install MetaMask");
          }

          // Connect to MetaMask
          const accounts = await ethereum.request({ method: "eth_requestAccounts" });
          connectedAddress = accounts[0];
          break;
        }

        case "walletconnect": {
          // For demo, using mock address
          connectedAddress = "0x" + Math.floor(Math.random() * 10**40).toString(16).padStart(40, "0");
          break;
        }

        case "coinbase": {
          // For demo, using mock address
          connectedAddress = "0x" + Math.floor(Math.random() * 10**40).toString(16).padStart(40, "0");
          break;
        }

        default:
          throw new Error("Unsupported wallet type");
      }

      setAddress(connectedAddress);
      setWalletType(type);
      setConnected(true);
      localStorage.setItem("walletAddress", connectedAddress);
      localStorage.setItem("walletType", type);

    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };

  const disconnect = () => {
    setAddress(null);
    setWalletType(null);
    setConnected(false);
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("walletType");
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        walletType,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}