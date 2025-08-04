import { Button } from "@/components/ui/button";
import { MentoringRequest } from "@/types/interfaces";
import { formatDate } from "date-fns";

interface MentoringCardProps {
  request: MentoringRequest;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export function MentoringCard({ request, actionButton }: MentoringCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "active":
        return "bg-green-100 text-green-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  console.log("request", request);

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[220px]">
      <div className="flex items-center gap-4 mb-4">
        <div>
          <div className="font-bold text-lg">Request #{request.id}</div>
          <div className="text-gray-600 mt-2">{request.requestMessage}</div>
          <div className="flex gap-2 mt-2">
            <span
              className={`inline-block text-xs px-2 py-1 rounded font-semibold ${getStatusColor(
                request.status
              )}`}
            >
              {request.status}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-auto text-sm text-gray-500 items-center justify-between">
        <div className="flex flex-col gap-1">
          <div>
            <b>Created by:</b> {request.alumniName}
          </div>
          <div>
            <b>Created on:</b> {formatDate(request.createdAt, "dd/MM/yyyy")}
          </div>
        </div>
        {actionButton && (
          <Button variant="outline" size="sm" onClick={actionButton.onClick}>
            {actionButton.label}
          </Button>
        )}
      </div>
    </div>
  );
}
