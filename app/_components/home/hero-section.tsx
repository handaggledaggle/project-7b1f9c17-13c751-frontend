import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function HeroPillCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card
      className="flex flex-col items-center p-4 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] rounded-lg border border-white/20 shadow-none"
      data-component="card"
    >
      <p className="text-2xl font-bold text-white">{title}</p>
      <p className="text-white/70 text-sm text-center">{desc}</p>
    </Card>
  );
}

export default function HeroSection() {
  return (
    <section
      data-section-type="hero"
      className="flex flex-col items-center justify-center py-20 px-8 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]"
    >
      <h1 className="text-5xl font-bold text-white text-center">
        작가 진입장벽은 낮추고, 인쇄·배송은 대신합니다
      </h1>
      <p className="text-xl text-white/70 text-center max-w-3xl mt-4">
        간단한 작품 등록만으로 검수·인쇄·포장·배송까지 플랫폼이 대행합니다. 업로드 가이드와 자동
        검수로 승인까지 빠르게 연결되어 작가가 창작에만 집중할 수 있습니다.
      </p>

      <div className="flex gap-4 mt-8">
        <Button
          className="bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white/90 border border-white/30 rounded-lg px-6 py-3 hover:from-[#7C3AED] hover:to-[#A78BFA]"
          data-component="primary-button"
        >
          회원가입하기
        </Button>
        <Button
          className="bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white/90 border border-white/30 rounded-lg px-6 py-3 hover:from-[#7C3AED] hover:to-[#A78BFA]"
          data-component="secondary-button"
        >
          작품 등록해보기
        </Button>
      </div>

      <div className="flex gap-6 mt-10">
        <HeroPillCard
          title="검수 자동화"
          desc="업로드 단계에서 저작권·출력 가이드 체크로 반려 리스크 감소"
        />
        <HeroPillCard title="대행 인쇄·배송" desc="제작부터 포장, 전국 배송까지 일괄 처리" />
        <HeroPillCard title="간편 정산" desc="판매별 수익 정산과 리포트 제공" />
      </div>
    </section>
  );
}
