import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";

export function TimelineStep(props: {
  index: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="border-violet-200/70 shadow-sm">
      <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-900">
          <div className="flex items-center gap-1">
            <span className="text-base font-bold">{props.index}</span>
            {props.icon ? <span className="text-violet-700">{props.icon}</span> : null}
          </div>
        </div>
        <h3 className="mt-1 text-base font-semibold text-violet-950">{props.title}</h3>
        <p className="text-sm text-violet-700">{props.description}</p>
      </CardContent>
    </Card>
  );
}
