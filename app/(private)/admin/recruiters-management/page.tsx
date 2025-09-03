"use client";

import RecuiterHeader from "@/components/admin/recuiter/ReuiterHeader";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { JobPostsManagement } from "@/components/shared/jobposts/JobPostsManagement";
import { RecuiterManagement } from "@/components/shared/recuiter/RecuiterManagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecuiter } from "@/hooks/use-recuiter";
import { useEffect, useState } from "react";

export default function AdminRecuiterManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<string>("All");

  const {
    data: recuiters,
    isLoading,
    refetch,
  } = useRecuiter({
    page: currentPage,
    size: 5,
    query: {
      CompanyName: debouncedSearch || "",
      ...(status !== "All" ? { status } : {}),
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1); // reset to first page on search
    }, 500); // delay 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatus("All");
    setCurrentPage(1);
    refetch();
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <RecuiterHeader />
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search box */}
          <div className="relative">
            <Input
              placeholder="Tìm kiếm nhà tuyển dụng..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pr-8"
            />
            {searchInput && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchInput("")}
              >
                ✕
              </button>
            )}
          </div>

          {/* Status filter */}
          <Select value={status} onValueChange={(val) => setStatus(val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Toàn bộ</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear all */}
          <Button variant="outline" onClick={handleClearFilters}>
            Xóa lọc
          </Button>
        </div>
        <RecuiterManagement
          currentPage={currentPage}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          recuiters={recuiters}
          refetchRecruiters={refetch}
        />
      </div>
    </ProtectedRoute>
  );
}
