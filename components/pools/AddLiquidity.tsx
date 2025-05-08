"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info } from "lucide-react";
import TokenSelector from "@/components/swap/TokenSelector";
import { mockTokens } from "@/lib/mock-data";
import { Token } from "@/lib/types";
import { useWallet } from "@/contexts/WalletContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AddLiquidity() {
  const { connected } = useWallet();
  const [token1, setToken1] = useState<Token>(mockTokens[0]);
  const [token2, setToken2] = useState<Token>(mockTokens[1]);
  const [amount1, setAmount1] = useState<string>("");
  const [amount2, setAmount2] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([80, 120]);
  const [feeTier, setFeeTier] = useState<string>("0.3");
  const [poolType, setPoolType] = useState<string>("concentrated");

  // Calculated values
  const token1Value = parseFloat(amount1) || 0;
  const token2Value = parseFloat(amount2) || 0;
  const totalValueUSD = token1Value * token1.priceUsd + token2Value * token2.priceUsd;
  
  // Mock pool APR based on fee tier
  const estimatedAPR = feeTier === "0.01" ? "4.2"
    : feeTier === "0.05" ? "8.5"
    : feeTier === "0.3" ? "15.2"
    : "22.8";
  
  // Handle input changes
  const handleAmount1Change = (value: string) => {
    setAmount1(value);
    // Mock price calculation for demonstration
    const calculatedAmount = parseFloat(value) * (token1.priceUsd / token2.priceUsd);
    setAmount2(isNaN(calculatedAmount) ? "" : calculatedAmount.toFixed(6));
  };
  
  const handleAmount2Change = (value: string) => {
    setAmount2(value);
    // Mock price calculation for demonstration
    const calculatedAmount = parseFloat(value) * (token2.priceUsd / token1.priceUsd);
    setAmount1(isNaN(calculatedAmount) ? "" : calculatedAmount.toFixed(6));
  };
  
  const handleAddLiquidity = () => {
    // Mock implementation for adding liquidity
    alert(`Added liquidity: ${amount1} ${token1.symbol} and ${amount2} ${token2.symbol}`);
    setAmount1("");
    setAmount2("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <Tabs defaultValue={poolType} onValueChange={setPoolType}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="concentrated">Concentrated Liquidity</TabsTrigger>
            <TabsTrigger value="classic">Classic Pool</TabsTrigger>
          </TabsList>
          <TabsContent value="concentrated" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Token 1</Label>
                <div className="flex items-center space-x-2">
                  <TokenSelector
                    selectedToken={token1}
                    onSelectToken={setToken1}
                    otherToken={token2}
                  />
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={amount1}
                    onChange={(e) => handleAmount1Change(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Token 2</Label>
                <div className="flex items-center space-x-2">
                  <TokenSelector
                    selectedToken={token2}
                    onSelectToken={setToken2}
                    otherToken={token1}
                  />
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={amount2}
                    onChange={(e) => handleAmount2Change(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Fee Tier</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Info className="h-3 w-3 mr-1" />
                        Learn about fee tiers
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Higher fee tiers are better for volatile pairs</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={feeTier} onValueChange={setFeeTier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fee tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.01">0.01% - Best for stable pairs</SelectItem>
                  <SelectItem value="0.05">0.05% - Best for stable pairs</SelectItem>
                  <SelectItem value="0.3">0.3% - Best for most pairs</SelectItem>
                  <SelectItem value="1">1% - Best for exotic pairs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Price Range ({priceRange[0]}% - {priceRange[1]}%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Info className="h-3 w-3 mr-1" />
                        About price ranges
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Narrow ranges can earn more fees but may require more active management</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider
                value={priceRange}
                min={50}
                max={200}
                step={1}
                onValueChange={(values) => setPriceRange(values as [number, number])}
              />
              <div className="text-xs text-muted-foreground">
                The price range determines how concentrated your liquidity will be. A narrower range may earn more fees but requires more active management to stay in range.
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="classic" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Token 1</Label>
                <div className="flex items-center space-x-2">
                  <TokenSelector
                    selectedToken={token1}
                    onSelectToken={setToken1}
                    otherToken={token2}
                  />
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={amount1}
                    onChange={(e) => handleAmount1Change(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Token 2</Label>
                <div className="flex items-center space-x-2">
                  <TokenSelector
                    selectedToken={token2}
                    onSelectToken={setToken2}
                    otherToken={token1}
                  />
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={amount2}
                    onChange={(e) => handleAmount2Change(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Fee Tier</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Info className="h-3 w-3 mr-1" />
                        Learn about fee tiers
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Higher fee tiers are better for volatile pairs</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={feeTier} onValueChange={setFeeTier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fee tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.01">0.01% - Best for stable pairs</SelectItem>
                  <SelectItem value="0.05">0.05% - Best for stable pairs</SelectItem>
                  <SelectItem value="0.3">0.3% - Best for most pairs</SelectItem>
                  <SelectItem value="1">1% - Best for exotic pairs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <Button 
          className="w-full" 
          size="lg" 
          disabled={!amount1 || !amount2 || !connected}
          onClick={handleAddLiquidity}
        >
          {!connected ? "Connect Wallet" : "Add Liquidity"}
        </Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Position Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pool Type</span>
                <span>{poolType === "concentrated" ? "Concentrated Liquidity" : "Classic Pool"}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fee Tier</span>
                <span>{feeTier}%</span>
              </div>
              
              {poolType === "concentrated" && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price Range</span>
                  <span>{priceRange[0]}% - {priceRange[1]}%</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated APR</span>
                <span className="text-green-500">{estimatedAPR}%</span>
              </div>
              
              <div className="border-t my-2"></div>
              
              <div className="flex justify-between font-medium">
                <span>Total Value</span>
                <span>${totalValueUSD.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Position Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{token1.symbol} Amount</span>
                <span>{amount1 || "0"}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>{token2.symbol} Amount</span>
                <span>{amount2 || "0"}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Current Price</span>
                <span>1 {token1.symbol} = {(token1.priceUsd / token2.priceUsd).toFixed(6)} {token2.symbol}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}