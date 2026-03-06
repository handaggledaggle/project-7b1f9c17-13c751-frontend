import { NextResponse } from "next/server";

type InquiryType = "COPYRIGHT" | "REFUND" | "SHIPPING" | "OTHER";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | {
        name?: unknown;
        email?: unknown;
        type?: unknown;
        referenceId?: unknown;
        message?: unknown;
        consents?: { privacy?: unknown; evidence?: unknown };
      }
    | null;

  if (!body) {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const type = typeof body.type === "string" ? (body.type as InquiryType) : "OTHER";
  const referenceId = typeof body.referenceId === "string" ? body.referenceId.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const consentPrivacy = Boolean(body.consents?.privacy);
  const consentEvidence = Boolean(body.consents?.evidence);

  const allowed: InquiryType[] = ["COPYRIGHT", "REFUND", "SHIPPING", "OTHER"];

  if (!name) return NextResponse.json({ error: "이름을 입력해 주세요." }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ error: "이메일 형식이 올바르지 않습니다." }, { status: 400 });
  if (!allowed.includes(type)) return NextResponse.json({ error: "문의 유형이 올바르지 않습니다." }, { status: 400 });
  if (message.length < 10)
    return NextResponse.json({ error: "상세 내용은 10자 이상 입력해 주세요." }, { status: 400 });
  if (!consentPrivacy || !consentEvidence)
    return NextResponse.json({ error: "필수 동의 항목을 체크해 주세요." }, { status: 400 });

  // NOTE: serverless MVP stub
  // - In production: insert into DB (Neon Postgres) and enqueue notification.
  // - Here: return a deterministic, unique ticket id.
  const ticketId = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `T-${Date.now()}`;

  // Basic server log for operators
  console.log("[support-ticket]", {
    ticketId,
    type,
    name,
    email,
    referenceId,
    messageLength: message.length,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ticketId }, { status: 201 });
}
