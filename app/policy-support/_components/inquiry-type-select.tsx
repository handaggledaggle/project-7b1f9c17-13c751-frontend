"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export type InquiryType = "COPYRIGHT" | "REFUND" | "SHIPPING" | "OTHER";

const LABELS: Record<InquiryType, string> = {
  COPYRIGHT: "저작권",
  REFUND: "환불/교환",
  SHIPPING: "배송",
  OTHER: "기타",
};

export function InquiryTypeSelect(props: {
  value: InquiryType;
  onChange: (value: InquiryType) => void;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between border-violet-200 bg-white text-violet-950 hover:bg-violet-50",
            props.className
          )}
        >
          <span>{LABELS[props.value]}</span>
          <ChevronDown className="h-4 w-4 text-violet-700" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
        {(Object.keys(LABELS) as InquiryType[]).map((key) => (
          <DropdownMenuItem key={key} onClick={() => props.onChange(key)}>
            {LABELS[key]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function inquiryTypeLabel(value: InquiryType) {
  return LABELS[value];
}
