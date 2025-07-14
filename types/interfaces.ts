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
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  timestamp: string;
  isRead: boolean;
}
