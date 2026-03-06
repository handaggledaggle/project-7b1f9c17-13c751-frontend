import { NextResponse } from "next/server";

function parseCsvRows(csv: string) {
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return { rows: [], errors: 0 };

  const header = lines[0].split(",").map((s) => s.trim());
  const idxOrder = header.indexOf("order_id");
  const idxTracking = header.indexOf("tracking_no");
  const idxCourier = header.indexOf("courier");

  const rows: Array<{ order_id: string; tracking_no: string; courier: string }> = [];
  let errors = 0;

  for (const line of lines.slice(1)) {
    const cols = line.split(",").map((s) => s.trim().replaceAll(/^"|"$/g, ""));
    const order_id = idxOrder !== -1 ? (cols[idxOrder] ?? "") : "";
    const tracking_no = idxTracking !== -1 ? (cols[idxTracking] ?? "") : "";
    const courier = idxCourier !== -1 ? (cols[idxCourier] ?? "") : "";

    if (!order_id || !tracking_no) {
      errors += 1;
      continue;
    }
    rows.push({ order_id, tracking_no, courier });
  }

  return { rows, errors };
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { courier?: string; csv?: string }
    | null;

  if (!body || typeof body.csv !== "string") {
    return new NextResponse("Invalid payload", { status: 400 });
  }

  const courier = typeof body.courier === "string" && body.courier.trim() ? body.courier.trim() : "";
  const { rows, errors } = parseCsvRows(body.csv);

  if (rows.length === 0) {
    return new NextResponse("No valid rows", { status: 400 });
  }

  // Serverless-only mock: 실제 DB 업데이트/중복 체크는 생략
  // 현실 구현 시: order_id 매칭, tracking_no 중복 방지, 실패 사유 리포트 생성

  const message = `일괄 송장 등록 완료: ${rows.length}건 처리${errors ? ` (오류 ${errors}건)` : ""}.`;
  return NextResponse.json({ processed: rows.length, errors, message, courierApplied: courier || null });
}
