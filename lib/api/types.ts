export interface ApiLocalized {
  fr: string;
  darija: string;
}

export type ApiAcademicLevel = "COLLEGE" | "LYCEE";
export type ApiCollegeYear = "AC_1" | "AC_2" | "AC_3";
export type ApiSubject = "MATH" | "PHYSIQUE" | "SVT";
export type ApiCourseIcon = "CALCULATOR" | "SIGMA" | "RULER" | "SHAPES" | "FLASK" | "BOOK";
export type ApiContentStatus = "DRAFT" | "PENDING_REVIEW" | "CHANGES_REQUESTED" | "PUBLISHED";

export interface ApiAdminUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface ApiLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: ApiAdminUser;
}

export interface ApiCourse {
  id: string;
  academicLevel: ApiAcademicLevel;
  collegeYear: ApiCollegeYear | null;
  subject: ApiSubject;
  position: number;
  title: ApiLocalized;
  shortDescription: ApiLocalized;
  goals: ApiLocalized[];
  prerequisites: ApiLocalized;
  estimatedMinutes: number;
  xpReward: number;
  icon: ApiCourseIcon;
  lessonIds: string[];
  status: ApiContentStatus;
}

export type CourseUpsertInput = Omit<ApiCourse, "id" | "lessonIds" | "status">;
