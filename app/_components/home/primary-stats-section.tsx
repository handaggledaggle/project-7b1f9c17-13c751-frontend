export default function PrimaryStatsSection() {
  return (
    <section
      data-section-type="stats"
      className="flex items-center justify-center py-16 px-8 bg-white shadow-lg"
    >
      <div className="flex gap-16">
        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold text-[#4C1D95]">주간 신규 작가</p>
          <p className="text-[#6D28D9] mt-2">+350명 평균</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold text-[#4C1D95]">작품 등록 완료</p>
          <p className="text-[#6D28D9] mt-2">약 2,400건/주 (업로드→승인 기준)</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold text-[#4C1D95]">승인율 / 반려율</p>
          <p className="text-[#6D28D9] mt-2">승인 78% · 반려 22%</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold text-[#4C1D95]">평균 등록 소요시간</p>
          <p className="text-[#6D28D9] mt-2">약 14분 (업로드→승인)</p>
        </div>
      </div>
    </section>
  );
}
