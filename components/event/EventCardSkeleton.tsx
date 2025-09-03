"use client";

import { Card } from "@/components/ui/card";

export function EventCardSkeleton() {
  return (
    <Card className="border bg-white flex flex-col overflow-hidden animate-pulse">
      <div className="w-full h-40 bg-gray-200" />
      <div className="p-6 flex flex-col flex-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="text-sm text-gray-600 mb-4 space-y-2">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <span className="mx-2" />
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-full mt-auto" />
      </div>
    </Card>
  );
}
