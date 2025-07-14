import { Button } from "@/components/ui/button";
import { Filter } from "@/components/ui/filter";
import { Major } from "@/hooks/use-major-codes";
import { ROLES } from "@/lib/api-client/constants";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { isApiSuccess } from "@/lib/utils";

const UserHeader = ({
  searchTerm,
  setSearchTerm,
  role,
  setRole,
  majors,
  majorCode,
  setMajorCode,
  setCurrentPage,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  majors: ApiResponse<PaginatedData<Major>> | undefined;
  majorCode: string;
  setMajorCode: (value: string) => void;
  setCurrentPage: (value: number) => void;
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

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="flex gap-4 items-center">
        <Filter
          searchPlaceholder="Search users..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          selects={[
            {
              placeholder: "Filter by role",
              value: role,
              onChange: (value) => {
                setRole(value);
                setCurrentPage(1);
              },
              options: roleOptions,
            },
            {
              placeholder: "Filter by major code",
              value: majorCode,
              onChange: (value) => {
                setMajorCode(value);
                setCurrentPage(1);
              },
              options: majorOptions,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default UserHeader;
