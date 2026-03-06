import Link from "next/link";
import { Suspense } from "react";
import { ArtworkDetailClient } from "./_components/artwork-detail-client";

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ artworkId: string }>;
}) {
  const { artworkId } = await params;

  return (
    <div className="w-[1440px] flex flex-col">
      <nav className="h-16 bg-white border-b border-[#DDD6FE] shadow-sm flex items-center justify-between px-8">
        <Link href="/" className="text-xl font-bold text-[#4C1D95]">
          printtie
        </Link>
        <div className="flex gap-6 text-[#6D28D9]">
          <Link className="text-[#6D28D9]" href="/">
            홈
          </Link>
          <Link className="text-[#6D28D9]" href="/upload">
            작품 등록
          </Link>
          <Link className="text-[#6D28D9]" href="/market">
            마켓
          </Link>
          <Link className="text-[#6D28D9]" href="/orders">
            주문/관리
          </Link>
          <Link className="text-[#6D28D9]" href="/support">
            정책·지원
          </Link>
          <Link className="text-[#6D28D9]" href="/login">
            로그인
          </Link>
        </div>
        <Link
          href="/signup"
          className="bg-gray-100 text-[#6D28D9] rounded-lg px-4 py-2"
        >
          Sign Up
        </Link>
      </nav>

      <main className="flex flex-col gap-12 px-8 py-10 bg-gray-50">
        <Suspense
          fallback={
            <div className="bg-white border border-[#DDD6FE] rounded-lg p-6">
              <div className="h-6 w-56 bg-gray-200 rounded" />
              <div className="mt-3 h-4 w-96 bg-gray-200 rounded" />
              <div className="mt-6 h-[520px] w-full bg-gray-200 rounded" />
            </div>
          }
        >
          <ArtworkDetailClient artworkId={artworkId} />
        </Suspense>
      </main>

      <footer className="flex justify-between py-12 px-8 bg-[#FFFFFF]">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold text-gray-900">printtie</span>
          <p className="text-[#6D28D9] text-sm">© 2026 printtie Inc. All rights reserved.</p>
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col gap-2">
            <p className="text-gray-900 font-semibold">회사</p>
            <p className="text-[#6D28D9] text-sm">소개</p>
            <p className="text-[#6D28D9] text-sm">채용</p>
            <p className="text-[#6D28D9] text-sm">보도자료</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-900 font-semibold">서비스</p>
            <p className="text-[#6D28D9] text-sm">작품 등록</p>
            <p className="text-[#6D28D9] text-sm">가격 안내</p>
            <p className="text-[#6D28D9] text-sm">주문 처리 흐름</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-900 font-semibold">지원</p>
            <p className="text-[#6D28D9] text-sm">자주 묻는 질문</p>
            <p className="text-[#6D28D9] text-sm">문의하기</p>
            <p className="text-[#6D28D9] text-sm">정책(환불/저작권)</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-900 font-semibold">개발자/파트너</p>
            <p className="text-[#6D28D9] text-sm">API/통합</p>
            <p className="text-[#6D28D9] text-sm">배송 파트너</p>
            <p className="text-[#6D28D9] text-sm">인쇄 파트너</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
