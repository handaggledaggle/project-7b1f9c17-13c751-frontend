import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FAQSection() {
  return (
    <section className="flex flex-col items-center py-6 bg-[#FAF5FF] rounded-lg">
      <h2 className="text-2xl font-bold text-[#4C1D95]">자주 묻는 질문</h2>
      <div className="flex flex-col gap-4 max-w-3xl w-full mt-4">
        <Card className="shadow-lg rounded-lg border border-[#DDD6FE]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-[#4C1D95]">
              프린트 색상이 화면과 다른데 교환 가능한가요?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[#6D28D9]">
            원칙적으로 인쇄물의 색상은 모니터와 차이가 있을 수 있습니다. 심각한 색상 왜곡이 확인될 경우 사진 제출 후 품질 검증을 통해 재인쇄 또는 환불 처리합니다.
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg border border-[#DDD6FE]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-[#4C1D95]">
              주문 후 규격을 변경할 수 있나요?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[#6D28D9]">
            제작 전(결제 후 24시간 이내)에는 변경이 가능할 수 있습니다. 이미 제작이 시작된 경우 변경이 불가하니 고객센터로 문의 바랍니다.
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg border border-[#DDD6FE]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-[#4C1D95]">
              배송 지연 시 환불은 어떻게 되나요?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[#6D28D9]">
            배송 지연이 당사 귀책 사유인 경우 배송비 보상 또는 주문 취소 시 전액 환불이 가능합니다. 세부 기준은 배송 정책을 따릅니다.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
