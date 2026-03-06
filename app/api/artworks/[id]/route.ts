import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
    Math.min(30, Math.floor(w / 28))
  )}" fill="#6D28D9">${label.replace(/</g, "&lt;")}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // NOTE: MVP/프로토타입용 더미 데이터입니다.
  const artwork = {
    artwork_id: id,
    title: "달빛 정원",
    description:
      "달빛 아래에서 피어나는 작은 정원을 상상하며 그린 작품입니다.\n\n- 업로드 검수 기준: 권장 DPI/해상도 충족 여부, 비율 안전영역, 과도한 압축 여부\n- 승인 후 판매 노출: 플랫폼 표준 제작/포장 프로세스를 적용해 품질 편차를 줄입니다.",
    released_at: "2026-02-12",
    views: 3248,
    artist: {
      artist_id: "artist_001",
      name: "김아티스트",
    },
    images: [
      {
        id: "img_main",
        label: "작품 미리보기 이미지",
        kind: "MAIN" as const,
        src: safeSvgDataUri("작품 미리보기 이미지", 1440, 1040),
        width: 1440,
        height: 1040,
      },
      {
        id: "img_1",
        label: "샘플 1",
        kind: "THUMB" as const,
        src: safeSvgDataUri("샘플 1", 640, 448),
        width: 640,
        height: 448,
      },
      {
        id: "img_2",
        label: "샘플 2",
        kind: "THUMB" as const,
        src: safeSvgDataUri("샘플 2", 640, 448),
        width: 640,
        height: 448,
      },
      {
        id: "img_3",
        label: "샘플 3",
        kind: "THUMB" as const,
        src: safeSvgDataUri("샘플 3", 640, 448),
        width: 640,
        height: 448,
      },
      {
        id: "img_guide",
        label: "프린트 샘플 안내",
        kind: "GUIDE" as const,
        src: safeSvgDataUri("프린트 샘플 안내", 640, 448),
        width: 640,
        height: 448,
      },
    ],
    options: {
      sizes: [
        { id: "A4", label: "A4 (210×297mm)" },
        { id: "A3", label: "A3 (297×420mm)" },
        { id: "30x40", label: "30x40cm" },
      ],
      materials: [
        { id: "MATTE", label: "무광 아트지" },
        { id: "GLOSS", label: "유광 아트지" },
        { id: "CANVAS", label: "캔버스" },
      ],
      recommended_size_id: "A3",
    },
  };

  return NextResponse.json({ artwork });
}
