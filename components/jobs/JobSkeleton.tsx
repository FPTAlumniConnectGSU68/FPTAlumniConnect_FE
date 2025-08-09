"use client";

import { Card, CardContent } from "@/components/ui/card";

export function JobCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function JobDetailsSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-4 flex-1">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>

        <div className="space-y-8">
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </CardContent>
    </Card>
  );
}
