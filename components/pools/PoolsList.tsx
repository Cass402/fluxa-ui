"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockPools } from "@/lib/mock-data";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import TokenPair from "@/components/common/TokenPair";

export default function PoolsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("tvl");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [feeTierFilter, setFeeTierFilter] = useState<string>("all");

  // Filter pools based on search term and fee tier
  const filteredPools = mockPools.filter((pool) => {
    const searchMatch = 
      pool.token1.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.token2.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    
    const feeMatch = 
      feeTierFilter === "all" || 
      pool.feeTier.toString() === feeTierFilter;
    
    return searchMatch && feeMatch;
  });

  // Sort pools based on selected field and direction
  const sortedPools = [...filteredPools].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "name":
        aValue = `${a.token1.symbol}/${a.token2.symbol}`;
        bValue = `${b.token1.symbol}/${b.token2.symbol}`;
        break;
      case "tvl":
        aValue = a.tvl;
        bValue = b.tvl;
        break;
      case "volume":
        aValue = a.volume24h;
        bValue = b.volume24h;
        break;
      case "apr":
        aValue = a.apr;
        bValue = b.apr;
        break;
      default:
        aValue = a.tvl;
        bValue = b.tvl;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Toggle sort direction when clicking on a sortable header
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Render a sortable header cell
  const SortableHeader = ({ field, label }: { field: string; label: string }) => (
    <div
      className="flex items-center gap-1 cursor-pointer"
      onClick={() => handleSort(field)}
    >
      {label}
      {sortField === field && (
        sortDirection === "asc" ? 
        <ChevronUp className="h-4 w-4" /> : 
        <ChevronDown className="h-4 w-4" />
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pools"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={feeTierFilter}
          onValueChange={setFeeTierFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Fee tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fee Tiers</SelectItem>
            <SelectItem value="0.01">0.01%</SelectItem>
            <SelectItem value="0.05">0.05%</SelectItem>
            <SelectItem value="0.3">0.3%</SelectItem>
            <SelectItem value="1">1%</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pool</TableHead>
              <TableHead>
                <SortableHeader field="tvl" label="TVL" />
              </TableHead>
              <TableHead>
                <SortableHeader field="volume" label="Volume (24h)" />
              </TableHead>
              <TableHead>
                <SortableHeader field="apr" label="APR" />
              </TableHead>
              <TableHead>Fee Tier</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPools.map((pool) => (
              <TableRow key={pool.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TokenPair 
                      token1={pool.token1} 
                      token2={pool.token2}
                      size="sm" 
                    />
                    <span>
                      {pool.token1.symbol}/{pool.token2.symbol}
                    </span>
                  </div>
                </TableCell>
                <TableCell>${pool.tvl.toLocaleString()}</TableCell>
                <TableCell>${pool.volume24h.toLocaleString()}</TableCell>
                <TableCell className="text-green-500">{pool.apr}%</TableCell>
                <TableCell>{pool.feeTier}%</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">Add Liquidity</Button>
                </TableCell>
              </TableRow>
            ))}
            {sortedPools.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No pools found. Try adjusting your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}