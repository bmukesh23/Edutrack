import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { Course } from '@/utils/types';
import { useNavigate } from 'react-router-dom';

const useCourse = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found, redirecting to login");
                    navigate("/");
                    return;
                }

                const response = await axiosInstance.get("/api/get-courses");

                if (response.data.courses) {
                    setCourses(response.data.courses);
                    console.log("Courses:", response.data);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCourses();
    }, [navigate]);

    return { courses };
}

export default useCourse;