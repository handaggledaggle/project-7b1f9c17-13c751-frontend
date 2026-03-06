export default function SecondaryStatsSection() {
  return (
    <section
      data-section-type="stats"
      className="flex items-center justify-center py-12 px-8 bg-[#FAF5FF]"
    >
      <div className="flex gap-16">
        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold text-[#4C1D95]">방문자 대비 CVR</p>
          <p className="text-[#6D28D9] mt-2">2.8%</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold text-[#4C1D95]">장바구니→결제</p>
          <p className="text-[#6D28D9] mt-2">68%</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold text-[#4C1D95]">재구매율</p>
          <p className="text-[#6D28D9] mt-2">21%</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold text-[#4C1D95]">평균 주문 금액</p>
          <p className="text-[#6D28D9] mt-2">₩42,000</p>
        </div>
      </div>
    </section>
  );
}
