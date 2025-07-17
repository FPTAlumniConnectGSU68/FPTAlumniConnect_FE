"use client";

import { EventsManagement } from "@/components/shared/events/EventsManagement";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AlumniEventsManagementPage() {
  return (
    <ProtectedRoute allowedRoles={["alumni"]}>
      <div className="space-y-6">
        <EventsManagement />
      </div>
    </ProtectedRoute>
  );
}
