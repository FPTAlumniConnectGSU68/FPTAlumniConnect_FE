"use client";

import { useState } from "react";
import MentorshipRequestsHeader from "./MentorshipRequestsHeader";
import MentorshipRequestsTable from "./MentorshipRequestsTable";
import { useMentorShipRequests } from "@/hooks/use-mentoring-requests";
import { useUsers } from "@/hooks/use-user";

const MentorshipRequestsView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: mentoringRequests, isLoading } = useMentorShipRequests({
    page: currentPage,
  });

  const { data: users } = useUsers({
    page: currentPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="flex flex-col gap-4">
      <MentorshipRequestsHeader />
      <MentorshipRequestsTable
        mentoringRequests={mentoringRequests}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        users={users}
      />
    </div>
  );
};

export default MentorshipRequestsView;
