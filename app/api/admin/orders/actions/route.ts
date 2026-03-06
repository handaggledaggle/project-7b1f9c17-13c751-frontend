import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { action?: string; orderIds?: unknown }
    | null;

  if (!body || typeof body.action !== "string" || !Array.isArray(body.orderIds)) {
    return new NextResponse("Invalid payload", { status: 400 });
  }

  const orderIds = body.orderIds.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
  if (orderIds.length === 0) return new NextResponse("No orderIds", { status: 400 });

  if (body.action !== "ASSIGN_PRINT_QUEUE" && body.action !== "MARK_INVOICE_PENDING") {
    return new NextResponse("Unsupported action", { status: 400 });
  }

  // Serverless-only mock: 상태 업데이트는 실제로 저장하지 않음
  const message =
    body.action === "ASSIGN_PRINT_QUEUE"
      ? `인쇄 큐에 ${orderIds.length}건을 배치했습니다.`
      : `송장 등록 대상으로 ${orderIds.length}건을 표시했습니다.`;

  return NextResponse.json({ updated: orderIds.length, message });
}
