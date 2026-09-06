import { ApiContentStatus, ApiDifficulty } from "@/lib/api/types";

export const STATUS_LABEL: Record<ApiContentStatus, string> = {
  DRAFT: "Brouillon",
  PENDING_REVIEW: "En relecture",
  CHANGES_REQUESTED: "À corriger",
  PUBLISHED: "Publié",
};

export const STATUS_TOKENS: Record<ApiContentStatus, { bg: string; fg: string }> = {
  DRAFT: { bg: "bg-surface-secondary", fg: "text-foreground-secondary" },
  PENDING_REVIEW: { bg: "bg-gold-light", fg: "text-gold" },
  CHANGES_REQUESTED: { bg: "bg-danger-light", fg: "text-danger" },
  PUBLISHED: { bg: "bg-success-light", fg: "text-success" },
};

export const ACADEMIC_LEVEL_LABEL: Record<string, string> = {
  COLLEGE: "Collège",
  LYCEE: "Lycée",
};

export const COLLEGE_YEAR_LABEL: Record<string, string> = {
  AC_1: "1ère année",
  AC_2: "2ème année",
  AC_3: "3ème année",
};

export const SUBJECT_LABEL: Record<string, string> = {
  MATH: "Maths",
  PHYSIQUE: "Physique-Chimie",
  SVT: "SVT",
};

export const DIFFICULTY_LABEL: Record<ApiDifficulty, string> = {
  FACILE: "Facile",
  MOYEN: "Moyen",
  DIFFICILE: "Difficile",
};
