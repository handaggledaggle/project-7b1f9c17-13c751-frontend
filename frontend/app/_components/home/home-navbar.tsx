import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomeNavbar() {
  return (
    <nav
      className="h-16 bg-white border-b border-[#DDD6FE] shadow-sm flex items-center justify-between px-8"
      data-section-type="navbar"
    >
      <span className="text-xl font-bold text-[#4C1D95]">printtie</span>

      <div className="flex gap-6">
        <Link className="text-[#6D28D9]" href="#">
          홈
        </Link>
        <Link className="text-[#6D28D9]" href="#">
          작품 등록
        </Link>
        <Link className="text-[#6D28D9]" href="#">
          마켓
        </Link>
        <Link className="text-[#6D28D9]" href="#">
          주문/관리
        </Link>
        <Link className="text-[#6D28D9]" href="#">
          정책·지원
        </Link>
        <Link className="text-[#6D28D9]" href="#">
          로그인
        </Link>
      </div>

      <Button
        className="bg-gray-100 text-[#6D28D9] rounded-lg px-4 py-2 hover:bg-gray-100"
        data-component="cta-button"
      >
        회원가입
      </Button>
    </nav>
  );
}
