import { Card } from "@/components/ui/card";

function TestimonialCard({
  quote,
  name,
  meta,
}: {
  quote: string;
  name: string;
  meta: string;
}) {
  return (
    <Card
      className="flex flex-col p-6 bg-white shadow-lg rounded-xl border border-[#DDD6FE] w-96"
      data-component="testimonial-card"
    >
      <p className="text-[#4C1D95]">{quote}</p>
      <div className="flex items-center gap-3 mt-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex flex-col">
          <p className="text-[#4C1D95] font-semibold">{name}</p>
          <p className="text-[#6D28D9] text-sm">{meta}</p>
        </div>
      </div>
    </Card>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      data-section-type="testimonials"
      className="flex flex-col items-center py-20 px-8 bg-[#FFFFFF]"
    >
      <h2 className="text-3xl font-bold text-[#4C1D95]">작가 후기</h2>
      <div className="flex gap-6 mt-8">
        <TestimonialCard
          quote='"업로드 가이드가 상세해서 처음 판매하는 작품도 빠르게 승인받았습니다. 제작과 배송도 전부 맡겨서 신경 쓸 게 줄었어요."'
          name="김아티스트"
          meta="일러스트레이터 · 판매자"
        />
        <TestimonialCard
          quote='"정산이 투명하고 고객 문의도 플랫폼으로 통합되어 운영 효율이 크게 개선됐습니다. 제작 품질도 안정적이에요."'
          name="이작가"
          meta="사진작가 · 판매자"
        />
      </div>
    </section>
  );
}
