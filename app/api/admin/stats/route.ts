import { NextResponse } from "next/server";

export async function GET() {
  // MVP mock: 실제 서비스에서는 기간 필터 + DB 집계
  return NextResponse.json({
    weeklyNewArtists: 124,
    weeklyArtworkApproved: 3412,
    weeklyCvr: 2.8,
    weeklyGmvKrw: 48200000,
    pendingInspection: 58,
    pendingPrint: 76,
  });
}
