export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const END_POINTS: {
  [key: string]: {
    path: string;
    method: RequestMethod;
    secure?: boolean;
    paging?: boolean;
  };
} = {
  // Auth
  signIn: { path: "/v1/auth/login", method: "POST" },
  signUp: { path: "/v1/auth/register", method: "POST" },
  getMajors: { path: "/v1/majorcodes", method: "GET" },

  //home
  getEvents: { path: "/v1/events", method: "GET" },
  updateEvent: { path: "/v1/events", method: "PUT", secure: true },
  getJobs: { path: "/v1/jobposts", method: "GET" },
  getRecuiters: { path: "/recruiter-info", method: "GET" },
  updateRecuiter: { path: "/recruiter-info/status", method: "PATCH" },
  getPosts: { path: "/v1/posts", method: "GET" },
  getUsers: { path: "/v1/users", method: "GET" },
  getMentors: { path: "/v1/mentors", method: "GET" },
  //
  getForumDetail: { path: "/v1/posts", method: "GET" },
  getComments: { path: "/v1/comments", method: "GET" },
  getChildCmts: { path: "", method: "GET" },
  postCmt: { path: "/v1/comments", method: "POST" },
  createPost: { path: "/v1/posts", method: "POST" },
  getTopUsers: { path: "/v1/posts/top-users", method: "GET" },
  //event
  getEventDetail: { path: "/v1/events", method: "GET" },
  joinEvent: { path: "/v1/user-join-events", method: "POST" },
  joinedEvent: { path: "/v1/events/user", method: "GET" },
  putRating: { path: "/v1/user-join-events", method: "PUT" },
  createEvent: { path: "/v1/events", method: "POST" },
  createTimeline: { path: "/v1/{eventId}/timelines", method: "POST" },

  getEventDetailWithTimelines: { path: "/v1/events/detail", method: "GET" },
  getEventRating: { path: "/v1/user-join-events/view-all", method: "GET" },
  checkUserJoinEvent: {
    path: "/v1/user-join-events/event/check-user",
    method: "GET",
  },
  getEventRoleStatistics: {
    path: "/v1/user-join-events/event/participants/by-role",
    method: "GET",
  },
  getEventPaticipantStatistics: {
    path: "/v1/user-join-events/event/participants/by-day",
    method: "GET",
  },
  // User
  patchMentorUser: { path: "/v1/users", method: "PATCH" },
  createUser: { path: "/v1/users", method: "POST" },
  // Notifications
  getUserNotifications: {
    path: "/Notification/user",
    method: "GET",
  },
  markNotificationAsRead: {
    path: "/Notification/mark-as-read",
    method: "PATCH",
  },

  // Mentorship Requests
  getMentorshipRequests: {
    path: "/v1/mentorships",
    method: "GET",
  },
  getMentorshipAlumniRequestById: {
    path: "/v1/mentorships/alumni",
    method: "GET",
  },
  createMentorshipRequest: {
    path: "/v1/mentorships",
    method: "POST",
  },

  // Schedule
  getSchedules: {
    path: "/schedules",
    method: "GET",
  },
  acceptSchedule: {
    path: "/schedules/mentorship/accept",
    method: "POST",
  },
  completeSchedule: {
    path: "/schedules/complete",
    method: "PATCH",
  },
  rateMentorRequest: {
    path: "/v1/api/schedules/rate",
    method: "POST",
  },
  // CV
  getCV: {
    path: "/v1/cvs",
    method: "GET",
  },
  getCVById: {
    path: "/v1/cvs",
    method: "GET",
  },
  createCV: {
    path: "/v1/cvs",
    method: "POST",
  },
  updateCV: {
    path: "/v1/cvs",
    method: "PATCH",
  },
  // Skills
  getSkills: {
    path: "/v1/skills",
    method: "GET",
  },
  // Job Applications
  createJobApplication: {
    path: "/v1/jobapplications",
    method: "POST",
  },
  updateJobApplication: {
    path: "/v1/jobapplications",
    method: "PATCH",
  },
  createJobPost: {
    path: "/v1/jobposts",
    method: "POST",
  },
  getJobApplicationsByJobPostId: {
    path: "/v1/jobapplications/jobpost",
    method: "GET",
  },
  getJobApplicationsByCvid: {
    path: "/v1/jobapplications",
    method: "GET",
  },
  // Recommendations
  recommendJobsByCv: {
    path: "/v1/phobert/recommend-jobs",
    method: "GET",
  },
  // User Count
  getUserCount: {
    path: "/v1/users/count",
    method: "GET",
  },
  getJobPostCount: {
    path: "/v1/jobposts/count",
    method: "GET",
  },
  getEventCount: {
    path: "/v1/events/count",
    method: "GET",
  },
  // Analytics / counts (monthly & status)
  getEventCountByMonth: {
    path: "/v1/events/count/month",
    method: "GET",
  },
  getEventCountByStatus: {
    path: "/v1/events/count/status",
    method: "GET",
  },
  getUserCountByMonth: {
    path: "/v1/users/count/month",
    method: "GET",
  },
  getJobApplicationCount: {
    path: "/v1/jobapplications/count",
    method: "GET",
  },
  getJobPostCountByMonth: {
    path: "/v1/jobposts/count/month",
    method: "GET",
  },
  getMajorCount: {
    path: "/v1/majorcodes/counts",
    method: "GET",
  },
  getMentorshipCount: {
    path: "/v1/mentorships/count",
    method: "GET",
  },
  getMentorshipCountByMonth: {
    path: "/v1/mentorships/count/month",
    method: "GET",
  },
  getPostCount: {
    path: "/v1/posts/count",
    method: "GET",
  },
  getPostCountByMonth: {
    path: "/v1/posts/count/month",
    method: "GET",
  },
  getScheduleCount: {
    path: "/schedules/count",
    method: "GET",
  },
  getScheduleCountByMonth: {
    path: "/schedules/count/month",
    method: "GET",
  },
};

export enum ACTIONS {
  // Auth
  SIGN_IN = "signIn",
  SIGN_UP = "signUp",
  REFRESH_TOKEN = "refreshToken",
  GET_SELF = "getSelf",
  GET_PROJECTS = "getProjects",
  CREATE_PROJECT = "createProject",

  //Home
  GET_JOBS = "getJobs",
  GET_RECUITERS = "getRecuiters",
  UPDATE_RECRUITER = "updateRecuiter",
  GET_UPCOMMING_EVENTS = "getEvents",
  UPDATE_EVENT = "updateEvent",
  GET_FORUMS = "getPosts",
  GET_USER = "getUsers",
  GET_MENTORS = "getMentors",
  GET_MAJORS = "getMajors",

  //
  GET_FORUM_DETAIL = "getForumDetail",
  GET_FORUM_CMTS = "getComments",
  GET_CHILD_CMTS = "getChildCmts",
  POST_CMT = "postCmt",
  CREATE_POST = "createPost",
  GET_TOP_USERS = "getTopUsers",

  GET_EVENT_DETAIL = "getEventDetail",
  JOIN_EVENT = "joinEvent",
  CREATE_EVENT = "createEvent",
  EVENT_JOINED = "joinedEvent",
  CREATE_TIMELINE = "createTimeline",
  PUT_RATING = "putRating",

  GET_EVENT_DETAIL_WITH_TIMELINES = "getEventDetailWithTimelines",
  GET_EVENT_RATING = "getEventRating",

  CHECK_USER_JOIN_EVENT = "checkUserJoinEvent",
  GET_EVENT_ROLE_STATISTICS = "getEventRoleStatistics",
  GET_EVENT_PATICIPANT_STATISTICS = "getEventPaticipantStatistics",
  // User
  PATCH_MENTOR_USER = "patchMentorUser",
  CREATE_USER = "createUser",

  // Notifications
  GET_USER_NOTIFICATIONS = "getUserNotifications",
  MARK_NOTIFICATION_AS_READ = "markNotificationAsRead",

  // Mentorship Requests
  GET_MENTORSHIP_REQUESTS = "getMentorshipRequests",
  GET_MENTORSHIP_ALUMNI_REQUEST_BY_ID = "getMentorshipAlumniRequestById",
  CREATE_MENTORSHIP_REQUEST = "createMentorshipRequest",

  // Schedule
  GET_SCHEDULES = "getSchedules",
  ACCEPT_SCHEDULE = "acceptSchedule",
  COMPLETE_SCHEDULE = "completeSchedule",
  RATE_MENTOR_REQUEST = "rateMentorRequest",
  // CV
  GET_CV = "getCV",
  GET_CV_BY_ID = "getCVById",
  CREATE_CV = "createCV",
  UPDATE_CV = "updateCV",
  // Skills
  GET_SKILLS = "getSkills",

  // Job Applications
  CREATE_JOB_APPLICATION = "createJobApplication",
  UPDATE_JOB_APPLICATION = "updateJobApplication",
  CREATE_JOB_POST = "createJobPost",
  GET_JOB_APPLICATIONS_BY_JOBPOST_ID = "getJobApplicationsByJobPostId",
  GET_JOB_APPLICATIONS_BY_CV_ID = "getJobApplicationsByCvid",

  // User Count
  GET_USER_COUNT = "getUserCount",
  GET_JOB_POST_COUNT = "getJobPostCount",
  GET_EVENT_COUNT = "getEventCount",
  // Analytics / counts (monthly & status)
  GET_EVENT_COUNT_BY_MONTH = "getEventCountByMonth",
  GET_EVENT_COUNT_BY_STATUS = "getEventCountByStatus",
  GET_USER_COUNT_BY_MONTH = "getUserCountByMonth",
  GET_JOB_APPLICATION_COUNT = "getJobApplicationCount",
  GET_JOB_POST_COUNT_BY_MONTH = "getJobPostCountByMonth",
  GET_MAJOR_COUNT = "getMajorCount",
  GET_MENTORSHIP_COUNT = "getMentorshipCount",
  GET_MENTORSHIP_COUNT_BY_MONTH = "getMentorshipCountByMonth",
  GET_POST_COUNT = "getPostCount",
  GET_POST_COUNT_BY_MONTH = "getPostCountByMonth",
  GET_SCHEDULE_COUNT = "getScheduleCount",
  GET_SCHEDULE_COUNT_BY_MONTH = "getScheduleCountByMonth",
  // Recommendations
  RECOMMEND_JOBS_BY_CV = "recommendJobsByCv",
}

export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ROLES = {
  ADMIN: 1,
  ALUMNI: 2,
  STUDENT: 3,
  RECRUITER: 4,
  LECTURER: 5,
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
