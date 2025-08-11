export interface User {
  userId: number;
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
  isMentor: boolean;
}

export interface Mentor {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  googleId: string | null;
  isMentor: boolean;
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
  minSalary: number;
  maxSalary: number;
  isDeal: boolean;
  requirements: string;
  benefits: string;
  time: string;
  status: "Open" | "Closed" | string;
  email: string;
  userId: number;
  majorId: number;
  majorName: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | number | null;
  updatedBy: string | number | null;
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
  startDate: string;
  endDate: string;
  location: string;
  organizerId: number;
  createdAt: string;
  updatedAt: string;
  averageRating?: number | null;
  userJoinEventId?: number | null;
}

export type TimelineSuggestion = {
  name: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  description?: string;
};

export type EventWithSuggestions = Omit<Event, "eventId"> & {
  id: number;
  timelineSuggestions?: TimelineSuggestion[];
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
