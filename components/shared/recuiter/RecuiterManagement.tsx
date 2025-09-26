import RecruiterTable from "@/components/admin/recuiter/RecuiterTable";
import RecuiterHeader from "@/components/admin/recuiter/ReuiterHeader";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { JobPost, RecruiterInfo } from "@/types/interfaces";
import { useState } from "react";

export function RecuiterManagement({
  recuiters,
  isLoading,
  onPageChange,
  currentPage,
  refetchRecruiters,
}: {
  recuiters: ApiResponse<PaginatedData<RecruiterInfo>> | undefined;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
  refetchRecruiters: () => void;
}) {
  return (
    <div className="space-y-4">
      <RecruiterTable
        recruiters={recuiters}
        currentPage={currentPage}
        isLoading={isLoading}
        onPageChange={onPageChange}
        refetchRecruiters={refetchRecruiters}
      />
    </div>
  );
}
