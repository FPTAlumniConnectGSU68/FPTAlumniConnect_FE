"use client";

import { Card } from "@/components/ui/card";

export function MentoringCardSkeleton() {
  return (
    <Card className="relative overflow-hidden bg-white rounded-xl shadow p-6 animate-pulse min-h-[220px] flex flex-col justify-between">
      <div>
        <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="flex gap-2 mt-2">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-5 bg-gray-200 rounded w-24" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full" />
            <div className="h-4 bg-gray-200 rounded w-40" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full" />
            <div className="h-4 bg-gray-200 rounded w-52" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-28" />
        </div>
        <div className="h-9 bg-gray-200 rounded w-28" />
      </div>
    </Card>
  );
}
