import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | {
        artworkId?: string;
        sizeId?: string;
        materialId?: string;
        quantity?: number;
      }
    | null;

  if (!body?.artworkId || !body?.sizeId || !body?.materialId) {
    return NextResponse.json(
      { message: "artworkId/sizeId/materialId are required" },
      { status: 400 }
    );
  }

  const quantity = typeof body.quantity === "number" && body.quantity > 0 ? body.quantity : 1;

  // NOTE: 서버리스 환경에서 영구 저장은 별도 DB/세션이 필요합니다.
  // 여기서는 프로토타입용으로 "정상 처리"만 반환합니다.
  const cartItemId = `ci_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  return NextResponse.json({ ok: true as const, cartItemId, quantity });
}
