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
  getPosts: { path: "/v1/posts", method: "GET" },
  getUsers: { path: "/v1/users", method: "GET" },
  getMentors: { path: "/v1/mentors", method: "GET" },
  //
  getForumDetail: { path: "/v1/posts", method: "GET" },
  getComments: { path: "/v1/comments", method: "GET" },
  getChildCmts: { path: "", method: "GET" },
  postCmt: { path: "/v1/comments", method: "POST" },
  createPost: { path: "/v1/posts", method: "POST" },
  // User
  patchMentorUser: { path: "/v1/users", method: "PATCH" },

  // Tests
  buildTest: { path: "/tests/build", method: "POST", secure: true },
  getTests: {
    path: "/tests",
    method: "GET",
    secure: true,
  },
  createTest: {
    path: "/tests",
    method: "POST",
    secure: true,
  },
  getTestDetails: {
    path: "/tests/details",
    method: "GET",
    secure: true,
  },
  runTest: {
    path: "/tests/run",
    method: "POST",
    secure: true,
  },
  runScheduleTest: {
    path: "/tests/schedule",
    method: "POST",
    secure: true,
  },

  // Notifications
  getUserNotifications: {
    path: "/Notification/user",
    method: "GET",
    secure: true,
  },
  markNotificationAsRead: {
    path: "/Notification/mark-as-read",
    method: "PATCH",
    secure: true,
  },

  // Mentorship Requests
  getMentorshipRequests: {
    path: "/v1/mentorships",
    method: "GET",
  },
};

export enum ACTIONS {
  // Auth
  SIGN_IN = "signIn",
  SIGN_UP = "signUp",
  REFRESH_TOKEN = "refreshToken",
  CREATE_USER = "createUser",
  GET_SELF = "getSelf",
  GET_PROJECTS = "getProjects",
  CREATE_PROJECT = "createProject",

  //Home
  GET_JOBS = "getJobs",
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

  // User
  PATCH_MENTOR_USER = "patchMentorUser",

  // Notifications
  GET_USER_NOTIFICATIONS = "getUserNotifications",
  MARK_NOTIFICATION_AS_READ = "markNotificationAsRead",

  // Mentorship Requests
  GET_MENTORSHIP_REQUESTS = "getMentorshipRequests",
}

export const API_URL = "http://localhost:5000/api";

export const ROLES = {
  ADMIN: 1,
  ALUMNI: 2,
  STUDENT: 3,
  RECRUITER: 4,
  LECTURER: 5,
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
