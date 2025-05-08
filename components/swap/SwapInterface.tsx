"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ArrowDownUp,
  Settings,
  ChevronDown,
  Info,
  RefreshCw,
} from "lucide-react";
import { mockTokens } from "@/lib/mock-data";
import { useWallet } from "@/contexts/WalletContext";
import { Token } from "@/lib/types";
import TokenSelector from "@/components/swap/TokenSelector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function SwapInterface() {
  const { connected } = useWallet();
  const { toast } = useToast();
  const [fromToken, setFromToken] = useState<Token>(mockTokens[0]);
  const [toToken, setToToken] = useState<Token>(mockTokens[1]);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Mock function to simulate conversion
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // Simulate price calculation with a simple mock rate
    const rate = fromToken.symbol === "ETH" ? 2950 : fromToken.symbol === "BTC" ? 62000 : 1;
    const calculatedAmount = parseFloat(value) * rate;
    setToAmount(isNaN(calculatedAmount) ? "" : calculatedAmount.toFixed(6));
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    // Reverse calculation
    const rate = fromToken.symbol === "ETH" ? 2950 : fromToken.symbol === "BTC" ? 62000 : 1;
    const calculatedAmount = parseFloat(value) / rate;
    setFromAmount(isNaN(calculatedAmount) ? "" : calculatedAmount.toFixed(6));
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to swap tokens",
        variant: "destructive",
      });
      return;
    }

    if (!fromAmount || !toAmount) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Swap successful!",
        description: `Swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
        variant: "default",
      });
      
      // Clear input fields after swap
      setFromAmount("");
      setToAmount("");
    }, 2000);
  };

  // Calculate the price impact (mock value for demonstration)
  const priceImpact = parseFloat(fromAmount) > 10 ? "0.05%" : "0.02%";
  
  // Calculate minimum received based on slippage
  const minimumReceived = parseFloat(toAmount) * (1 - slippage / 100);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Swap Tokens</h3>
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="slippage">Slippage Tolerance ({slippage}%)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="slippage"
                    value={[slippage]}
                    max={5}
                    step={0.1}
                    onValueChange={(values) => setSlippage(values[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value))}
                    min={0.1}
                    max={5}
                    step={0.1}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Transaction Deadline</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue={20} className="w-20" />
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Expert Mode</Label>
                  <Switch />
                </div>
                <p className="text-xs text-muted-foreground">
                  Allow high slippage trades and skip confirmation screen
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>From</Label>
          {fromToken && (
            <span className="text-sm text-muted-foreground">
              Balance: {fromToken.balance.toFixed(4)} {fromToken.symbol}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              className="pr-20"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 text-xs"
              onClick={() => handleFromAmountChange(fromToken.balance.toString())}
            >
              MAX
            </Button>
          </div>
          <TokenSelector
            selectedToken={fromToken}
            onSelectToken={setFromToken}
            otherToken={toToken}
          />
        </div>
      </div>
      
      <div className="flex justify-center -my-2">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full h-10 w-10 bg-muted shadow-md z-10"
          onClick={handleSwapTokens}
        >
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>To (estimated)</Label>
          {toToken && (
            <span className="text-sm text-muted-foreground">
              Balance: {toToken.balance.toFixed(4)} {toToken.symbol}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="0.0"
            value={toAmount}
            onChange={(e) => handleToAmountChange(e.target.value)}
            className="flex-1"
          />
          <TokenSelector
            selectedToken={toToken}
            onSelectToken={setToToken}
            otherToken={fromToken}
          />
        </div>
      </div>
      
      {fromAmount && toAmount && (
        <div className="space-y-2 rounded-lg bg-muted/50 p-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-muted-foreground">
              Rate
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="ml-1 h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The current exchange rate</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center">
              1 {fromToken.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken.symbol}
              <RefreshCw className="ml-1 h-3 w-3" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-muted-foreground">
              Price Impact
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="ml-1 h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The difference between the market price and estimated price due to trade size</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className={cn(
              parseFloat(priceImpact) < 0.03 ? "text-green-500" : "text-yellow-500"
            )}>
              {priceImpact}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-muted-foreground">
              Minimum Received
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="ml-1 h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The minimum amount you are guaranteed to receive. If the price slips more than your slippage tolerance, your transaction will revert.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              {minimumReceived.toFixed(6)} {toToken.symbol}
            </div>
          </div>
        </div>
      )}
      
      <Button 
        className="w-full"
        disabled={!fromAmount || !toAmount || isLoading} 
        onClick={handleSwap}
      >
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Swapping...
          </>
        ) : !connected ? (
          "Connect Wallet"
        ) : !fromAmount || !toAmount ? (
          "Enter an amount"
        ) : (
          `Swap ${fromToken.symbol} for ${toToken.symbol}`
        )}
      </Button>
    </div>
  );
}