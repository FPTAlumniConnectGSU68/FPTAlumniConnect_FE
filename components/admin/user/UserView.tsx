import { useMajorCodes } from "@/hooks/use-major-codes";
import { useUsers } from "@/hooks/use-user";
import { useState } from "react";
import UserHeader from "./UserHeader";
import UserTable from "./UserTable";

const UserView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");
  const [majorCode, setMajorCode] = useState("");
  const { data: majors } = useMajorCodes();
  const { data: users, isLoading } = useUsers({
    page: currentPage,
    role: role,
    major: majorCode,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-4">
      <UserHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        role={role}
        setRole={setRole}
        majors={majors}
        majorCode={majorCode}
        setMajorCode={setMajorCode}
        setCurrentPage={setCurrentPage}
      />
      <UserTable
        users={users}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UserView;
