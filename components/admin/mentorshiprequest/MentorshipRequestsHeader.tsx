import { Filter } from "@/components/ui/filter";

const MentorshipRequestsHeader = ({
  searchTerm,
  setSearchTerm,
  status,
  setStatus,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}) => {
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Completed", label: "Completed" },
  ];

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Mentorship Requests</h1>
      <div className="flex gap-4 items-center">
        <Filter
          searchPlaceholder="Search alumni requests..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          selects={[
            {
              placeholder: "Filter by status",
              value: status,
              onChange: (value) => {
                setStatus(value);
              },
              options: statusOptions,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default MentorshipRequestsHeader;
