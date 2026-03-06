"use client";

import { useMemo, useRef, useState } from "react";
import { FileUp, Loader2, Eye, Play, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export type BulkInvoiceResult =
  | { status: "success"; message: string; processed: number; errors: number }
  | { status: "error"; message: string };

type ParsedRow = { order_id: string; tracking_no: string; courier: string };

function parseCsv(text: string): { rows: ParsedRow[]; warnings: string[] } {
  const warnings: string[] = [];
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return { rows: [], warnings: ["CSV가 비어 있습니다."] };

  const header = lines[0].split(",").map((s) => s.trim());
  const idxOrder = header.indexOf("order_id");
  const idxTracking = header.indexOf("tracking_no");
  const idxCourier = header.indexOf("courier");

  if (idxOrder === -1 || idxTracking === -1) {
    warnings.push("헤더에 order_id, tracking_no 컬럼이 필요합니다.");
  }

  const rows: ParsedRow[] = [];
  for (const line of lines.slice(1)) {
    const cols = line.split(",").map((s) => s.trim().replaceAll(/^"|"$/g, ""));
    const order_id = cols[idxOrder] ?? "";
    const tracking_no = cols[idxTracking] ?? "";
    const courier = idxCourier !== -1 ? cols[idxCourier] ?? "" : "";

    if (!order_id || !tracking_no) continue;
    rows.push({ order_id, tracking_no, courier });
  }

  if (rows.length === 0) warnings.push("파싱된 행이 없습니다. (빈 줄/필수 컬럼 누락 가능)");

  return { rows, warnings };
}

async function apiPostJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export default function BulkInvoicePanel(props: { onDone: (result: BulkInvoiceResult) => void }) {
  const { onDone } = props;

  const [courier, setCourier] = useState("CJ대한통운");
  const [csvName, setCsvName] = useState<string | null>(null);
  const [csvText, setCsvText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const parsed = useMemo(() => parseCsv(csvText), [csvText]);
  const previewRows = parsed.rows.slice(0, 20);

  const pickFile = () => fileInputRef.current?.click();

  const onFile = async (file: File | null) => {
    if (!file) return;
    setCsvName(file.name);
    const text = await file.text();
    setCsvText(text);
  };

  const execute = async () => {
    setLoading(true);
    try {
      const res = await apiPostJson<{ processed: number; errors: number; message: string }>(
        "/api/admin/invoices/bulk",
        {
          courier,
          csv: csvText,
        }
      );
      onDone({ status: "success", message: res.message, processed: res.processed, errors: res.errors });
    } catch (e) {
      onDone({ status: "error", message: e instanceof Error ? e.message : "일괄 등록에 실패했습니다." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-violet-900">일괄 송장 등록</h2>
      <div className="flex flex-col xl:flex-row gap-6 mt-4 w-full">
        <Card className="flex-1 bg-white shadow-lg border border-violet-200 rounded-lg p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-violet-900">택배사</Label>
              <select
                className="bg-white text-violet-900 border border-violet-200 rounded-lg h-10 px-3"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
              >
                <option className="text-violet-900">CJ대한통운</option>
                <option className="text-violet-900">한진택배</option>
                <option className="text-violet-900">로젠</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-violet-900">송장 파일 업로드 (CSV)</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={pickFile}
                className={cn(
                  "h-12 bg-white border border-violet-200 rounded-lg flex items-center justify-between px-3",
                  "text-violet-700 hover:bg-violet-50"
                )}
              >
                <span className="truncate">
                  {csvName ? csvName : "파일 선택 또는 드래그 앤 드롭"}
                </span>
                <span className="inline-flex items-center gap-2 text-sm">
                  <FileUp className="h-4 w-4" />
                  업로드
                </span>
              </button>
              {parsed.warnings.length > 0 ? (
                <Card className="p-3 border-amber-200 bg-amber-50">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-900 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">주의</p>
                      <ul className="text-sm text-amber-900/90 list-disc list-inside mt-1 space-y-1">
                        {parsed.warnings.map((w) => (
                          <li key={w}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-violet-900">매핑 옵션</Label>
              <div className="flex flex-wrap gap-3">
                <Card className="border-violet-200 px-3 py-2 text-violet-900">주문번호 ↔ order_id</Card>
                <Card className="border-violet-200 px-3 py-2 text-violet-900">송장번호 ↔ tracking_no</Card>
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-violet-50 text-violet-900 border-violet-200"
                    disabled={!csvText.trim()}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="ml-2">미리보기</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>CSV 미리보기</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-3">
                    <Card className="p-3 border-violet-200 bg-violet-50">
                      <p className="text-sm text-violet-900">
                        파싱된 행: <b>{parsed.rows.length}</b> (상위 20개만 표시)
                      </p>
                    </Card>

                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-2">order_id</th>
                            <th className="text-left p-2">tracking_no</th>
                            <th className="text-left p-2">courier</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewRows.map((r, idx) => (
                            <tr key={`${r.order_id}-${idx}`} className="border-t">
                              <td className="p-2 font-mono">{r.order_id}</td>
                              <td className="p-2 font-mono">{r.tracking_no}</td>
                              <td className="p-2">{r.courier || courier}</td>
                            </tr>
                          ))}
                          {previewRows.length === 0 ? (
                            <tr className="border-t">
                              <td colSpan={3} className="p-4 text-muted-foreground">
                                미리보기할 데이터가 없습니다.
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="secondary">닫기</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                onClick={() => void execute()}
                className="bg-violet-600 hover:bg-violet-700"
                disabled={loading || !csvText.trim()}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                <span className="ml-2">일괄 등록 실행</span>
              </Button>
            </div>
          </div>
        </Card>

        <aside className="w-full xl:w-96">
          <Card className="bg-white shadow-lg border border-violet-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-violet-900">업로드 가이드</h3>
            <ul className="text-sm text-violet-700 mt-2 list-disc list-inside space-y-1">
              <li>컬럼: order_id, tracking_no, courier</li>
              <li>order_id는 내부 주문번호와 정확히 매칭되어야 합니다.</li>
              <li>중복 송장번호는 등록되지 않습니다.</li>
              <li>오류 발생 시 오류 건수와 사유를 제공합니다.</li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
