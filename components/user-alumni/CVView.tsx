"use client";

import { useAuth } from "@/contexts/auth-context";
import { useCV, useCreateCV, useUpdateCV } from "@/hooks/use-cv";
import { isApiSuccess } from "@/lib/utils";
import { CV, CVCreate, User } from "@/types/interfaces";
import { useState, useRef, useCallback, useMemo } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Plus, Download } from "lucide-react";
import CVForm from "./CVForm";
import CVPreview from "./CVPreview";
import generatePDF from "react-to-pdf";
import { toast } from "sonner";
import { useMajorCodes } from "@/hooks/use-major-codes";
const MODE = {
  CREATE: "create",
  EDIT: "edit",
  PREVIEW: "preview",
};
const CVView = () => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const { data: majorCodes } = useMajorCodes();
  const { user } = useAuth();

  // Memoize derived data
  const majorItems = useMemo(
    () =>
      majorCodes && isApiSuccess(majorCodes)
        ? majorCodes.data?.items ?? []
        : [],
    [majorCodes]
  );

  const downloadPDF = useCallback(async (cv: CV) => {
    try {
      await generatePDF(pdfRef, {
        filename: `${cv.fullName.replace(/\s+/g, "_")}_CV.pdf`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }, []);

  const {
    data: cvData,
    isLoading,
    refetch,
  } = useCV({
    query: {
      UserId: user?.userId ? user.userId.toString() : "",
    },
  });

  const createCV = useCreateCV();

  const updateCV = useUpdateCV();

  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [mode, setMode] = useState<string>(MODE.CREATE);

  const handleCreateClick = useCallback(() => {
    setSelectedCV(null);
    setMode(MODE.CREATE);
    setIsOpen(true);
  }, []);

  const handleEditClick = useCallback((cv: CV) => {
    setSelectedCV(cv);
    setMode(MODE.EDIT);
    setIsOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (data: CV) => {
      console.log("Submitting data:", data);
      try {
        if (mode === MODE.CREATE) {
          const cvDataCreate = {
            userId: user?.userId ?? 0,
            fullName: data.fullName,
            address: data.address,
            birthday: data.birthday,
            gender: data.gender,
            email: data.email,
            phone: data.phone,
            city: data.city,
            company: data.company,
            primaryDuties: data.primaryDuties,
            jobLevel: data.jobLevel,
            startAt: data.startAt,
            endAt: data.endAt,
            language: data.language,
            languageLevel: data.languageLevel,
            minSalary: data.minSalary,
            maxSalary: data.maxSalary,
            isDeal: data.isDeal,
            desiredJob: data.desiredJob,
            position: data.position,
            majorId: parseInt(data.majorId),
            additionalContent: data.additionalContent,
            status: data.status,
            skillIds: data.skillIds,
            majorName: data.majorName,
            skillNames: data.skillNames,
          } as CVCreate;
          const result = await createCV.mutateAsync(cvDataCreate);

          if (result.status === "success") {
            setIsOpen(false);
            refetch();
          } else {
            toast.error(result.message || "Failed to create CV");
          }
        } else {
          const cvDataUpdate = {
            id: data.id,
            userId: user?.userId ?? 0,
            fullName: data.fullName,
            address: data.address,
            birthday: data.birthday,
            gender: data.gender,
            email: data.email,
            phone: data.phone,
            city: data.city,
            company: data.company,
            primaryDuties: data.primaryDuties,
            jobLevel: data.jobLevel,
            startAt: data.startAt,
            endAt: data.endAt,
            language: data.language,
            languageLevel: data.languageLevel,
            minSalary: data.minSalary,
            maxSalary: data.maxSalary,
            isDeal: data.isDeal,
            desiredJob: data.desiredJob,
            position: data.position,
            majorId: parseInt(data.majorId),
            additionalContent: data.additionalContent,
            status: data.status,
            skillIds: data.skillIds,
            majorName: data.majorName,
            skillNames: data.skillNames,
          };
          console.log("Modifying CV data:", cvDataUpdate);
          const result = await updateCV.mutateAsync(cvDataUpdate);
          console.log("API Response:", result);

          if (result.status === "success") {
            setIsOpen(false);
            refetch();
          } else {
            toast.error(result.message || "Failed to update CV");
          }
        }
      } catch (error) {
        console.error("Error creating CV:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to save CV"
        );
      }
    },
    [mode, user, createCV, updateCV, refetch]
  );

  const cvItems =
    cvData && isApiSuccess(cvData) ? cvData.data?.items ?? [] : [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My CVs</h1>
        <Button onClick={handleCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          Create New CV
        </Button>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === MODE.EDIT ? "Edit CV" : "Create New CV"}
            </DialogTitle>
            <DialogDescription>
              {mode === MODE.EDIT
                ? "Edit your CV details below"
                : "Fill in your CV details to start your job search"}
            </DialogDescription>
          </DialogHeader>
          <CVForm
            initialData={selectedCV}
            onSubmit={handleSubmit}
            majorItems={majorItems}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              disabled={createCV.isPending}
              onClick={() => {
                const form = document.getElementById(
                  "cv-form"
                ) as HTMLFormElement;
                if (form) {
                  const submitEvent = new Event("submit", {
                    bubbles: true,
                    cancelable: true,
                  });
                  form.dispatchEvent(submitEvent);
                }
              }}
            >
              {mode === MODE.EDIT ? "Save Changes" : "Create CV"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              CV Preview
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedCV && downloadPDF(selectedCV)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedCV && <CVPreview ref={pdfRef} cv={selectedCV} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-center py-8">Loading CVs...</div>
      ) : cvItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cvItems.map((cv: CV) => (
            <Card key={cv.id} className="p-4 transition-shadow">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-2">
                  {cv.desiredJob || "Untitled CV"}
                </h3>
                <div className="text-sm text-gray-500">
                  Position: {cv.position || "Not specified"}
                </div>
                <div className="flex items-center mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      cv.status === "Public"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {cv.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditClick(cv)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedCV(cv);
                      setIsPreviewOpen(true);
                    }}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 flex flex-col items-center gap-4">
          No CVs found. Create a new CV to start your job search.
        </div>
      )}
    </div>
  );
};

export default CVView;
