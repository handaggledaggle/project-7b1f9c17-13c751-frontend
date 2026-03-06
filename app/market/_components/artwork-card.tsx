"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

export type ArtworkSummary = {
  id: string;
  title: string;
  artist_name: string;
  category: "ILLUSTRATION" | "POSTER" | "PHOTO" | "DIGITAL";
  price_krw: number;
  image_url: string;
  flags: {
    print_available: boolean;
    instant_buy: boolean;
    limited: boolean;
    approved: boolean;
    free_shipping: boolean;
  };
};

function formatKRW(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function categoryLabel(category: ArtworkSummary["category"]) {
  switch (category) {
    case "ILLUSTRATION":
      return "일러스트";
    case "POSTER":
      return "포스터";
    case "PHOTO":
      return "사진";
    case "DIGITAL":
      return "디지털아트";
  }
}

export function ArtworkCard({ artwork }: { artwork: ArtworkSummary }) {
  return (
    <Card className="overflow-hidden border-[#DDD6FE] shadow-lg">
      <div className="relative w-full h-44 bg-muted">
        <Image
          src={artwork.image_url}
          alt={artwork.title}
          fill
          unoptimized
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-white/90 text-[#4C1D95]">
            {categoryLabel(artwork.category)}
          </Badge>
          {artwork.flags.limited ? (
            <Badge variant="outline" className="bg-white/90 text-[#4C1D95] border-[#DDD6FE]">
              한정판
            </Badge>
          ) : null}
          {artwork.flags.free_shipping ? (
            <Badge variant="outline" className="bg-white/90 text-[#4C1D95] border-[#DDD6FE]">
              무료배송
            </Badge>
          ) : null}
        </div>
      </div>

      <CardContent className="p-6 space-y-2">
        <h3 className="text-lg font-semibold text-[#4C1D95] line-clamp-1">{artwork.title}</h3>
        <p className="text-[#6D28D9] text-sm line-clamp-1">
          아티스트: {artwork.artist_name} · 카테고리: {categoryLabel(artwork.category)}
        </p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[#4C1D95] font-semibold">₩{formatKRW(artwork.price_krw)}</span>
            <span className={cn("text-[#6D28D9] text-sm", "line-clamp-1")}>
              {artwork.flags.print_available ? "프린트 제작 가능" : "제작 옵션 확인"}
              {artwork.flags.instant_buy ? " · 즉시 구매" : ""}
              {artwork.flags.approved ? "" : " · 검수중"}
            </span>
          </div>
          <Button asChild variant="outline" className="text-[#4C1D95]">
            <Link href={`/artworks/${artwork.id}`}>상세보기</Link>
          </Button>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0" />
    </Card>
  );
}
