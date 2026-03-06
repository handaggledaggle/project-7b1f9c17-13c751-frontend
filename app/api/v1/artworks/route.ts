import { NextResponse } from "next/server";

type ArtworkSummary = {
  id: string;
  title: string;
  artist_name: string;
  category: "ILLUSTRATION" | "POSTER" | "PHOTO" | "DIGITAL";
  price_krw: number;
  image_url: string;
  created_at: string; // ISO
  score: number; // for recommended sort
  tags: string[];
  flags: {
    print_available: boolean;
    instant_buy: boolean;
    limited: boolean;
    approved: boolean;
    free_shipping: boolean;
  };
};

const MOCK: ArtworkSummary[] = [
  {
    id: "art_001",
    title: "봄빛 일러스트",
    artist_name: "김소연",
    category: "ILLUSTRATION",
    price_krw: 45000,
    image_url: "https://picsum.photos/seed/art_001/800/600",
    created_at: "2026-03-01T10:00:00.000Z",
    score: 98,
    tags: ["봄", "파스텔", "감성"],
    flags: {
      print_available: true,
      instant_buy: true,
      limited: false,
      approved: true,
      free_shipping: false,
    },
  },
  {
    id: "art_002",
    title: "모노톤 도시 사진",
    artist_name: "박준형",
    category: "PHOTO",
    price_krw: 32000,
    image_url: "https://picsum.photos/seed/art_002/800/600",
    created_at: "2026-02-27T10:00:00.000Z",
    score: 92,
    tags: ["도시", "흑백", "사진"],
    flags: {
      print_available: true,
      instant_buy: false,
      limited: true,
      approved: true,
      free_shipping: true,
    },
  },
  {
    id: "art_003",
    title: "레트로 포스터 세트",
    artist_name: "이지훈",
    category: "POSTER",
    price_krw: 78000,
    image_url: "https://picsum.photos/seed/art_003/800/600",
    created_at: "2026-02-20T10:00:00.000Z",
    score: 95,
    tags: ["레트로", "포스터", "세트"],
    flags: {
      print_available: true,
      instant_buy: true,
      limited: false,
      approved: true,
      free_shipping: false,
    },
  },
  {
    id: "art_004",
    title: "디지털 추상 작품",
    artist_name: "한예린",
    category: "DIGITAL",
    price_krw: 60000,
    image_url: "https://picsum.photos/seed/art_004/800/600",
    created_at: "2026-03-03T10:00:00.000Z",
    score: 90,
    tags: ["추상", "디지털", "컬러"],
    flags: {
      print_available: true,
      instant_buy: true,
      limited: false,
      approved: true,
      free_shipping: true,
    },
  },
  {
    id: "art_005",
    title: "초여름 바다 포스터",
    artist_name: "정다은",
    category: "POSTER",
    price_krw: 38000,
    image_url: "https://picsum.photos/seed/art_005/800/600",
    created_at: "2026-03-04T10:00:00.000Z",
    score: 88,
    tags: ["바다", "여름", "인테리어"],
    flags: {
      print_available: true,
      instant_buy: true,
      limited: false,
      approved: true,
      free_shipping: false,
    },
  },
  {
    id: "art_006",
    title: "밤의 네온 스케치",
    artist_name: "서지훈",
    category: "ILLUSTRATION",
    price_krw: 52000,
    image_url: "https://picsum.photos/seed/art_006/800/600",
    created_at: "2026-02-18T10:00:00.000Z",
    score: 86,
    tags: ["네온", "야경", "스케치"],
    flags: {
      print_available: true,
      instant_buy: false,
      limited: false,
      approved: true,
      free_shipping: true,
    },
  },
  {
    id: "art_007",
    title: "산책길 필름 사진",
    artist_name: "이채원",
    category: "PHOTO",
    price_krw: 29000,
    image_url: "https://picsum.photos/seed/art_007/800/600",
    created_at: "2026-03-05T10:00:00.000Z",
    score: 84,
    tags: ["필름", "산책", "감성"],
    flags: {
      print_available: true,
      instant_buy: true,
      limited: false,
      approved: true,
      free_shipping: false,
    },
  },
  {
    id: "art_008",
    title: "미니멀 라인 아트",
    artist_name: "최유나",
    category: "DIGITAL",
    price_krw: 24000,
    image_url: "https://picsum.photos/seed/art_008/800/600",
    created_at: "2026-02-10T10:00:00.000Z",
    score: 83,
    tags: ["미니멀", "라인", "모던"],
    flags: {
      print_available: true,
      instant_buy: true,
      limited: true,
      approved: true,
      free_shipping: true,
    },
  },
  {
    id: "art_009",
    title: "검수 대기 샘플(노출X)",
    artist_name: "테스트",
    category: "ILLUSTRATION",
    price_krw: 15000,
    image_url: "https://picsum.photos/seed/art_009/800/600",
    created_at: "2026-03-06T10:00:00.000Z",
    score: 10,
    tags: ["테스트"],
    flags: {
      print_available: true,
      instant_buy: false,
      limited: false,
      approved: false,
      free_shipping: false,
    },
  },
  // add some more for pagination
  ...Array.from({ length: 24 }).map((_, i) => {
    const n = i + 10;
    const id = `art_${String(n).padStart(3, "0")}`;
    const cats = ["ILLUSTRATION", "POSTER", "PHOTO", "DIGITAL"] as const;
    const category = cats[n % cats.length];
    const price = 18000 + (n % 9) * 7000;
    return {
      id,
      title: `컬렉션 작품 ${n}`,
      artist_name: ["김서현", "박민준", "이수연", "정우진"][n % 4],
      category,
      price_krw: price,
      image_url: `https://picsum.photos/seed/${id}/800/600`,
      created_at: new Date(Date.UTC(2026, 1, (n % 28) + 1, 10, 0, 0)).toISOString(),
      score: 60 + (n % 40),
      tags: ["컬렉션", category.toLowerCase(), n % 2 ? "감성" : "모던"],
      flags: {
        print_available: true,
        instant_buy: n % 3 !== 0,
        limited: n % 7 === 0,
        approved: true,
        free_shipping: n % 4 === 0,
      },
    } satisfies ArtworkSummary;
  }),
];

function parsePositiveInt(v: string | null, fallback: number) {
  if (!v) return fallback;
  const n = Number(v);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) return null;
  return n;
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const page = parsePositiveInt(url.searchParams.get("page"), 1);
  const pageSize = parsePositiveInt(url.searchParams.get("page_size"), 8);
  if (page === null || pageSize === null) {
    return NextResponse.json(
      { message: "Invalid pagination params: page/page_size must be positive integers." },
      { status: 400 }
    );
  }

  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const category = (url.searchParams.get("category") ?? "").trim();
  const sortBy = (url.searchParams.get("sort_by") ?? "recommended") as
    | "recommended"
    | "newest"
    | "price_asc"
    | "price_desc";

  const freeShipping = url.searchParams.get("free_shipping") === "true";
  const approvedOnly = url.searchParams.get("approved_only") !== "false"; // default true

  let filtered = MOCK.slice();

  if (approvedOnly) {
    filtered = filtered.filter((a) => a.flags.approved);
  }

  if (freeShipping) {
    filtered = filtered.filter((a) => a.flags.free_shipping);
  }

  if (category) {
    filtered = filtered.filter((a) => a.category === category);
  }

  if (q) {
    filtered = filtered.filter((a) => {
      const haystack = [a.title, a.artist_name, ...a.tags].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }

  filtered.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.created_at.localeCompare(a.created_at);
      case "price_asc":
        return a.price_krw - b.price_krw;
      case "price_desc":
        return b.price_krw - a.price_krw;
      case "recommended":
      default:
        return b.score - a.score;
    }
  });

  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = filtered.slice(start, end).map((a) => ({
    id: a.id,
    title: a.title,
    artist_name: a.artist_name,
    category: a.category,
    price_krw: a.price_krw,
    image_url: a.image_url,
    flags: a.flags,
  }));

  return NextResponse.json({
    items,
    total_count: totalCount,
    page,
    page_size: pageSize,
  });
}
