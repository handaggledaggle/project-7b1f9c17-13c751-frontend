import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Copyright,
  FileText,
  LifeBuoy,
  ShieldCheck,
  Truck,
  Undo2,
} from "lucide-react";

import { SupportForm } from "./_components/support-form";
import { TimelineStep } from "./_components/timeline-step";

export default function PolicySupportPage() {
  return (
    <div className="min-h-dvh bg-white">
      <header className="sticky top-0 z-50 border-b border-violet-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-violet-950">printtie</span>
            <Badge variant="secondary" className="bg-violet-50 text-violet-700">
              정책·지원
            </Badge>
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            <Link className="text-sm font-medium text-violet-700 hover:text-violet-950" href="/">
              홈
            </Link>
            <Link className="text-sm font-medium text-violet-700 hover:text-violet-950" href="/upload">
              작품 등록
            </Link>
            <Link className="text-sm font-medium text-violet-700 hover:text-violet-950" href="/market">
              마켓
            </Link>
            <Link className="text-sm font-medium text-violet-700 hover:text-violet-950" href="/orders">
              주문/관리
            </Link>
            <Link
              className="text-sm font-medium text-violet-950 underline underline-offset-4"
              href="/policy-support"
            >
              정책·지원
            </Link>
            <Link className="text-sm font-medium text-violet-700 hover:text-violet-950" href="/login">
              로그인
            </Link>
          </nav>

          <Button asChild variant="outline" className="border-violet-200 text-violet-800">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-violet-700 to-violet-300">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-white/90">
                <ShieldCheck className="h-4 w-4" />
                신뢰·정책·지원
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
                정책·지원
              </h1>
              <p className="mt-3 text-white/75">
                저작권 동의, 환불·교환 정책, 신고 절차와 배송 SLA를 명확히 안내하고,
                신고·문의 양식을 통해 빠르게 대응합니다.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Card className="border-white/20 bg-white/10 text-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">운영 지표</CardTitle>
                    <CardDescription className="text-white/70">
                      배송 SLA, 반려율 등 운영 관련 지표를 기준으로 정책을 운영합니다.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-white/20 bg-white/10 text-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">신고·문의</CardTitle>
                    <CardDescription className="text-white/70">
                      저작권 침해, 품질 문제, 환불 요청을 접수할 수 있습니다.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* 주요 정책 요약 */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-violet-950">주요 정책 요약</h2>
              <p className="mt-2 text-violet-700">
                서비스 이용자와 아티스트를 보호하기 위한 핵심 운영 정책
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-50">
                    <Copyright className="h-5 w-5 text-violet-800" />
                  </div>
                  <CardTitle className="mt-4 text-xl text-violet-950">저작권·사용 권한</CardTitle>
                  <CardDescription className="text-violet-700">
                    아티스트는 업로드 시 작품의 저작권을 보유하거나 적법한 권한을 보유했음을 확인해야
                    합니다. 침해 신고 접수 시 조사 절차를 진행합니다.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-50">
                    <Undo2 className="h-5 w-5 text-violet-800" />
                  </div>
                  <CardTitle className="mt-4 text-xl text-violet-950">환불·교환 정책</CardTitle>
                  <CardDescription className="text-violet-700">
                    상품 불량·오배송은 확인 후 환불 또는 재제작으로 처리합니다. 구매자와 아티스트 보호를
                    위해 증빙을 요청할 수 있습니다.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-50">
                    <Truck className="h-5 w-5 text-violet-800" />
                  </div>
                  <CardTitle className="mt-4 text-xl text-violet-950">배송 SLA</CardTitle>
                  <CardDescription className="text-violet-700">
                    표준 제작 및 배송 리드타임을 명시하며, SLA 초과 시 보상 규정을 적용합니다. 지연 원인과
                    재발 방지 대책을 공개합니다.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-violet-50">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-violet-950">자주 묻는 질문</h2>
              <p className="mt-2 text-violet-700">정책과 신고/문의 처리 방식에 대한 핵심 답변</p>
            </div>

            <div className="mx-auto mt-6 grid max-w-3xl gap-4">
              <Card className="border-violet-200/70 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-violet-950">저작권 침해 신고는 어떻게 하나요?</CardTitle>
                  <CardDescription className="text-violet-700">
                    신고 양식을 통해 침해 주장과 관련 증빙(원본 파일, 등록 시점 자료 등)을 제출하세요. 접수
                    후 조사팀이 7영업일 내 회신합니다.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-violet-200/70 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-violet-950">상품이 파손되어 도착했어요. 환불 절차는?</CardTitle>
                  <CardDescription className="text-violet-700">
                    수령 후 7일 이내 사진 증빙을 제출하면 검토 후 환불 또는 재제작 처리합니다. 교환 배송비
                    정책은 상품 유형에 따라 다릅니다.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-violet-200/70 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-violet-950">배송이 SLA를 초과했어요. 보상은 어떻게 되나요?</CardTitle>
                  <CardDescription className="text-violet-700">
                    배송지연 발생 시 주문 상태 및 원인 확인 후 지연 기간에 따른 보상(부분 환불 또는 쿠폰)을
                    제공합니다. 대규모 지연은 공지로 안내합니다.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* 신고·처리 흐름 */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-violet-950">신고·처리 흐름</h2>
              <p className="mt-2 text-violet-700">접수부터 결과 통보까지, 처리 단계와 책임을 투명하게 공개합니다.</p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <TimelineStep
                index={1}
                title="신고 접수"
                description="사용자 또는 아티스트가 신고 양식을 제출합니다."
                icon={<FileText className="h-4 w-4" />}
              />
              <TimelineStep
                index={2}
                title="초기 검토"
                description="증빙자료 확인 후 우선 처리 여부를 결정합니다."
                icon={<ShieldCheck className="h-4 w-4" />}
              />
              <TimelineStep
                index={3}
                title="조사·결정"
                description="정책팀이 조사하여 조치(삭제·환불·경고 등)를 결정합니다."
                icon={<LifeBuoy className="h-4 w-4" />}
              />
              <TimelineStep
                index={4}
                title="결과 통보"
                description="신고 접수자와 관련자에게 처리 결과 및 향후 절차를 안내합니다."
                icon={<FileText className="h-4 w-4" />}
              />
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="bg-violet-50">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <SupportForm />
          </div>
        </section>

        <Separator />

        {/* Footer */}
        <footer className="bg-white">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-10 px-4 py-12 md:flex-row">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">printtie</span>
                <Badge variant="outline" className="border-violet-200 text-violet-800">
                  Trust
                </Badge>
              </div>
              <p className="text-sm text-violet-700">© 2026 printtie Inc. All rights reserved.</p>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">회사</p>
                <ul className="space-y-1 text-sm text-violet-700">
                  <li>소개</li>
                  <li>채용</li>
                  <li>보도자료</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">서비스</p>
                <ul className="space-y-1 text-sm text-violet-700">
                  <li>작품 등록</li>
                  <li>가격 안내</li>
                  <li>주문 처리 흐름</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">지원</p>
                <ul className="space-y-1 text-sm text-violet-700">
                  <li>자주 묻는 질문</li>
                  <li>문의하기</li>
                  <li>정책(환불/저작권)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">파트너</p>
                <ul className="space-y-1 text-sm text-violet-700">
                  <li>API/통합</li>
                  <li>배송 파트너</li>
                  <li>인쇄 파트너</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
