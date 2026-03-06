"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Download,
  FileUp,
  Filter,
  Loader2,
  Printer,
  Search,
  Truck,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import BulkInvoicePanel, { type BulkInvoiceResult } from "./bulk-invoice-panel";
import OrderCard, { type OrderItem, type OrderStatus } from "./order-card";

type Stats = {
  weeklyNewArtists: number;
  weeklyArtworkApproved: number;
  weeklyCvr: number;
  weeklyGmvKrw: number;
  pendingInspection: number;
  pendingPrint: number;
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  ALL: "전체",
  PAID: "결제완료",
  INSPECTION: "검수중",
  PRINT_WAIT: "인쇄대기",
  INVOICE_PENDING: "송장등록",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
};

function formatKrw(n: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(n);
}

function downloadTextFile(filename: string, content: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function toOrdersCsv(orders: OrderItem[]) {
  const header = [
    "order_id",
    "customer_name",
    "artwork_title",
    "quantity",
    "paid_at",
    "status",
    "amount_krw",
    "shipping",
  ];
  const rows = orders.map((o) => [
    o.orderId,
    o.customerName,
    o.artworkTitle,
    String(o.quantity),
    o.paidAt,
    o.status,
    String(o.amountKrw),
    o.shippingMethod,
  ]);

  const esc = (v: string) => {
    const needs = /[\n\r,\"]/g.test(v);
    const vv = v.replaceAll('"', '""');
    return needs ? `"${vv}"` : vv;
  };

  return [header, ...rows]
    .map((r) => r.map((c) => esc(c)).join(","))
    .join("\n");
}

async function apiGetJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

async function apiPostJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export default function OrdersConsoleClient() {
  const [status, setStatus] = useState<OrderStatus>("ALL");
  const [query, setQuery] = useState<string>("");
  const [appliedStatus, setAppliedStatus] = useState<OrderStatus>("ALL");
  const [appliedQuery, setAppliedQuery] = useState<string>("");

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const selectedIds = useMemo(
    () => Object.entries(selected).filter(([, v]) => v).map(([k]) => k),
    [selected]
  );

  const selectedCount = selectedIds.length;

  const filteredOrders = orders;

  const refresh = async (s: OrderStatus, q: string) => {
    setLoading(true);
    setBanner(null);
    try {
      const [o, st] = await Promise.all([
        apiGetJson<{ items: OrderItem[] }>(
          `/api/admin/orders?status=${encodeURIComponent(s)}&q=${encodeURIComponent(q)}`
        ),
        apiGetJson<Stats>(`/api/admin/stats`),
      ]);
      setOrders(o.items);
      setStats(st);
      setSelected({});
    } catch (e) {
      setBanner({
        type: "error",
        message: e instanceof Error ? e.message : "데이터를 불러오지 못했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh(appliedStatus, appliedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onApply = async () => {
    setAppliedStatus(status);
    setAppliedQuery(query);
    await refresh(status, query);
  };

  const onReset = async () => {
    setStatus("ALL");
    setQuery("");
    setAppliedStatus("ALL");
    setAppliedQuery("");
    await refresh("ALL", "");
  };

  const toggleAll = (value: boolean) => {
    const next: Record<string, boolean> = {};
    for (const o of filteredOrders) next[o.orderId] = value;
    setSelected(next);
  };

  const onBatchAction = async (action: "ASSIGN_PRINT_QUEUE" | "MARK_INVOICE_PENDING") => {
    if (selectedIds.length === 0) {
      setBanner({ type: "error", message: "선택된 주문이 없습니다." });
      return;
    }

    setActionLoading(true);
    setBanner(null);
    try {
      const res = await apiPostJson<{ updated: number; message: string }>(
        `/api/admin/orders/actions`,
        { action, orderIds: selectedIds }
      );
      setBanner({ type: "success", message: res.message });
      await refresh(appliedStatus, appliedQuery);
    } catch (e) {
      setBanner({
        type: "error",
        message: e instanceof Error ? e.message : "작업에 실패했습니다.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const onExportCsv = () => {
    const csv = toOrdersCsv(filteredOrders);
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate()
    ).padStart(2, "0")}`;
    downloadTextFile(`printtie_orders_${stamp}.csv`, csv, "text/csv;charset=utf-8");
  };

  const onBulkInvoiceDone = async (result: BulkInvoiceResult) => {
    if (result.status === "success") {
      setBanner({ type: "success", message: result.message });
      await refresh(appliedStatus, appliedQuery);
    } else {
      setBanner({ type: "error", message: result.message });
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-violet-200/70 shadow-sm flex items-center justify-between px-8">
        <span className="text-xl font-bold text-violet-900">printtie</span>
        <div className="hidden md:flex gap-6">
          <Link className="text-violet-700 hover:text-violet-900" href="#">
            홈
          </Link>
          <Link className="text-violet-700 hover:text-violet-900" href="#">
            작품 등록
          </Link>
          <Link className="text-violet-700 hover:text-violet-900" href="#">
            마켓
          </Link>
          <Link className="text-violet-900 font-semibold" href="#">
            주문/관리
          </Link>
          <Link className="text-violet-700 hover:text-violet-900" href="#">
            정책·지원
          </Link>
          <Link className="text-violet-700 hover:text-violet-900" href="#">
            로그인
          </Link>
        </div>
        <Button variant="secondary" className="bg-muted text-violet-700 hover:text-violet-900">
          운영자 계정
        </Button>
      </nav>

      {/* Hero */}
      <header className="flex flex-col gap-4 px-8 py-6 bg-gradient-to-br from-violet-600 to-violet-300">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white">주문/관리 콘솔</h1>
            <p className="text-white/70 mt-1">
              관리자가 주문 검수, 인쇄 큐 배치 및 송장 관리를 수행하는 운영 대시보드입니다. 상태 필터와
              일괄 작업을 사용해 대량 주문을 효율적으로 처리하세요.
            </p>
          </div>

          <div className="flex gap-3 items-center shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-sm text-white/70">운영자</span>
              <span className="text-white font-semibold">김운영</span>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-white/20 text-white">KO</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="flex flex-wrap gap-3 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20"
                >
                  <Filter className="h-4 w-4" />
                  <span className="ml-2">상태: {STATUS_LABEL[status]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuRadioGroup value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
                  {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
                    <DropdownMenuRadioItem key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatus("ALL")}>
                  <X className="h-4 w-4" />
                  <span className="ml-2">상태 초기화</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative w-full sm:w-[420px]">
              <Search className="h-4 w-4 text-white/80 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="주문번호, 고객명, 작품명으로 검색"
                className={cn(
                  "pl-9 bg-white/10 text-white placeholder:text-white/60 border-white/20 focus-visible:ring-white/30",
                  "backdrop-blur"
                )}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => void onApply()}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20"
              variant="secondary"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              <span className="ml-2">필터 적용</span>
            </Button>
            <Button
              onClick={() => void onReset()}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20"
              variant="secondary"
              disabled={loading}
            >
              <X className="h-4 w-4" />
              <span className="ml-2">선택 초기화</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col px-8 py-8 gap-8 bg-gradient-to-br from-violet-600 to-violet-300">
        {banner ? (
          <Card
            className={cn(
              "px-4 py-3 border",
              banner.type === "success" ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"
            )}
          >
            <p className={cn("text-sm", banner.type === "success" ? "text-emerald-900" : "text-rose-900")}>
              {banner.message}
            </p>
          </Card>
        ) : null}

        {/* Stats */}
        <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4 bg-white shadow-lg rounded-lg px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <Card className="border-violet-200 p-4">
              <p className="text-sm text-violet-700">이번주 신규 작가 가입</p>
              <p className="text-2xl font-bold text-violet-900">
                {stats ? `${stats.weeklyNewArtists.toLocaleString("ko-KR")}명` : "-"}
              </p>
            </Card>
            <Card className="border-violet-200 p-4">
              <p className="text-sm text-violet-700">주간 작품 승인(완료)</p>
              <p className="text-2xl font-bold text-violet-900">
                {stats ? `${stats.weeklyArtworkApproved.toLocaleString("ko-KR")}건` : "-"}
              </p>
            </Card>
            <Card className="border-violet-200 p-4">
              <p className="text-sm text-violet-700">주문 전환율(CVR)</p>
              <p className="text-2xl font-bold text-violet-900">{stats ? `${stats.weeklyCvr}%` : "-"}</p>
            </Card>
            <Card className="border-violet-200 p-4">
              <p className="text-sm text-violet-700">GMV(주간)</p>
              <p className="text-2xl font-bold text-violet-900">{stats ? formatKrw(stats.weeklyGmvKrw) : "-"}</p>
            </Card>
          </div>

          <Separator className="lg:hidden" />

          <div className="flex gap-6 items-center justify-end shrink-0">
            <div className="flex flex-col items-end">
              <p className="text-sm text-violet-700">검수 대기</p>
              <p className="text-lg font-bold text-violet-900">{stats ? `${stats.pendingInspection}건` : "-"}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm text-violet-700">인쇄 대기</p>
              <p className="text-lg font-bold text-violet-900">{stats ? `${stats.pendingPrint}건` : "-"}</p>
            </div>
          </div>
        </section>

        {/* Orders */}
        <section className="flex flex-col gap-6 bg-violet-50 p-6 rounded-lg border border-violet-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-violet-900">주문 목록</h2>
              {selectedCount > 0 ? (
                <Badge variant="secondary" className="bg-white border border-violet-200 text-violet-900">
                  선택 {selectedCount}건
                </Badge>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="bg-violet-50 text-violet-900 border-violet-200"
                onClick={() => void onBatchAction("MARK_INVOICE_PENDING")}
                disabled={actionLoading || selectedCount === 0}
              >
                <Truck className="h-4 w-4" />
                <span className="ml-2">선택 송장 등록</span>
              </Button>
              <Button
                variant="outline"
                className="bg-violet-50 text-violet-900 border-violet-200"
                onClick={() => void onBatchAction("ASSIGN_PRINT_QUEUE")}
                disabled={actionLoading || selectedCount === 0}
              >
                <Printer className="h-4 w-4" />
                <span className="ml-2">선택 인쇄 큐에 배치</span>
              </Button>
              <Button
                variant="outline"
                className="bg-violet-50 text-violet-900 border-violet-200"
                onClick={onExportCsv}
                disabled={loading || filteredOrders.length === 0}
              >
                <Download className="h-4 w-4" />
                <span className="ml-2">CSV 내보내기</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="bg-white border border-violet-200 text-violet-900">
                    일괄 선택
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => toggleAll(true)}>전체 선택</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleAll(false)}>전체 해제</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {loading ? (
              <Card className="p-6 border-violet-200 bg-white">
                <div className="flex items-center gap-3 text-violet-900">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <p className="text-sm">주문 목록을 불러오는 중…</p>
                </div>
              </Card>
            ) : filteredOrders.length === 0 ? (
              <Card className="p-6 border-violet-200 bg-white">
                <p className="text-sm text-violet-700">조건에 해당하는 주문이 없습니다.</p>
              </Card>
            ) : (
              filteredOrders.map((o) => (
                <OrderCard
                  key={o.orderId}
                  item={o}
                  checked={!!selected[o.orderId]}
                  onCheckedChange={(v) => setSelected((prev) => ({ ...prev, [o.orderId]: v }))}
                  onAction={async (action) => {
                    if (action === "ASSIGN_PRINT_QUEUE") {
                      setActionLoading(true);
                      try {
                        await apiPostJson(`/api/admin/orders/actions`, {
                          action: "ASSIGN_PRINT_QUEUE",
                          orderIds: [o.orderId],
                        });
                        setBanner({ type: "success", message: "인쇄 큐에 배치했습니다." });
                        await refresh(appliedStatus, appliedQuery);
                      } catch (e) {
                        setBanner({
                          type: "error",
                          message: e instanceof Error ? e.message : "작업에 실패했습니다.",
                        });
                      } finally {
                        setActionLoading(false);
                      }
                      return;
                    }

                    if (action === "MARK_INVOICE_PENDING") {
                      setActionLoading(true);
                      try {
                        await apiPostJson(`/api/admin/orders/actions`, {
                          action: "MARK_INVOICE_PENDING",
                          orderIds: [o.orderId],
                        });
                        setBanner({ type: "success", message: "송장 등록 대상으로 표시했습니다." });
                        await refresh(appliedStatus, appliedQuery);
                      } catch (e) {
                        setBanner({
                          type: "error",
                          message: e instanceof Error ? e.message : "작업에 실패했습니다.",
                        });
                      } finally {
                        setActionLoading(false);
                      }
                      return;
                    }

                    if (action === "EXPORT_SINGLE") {
                      downloadTextFile(`${o.orderId}.json`, JSON.stringify(o, null, 2));
                    }
                  }}
                />
              ))
            )}
          </div>

          <Card className="p-4 border-violet-200 bg-white">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-md bg-violet-50 border border-violet-200 flex items-center justify-center">
                <FileUp className="h-4 w-4 text-violet-900" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-violet-900">운영 TIP</p>
                <p className="text-sm text-violet-700 mt-1">
                  상태는 <b>SSOT(단일 진실)</b> 원칙으로 관리하세요. “결제완료 → 검수 → 인쇄 큐 → 송장등록 → 배송중”
                  흐름을 유지하면 리드타임/CS 비용을 줄일 수 있습니다.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Timeline */}
        <section className="flex flex-col gap-6 bg-white shadow-lg p-6 rounded-lg border border-violet-200">
          <h2 className="text-xl font-bold text-violet-900">주문 처리 흐름</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                n: 1,
                title: "결제 완료",
                desc: "결제 확인 후 자동으로 검수 목록에 등록됩니다.",
              },
              {
                n: 2,
                title: "검수",
                desc: "아티스트 저작권/파일 규격 검토 및 승인 여부 판단.",
              },
              {
                n: 3,
                title: "인쇄 큐",
                desc: "검수 통과 시 인쇄 파트너 큐에 배치합니다.",
              },
              {
                n: 4,
                title: "송장 등록",
                desc: "택배사 송장 번호 등록 후 배송 시작.",
              },
            ].map((s) => (
              <div key={s.n} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <p className="text-violet-900 font-bold">{s.n}</p>
                </div>
                <h3 className="text-sm font-semibold text-violet-900">{s.title}</h3>
                <p className="text-violet-700 text-center text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bulk invoice */}
        <section className="flex flex-col items-start bg-violet-50 p-6 rounded-lg border border-violet-200">
          <BulkInvoicePanel onDone={onBulkInvoiceDone} />
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row md:justify-between gap-8 py-12 px-8 bg-white">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold text-gray-900">printtie</span>
          <p className="text-violet-700 text-sm">© 2026 printtie Inc. All rights reserved.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-10">
          <div className="flex flex-col gap-2">
            <p className="text-gray-700 font-semibold">회사</p>
            <p className="text-violet-700 text-sm">소개</p>
            <p className="text-violet-700 text-sm">채용</p>
            <p className="text-violet-700 text-sm">보도자료</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-700 font-semibold">서비스</p>
            <p className="text-violet-700 text-sm">작품 등록</p>
            <p className="text-violet-700 text-sm">가격 안내</p>
            <p className="text-violet-700 text-sm">주문 처리 흐름</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-700 font-semibold">지원</p>
            <p className="text-violet-700 text-sm">자주 묻는 질문</p>
            <p className="text-violet-700 text-sm">문의하기</p>
            <p className="text-violet-700 text-sm">정책(환불/저작권)</p>
          </div>
        </div>
      </footer>

      {/* Floating helper: not necessary but keeps parity with “운영” context */}
      <div className="fixed bottom-6 right-6 hidden lg:block">
        <Card className="p-4 border-violet-200 bg-white/90 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center">
              <Search className="h-4 w-4 text-violet-900" />
            </div>
            <div>
              <p className="text-sm font-semibold text-violet-900">빠른 검색</p>
              <p className="text-xs text-violet-700">주문번호로 즉시 찾을 수 있어요</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Global loading overlay for actions */}
      {actionLoading ? (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-[1px] flex items-center justify-center">
          <Card className="p-4 border-violet-200 bg-white">
            <div className="flex items-center gap-3 text-violet-900">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="text-sm">작업을 처리 중입니다…</p>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
