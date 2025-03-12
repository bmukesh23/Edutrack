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
    _id: string;
    course_title: string;
    course_summary: string;
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
    course_title: string;
    course_summary: string;
    chapters: Chapter[];
    totalLessons: number;
}