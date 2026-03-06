import { NextResponse } from "next/server";

type OrderStatus = "ALL" | "PAID" | "INSPECTION" | "PRINT_WAIT" | "INVOICE_PENDING" | "SHIPPING" | "DELIVERED";

type OrderItem = {
  orderId: string;
  customerName: string;
  artworkTitle: string;
  quantity: number;
  paidAt: string;
  status: Exclude<OrderStatus, "ALL">;
  amountKrw: number;
  shippingMethod: string;
};

const MOCK: OrderItem[] = [
  {
    orderId: "#20260306-0001",
    customerName: "박지혜",
    artworkTitle: "봄날 풍경",
    quantity: 2,
    paidAt: "2026-03-05 14:22",
    status: "INSPECTION",
    amountKrw: 36000,
    shippingMethod: "빠른배송",
  },
  {
    orderId: "#20260306-0002",
    customerName: "이민수",
    artworkTitle: "도시의 밤",
    quantity: 1,
    paidAt: "2026-03-05 13:12",
    status: "PRINT_WAIT",
    amountKrw: 18000,
    shippingMethod: "일반",
  },
  {
    orderId: "#20260305-0999",
    customerName: "조민호",
    artworkTitle: "추상 A",
    quantity: 3,
    paidAt: "2026-03-04 09:05",
    status: "INVOICE_PENDING",
    amountKrw: 72000,
    shippingMethod: "배송중",
  },
  {
    orderId: "#20260305-0881",
    customerName: "김하늘",
    artworkTitle: "푸른 정원",
    quantity: 1,
    paidAt: "2026-03-04 11:40",
    status: "PAID",
    amountKrw: 22000,
    shippingMethod: "일반",
  },
  {
    orderId: "#20260304-0412",
    customerName: "최다은",
    artworkTitle: "모노크롬",
    quantity: 2,
    paidAt: "2026-03-03 16:18",
    status: "SHIPPING",
    amountKrw: 44000,
    shippingMethod: "일반",
  },
];

function matchesQuery(o: OrderItem, q: string) {
  const qq = q.trim().toLowerCase();
  if (!qq) return true;
  return (
    o.orderId.toLowerCase().includes(qq) ||
    o.customerName.toLowerCase().includes(qq) ||
    o.artworkTitle.toLowerCase().includes(qq)
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") ?? "ALL") as OrderStatus;
  const q = searchParams.get("q") ?? "";

  const items = MOCK.filter((o) => {
    const statusOk = status === "ALL" ? true : o.status === status;
    return statusOk && matchesQuery(o, q);
  });

  return NextResponse.json({ items });
}
