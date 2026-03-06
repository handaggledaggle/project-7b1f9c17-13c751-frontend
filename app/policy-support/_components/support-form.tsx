"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2, Send } from "lucide-react";

import { InquiryType, InquiryTypeSelect, inquiryTypeLabel } from "./inquiry-type-select";

type FormState = {
  name: string;
  email: string;
  type: InquiryType;
  referenceId: string;
  message: string;
  consentPrivacy: boolean;
  consentEvidence: boolean;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  type: "COPYRIGHT",
  referenceId: "",
  message: "",
  consentPrivacy: false,
  consentEvidence: false,
};

function isValidEmail(email: string) {
  // intentionally simple
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SupportForm({ className }: { className?: string }) {
  const [state, setState] = React.useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<
    | { status: "idle" }
    | { status: "success"; ticketId: string }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const canSubmit =
    state.name.trim().length > 0 &&
    isValidEmail(state.email) &&
    state.message.trim().length >= 10 &&
    state.consentPrivacy &&
    state.consentEvidence;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult({ status: "idle" });

    if (!canSubmit) {
      setResult({ status: "error", message: "입력값과 동의 항목을 확인해 주세요." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          type: state.type,
          referenceId: state.referenceId,
          message: state.message,
          consents: {
            privacy: state.consentPrivacy,
            evidence: state.consentEvidence,
          },
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ticketId: string }
        | { error: string }
        | null;

      if (!res.ok) {
        const msg = data && "error" in data ? data.error : "접수에 실패했습니다. 잠시 후 다시 시도해 주세요.";
        setResult({ status: "error", message: msg });
        return;
      }

      const ticketId = data && "ticketId" in data ? data.ticketId : "";
      setResult({ status: "success", ticketId: ticketId || "-" });
      setState(INITIAL);
    } catch {
      setResult({ status: "error", message: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className={cn("mx-auto w-full max-w-2xl border-violet-200/70 shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="text-2xl text-violet-950">신고 / 문의 접수</CardTitle>
        <CardDescription className="text-violet-700">
          저작권 침해, 환불 요청, 배송 지연 등 문제를 구체적으로 작성해 주세요. 접수 번호는 회신 시
          안내됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-violet-950" htmlFor="name">
                이름
              </Label>
              <Input
                id="name"
                placeholder="홍길동"
                value={state.name}
                onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                className="border-violet-200"
                autoComplete="name"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-violet-950" htmlFor="email">
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={state.email}
                onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
                className="border-violet-200"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-violet-950">문의 유형</Label>
            <InquiryTypeSelect value={state.type} onChange={(type) => setState((s) => ({ ...s, type }))} />
            <p className="text-xs text-violet-700">선택됨: {inquiryTypeLabel(state.type)}</p>
          </div>

          <div className="grid gap-2">
            <Label className="text-violet-950" htmlFor="ref">
              관련 주문 또는 작품 ID
            </Label>
            <Input
              id="ref"
              placeholder="Order12345 또는 Work6789"
              value={state.referenceId}
              onChange={(e) => setState((s) => ({ ...s, referenceId: e.target.value }))}
              className="border-violet-200"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-violet-950" htmlFor="message">
              상세 내용 및 증빙
            </Label>
            <Textarea
              id="message"
              placeholder="문제 발생 시점, 증빙(사진/파일) 링크 또는 설명을 입력하세요."
              value={state.message}
              onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
              className="min-h-36 border-violet-200"
            />
            <p className="text-xs text-violet-700">최소 10자 이상 입력해 주세요.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <Checkbox
                id="consentPrivacy"
                checked={state.consentPrivacy}
                onCheckedChange={(v) => setState((s) => ({ ...s, consentPrivacy: Boolean(v) }))}
              />
              <Label htmlFor="consentPrivacy" className="leading-5 text-violet-950">
                개인정보 수집·이용에 동의합니다.
              </Label>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="consentEvidence"
                checked={state.consentEvidence}
                onCheckedChange={(v) => setState((s) => ({ ...s, consentEvidence: Boolean(v) }))}
              />
              <Label htmlFor="consentEvidence" className="leading-5 text-violet-950">
                증빙 자료 제공에 동의합니다.
              </Label>
            </div>
          </div>

          {result.status === "success" ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              접수가 완료되었습니다. 접수 번호: <span className="font-mono font-semibold">{result.ticketId}</span>
            </div>
          ) : null}
          {result.status === "error" ? (
            <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
              {result.message}
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!canSubmit || submitting}
              className="bg-violet-50 text-violet-950 hover:bg-violet-100"
              variant="secondary"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  제출 중
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  제출하기
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
