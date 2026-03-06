import { Card } from "@/components/ui/card";

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card
      className="flex flex-col items-start p-6 bg-[#FFFFFF] rounded-xl w-80 shadow-none border-0"
      data-component="feature-card"
    >
      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
      <h3 className="text-xl font-semibold text-[#4C1D95] mt-4">{title}</h3>
      <p className="text-[#6D28D9] mt-2">{desc}</p>
    </Card>
  );
}

export default function FeaturesSection() {
  return (
    <section
      data-section-type="features"
      className="flex flex-col items-center py-20 px-8 bg-white shadow-lg"
    >
      <h2 className="text-3xl font-bold text-[#4C1D95]">핵심 기능</h2>
      <p className="text-lg text-[#6D28D9]">작가 진입 장벽 해소 · 플랫폼 대행 인쇄·배송 · 업로드 검수</p>

      <div className="flex gap-8 mt-8">
        <FeatureCard
          title="자동 업로드 검수"
          desc="파일 해상도, 색상 모드, 저작권 체크를 자동으로 안내하고 승인까지 연결합니다."
        />
        <FeatureCard
          title="인쇄·포장·배송 대행"
          desc="여러 규격과 소재 지원, 파트너 공정을 통해 주문 자동 생산과 포장, 배송까지 일괄 처리합니다."
        />
        <FeatureCard
          title="작가 전용 대시보드"
          desc="작품 상태, 매출, 반려 이력과 개선 가이드를 한눈에 확인할 수 있습니다."
        />
      </div>
    </section>
  );
}
