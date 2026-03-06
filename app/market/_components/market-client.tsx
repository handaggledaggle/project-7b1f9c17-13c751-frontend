"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, LoaderCircle, X } from "lucide-react";

import { ArtworkCard, type ArtworkSummary } from "./artwork-card";

type SortBy = "recommended" | "newest" | "price_asc" | "price_desc";

type ArtworkListResponse = {
  items: ArtworkSummary[];
  total_count: number;
  page: number;
  page_size: number;
};

const CATEGORIES = [
  { value: "", label: "모든 카테고리" },
  { value: "ILLUSTRATION", label: "일러스트" },
  { value: "POSTER", label: "포스터" },
  { value: "PHOTO", label: "사진" },
  { value: "DIGITAL", label: "디지털아트" },
] as const;

const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: "recommended", label: "추천순" },
  { value: "newest", label: "최신순" },
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
];

function buildQuery(params: {
  page: number;
  pageSize: number;
  q: string;
  category: string;
  sortBy: SortBy;
  freeShipping: boolean;
  approvedOnly: boolean;
}) {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("page_size", String(params.pageSize));
  if (params.q.trim()) sp.set("q", params.q.trim());
  if (params.category) sp.set("category", params.category);
  sp.set("sort_by", params.sortBy);
  if (params.freeShipping) sp.set("free_shipping", "true");
  if (params.approvedOnly) sp.set("approved_only", "true");
  return sp.toString();
}

async function fetchArtworks(queryString: string, signal?: AbortSignal) {
  const res = await fetch(`/api/v1/artworks?${queryString}` as const, {
    method: "GET",
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `요청 실패 (HTTP ${res.status})`);
  }
  return (await res.json()) as ArtworkListResponse;
}

export function MarketClient() {
  const pageSize = 8;

  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState<string>("");
  const [sortBy, setSortBy] = React.useState<SortBy>("recommended");
  const [freeShippingOnly, setFreeShippingOnly] = React.useState(false);
  const [approvedOnly, setApprovedOnly] = React.useState(true);

  const [items, setItems] = React.useState<ArtworkSummary[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(1);

  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const controllerRef = React.useRef<AbortController | null>(null);

  const activeFilterText = React.useMemo(() => {
    const parts: string[] = [];
    parts.push(freeShippingOnly ? "무료배송만" : "무료배송 없음");
    parts.push(approvedOnly ? "승인된 작품만" : "전체 상태");
    return `필터: ${parts.join(" · ")}`;
  }, [freeShippingOnly, approvedOnly]);

  const runSearch = React.useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      const queryString = buildQuery({
        page: nextPage,
        pageSize,
        q,
        category,
        sortBy,
        freeShipping: freeShippingOnly,
        approvedOnly,
      });

      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        setError(null);
        if (mode === "replace") setIsLoading(true);
        else setIsLoadingMore(true);

        const data = await fetchArtworks(queryString, controller.signal);
        setTotalCount(data.total_count);
        setPage(data.page);
        setItems((prev) => (mode === "append" ? [...prev, ...data.items] : data.items));
      } catch (e) {
        if ((e as any)?.name === "AbortError") return;
        setError((e as Error)?.message ?? "알 수 없는 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [q, category, sortBy, freeShippingOnly, approvedOnly]
  );

  React.useEffect(() => {
    void runSearch(1, "replace");
    return () => controllerRef.current?.abort();
  }, [runSearch]);

  const hasMore = items.length < totalCount;

  return (
    <>
      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]">
        <div className="mx-auto w-full max-w-[1440px] px-8 py-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-white">마켓 — 작품 탐색</h1>
                <p className="text-white/70 mt-2 max-w-2xl">
                  카테고리 기반 카드 그리드로 아티스트 작품을 찾아보고, 필터·검색으로 원하는 작품을 빠르게 발견하세요.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className={cn("flex items-center rounded-lg border border-white/20 bg-white/10 px-3 py-2", "backdrop-blur-sm")}
                >
                  <Search className="mr-2 size-4 text-white/80" aria-hidden="true" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void runSearch(1, "replace");
                    }}
                    placeholder="작가명, 작품명, 태그로 검색"
                    className={cn(
                      "h-8 w-[280px] sm:w-[360px]",
                      "border-0 bg-transparent text-white placeholder:text-white/60",
                      "focus-visible:ring-0 focus-visible:ring-offset-0"
                    )}
                    aria-label="작가명, 작품명, 태그로 검색"
                  />
                  {q ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-white/80 hover:text-white hover:bg-white/10"
                      onClick={() => {
                        setQ("");
                        void runSearch(1, "replace");
                      }}
                      aria-label="검색어 지우기"
                    >
                      <X className="size-4" />
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    onClick={() => void runSearch(1, "replace")}
                    className="ml-2 bg-white/10 text-white hover:bg-white/20"
                    variant="secondary"
                  >
                    검색
                  </Button>
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      className="bg-white/10 text-white hover:bg-white/20"
                    >
                      <SlidersHorizontal className="mr-2 size-4" aria-hidden="true" />
                      고급 필터
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[360px]">
                    <SheetHeader>
                      <SheetTitle>고급 필터</SheetTitle>
                    </SheetHeader>

                    <div className="mt-6 space-y-6">
                      <div className="space-y-2">
                        <Label className="text-sm">배송</Label>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">무료배송만 보기</p>
                            <p className="text-xs text-muted-foreground">무료배송 작품만 목록에 표시합니다.</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={freeShippingOnly}
                            onChange={(e) => setFreeShippingOnly(e.target.checked)}
                            aria-label="무료배송만 보기"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label className="text-sm">상태</Label>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">승인된 작품만 보기</p>
                            <p className="text-xs text-muted-foreground">기본값: 승인 완료된 작품만 노출합니다.</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={approvedOnly}
                            onChange={(e) => setApprovedOnly(e.target.checked)}
                            aria-label="승인된 작품만 보기"
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={() => void runSearch(1, "replace")}
                        className="w-full"
                      >
                        필터 적용
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="category" className="text-white/90">
                  카테고리
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    "border border-white/20 bg-white/10 text-white",
                    "outline-none"
                  )}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.label} value={c.value} className="text-black">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="text-white/90">
                  정렬
                </Label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortBy);
                  }}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    "border border-white/20 bg-white/10 text-white",
                    "outline-none"
                  )}
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value} className="text-black">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:ml-auto text-white/70">
                <span className="text-sm">{activeFilterText}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Card grid */}
      <section className="w-full bg-white py-20 shadow-lg">
        <div className="mx-auto w-full max-w-[1440px] px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#4C1D95]">추천 작품</h2>
              <p className="text-[#6D28D9]">주요 카테고리별로 엄선된 작품들을 확인하세요.</p>
            </div>
            <div className="text-[#6D28D9] text-sm">
              검색결과<span className="text-[#4C1D95]"> {totalCount.toLocaleString()}건</span>
            </div>
          </div>

          {error ? (
            <Card className="border-[#DDD6FE] p-6">
              <div className="text-sm text-red-600">{error}</div>
              <div className="mt-3">
                <Button onClick={() => void runSearch(1, "replace")}>다시 시도</Button>
              </div>
            </Card>
          ) : null}

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-[#6D28D9]">
              <LoaderCircle className="mr-2 size-5 animate-spin" aria-hidden="true" />
              불러오는 중…
            </div>
          ) : items.length === 0 ? (
            <Card className="border-[#DDD6FE] p-8">
              <p className="text-[#4C1D95] font-semibold">검색 결과가 없습니다.</p>
              <p className="text-sm text-[#6D28D9] mt-1">다른 키워드 또는 필터로 다시 시도해보세요.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {items.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          )}

          <div className="w-full flex justify-center mt-8">
            <Button
              variant="outline"
              className="bg-white shadow-lg border-[#DDD6FE] text-[#4C1D95]"
              disabled={isLoading || isLoadingMore || !hasMore}
              onClick={() => void runSearch(page + 1, "append")}
            >
              {isLoadingMore ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" aria-hidden="true" />
                  불러오는 중…
                </>
              ) : hasMore ? (
                "더 보기"
              ) : (
                "마지막 페이지입니다"
              )}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
