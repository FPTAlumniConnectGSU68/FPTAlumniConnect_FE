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
  } = useMajorCodes({
    query: {
      Size: "200",
    },
  });

  const renderContent = () => {
    if (isMajorsLoading) {
      return (
        <SelectItem value="loading" disabled>
          Đang tải chuyên ngành...
        </SelectItem>
      );
    }

    if (isMajorsError) {
      return (
        <SelectItem value="error" disabled>
          Lỗi: Không thể tải chuyên ngành
        </SelectItem>
      );
    }

    if (majorsResponse?.status === "error") {
      return (
        <SelectItem value="api-error" disabled>
          Lỗi: {majorsResponse.message || "Không thể tải chuyên ngành"}
        </SelectItem>
      );
    }

    if (majorsResponse?.status === "success") {
      const majors = majorsResponse.data?.items || [];

      if (majors.length === 0) {
        return (
          <SelectItem value="empty" disabled>
            Không có chuyên ngành nào
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
        <SelectValue placeholder="Chọn chuyên ngành của bạn" />
      </SelectTrigger>
      <SelectContent>{renderContent()}</SelectContent>
    </Select>
  );
}
