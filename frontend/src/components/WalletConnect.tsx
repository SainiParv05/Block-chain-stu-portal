import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getConnectedAddress } from "@/utils/contract";

export const WalletConnect = () => {
  const [address, setAddress] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const addr = await getConnectedAddress();
      if (addr) setAddress(addr);
    })();
  }, []);

  const reconnect = async () => {
    const addr = await getConnectedAddress();
    if (addr) {
      setAddress(addr);
      toast({
        title: "Connected",
        description: `Using local Hardhat wallet: ${addr.slice(0, 6)}...${addr.slice(-4)}`,
      });
    }
  };

  const disconnect = () => {
    setAddress("");
    toast({
      title: "Disconnected",
      description: "Local wallet disconnected",
    });
  };

  if (address) {
    return (
      <Button onClick={disconnect} variant="outline" size="sm" className="gap-2">
        <Wallet className="h-4 w-4" />
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button onClick={reconnect} size="sm" className="gap-2">
      <Wallet className="h-4 w-4" />
      Connect Local Wallet
    </Button>
  );
};
