import { useMajorCodes } from "@/hooks/use-major-codes";
import { useCreateUser, UserCreateParams, useUsers } from "@/hooks/use-user";
import { useState } from "react";
import UserHeader from "./UserHeader";
import UserTable from "./UserTable";
import UserCreateDialog from "./UserCreateDialog";
import { toast } from "sonner";
import { isApiSuccess } from "@/lib/utils";

const UserView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");
  const [majorCode, setMajorCode] = useState("");
  const { data: majors } = useMajorCodes({});
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<string>("");
  const [majorId, setMajorId] = useState<string>("");
  const { data: users, isLoading } = useUsers({
    page: currentPage,
    role: role,
    major: majorCode,
  });
  const { mutateAsync: createUser, isPending: isCreateLoading } =
    useCreateUser();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateUser = async (userData: UserCreateParams) => {
    const response = await createUser(userData);
    if (isApiSuccess(response)) {
      toast.success("User created successfully");
      setIsOpen(false);
      setCode("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setRoleId("");
      setMajorId("");
    } else {
      toast.error("Check your input and try again");
    }
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
        setIsOpen={setIsOpen}
      />
      <UserTable
        users={users}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <UserCreateDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleCreateUser}
        majors={majors}
        isLoading={isCreateLoading}
        code={code}
        setCode={setCode}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        roleId={roleId}
        setRoleId={setRoleId}
        majorId={majorId}
        setMajorId={setMajorId}
      />
    </div>
  );
};

export default UserView;
