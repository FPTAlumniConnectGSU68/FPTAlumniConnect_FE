"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMajorCodes } from "@/hooks/use-major-codes";
import useMajorService, { MajorCodeItem } from "@/lib/services/major.service";
import { isApiSuccess } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminMajorCodesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const {
    data: majors,
    isLoading,
    refetch,
  } = useMajorCodes({
    query: {
      Page: currentPage.toString(),
      Size: "5",
      MajorName: debouncedSearch,
    },
  });

  const { CREATE_MAJOR, UPDATE_MAJOR } = useMajorService();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const items = majors && isApiSuccess(majors) ? majors.data?.items ?? [] : [];
  const totalPages =
    majors && isApiSuccess(majors) ? majors.data?.totalPages ?? 1 : 1;

  const [form, setForm] = useState<Partial<MajorCodeItem>>({});
  const [editing, setEditing] = useState<MajorCodeItem | null>(null);
  const [open, setOpen] = useState(false);

  const resetForm = () => setForm({});

  const handleSubmit = async () => {
    try {
      if (editing) {
        const res = await UPDATE_MAJOR(editing.majorId, form);
        if (isApiSuccess(res)) toast.success("Cập nhật thành công");
      } else {
        const res = await CREATE_MAJOR(form);
        if (isApiSuccess(res)) toast.success("Tạo thành công");
      }
      resetForm();
      setEditing(null);
      setOpen(false);
      refetch();
    } catch (e) {
      toast.error("Thao tác thất bại");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mã ngành</h1>
          <Button
            onClick={() => {
              setEditing(null);
              resetForm();
              setOpen(true);
            }}
          >
            Thêm
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Tìm theo tên ngành"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button variant="outline" onClick={() => setSearchInput("")}>
            Xóa
          </Button>
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên ngành</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Ngày cập nhật</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((m: MajorCodeItem) => (
                <TableRow key={m.majorId}>
                  <TableCell>{m.majorName}</TableCell>
                  <TableCell>{m.createdAt}</TableCell>
                  <TableCell>{m.updatedAt}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditing(m);
                        setForm(m);
                        setOpen(true);
                      }}
                    >
                      Sửa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {open && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-4 rounded-md w-full max-w-md space-y-3">
              <h2 className="text-lg font-semibold">
                {editing ? "Cập nhật mã ngành" : "Thêm mã ngành"}
              </h2>
              <Input
                placeholder="Tên ngành"
                value={form.majorName || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, majorName: e.target.value }))
                }
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSubmit}>Lưu</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
