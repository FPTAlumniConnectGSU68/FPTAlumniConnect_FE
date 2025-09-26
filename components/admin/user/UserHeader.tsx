import { Button } from "@/components/ui/button";
import { Filter } from "@/components/ui/filter";
import { Major } from "@/hooks/use-major-codes";
import { ROLES } from "@/lib/api-client/constants";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { isApiSuccess } from "@/lib/utils";
import { PlusIcon } from "lucide-react";

const UserHeader = ({
  searchTerm,
  setSearchTerm,
  role,
  setRole,
  majors,
  majorCode,
  setMajorCode,
  setCurrentPage,
  setIsOpen,
  mentorStatus,
  setMentorStatus,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  majors: ApiResponse<PaginatedData<Major>> | undefined;
  majorCode: string;
  setMajorCode: (value: string) => void;
  setCurrentPage: (value: number) => void;
  setIsOpen: (value: boolean) => void;
  mentorStatus: string;
  setMentorStatus: (value: string) => void;
}) => {
  if (!majors) return null;

  if (!majors || !isApiSuccess(majors) || !majors.data) return null;
  const majorItems = majors.data.items;

  const roleOptions = Object.keys(ROLES).map((key) => ({
    value: ROLES[key as keyof typeof ROLES].toString(),
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  const majorOptions = majorItems.map((major) => ({
    value: major.majorId.toString(),
    label: major.majorName,
  }));

  const mentorStatusOptions = [
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Suspended", label: "Suspended" },
  ];

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      <div className="flex gap-4 items-center">
        <Filter
          searchPlaceholder="Tìm kiếm người dùng..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          selects={[
            {
              placeholder: "Lọc theo vai trò",
              value: role,
              onChange: (value) => {
                setRole(value);
                setCurrentPage(1);
              },
              options: roleOptions,
            },
            {
              placeholder: "Lọc theo mentor status",
              value: mentorStatus,
              onChange: (value) => {
                setMentorStatus(value);
                setCurrentPage(1);
              },
              options: mentorStatusOptions,
            },
            {
              placeholder: "Lọc theo chuyên ngành",
              value: majorCode,
              onChange: (value) => {
                setMajorCode(value);
                setCurrentPage(1);
              },
              options: majorOptions,
            },
          ]}
        />
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <PlusIcon className="w-4 h-4" />
          Tạo người dùng
        </Button>
      </div>
    </div>
  );
};

export default UserHeader;
