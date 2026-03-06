import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const baseBySize: Record<string, number> = {
  A4: 35000,
  A3: 45000,
  "30x40": 49000,
};

const addByMaterial: Record<string, number> = {
  MATTE: 0,
  GLOSS: 2000,
  CANVAS: 15000,
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { artworkId?: string; sizeId?: string; materialId?: string }
    | null;

  const sizeId = body?.sizeId;
  const materialId = body?.materialId;

  if (!sizeId || !materialId) {
    return NextResponse.json(
      { message: "sizeId/materialId are required" },
      { status: 400 }
    );
  }

  const base = baseBySize[sizeId] ?? 45000;
  const add = addByMaterial[materialId] ?? 0;

  // MVP: 배송비/가공비/세금 등을 합산하기 전에, 옵션 기반 권장가만 단순 산출
  const price = base + add;

  return NextResponse.json({ price, currency: "KRW" as const });
}
