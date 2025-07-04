import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { isError } from "@/lib/utils";
import { JobPost, Post, SuccessRes, User } from "@/types/interfaces";
import { useMutation } from "@tanstack/react-query";

export function useHomeData() {
  return useMutation({
    mutationFn: async () => {
      try {
        const [alumniRes, jobsRes, eventsRes, mentorsRes, forumsRes] =
          await Promise.all([
            APIClient.invoke<SuccessRes<User>>({
              action: ACTIONS.GET_USER,
              query: { RoleId: "2", Size: "6" },
            }),
            APIClient.invoke<SuccessRes<JobPost>>({
              action: ACTIONS.GET_LATEST_JOBS,
              query: { status: "Open", Size: "4" },
            }),
            APIClient.invoke<SuccessRes<Event>>({
              action: ACTIONS.GET_UPCOMMING_EVENTS,
              query: { Size: "6" },
            }),
            APIClient.invoke<SuccessRes<User>>({
              action: ACTIONS.GET_USER,
              query: { RoleId: "5", Size: "6" },
            }),
            APIClient.invoke<SuccessRes<Post>>({
              action: ACTIONS.GET_FORUMS,
              query: { Size: "3" },
            }),
          ]);

        return {
          featuredAlumni: alumniRes.items,
          featuredJobs: jobsRes.items,
          upcomingEvents: eventsRes.items,
          mentors: mentorsRes.items,
          forumPosts: forumsRes.items,
        };
      } catch (err) {
        console.error("Home data fetch failed:", err);
        throw new Error("One or more requests failed.");
      }
    },
    // mutationFn: async () => {
    //   const alumniRes = await APIClient.invoke<SuccessRes<User>>({
    //     action: ACTIONS["GET_USER"],
    //     query: {
    //       RoleId: "2",
    //       Size: "6",
    //     },
    //   });

    //   const jobsRes = await APIClient.invoke<SuccessRes<JobPost>>({
    //     action: ACTIONS["GET_LATEST_JOBS"],
    //     query: {
    //       status: "Open",
    //       Size: "4",
    //     },
    //   });

    //   const eventsRes = await APIClient.invoke<SuccessRes<Event>>({
    //     action: ACTIONS["GET_UPCOMMING_EVENTS"],
    //     query: {
    //       Size: "6",
    //     },
    //   });

    //   const mentorsRes = await APIClient.invoke<SuccessRes<User>>({
    //     action: ACTIONS["GET_USER"],
    //     query: {
    //       RoleId: "5",
    //       Size: "6",
    //     },
    //   });

    //   const forumsRes = await APIClient.invoke<SuccessRes<Post>>({
    //     action: ACTIONS["GET_FORUMS"],
    //     query: { Size: "3" },
    //   });

    //   if (
    //     isError(alumniRes) ||
    //     isError(jobsRes) ||
    //     isError(eventsRes) ||
    //     isError(mentorsRes) ||
    //     isError(forumsRes)
    //   ) {
    //     throw new Error("One or more API calls failed");
    //   }

    //   return {
    //     featuredAlumni: alumniRes.items,
    //     featuredJobs: jobsRes.items,
    //     upcomingEvents: eventsRes.items,
    //     mentors: mentorsRes.items,
    //     forumPosts: forumsRes.items,
    //   };
    // },
  });
}