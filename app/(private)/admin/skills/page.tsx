"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSkills } from "@/hooks/use-skills";
import useSkillService from "@/lib/services/skill.service";
import { isApiSuccess } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { toast } from "sonner";
import { Skill } from "@/types/interfaces";

export default function AdminSkillsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: skills,
    isLoading,
    refetch,
  } = useSkills({
    page: currentPage,
    size: 5,
  });

  const skillsItems =
    skills && isApiSuccess(skills) ? skills.data?.items ?? [] : [];
  const totalPages =
    skills && isApiSuccess(skills) ? skills.data?.totalPages ?? 1 : 1;

  const { CREATE_SKILL, UPDATE_SKILL, DELETE_SKILL } = useSkillService();

  const [form, setForm] = useState<Partial<Skill>>({});
  const [editing, setEditing] = useState<Skill | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      if (editing) {
        const res = await UPDATE_SKILL(editing.skillId, form);
        if (isApiSuccess(res)) toast("Cập nhật thành công");
      } else {
        const res = await CREATE_SKILL(form);
        if (isApiSuccess(res)) toast("Tạo thành công");
      }
      setForm({});
      setEditing(null);
      setOpen(false);
      refetch();
    } catch (e) {
      toast("Thao tác thất bại");
    }
  };

  const handleDelete = async (item: Skill) => {
    try {
      const res = await DELETE_SKILL(item.skillId);
      if (isApiSuccess(res)) {
        toast("Đã xóa");
        refetch();
      }
    } catch (e) {
      toast("Xóa thất bại");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Kỹ năng</h1>
          <Button
            onClick={() => {
              setEditing(null);
              setForm({});
              setOpen(true);
            }}
          >
            Thêm
          </Button>
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skillsItems.map((m) => (
                <TableRow key={m.skillId}>
                  <TableCell>{m.name}</TableCell>
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
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(m)}
                    >
                      Xóa
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
                {editing ? "Cập nhật kỹ năng" : "Thêm kỹ năng"}
              </h2>
              <Input
                placeholder="Tên kỹ năng"
                value={form.name || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
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
