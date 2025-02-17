export interface UserDetails {
    email: string;
    name: string;
    photoURL: string;
}

export interface UserPrefDetails {
    email: string;
    preferences: {
        subjects: string;
        skillLevel: string;
    };
}

export interface DashboardUserDetails {
    name: string;
    photoURL: string;
}

export interface Question {
    question: string;
    options: string[];
    answer: string;
}

export interface Course {
  course_title: string;
  course_summary: string;
  timestamp: string;
  totalLessons: number;
}