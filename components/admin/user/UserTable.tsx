import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Pagination from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePatchMentorUser, UserData } from "@/hooks/use-user";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { isApiSuccess } from "@/lib/utils";
import { User } from "@/types/interfaces";
import { useCallback, useState } from "react";

interface UserTableProps {
  users: ApiResponse<PaginatedData<User>> | undefined;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
}

// Separate component for user avatar and name
const UserIdentity = ({ user }: { user: User }) => (
  <div className="flex items-center gap-2">
    <Avatar className="h-8 w-8">
      <AvatarImage
        src={user.profilePicture || "/placeholder-user.jpg"}
        alt={`${user.firstName} ${user.lastName}`}
      />
      <AvatarFallback>
        {user.firstName[0]}
        {user.lastName[0]}
      </AvatarFallback>
    </Avatar>
    <div>
      <div className="font-medium">
        {user.firstName} {user.lastName}
      </div>
      {user.isMentor && (
        <Badge variant="secondary" className="text-xs">
          Mentor
        </Badge>
      )}
    </div>
  </div>
);

// Separate component for user email
const UserEmail = ({
  email,
  isVerified,
}: {
  email: string;
  isVerified: boolean;
}) => (
  <div className="flex items-center gap-1">
    {email}
    {isVerified && (
      <Badge variant="secondary" className="text-xs">
        Verified
      </Badge>
    )}
  </div>
);

// Separate component for role selector
const RoleSelector = ({
  user,
  onRoleChange,
}: {
  user: User;
  onRoleChange: (value: string, userId: number) => void;
}) => (
  <Select
    defaultValue={user.isMentor ? "Mentor" : "None"}
    onValueChange={(value) => onRoleChange(value, user.userId)}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select an option" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Mentor">Mentor</SelectItem>
      <SelectItem value="None">None</SelectItem>
    </SelectContent>
  </Select>
);

const EditUserSheet = ({
  user,
  onRoleChange,
  setIsOpen,
  isOpen,
  onOpenChange,
}: {
  user: User;
  onRoleChange: (value: string, userId: number) => void;
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}) => {
  const [role, setRole] = useState(user.isMentor ? "Mentor" : "None");

  const handleRoleChange = (value: string) => {
    setRole(value);
  };

  const handleSave = () => {
    onRoleChange(role, user.userId);
    setIsOpen(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline">Edit</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label>First Name</Label>
              <Input type="text" defaultValue={user.firstName} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Last Name</Label>
              <Input type="text" defaultValue={user.lastName} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input type="email" defaultValue={user.email} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Input type="text" defaultValue={user.roleName} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Major</Label>
              <Input type="text" defaultValue={user.majorName} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Mentoring</Label>
              <Select defaultValue={role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mentor">Mentor</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="mb-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Update</Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const UserTable = ({
  users,
  isLoading,
  onPageChange,
  currentPage,
}: UserTableProps) => {
  const [openSheetId, setOpenSheetId] = useState<number | null>(null);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [termChoice, setTermChoice] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { mutate: patchMentorUser, isPending } = usePatchMentorUser();

  const handleRoleChange = useCallback(
    (value: string, userId: number) => {
      if (!users || !isApiSuccess(users) || !users.data) return;

      const user = users.data.items.find((u) => u.userId === userId);
      if (user) {
        setSelectedUser(user);
        setTermChoice(value);
      }
    },
    [users]
  );

  const handleConfirm = useCallback(async () => {
    if (!selectedUser) return;

    const userData: UserData = {
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      email: selectedUser.email,
      isMentor: termChoice === "Mentor",
      profilePicture: selectedUser.profilePicture || "",
    };

    try {
      await patchMentorUser({
        userId: selectedUser.userId.toString(),
        userData,
      });

      setIsOpenConfirm(false);
      setOpenSheetId(null);
      setSelectedUser(null);
      setTermChoice("");
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  }, [selectedUser, termChoice, patchMentorUser]);

  if (isLoading) {
    return <LoadingSpinner text="loading users..." />;
  }

  if (
    !users ||
    !isApiSuccess(users) ||
    !users.data ||
    users.data.items.length === 0
  ) {
    return <div className="text-center py-4">No users found</div>;
  }

  const { items: userItems, totalPages } = users.data;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table className="w-full bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Major</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userItems.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>
                  <UserIdentity user={user} />
                </TableCell>
                <TableCell>
                  <UserEmail
                    email={user.email}
                    isVerified={user.emailVerified}
                  />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{user.roleName}</Badge>
                </TableCell>
                <TableCell>{user.majorName}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.emailVerified ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {user.emailVerified ? "Active" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <EditUserSheet
                    user={user}
                    onRoleChange={handleRoleChange}
                    setIsOpen={setIsOpenConfirm}
                    isOpen={openSheetId === user.userId}
                    onOpenChange={(open) =>
                      setOpenSheetId(open ? user.userId : null)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      <Dialog open={isOpenConfirm} onOpenChange={setIsOpenConfirm}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
              Confirmation
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to change the role of this user to{" "}
              {termChoice}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpenConfirm(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserTable;
