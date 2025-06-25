import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UnauthorizedProps {
  message?: string;
  showBackButton?: boolean;
}

export default function Unauthorized({
  message = "You don't have permission to access this page",
  showBackButton = true,
}: UnauthorizedProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center space-y-6 max-w-md mt-28">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-red-50 p-3 rounded-full">
            <ShieldX className="h-12 w-12 text-red-500" />
          </div>
        </div>

        {/* Error Code */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Unauthorized Access
          </h1>
        </div>

        {/* Message */}
        <p className="text-gray-600">{message}</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          {showBackButton && (
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          )}
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
