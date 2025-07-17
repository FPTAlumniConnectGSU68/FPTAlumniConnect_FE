import { Major, useMajorCodes } from "@/hooks/use-major-codes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MajorSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function MajorSelect({
  value,
  onValueChange,
  disabled,
}: MajorSelectProps) {
  const {
    data: majorsResponse,
    isLoading: isMajorsLoading,
    isError: isMajorsError,
  } = useMajorCodes();

  const renderContent = () => {
    if (isMajorsLoading) {
      return (
        <SelectItem value="loading" disabled>
          Loading majors...
        </SelectItem>
      );
    }

    if (isMajorsError) {
      return (
        <SelectItem value="error" disabled>
          Error: Failed to load majors
        </SelectItem>
      );
    }

    if (majorsResponse?.status === "error") {
      return (
        <SelectItem value="api-error" disabled>
          Error: {majorsResponse.message || "Failed to load majors"}
        </SelectItem>
      );
    }

    if (majorsResponse?.status === "success") {
      const majors = majorsResponse.data?.items || [];

      if (majors.length === 0) {
        return (
          <SelectItem value="empty" disabled>
            No majors available
          </SelectItem>
        );
      }

      return majors.map((major: Major) => (
        <SelectItem key={major.majorId} value={major.majorId.toString()}>
          {major.majorName}
        </SelectItem>
      ));
    }

    return null;
  };

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select your major" />
      </SelectTrigger>
      <SelectContent>{renderContent()}</SelectContent>
    </Select>
  );
}
