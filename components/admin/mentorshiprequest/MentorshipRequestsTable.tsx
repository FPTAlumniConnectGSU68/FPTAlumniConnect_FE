import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Pagination from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { isApiSuccess } from "@/lib/utils";
import { MentoringRequest, User } from "@/types/interfaces";

const MentorshipRequestsTable = ({
  mentoringRequests,
  isLoading,
  onPageChange,
  users,
}: {
  mentoringRequests: ApiResponse<PaginatedData<MentoringRequest>> | undefined;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  users: ApiResponse<PaginatedData<User>> | undefined;
}) => {
  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (
    !mentoringRequests ||
    !isApiSuccess(mentoringRequests) ||
    !mentoringRequests.data ||
    mentoringRequests.data.items.length === 0
  ) {
    return <div className="text-center py-4">No mentoring requests found</div>;
  }

  if (
    !users ||
    !isApiSuccess(users) ||
    !users.data ||
    users.data.items.length === 0
  ) {
    return <div className="text-center py-4">No users found</div>;
  }

  const {
    items: mentoringRequestItems,
    totalPages,
    page,
  } = mentoringRequests.data;
  const { items: userItems } = users.data;
  const getAumniName = (aumniId: number) => {
    const aumni = userItems.find((user: User) => user.userId === aumniId);
    if (!aumni) {
      return "Unknown";
    }
    return aumni.firstName + " " + aumni.lastName;
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table className="w-full bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Aumni</TableHead>
              <TableHead>Request Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentoringRequestItems.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{getAumniName(request.aumniId)}</TableCell>
                <TableCell>{request.requestMessage}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  <Button>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default MentorshipRequestsTable;
