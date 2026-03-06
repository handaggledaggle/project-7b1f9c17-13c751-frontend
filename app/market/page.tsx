import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MarketClient } from "./_components/market-client";

export const metadata: Metadata = {
  title: "마켓 — 작품 탐색 | printtie",
  description:
    "카테고리 기반 카드 그리드로 아티스트 작품을 찾아보고, 필터·검색으로 원하는 작품을 빠르게 발견하세요.",
};

export default async function MarketPage() {
  return (
    <div className="w-full min-h-dvh flex flex-col bg-white">
      {/* Navbar */}
      <header className="w-full border-b border-[#DDD6FE] bg-white shadow-sm">
        <div className="mx-auto w-full max-w-[1440px] h-16 px-8 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#4C1D95]">
            printtie
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="text-[#6D28D9] hover:text-[#4C1D95]">
              홈
            </Link>
            <Link
              href="/upload"
              className="text-[#6D28D9] hover:text-[#4C1D95]"
            >
              작품 등록
            </Link>
            <Link
              href="/market"
              className="text-[#4C1D95] font-semibold"
              aria-current="page"
            >
              마켓
            </Link>
            <Link
              href="/orders"
              className="text-[#6D28D9] hover:text-[#4C1D95]"
            >
              주문/관리
            </Link>
            <Link
              href="/support"
              className="text-[#6D28D9] hover:text-[#4C1D95]"
            >
              정책·지원
            </Link>
            <Link
              href="/login"
              className="text-[#6D28D9] hover:text-[#4C1D95]"
            >
              로그인
            </Link>
          </nav>

          <Button asChild variant="secondary" className="bg-gray-100 text-[#6D28D9]">
            <Link href="/signup">회원가입</Link>
          </Button>
        </div>
      </header>

      {/* Hero + Card Grid (client: search/filter/pagination) */}
      <main className="w-full">
        <MarketClient />

        {/* Features */}
        <section className="w-full bg-[#FAF5FF] py-20">
          <div className="mx-auto w-full max-w-[1440px] px-8">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold text-[#4C1D95]">주요 기능</h2>
              <p className="mt-2 text-lg text-[#6D28D9]">
                구매자가 작품을 쉽게 발견하고 주문할 수 있도록 돕는 기능들
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-[#DDD6FE] shadow-lg">
                <CardHeader className="items-center text-center">
                  <div className="w-12 h-12 rounded-lg bg-gray-200" />
                  <CardTitle className="mt-4 text-[#4C1D95]">카테고리 필터</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-[#6D28D9]">
                  카테고리·태그·가격대별 필터로 관심 작품만 빠르게 탐색
                </CardContent>
              </Card>

              <Card className="border-[#DDD6FE] shadow-lg">
                <CardHeader className="items-center text-center">
                  <div className="w-12 h-12 rounded-lg bg-gray-200" />
                  <CardTitle className="mt-4 text-[#4C1D95]">작품 상태 표시</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-[#6D28D9]">
                  승인 완료, 한정판, 즉시 배송 가능 등 상태를 명확히 표시
                </CardContent>
              </Card>

              <Card className="border-[#DDD6FE] shadow-lg">
                <CardHeader className="items-center text-center">
                  <div className="w-12 h-12 rounded-lg bg-gray-200" />
                  <CardTitle className="mt-4 text-[#4C1D95]">빠른 결제 연동</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-[#6D28D9]">
                  장바구니→결제 흐름을 단축해 구매전환율을 높입니다
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="w-full bg-white py-20 shadow-lg">
          <div className="mx-auto w-full max-w-[1440px] px-8">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold text-[#4C1D95]">가격 정책</h2>
              <p className="mt-2 text-lg text-[#6D28D9]">작품별 판매 수수료와 제작 옵션 안내</p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-[#DDD6FE]">
                <CardHeader>
                  <CardTitle className="text-[#4C1D95]">기본 판매</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-3xl font-bold text-[#4C1D95]">
                    수수료 10%
                    <span className="text-lg font-medium text-[#6D28D9]"> · 제작비 별도</span>
                  </p>
                  <div className="space-y-2 text-[#4C1D95]">
                    <p>작품당 커미션: 10%</p>
                    <p>승인 처리: 평균 24시간 내</p>
                    <p>환불 정책: 구매일로부터 7일 이내</p>
                  </div>
                  <Button variant="outline" className="text-[#4C1D95]">
                    수수료 상세보기
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-[#DDD6FE]">
                <CardHeader>
                  <CardTitle className="text-[#4C1D95]">프리미엄 제작 옵션</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-3xl font-bold text-[#4C1D95]">
                    제작비 별도
                    <span className="text-lg font-medium text-[#6D28D9]"> · 견적별도</span>
                  </p>
                  <div className="space-y-2 text-[#4C1D95]">
                    <p>고품질 인쇄 옵션 제공</p>
                    <p>대량 주문 시 할인 제공</p>
                    <p>배송 추적·보증 포함</p>
                  </div>
                  <Button variant="outline" className="text-[#4C1D95]">
                    견적 요청
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full bg-[#FAF5FF] py-20">
          <div className="mx-auto w-full max-w-[1440px] px-8">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold text-[#4C1D95]">구매자 리뷰</h2>
              <p className="mt-2 text-[#6D28D9]">실제 구매자들이 남긴 후기와 평가</p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-[#DDD6FE] shadow-lg">
                <CardContent className="p-6">
                  <p className="text-[#4C1D95]">
                    “작품 설명과 인쇄 품질이 기대 이상이었어요. 배송도 빠르게 처리되었습니다.”
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="flex flex-col">
                      <p className="font-semibold text-[#4C1D95]">김민지</p>
                      <p className="text-sm text-[#6D28D9]">구매자 · 3일 전</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#DDD6FE] shadow-lg">
                <CardContent className="p-6">
                  <p className="text-[#4C1D95]">
                    “작가와의 커뮤니케이션이 원활했고 맞춤 제작도 친절히 안내받았습니다.”
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="flex flex-col">
                      <p className="font-semibold text-[#4C1D95]">오준호</p>
                      <p className="text-sm text-[#6D28D9]">구매자 · 2주 전</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white py-12">
        <div className="mx-auto w-full max-w-[1440px] px-8 flex flex-col md:flex-row md:justify-between gap-10">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold text-gray-900">printtie</span>
            <p className="text-[#6D28D9] text-sm">© 2026 printtie Inc. All rights reserved.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="flex flex-col gap-2">
              <p className="text-gray-700 font-semibold">회사</p>
              <Link href="/about" className="text-[#6D28D9] text-sm">
                소개
              </Link>
              <Link href="/careers" className="text-[#6D28D9] text-sm">
                채용
              </Link>
              <Link href="/press" className="text-[#6D28D9] text-sm">
                보도자료
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-700 font-semibold">서비스</p>
              <Link href="/upload" className="text-[#6D28D9] text-sm">
                작품 등록
              </Link>
              <Link href="/pricing" className="text-[#6D28D9] text-sm">
                가격 안내
              </Link>
              <Link href="/flow" className="text-[#6D28D9] text-sm">
                주문 처리 흐름
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-700 font-semibold">지원</p>
              <Link href="/faq" className="text-[#6D28D9] text-sm">
                자주 묻는 질문
              </Link>
              <Link href="/contact" className="text-[#6D28D9] text-sm">
                문의하기
              </Link>
              <Link href="/policies" className="text-[#6D28D9] text-sm">
                정책(환불/저작권)
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-700 font-semibold">파트너</p>
              <Link href="/partners/api" className="text-[#6D28D9] text-sm">
                API/통합
              </Link>
              <Link href="/partners/shipping" className="text-[#6D28D9] text-sm">
                배송 파트너
              </Link>
              <Link href="/partners/print" className="text-[#6D28D9] text-sm">
                인쇄 파트너
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
