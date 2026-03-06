import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section
      data-section-type="cta"
      className="flex flex-col items-center justify-center py-16 px-8 bg-[#FAF5FF]"
    >
      <h2 className="text-3xl font-bold text-[#4C1D95] text-center">지금 바로 작품을 등록하고 판매를 시작하세요</h2>
      <p className="text-lg text-[#6D28D9] text-center max-w-2xl mt-4">
        복잡한 생산·배송 과정을 플랫폼이 대신 처리합니다. 승인 가이드와 전담 지원으로 첫 판매까지 빠르게
        연결됩니다.
      </p>

      <div className="flex gap-4 mt-6">
        <Button
          className="bg-[#FAF5FF] text-[#4C1D95] border border-[#DDD6FE] rounded-lg px-8 py-3 hover:bg-[#FAF5FF]"
          data-component="primary-button"
        >
          회원가입
        </Button>
        <Button
          className="bg-white shadow-lg text-[#4C1D95] border border-[#DDD6FE] rounded-lg px-8 py-3 hover:bg-white"
          data-component="secondary-button"
        >
          작품 등록하기
        </Button>
      </div>

      <p className="text-[#6D28D9] text-sm mt-4">문의: support@printtie.example · 가이드 보기</p>
    </section>
  );
}
