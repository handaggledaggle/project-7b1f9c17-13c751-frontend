"use client";

import { useMemo, useState } from "react";
import { ClipboardList, FileDown, Printer, Truck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type OrderStatus =
  | "ALL"
  | "PAID"
  | "INSPECTION"
  | "PRINT_WAIT"
  | "INVOICE_PENDING"
  | "SHIPPING"
  | "DELIVERED";

export type OrderItem = {
  orderId: string;
  customerName: string;
  artworkTitle: string;
  quantity: number;
  paidAt: string;
  status: Exclude<OrderStatus, "ALL">;
  amountKrw: number;
  shippingMethod: string;
};

const STATUS_BADGE: Record<OrderItem["status"], { label: string; className: string }> = {
  PAID: { label: "결제완료", className: "bg-violet-50 text-violet-900 border border-violet-200" },
  INSPECTION: { label: "검수중", className: "bg-amber-50 text-amber-900 border border-amber-200" },
  PRINT_WAIT: { label: "인쇄대기", className: "bg-blue-50 text-blue-900 border border-blue-200" },
  INVOICE_PENDING: { label: "송장등록", className: "bg-emerald-50 text-emerald-900 border border-emerald-200" },
  SHIPPING: { label: "배송중", className: "bg-indigo-50 text-indigo-900 border border-indigo-200" },
  DELIVERED: { label: "배송완료", className: "bg-slate-50 text-slate-900 border border-slate-200" },
};

function formatKrw(n: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function OrderCard(props: {
  item: OrderItem;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  onAction: (action: "ASSIGN_PRINT_QUEUE" | "MARK_INVOICE_PENDING" | "EXPORT_SINGLE") => void | Promise<void>;
}) {
  const { item, checked, onCheckedChange, onAction } = props;

  const badge = STATUS_BADGE[item.status];
  const [courier, setCourier] = useState("CJ대한통운");
  const [tracking, setTracking] = useState("");

  const canShip = useMemo(() => item.status === "INVOICE_PENDING" || item.status === "SHIPPING", [item.status]);

  return (
    <div className="flex gap-4">
      <Card className="w-12 h-12 bg-muted border-violet-200 rounded-md flex items-center justify-center shrink-0">
        <span className="text-violet-900 font-semibold">P</span>
      </Card>

      <Card className="flex-1 bg-white shadow-lg border border-violet-200 rounded-lg p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <input
                  aria-label="선택"
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onCheckedChange(e.target.checked)}
                  className="h-4 w-4 accent-violet-600"
                />
                <div className="min-w-0">
                  <p className="text-sm text-violet-700">주문번호 • 고객</p>
                  <p className="text-violet-900 font-semibold truncate">
                    {item.orderId} · {item.customerName}
                  </p>
                </div>
                <Badge className={cn("ml-auto lg:ml-0", badge.className)}>{badge.label}</Badge>
              </div>
              <p className="text-sm text-violet-700 mt-2">작품: "{item.artworkTitle}" · 수량 {item.quantity}</p>
            </div>

            <div className="flex flex-col items-start lg:items-end">
              <p className="text-sm text-violet-700">결제일</p>
              <p className="text-violet-900 font-medium">{item.paidAt}</p>
              <p className="text-sm text-violet-700">배송: {item.shippingMethod}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-sm text-violet-700">
              <span>결제금액: {formatKrw(item.amountKrw)}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-violet-50 text-violet-900 border-violet-200">
                    <ClipboardList className="h-4 w-4" />
                    <span className="ml-2">검수 상세</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>검수 상세</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">주문</p>
                      <p className="font-medium">{item.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">작품</p>
                      <p className="font-medium">{item.artworkTitle}</p>
                    </div>
                    <Card className="p-3 border-violet-200 bg-violet-50">
                      <p className="text-sm text-violet-900 font-semibold">운영 체크리스트(예시)</p>
                      <ul className="text-sm text-violet-700 list-disc list-inside mt-2 space-y-1">
                        <li>해상도/DPI 기준 충족 여부</li>
                        <li>색공간(권장: sRGB) 및 파일 손상 여부</li>
                        <li>저작권/신고 이력 확인</li>
                        <li>주문 옵션/수량, 배송지 특이사항</li>
                      </ul>
                    </Card>
                  </div>
                  <DialogFooter>
                    <Button variant="secondary">닫기</Button>
                    <Button variant="outline" onClick={() => void onAction("EXPORT_SINGLE")}
                      className="border-violet-200">
                      <FileDown className="h-4 w-4" />
                      <span className="ml-2">JSON 내보내기</span>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-violet-50 text-violet-900 border-violet-200"
                    disabled={!canShip}
                    title={canShip ? "" : "현재 상태에서는 송장 작업이 제한됩니다."}
                  >
                    <Truck className="h-4 w-4" />
                    <span className="ml-2">송장 등록</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>송장 등록 (단건)</DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>택배사</Label>
                      <select
                        className="h-10 rounded-md border border-violet-200 px-3 text-sm"
                        value={courier}
                        onChange={(e) => setCourier(e.target.value)}
                      >
                        <option>CJ대한통운</option>
                        <option>한진택배</option>
                        <option>로젠</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label>송장번호</Label>
                      <Input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="예: 1234-5678-9012" />
                    </div>
                    <Card className="p-3 border-violet-200 bg-violet-50">
                      <p className="text-sm text-violet-700">
                        실제 MVP에서는 이 입력이 <b>주문 상태 이력</b>에 기록되고, 구매자에게 알림이 발송됩니다.
                      </p>
                    </Card>
                  </div>

                  <DialogFooter>
                    <Button variant="secondary">닫기</Button>
                    <Button
                      onClick={() => void onAction("MARK_INVOICE_PENDING")}
                      disabled={!tracking.trim()}
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      등록
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                className="bg-violet-50 text-violet-900 border-violet-200"
                onClick={() => void onAction("ASSIGN_PRINT_QUEUE")}
              >
                <Printer className="h-4 w-4" />
                <span className="ml-2">인쇄 큐 배치</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
