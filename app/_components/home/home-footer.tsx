export default function HomeFooter() {
  return (
    <footer data-section-type="footer" className="flex justify-between py-12 px-8 bg-[#FFFFFF]">
      <div className="flex flex-col gap-2">
        <span className="text-lg font-bold text-gray-900">printtie</span>
        <p className="text-[#6D28D9] text-sm">© 2026 printtie Inc. All rights reserved.</p>
      </div>

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
    </footer>
  );
}
