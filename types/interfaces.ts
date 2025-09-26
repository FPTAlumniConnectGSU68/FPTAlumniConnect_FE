export interface User {
  userId: number;
  code?: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  profilePicture: string | null;
  roleId: number;
  roleName: string;
  majorId: number;
  majorName: string;
  googleId: string | null;
  mentorStatus: "Active" | "Suspended" | "Pending" | string;
}

export interface Mentor {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  googleId: string | null;
  mentorStatus: "Active" | "Suspended" | "Pending" | string;
  majorId: number;
  majorName: string;
  profilePicture: string;
  rating: number;
  roleId: number;
  roleName: string;
}

export interface Post {
  postId: number;
  authorId: number;
  content: string;
  title: string;
  views: number;
  majorId: number;
  majorName: string;
  status: "Published" | "Draft" | string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobPost {
  jobPostId: number;
  jobDescription: string;
  jobTitle: string;
  location: string;
  city: string;
  minSalary: number;
  maxSalary: number;
  isDeal: boolean;
  requirements: string;
  benefits: string;
  time: string;
  status: string;
  email: string;
  userId: number;
  majorId: number;
  majorName: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  skills: Skill[];
  recruiterInfoId: number;
  companyName: string;
  companyLogoUrl: string;
}

export interface JobPostCreate {
  jobTitle: string;
  jobDescription: string;
  minSalary: number;
  maxSalary: number;
  isDeal: boolean;
  location: string;
  city: string;
  requirements: string;
  benefits: string;
  time: string;
  status: string;
  email: string;
  userId: number;
  majorId: number;
  skillIds: number[];
}

export interface Event {
  eventId: number;
  eventName: string;
  img: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  location: string;
  organizerId: number;
  majorId: number;
  majorName?: string; // optional for backward compatibility
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  status: string | null;
  createdBy: string | null;
  averageRating: number | null;
  userJoinEventId: number | null;
  eventTimeLines?: EventTimeline[];
  total: number;
  speaker: string;
}

export interface PopularEventItem {
  eventId: number;
  eventName: string;
  participantCount: number;
  popularityScore: number;
}

export interface EventTimeline {
  eventTimeLineId: number;
  title: string;
  description: string;
  startTime: string; // "HH:mm:ss"
  endTime: string; // "HH:mm:ss"
  day: string;
  speaker: string;
}

export type TimelineSuggestion = {
  eventTimeLineId?: number; // optional for new timelines
  eventId: number;
  name: string;
  title?: string; // fallback to name
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  description?: string;
  speaker: string;
  day: string;
};

export interface Notification {
  id: number;
  userId: number;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface MentoringRequest {
  [x: string]: any;
  id: number;
  aumniId: number;
  requestMessage: string;
  status: "Active" | "Pending" | "Cancelled" | "Completed";
  alumniName: string;
}

export interface MentoringRequestCreate {
  aumniId: number;
  requestMessage: string;
  type: null;
  status: "Active" | "Pending" | "Cancelled" | "Completed";
}
export interface Comment {
  postId: number;
  authorId: number | undefined;
  content: string;
  parentCommentId: number | null;
  type: string;
}

export interface CommentType {
  commentId: number;
  parentCommentId: number | null;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  childComments?: CommentType[]; // child comments
}

export interface Schedule {
  scheduleId: number;
  mentorShipId: number;
  mentorId: number;
  alumniId: number;
  mentorName: string;
  alumniName: string;
  startTime: string;
  endTime: string;
  content: string;
  status: "Completed" | "Active" | "Failed";
  rating: number | null;
  comment: string | null;
}

export interface ScheduleCreate {
  mentorShipId: number;
  mentorId: number;
  startTime: string;
  endTime: string;
  content: string;
  status: "Completed" | "Active" | "Failed";
  rating: number | null;
  comment: string | null;
}

export interface CV {
  id: number;
  userId: number;
  fullName: string;
  address: string;
  birthday: string;
  gender: string;
  email: string;
  phone: string;
  city: string;
  company: string;
  primaryDuties: string;
  jobLevel: string;
  startAt: string;
  endAt: string;
  language: string;
  languageLevel: string;
  minSalary: number;
  maxSalary: number;
  isDeal: boolean;
  desiredJob: string;
  position: string;
  majorId: string;
  majorName: string;
  additionalContent: string;
  status: "Deleted" | "Public" | "Private";
  skillIds: number[];
  skillNames: string[];
}

export interface CVCreate {
  userId: number;
  fullName: string;
  address: string;
  birthday: string;
  gender: string;
  email: string;
  phone: string;
  city: string;
  company: string;
  primaryDuties: string;
  jobLevel: string;
  startAt: string;
  endAt: string;
  language: string;
  languageLevel: string;
  minSalary: number;
  maxSalary: number;
  isDeal: boolean;
  desiredJob: string;
  position: string;
  majorId: number;
  additionalContent: string;
  status: string;
  skillIds: number[];
}

export interface CVUpdate {
  id: number;
  userId: number;
  fullName: string;
  address: string;
  birthday: string;
  gender: string;
  email: string;
  phone: string;
  city: string;
  company: string;
  primaryDuties: string;
  jobLevel: string;
  startAt: string;
  endAt: string;
  language: string;
  languageLevel: string;
  minSalary: number;
  maxSalary: number;
  isDeal: boolean;
  desiredJob: string;
  position: string;
  majorId: number;
  additionalContent: string;
  status: string;
  skillIds: number[];
}
export interface Skill {
  skillId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplicationCreate {
  jobPostId: number;
  cvid: number;
  letterCover: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface JobApplicationByJobPostId {
  applicationId: number;
  jobPostId: number;
  cvid: number;
  letterCover: string;
  status: "Pending" | "Approved" | "Rejected";
  type: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface JobApplicationByCvid {
  applicationId: number;
  jobPostId: number;
  cvid: number;
  letterCover: string;
  status: "Approved" | "Pending" | "Rejected";
  type: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}
export interface EventRating {
  id: number;
  userId: number;
  userName: string;
  avatar: string;
  role: string;
  code: string; // e.g., "K7"
  eventId: number;
  content: string; // feedback text
  rating: number | null; // can be null if user hasn’t rated yet
  createdAt: string; // ISO datetime
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
}

export interface TopUser {
  name: string;
  userAvatar?: string;
  class: string;
  posts: number;
}

export interface TopUserApi {
  postCount: number;
  userAvatar: string;
  userCode: string;
  userId: number;
  userName: string;
}

export interface RecruiterInfo {
  recruiterInfoId: number;
  userId: number;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyLogoUrl: string;
  companyCertificateUrl: string;
  status: boolean | string; // depends on whether "True" is boolean or string
}
