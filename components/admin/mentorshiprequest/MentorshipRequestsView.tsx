"use client";

import { useMentorShipRequests } from "@/hooks/use-mentoring-requests";
import { useState } from "react";
import MentorshipRequestsHeader from "./MentorshipRequestsHeader";
import MentorshipRequestsTable from "./MentorshipRequestsTable";

const MentorshipRequestsView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");

  const { data: mentoringRequests, isLoading } = useMentorShipRequests({
    page: currentPage,
    query: {
      status,
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="flex flex-col gap-4">
      <MentorshipRequestsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        status={status}
        setStatus={setStatus}
      />
      <MentorshipRequestsTable
        mentoringRequests={mentoringRequests}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MentorshipRequestsView;
