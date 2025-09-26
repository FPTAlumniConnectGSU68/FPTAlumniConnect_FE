import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Removed confirm dialog; admin changes apply directly
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Pagination from "@/components/ui/pagination";
// Removed mentoring dropdown per request
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
import { useAuth } from "@/contexts/auth-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { isApiSuccess } from "@/lib/utils";
import { User } from "@/types/interfaces";
import { PencilIcon } from "lucide-react";
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
      {user.mentorStatus === "Active" && (
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

// Role selector removed

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
  // Removed mentoring dropdown from sheet

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <PencilIcon className="w-4 h-4" />
        </Button>
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
            <div>mentorStatus: {user.mentorStatus}</div>
            <div className="flex flex-col gap-2">
              <Label>Major</Label>
              <Input type="text" defaultValue={user.majorName} disabled />
            </div>
            {/* Mentoring dropdown removed */}
          </div>
          <SheetFooter className="mb-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
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
  const { user: currentUser } = useAuth();
  const isAdmin = (currentUser?.roleName || "").toLowerCase() === "admin";

  const { mutate: patchMentorUser, isPending } = usePatchMentorUser();

  const handleAdminMentorChange = useCallback(
    (value: string, userRow: User) => {
      const userData: UserData = {
        firstName: userRow.firstName,
        lastName: userRow.lastName,
        email: userRow.email,
        mentorStatus: value === "Mentor" ? "Active" : "Suspended",
        profilePicture: userRow.profilePicture || "",
      };
      patchMentorUser({ userId: userRow.userId.toString(), userData });
    },
    [patchMentorUser]
  );

  // Accept flow removed; admin uses dropdown instead

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
              <TableHead>Request Mentor</TableHead>
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
                <TableCell>
                  <Badge
                    variant={
                      user.mentorStatus === "Active"
                        ? "outline"
                        : user.mentorStatus === "Pending"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {user.mentorStatus}
                  </Badge>
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
                  {isAdmin ? (
                    <Select
                      defaultValue={
                        user.mentorStatus === "Active" ? "Mentor" : "None"
                      }
                      onValueChange={(val) =>
                        handleAdminMentorChange(val, user)
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Set mentor status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mentor">Mentor</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : user.mentorStatus === "Pending" ? (
                    <Badge variant="default">Pending</Badge>
                  ) : (
                    <Badge variant="outline">No action</Badge>
                  )}
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

      {/* Accept dialog removed */}
    </div>
  );
};

export default UserTable;
