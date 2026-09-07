export interface ApiLocalized {
  fr: string;
  darija: string;
}

export type ApiAcademicLevel = "COLLEGE" | "LYCEE";
export type ApiCollegeYear = "AC_1" | "AC_2" | "AC_3";
export type ApiSubject = "MATH" | "PHYSIQUE" | "SVT";
export type ApiCourseIcon = "CALCULATOR" | "SIGMA" | "RULER" | "SHAPES" | "FLASK" | "BOOK";
export type ApiContentStatus = "DRAFT" | "PENDING_REVIEW" | "CHANGES_REQUESTED" | "PUBLISHED";
export type ApiRole = "STUDENT" | "SUPPORTER" | "ADMIN";

export interface ApiAdminUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: ApiRole;
}

export interface ApiTeamMember {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: ApiRole;
}

export interface ApiTeamInvite {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: ApiRole;
}

export type ApiPremiumRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ApiPremiumRequest {
  id: string;
  status: ApiPremiumRequestStatus;
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  proofFileName: string;
  pricePaid: number;
  promoCode: string | null;
  affiliateOwnerName: string | null;
  userId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userReferenceCode: string;
}

export interface ApiAffiliateCode {
  id: string;
  code: string;
  ownerName: string;
  ownerContact: string | null;
  discountedPrice: number;
  commissionAmount: number;
  active: boolean;
  redemptionCount: number;
  totalEarned: number;
  totalPaid: number;
  totalOwed: number;
  createdAt: string;
}

export interface ApiAffiliatePayout {
  id: string;
  amount: number;
  paidAt: string;
  note: string | null;
}

export interface ApiAffiliatePayoutWithCode {
  id: string;
  code: string | null;
  ownerName: string | null;
  amount: number;
  paidAt: string;
  note: string | null;
}

export interface ApiCountByLabel {
  label: string;
  count: number;
}

export interface ApiDailyRevenuePoint {
  date: string;
  amount: number;
  count: number;
}

export interface ApiDailySignupPoint {
  date: string;
  count: number;
}

export interface ApiTopCourse {
  courseTitle: string;
  enrollments: number;
  completions: number;
  completionRate: number;
}

export interface ApiTopAffiliate {
  code: string;
  ownerName: string;
  redemptions: number;
  earned: number;
}

export interface ApiRevenueAnalytics {
  totalApprovedRevenue: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  averagePricePaid: number;
  promoRedemptionsCount: number;
  fullPriceCount: number;
  last30Days: ApiDailyRevenuePoint[];
}

export interface ApiUserGrowthAnalytics {
  totalStudents: number;
  totalPremium: number;
  totalSuspended: number;
  signupsLast30Days: ApiDailySignupPoint[];
  byAcademicLevel: ApiCountByLabel[];
  byCity: ApiCountByLabel[];
  funnelSignedUp: number;
  funnelSubmittedPremiumRequest: number;
  funnelApprovedPremium: number;
}

export interface ApiEngagementAnalytics {
  totalEnrollments: number;
  completedEnrollments: number;
  completionRate: number;
  quizPassRate: number;
  topCourses: ApiTopCourse[];
}

export interface ApiAffiliateAnalytics {
  totalActiveCodes: number;
  totalEarnedAllTime: number;
  totalPaidAllTime: number;
  totalOwedAllTime: number;
  topAffiliates: ApiTopAffiliate[];
}

export interface ApiAnalyticsOverview {
  revenue: ApiRevenueAnalytics;
  userGrowth: ApiUserGrowthAnalytics;
  engagement: ApiEngagementAnalytics;
  affiliates: ApiAffiliateAnalytics;
}

export interface ApiStudent {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  academicLevel: ApiAcademicLevel;
  collegeYear: ApiCollegeYear | null;
  city: string;
  premium: boolean;
  suspended: boolean;
  referenceCode: string;
  xp: number;
  createdAt: string;
}

export interface ApiMaintenanceStatus {
  active: boolean;
  message: string | null;
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

export type ApiDifficulty = "FACILE" | "MOYEN" | "DIFFICILE";

export interface ApiQuizChoice {
  id: string;
  label: ApiLocalized;
}

export type ApiContentBlockType =
  | "explanation"
  | "example"
  | "question"
  | "formula"
  | "image"
  | "diagram"
  | "table"
  | "tip"
  | "warning"
  | "summary";

interface ApiContentBlockBase {
  id: string;
  position: number;
}

export interface ApiStackedOperation {
  operator: string;
  operands: string[];
  result: string;
}

export interface ApiExplanationBlock extends ApiContentBlockBase {
  type: "explanation";
  title: ApiLocalized;
  body: ApiLocalized;
}
export interface ApiExampleBlock extends ApiContentBlockBase {
  type: "example";
  title: ApiLocalized;
  body: ApiLocalized;
  stackedOperation: ApiStackedOperation | null;
}
export interface ApiQuestionBlock extends ApiContentBlockBase {
  type: "question";
  prompt: ApiLocalized;
  choices: ApiQuizChoice[];
  correctChoiceId: string;
  explanation: ApiLocalized;
}
export interface ApiFormulaBlock extends ApiContentBlockBase {
  type: "formula";
  caption: ApiLocalized | null;
  expression: string;
}
export interface ApiImageBlock extends ApiContentBlockBase {
  type: "image";
  caption: ApiLocalized | null;
  illustration: string;
}
export interface ApiDiagramBlock extends ApiContentBlockBase {
  type: "diagram";
  caption: ApiLocalized | null;
  kind: string;
  values: number[] | null;
}
export interface ApiTableBlock extends ApiContentBlockBase {
  type: "table";
  caption: ApiLocalized | null;
  headers: ApiLocalized[];
  rows: ApiLocalized[][];
}
export interface ApiTipBlock extends ApiContentBlockBase {
  type: "tip";
  body: ApiLocalized;
}
export interface ApiWarningBlock extends ApiContentBlockBase {
  type: "warning";
  body: ApiLocalized;
}
export interface ApiSummaryBlock extends ApiContentBlockBase {
  type: "summary";
  bullets: ApiLocalized[];
}

export type ApiContentBlock =
  | ApiExplanationBlock
  | ApiExampleBlock
  | ApiQuestionBlock
  | ApiFormulaBlock
  | ApiImageBlock
  | ApiDiagramBlock
  | ApiTableBlock
  | ApiTipBlock
  | ApiWarningBlock
  | ApiSummaryBlock;

export interface ApiQuizQuestion {
  id: string;
  prompt: ApiLocalized;
  choices: ApiQuizChoice[];
  correctChoiceId: string;
  explanation: ApiLocalized;
}

export interface ApiQuiz {
  id: string;
  passScore: number;
  questions: ApiQuizQuestion[];
}

/** Admin/teacher authoring view — unlike the student-facing quiz shape,
 * this carries the full answer key (correctChoiceId/explanation). */
export interface ApiLesson {
  id: string;
  courseId: string;
  position: number;
  title: ApiLocalized;
  objective: ApiLocalized;
  estimatedMinutes: number;
  xpReward: number;
  content: ApiContentBlock[];
  quiz: ApiQuiz;
  status: ApiContentStatus;
}

export type LessonUpsertInput = Omit<ApiLesson, "id" | "courseId" | "status">;

export interface ApiCorrection {
  solution: ApiLocalized;
  steps: ApiLocalized[];
  commonMistakes: ApiLocalized[];
}

export interface ApiExercise {
  id: string;
  courseId: string;
  position: number;
  title: ApiLocalized;
  difficulty: ApiDifficulty;
  estimatedMinutes: number;
  premium: boolean;
  locked: boolean;
  statement: ApiLocalized;
  hints: ApiLocalized[];
  correction: ApiCorrection;
  status: ApiContentStatus;
}

export type ExerciseUpsertInput = Omit<ApiExercise, "id" | "courseId" | "locked" | "status">;

export interface ApiMockExamPart {
  id: string;
  prompt: ApiLocalized;
  solution: ApiLocalized;
  steps: ApiLocalized[];
}

/** Mock exams have no courseId — they aren't tied to a course, unlike
 * Lesson/Exercise. */
export interface ApiMockExam {
  id: string;
  position: number;
  title: ApiLocalized;
  durationMinutes: number;
  difficulty: ApiDifficulty;
  premium: boolean;
  locked: boolean;
  parts: ApiMockExamPart[];
  status: ApiContentStatus;
}

export type MockExamUpsertInput = Omit<ApiMockExam, "id" | "locked" | "status">;
