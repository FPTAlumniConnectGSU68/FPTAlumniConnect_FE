export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export const END_POINTS: {
  [key: string]: {
    path: string;
    method: RequestMethod;
    secure?: boolean;
    paging?: boolean;
  };
} = {
  // Auth
  signIn: { path: "/api/v1/auth/login", method: "POST" },
  signUp: { path: "/api/v1/auth/register", method: "POST" },
  getMajors: { path: "/api/v1/majorcodes", method: "GET" },

  //home
  getEvents: { path: "/api/v1/events", method: "GET" },
  getJobs: { path: "/api/v1/jobposts", method: "GET" },
  getPosts: { path: "/api/v1/posts", method: "GET" },
  getUsers: { path: "/api/v1/users", method: "GET" },

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
  GET_LATEST_JOBS = "getJobs",
  GET_UPCOMMING_EVENTS = "getEvents",
  GET_FORUMS = "getPosts",
  GET_USER = "getUsers",
  GET_MAJORS = "getMajors",
}

export const API_URL =
  "https://fptalumniconnectapi20250627230412-f0gcc6b8e3axcfe2.canadacentral-01.azurewebsites.net";

export const ROLES = {
  ADMIN: 1,
  ALUMNI: 2,
  STUDENT: 3,
  RECRUITER: 4,
  LECTURER: 5,
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];