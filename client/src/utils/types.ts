export interface UserPrefDetails {
    email: string;
    preferences: {
        subjects: string;
        skillLevel: string;
    };
}

export interface DashboardUserDetails {
    name: string;
    email: string;
    photoUrl: string;
}

export interface Question {
    question: string;
    options: string[];
    answer: string;
}

export interface Course {
    id: string;
    courseTitle: string;
    courseSummary: string;
    timestamp: string;
    totalLessons: number;
    category: string;
    difficulty: string;
}

export interface Chapter {
    chapter_title: string;
    chapter_summary: string;
}

export interface CourseDetailsTypes {
    courseTitle: string;
    courseSummary: string;
    chapters: Chapter[];
    totalLessons: number;
}

export type QuizQuestion = {
    question: string;
    options: string[];
    correctAnswer: string;
};