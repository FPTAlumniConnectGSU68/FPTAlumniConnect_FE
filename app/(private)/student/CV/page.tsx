<<<<<<< HEAD
"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import CVView from "@/components/user-alumni/CVView";

export default function StudentCVPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="space-y-6">
        <CVView />
      </div>
    </ProtectedRoute>
  );
}
=======
import CVView from "@/components/user-alumni/CVView";

const CVPage = () => {
  return <CVView />;
};

export default CVPage;
>>>>>>> a9ec0bae87494269df48cd121356889e5e42d8df
