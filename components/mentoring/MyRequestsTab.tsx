import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MentoringCard } from "./MentoringCard";
import { useMentorShipAlumniRequest } from "@/hooks/use-mentoring-requests";
import { isApiSuccess } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MentoringRequest } from "@/types/interfaces";

interface MyRequestsTabProps {
  userId: number;
}

export function MyRequestsTab({ userId }: MyRequestsTabProps) {
  const router = useRouter();
  const { data: alumniRequest, isLoading } = useMentorShipAlumniRequest({
    userId,
  });

  if (isLoading) {
    return (
      <div className="py-4 flex justify-center items-center h-[50vh]">
        <LoadingSpinner size="md" text="Loading mentoring requests..." />
      </div>
    );
  }

  if (!alumniRequest || !isApiSuccess(alumniRequest) || !alumniRequest.data) {
    return <div className="text-center py-4">No mentoring requests found</div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/alumni/mentoring?isCreate=true")}
        >
          Create Request
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumniRequest.data.map((request: MentoringRequest) => (
          <MentoringCard
            key={request.id}
            request={request}
            actionButton={{
              label: "Send Message",
              onClick: () => {
                // Handle send message
                console.log("Send message", request.id);
              },
            }}
          />
        ))}
      </div>
    </div>
  );
}
