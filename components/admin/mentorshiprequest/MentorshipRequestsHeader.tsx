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
    { value: "Active", label: "Đang hoạt động" },
    { value: "Pending", label: "Đang chờ" },
    { value: "Cancelled", label: "Đã hủy" },
    { value: "Completed", label: "Đã hoàn thành" },
  ];

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Yêu cầu cố vấn</h1>
      <div className="flex gap-4 items-center">
        <Filter
          searchPlaceholder="Tìm kiếm yêu cầu mentor..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          selects={[
            {
              placeholder: "Lọc theo status",
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
