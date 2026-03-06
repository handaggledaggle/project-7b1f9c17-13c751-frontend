"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AlertCircle, ShoppingCart, Zap } from "lucide-react";
import { FAQSection } from "./faq-section";

type ArtworkDetail = {
  artwork_id: string;
  title: string;
  description: string;
  released_at: string; // YYYY-MM-DD
  views: number;
  artist: {
    artist_id: string;
    name: string;
  };
  images: Array<{
    id: string;
    label: string;
    kind: "MAIN" | "THUMB" | "GUIDE";
    src: string;
    width: number;
    height: number;
  }>;
  options: {
    sizes: Array<{ id: string; label: string }>;
    materials: Array<{ id: string; label: string }>;
    recommended_size_id?: string;
  };
};

function formatKRW(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value) + "원";
}

function safeSvgDataUri(label: string, w: number, h: number) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#EDE9FE"/>
      <stop offset="1" stop-color="#DDD6FE"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="16" y="16" width="${Math.max(0, w - 32)}" height="${Math.max(0, h - 32)}" rx="14" fill="#FFFFFF" opacity="0.7"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="ui-sans-serif, system-ui" font-size="${Math.max(
    14,
    Math.min(26, Math.floor(w / 28))
  )}" fill="#6D28D9">${label.replace(/</g, "&lt;")}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function fetchArtwork(artworkId: string): Promise<ArtworkDetail> {
  const res = await fetch(`/api/artworks/${encodeURIComponent(artworkId)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to load artwork: ${res.status}`);
  }
  const json = (await res.json()) as { artwork: ArtworkDetail };
  return json.artwork;
}

async function calculatePrice(input: {
  artworkId: string;
  sizeId: string;
  materialId: string;
}): Promise<number> {
  const res = await fetch(`/api/pricing/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Failed to calculate price: ${res.status}`);
  }
  const json = (await res.json()) as { price: number; currency: "KRW" };
  return json.price;
}

async function addToCart(input: {
  artworkId: string;
  sizeId: string;
  materialId: string;
  quantity: number;
}): Promise<{ ok: true; cartItemId: string }> {
  const res = await fetch(`/api/cart/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Failed to add to cart: ${res.status}`);
  }
  return (await res.json()) as { ok: true; cartItemId: string };
}

export function ArtworkDetailClient({ artworkId }: { artworkId: string }) {
  const [artwork, setArtwork] = useState<ArtworkDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [sizeId, setSizeId] = useState<string>("A3");
  const [materialId, setMaterialId] = useState<string>("MATTE");

  const [price, setPrice] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const [dialog, setDialog] = useState<null | {
    title: string;
    description: string;
  }>(null);

  useEffect(() => {
    let mounted = true;
    setError(null);

    fetchArtwork(artworkId)
      .then((data) => {
        if (!mounted) return;
        setArtwork(data);
        setSelectedImageId(data.images.find((i) => i.kind === "MAIN")?.id ?? data.images[0]?.id ?? null);
        const nextSize = data.options.recommended_size_id ?? data.options.sizes[0]?.id ?? "A3";
        const nextMaterial = data.options.materials[0]?.id ?? "MATTE";
        setSizeId(nextSize);
        setMaterialId(nextMaterial);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      });

    return () => {
      mounted = false;
    };
  }, [artworkId]);

  useEffect(() => {
    if (!artwork) return;
    let mounted = true;

    startTransition(() => {
      calculatePrice({ artworkId: artwork.artwork_id, sizeId, materialId })
        .then((p) => {
          if (!mounted) return;
          setPrice(p);
        })
        .catch(() => {
          if (!mounted) return;
          setPrice(null);
        });
    });

    return () => {
      mounted = false;
    };
  }, [artwork, sizeId, materialId, startTransition]);

  const selectedImage = useMemo(() => {
    if (!artwork) return null;
    return artwork.images.find((i) => i.id === selectedImageId) ?? artwork.images[0] ?? null;
  }, [artwork, selectedImageId]);

  const thumbs = useMemo(() => {
    if (!artwork) return [];
    return artwork.images.filter((i) => i.kind !== "MAIN");
  }, [artwork]);

  if (error) {
    return (
      <Card className="border border-[#DDD6FE]">
        <CardHeader>
          <CardTitle className="text-[#4C1D95]">작품 정보를 불러오지 못했어요</CardTitle>
          <CardDescription className="text-[#6D28D9]">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" onClick={() => location.reload()}>
            다시 시도
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!artwork) {
    return (
      <section className="flex gap-10 bg-[#FFFFFF]">
        <div className="flex flex-col gap-4" style={{ width: 720 }}>
          <div className="w-full h-[520px] bg-gray-200 rounded-lg" />
          <div className="flex gap-3">
            <div className="w-40 h-28 bg-gray-200 rounded-lg" />
            <div className="w-40 h-28 bg-gray-200 rounded-lg" />
            <div className="w-40 h-28 bg-gray-200 rounded-lg" />
            <div className="w-40 h-28 bg-gray-200 rounded-lg" />
          </div>
        </div>
        <aside className="flex flex-col gap-6" style={{ width: 600 }}>
          <div className="h-36 rounded-lg bg-gray-200" />
          <div className="h-56 rounded-lg bg-gray-200" />
          <div className="h-64 rounded-lg bg-gray-200" />
        </aside>
      </section>
    );
  }

  const mainSrc = selectedImage?.src || safeSvgDataUri("작품 미리보기 이미지", 1440, 1040);

  const onAddToCart = async () => {
    try {
      const result = await addToCart({ artworkId: artwork.artwork_id, sizeId, materialId, quantity: 1 });
      setDialog({
        title: "장바구니에 담았습니다",
        description: `담은 항목 ID: ${result.cartItemId}`,
      });
    } catch (e) {
      setDialog({
        title: "장바구니 담기에 실패했어요",
        description: e instanceof Error ? e.message : "Unknown error",
      });
    }
  };

  const onBuyNow = async () => {
    setDialog({
      title: "바로 구매(데모)",
      description:
        "MVP에서는 체크아웃 페이지로 이동하여 배송지/결제를 진행합니다. (현재 화면은 서비스 기획/프로토타입용)",
    });
  };

  return (
    <>
      <section className="flex gap-10 bg-[#FFFFFF]">
        <div className="flex flex-col gap-4" style={{ width: 720 }}>
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <div className="w-full h-[520px] bg-gray-100 rounded-lg overflow-hidden relative">
                <Image
                  src={mainSrc}
                  alt={selectedImage?.label ?? artwork.title}
                  fill
                  className="object-cover"
                  sizes="720px"
                  priority
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            {thumbs.slice(0, 4).map((t) => {
              const active = t.id === selectedImageId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedImageId(t.id)}
                  className={cn(
                    "w-40 h-28 rounded-lg overflow-hidden bg-gray-100 border flex items-center justify-center relative",
                    active ? "border-[#6D28D9]" : "border-transparent"
                  )}
                  aria-pressed={active}
                >
                  <Image src={t.src} alt={t.label} fill className="object-cover" sizes="160px" />
                  <span className="sr-only">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="flex flex-col gap-6" style={{ width: 600 }}>
          <Card className="bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] border border-white/20">
            <CardHeader className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <CardTitle className="text-2xl font-bold text-white truncate">
                    작품명: {artwork.title}
                  </CardTitle>
                  <CardDescription className="text-white/90 mt-1">
                    작가: {artwork.artist.name} • 판형 옵션 및 프린트 재질 선택 후 결제 가능합니다.
                  </CardDescription>
                  <div className="flex gap-3 items-center mt-3">
                    <span className="text-sm text-white/70">출시일: {artwork.released_at}</span>
                    <span className="text-sm text-white/70">•</span>
                    <span className="text-sm text-white/70">조회수 {new Intl.NumberFormat("ko-KR").format(artwork.views)}</span>
                  </div>
                </div>
                <Badge className="bg-white/15 text-white border border-white/20">승인 노출</Badge>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-white shadow-lg rounded-lg border border-[#DDD6FE]">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-xl font-semibold text-[#4C1D95]">구매 옵션</CardTitle>
              <CardDescription className="text-[#6D28D9]">
                규격/재질 선택에 따라 가격이 자동 반영됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-1/2">
                  <Label className="text-sm text-[#4C1D95]" htmlFor="size">
                    규격
                  </Label>
                  <select
                    id="size"
                    className="p-3 border border-[#DDD6FE] rounded-lg text-[#4C1D95] bg-white shadow-sm"
                    value={sizeId}
                    onChange={(e) => setSizeId(e.target.value)}
                  >
                    {artwork.options.sizes.map((s) => (
                      <option key={s.id} value={s.id} className="text-[#4C1D95]">
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-[#6D28D9]">권장: A3는 프린트 선명도가 높습니다.</p>
                </div>

                <div className="flex flex-col gap-2 w-1/2">
                  <Label className="text-sm text-[#4C1D95]" htmlFor="material">
                    프린트 재질
                  </Label>
                  <select
                    id="material"
                    className="p-3 border border-[#DDD6FE] rounded-lg text-[#4C1D95] bg-white shadow-sm"
                    value={materialId}
                    onChange={(e) => setMaterialId(e.target.value)}
                  >
                    {artwork.options.materials.map((m) => (
                      <option key={m.id} value={m.id} className="text-[#4C1D95]">
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-[#6D28D9]">프린트 재질에 따라 색감과 마감 차이가 있습니다.</p>
                </div>
              </div>

              <Separator className="bg-[#DDD6FE]" />

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-[#4C1D95]">
                    가격: {price == null ? "계산 중…" : formatKRW(price)}
                  </span>
                  <span className="text-sm text-[#6D28D9]">선택한 규격/재질에 따라 자동 반영됩니다</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]"
                    onClick={onAddToCart}
                    disabled={isPending}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    장바구니에 담기
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]"
                    onClick={onBuyNow}
                    disabled={isPending}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    바로 구매
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg p-6 rounded-lg border border-[#DDD6FE]">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-semibold text-[#4C1D95]">제작 · 배송 · 환불 요약</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className="text-[#4C1D95]">제작 기간</p>
                  <p className="text-[#6D28D9]">결제 후 3–5 영업일</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#4C1D95]">배송 (국내)</p>
                  <p className="text-[#6D28D9]">택배사 기준 2–3일 추가</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#4C1D95]">환불 정책</p>
                  <p className="text-[#6D28D9]">인쇄 품질 불량 시 전액 환불 또는 재작업</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#4C1D95]">교환/반품</p>
                  <p className="text-[#6D28D9]">수령 후 7일 이내 고객센터 접수</p>
                </div>
              </div>
              <p className="text-sm text-[#6D28D9] mt-3">
                ※ 맞춤 제작 및 작가 약관에 따라 일부 조건이 달라질 수 있습니다.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg p-4 rounded-lg border border-[#DDD6FE]">
            <CardContent className="p-0 flex gap-3">
              <AlertCircle className="h-5 w-5 text-[#6D28D9] mt-0.5" />
              <p className="text-sm text-[#4C1D95]">
                작품 등록 지표: 승인 완료된 작품은 품질 검수를 통해 노출됩니다. 신규 작가의 빠른 등록/승인 촉진이 구매 전환에 영향을 미칩니다.
              </p>
            </CardContent>
          </Card>
        </aside>
      </section>

      <section className="flex flex-col gap-6 bg-white shadow-lg p-6 rounded-lg border border-[#DDD6FE]">
        <h2 className="text-2xl font-bold text-[#4C1D95]">제작 및 품질 안내</h2>
        <div className="flex gap-6">
          <div className="flex-1 flex flex-col gap-3 bg-[#FFFFFF] p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#4C1D95]">프린트 규격 & 샘플</h3>
            <p className="text-[#6D28D9]">
              각 규격별 샘플 이미지를 제공하여 인쇄 결과물을 사전에 확인할 수 있습니다. 고해상도 원본을 권장합니다.
            </p>
          </div>
          <div className="flex-1 flex flex-col gap-3 bg-[#FFFFFF] p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#4C1D95]">색감 보정</h3>
            <p className="text-[#6D28D9]">
              기계별 색감 차이를 줄이기 위해 프로파일 보정을 적용합니다. 컨펌 시 색상 차이 발생 시 상담을 통해 조정합니다.
            </p>
          </div>
          <div className="flex-1 flex flex-col gap-3 bg-[#FFFFFF] p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#4C1D95]">포장 및 배송</h3>
            <p className="text-[#6D28D9]">
              안전한 튜브 포장 또는 판지 포장으로 발송합니다. 배송지연 발생 시 알림을 통해 안내합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white shadow-lg p-6 rounded-lg border border-[#DDD6FE]">
        <h2 className="text-2xl font-bold text-[#4C1D95]">작품 설명</h2>
        <p className="text-[#6D28D9] mt-3 whitespace-pre-wrap">{artwork.description}</p>
      </section>

      <FAQSection />

      <Dialog open={!!dialog} onOpenChange={(open) => (!open ? setDialog(null) : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog?.title}</DialogTitle>
            <DialogDescription>{dialog?.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialog(null)}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
