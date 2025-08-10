import { Search } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Sidebar from '@/layouts/Sidebar';
import useUserDetails from '@/hook/useUserDetails';
import useCourse from '@/hook/useCourse';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { FaGraduationCap } from "react-icons/fa";

const generateRandomPercentage = () => Math.floor(Math.random() * 100) + 1;

const categoryColors = [
    '#3B82F6',
    '#22C55E',
    '#F97316',
    '#8B5CF6',
    '#EF4444',
    '#F59E0B',
];

const Dashboard = () => {
    const { userDetails, loading } = useUserDetails();
    const { courses } = useCourse();
    const navigate = useNavigate();

    const metricsData = useMemo(() => {
        const totalCourses = courses.length;
        const completedCourses = courses.filter(course =>
            localStorage.getItem(`course-${course.id}-completed`) === "true"
        ).length;

        const certificateCourses = 0;
        const totalHoursSpent = totalCourses * 1.5;

        return [
            { label: 'Ongoing', value: totalCourses - completedCourses, color: '#3B82F6' },
            { label: 'Complete', value: completedCourses, color: '#22C55E' },
            { label: 'Certificate', value: certificateCourses, color: '#F97316' },
            { label: 'Hour Spent', value: totalHoursSpent, color: '#8B5CF6' },
        ];
    }, [courses]);

    const uniqueCategories = [...new Set(courses.map(course => course.category))];
    const courseDistribution = uniqueCategories.map((category, index) => ({
        name: category,
        value: generateRandomPercentage(),
        color: categoryColors[index % categoryColors.length],
    }));

    return (
        <section className="min-h-screen bg-gray-900 text-white">
            <Sidebar />

            <div
                className="flex-1 px-4 sm:p-6 md:p-8 overflow-y-auto min-w-0 md:ml-64 transition-all duration-150"
                style={{ maxHeight: 'calc(100vh - 14px)' }}
            >
                {/* Top bar */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 mt-5 md:mt-0 gap-4">
                    {/* Search Bar - left on desktop, below on mobile */}
                    <div className="relative w-full sm:max-w-xs order-2 sm:order-1">
                        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Try search programming course"
                            className="pl-10 pr-4 py-2 border rounded-lg w-full bg-gray-800 text-white border-gray-700 text-sm sm:text-base"
                        />
                    </div>

                    {/* User Profile - top right on mobile, right on desktop */}
                    {userDetails ? (
                        <div className="flex items-center space-x-3 order-1 sm:order-2 w-full sm:w-auto justify-end sm:justify-start">
                            <img
                                src={userDetails?.photoUrl}
                                alt="User Profile"
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="font-medium pr-1 text-sm sm:text-base">
                                {userDetails.name}
                            </span>
                        </div>
                    ) : (
                        <span className="font-medium text-sm sm:text-base order-1 sm:order-2 w-full sm:w-auto justify-end sm:justify-start flex">
                            Loading...
                        </span>
                    )}
                </div>


                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {metricsData.map((metric, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-sm">
                            <div className="text-lg sm:text-2xl md:text-3xl font-bold mb-1" style={{ color: metric.color }}>
                                {metric.value}
                            </div>
                            <div className="text-gray-400 text-xs sm:text-sm">{metric.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Courses column */}
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-base sm:text-lg font-semibold">Recommended Course</h2>
                            <button className="text-purple-400 text-xs sm:text-sm" onClick={() => navigate('/mycourses')}>View All</button>
                        </div>

                        {loading ? (
                            <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg shadow-inner">
                                <p className="text-gray-300 text-sm sm:text-lg">Loading courses...</p>
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center bg-gray-800 rounded-lg shadow-inner text-center px-4">
                                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-white">No courses found</h2>
                                <p className="text-gray-400 mb-4 text-xs sm:text-sm">
                                    Take an initial assessment to create your personalized course.
                                </p>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                                    onClick={() => navigate("/preferences-form")}
                                >
                                    Take Assessment
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {courses.slice(0, 3).map((course, index) => (
                                    <div key={index} className="bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                                        <div className="w-full h-24 sm:h-32 bg-gradient-to-r from-blue-400 to-blue-600" />
                                        <div className="p-4">
                                            <h3 className="font-medium mb-2 line-clamp-2 text-white text-sm sm:text-base">{course.courseTitle}</h3>
                                            <div className="text-xs sm:text-sm text-gray-400">
                                                {course.totalLessons || 0} Lessons • 22 Hours
                                            </div>
                                            <p className="text-gray-300 text-xs line-clamp-2">{course.courseSummary}</p>
                                            <p className="text-xs text-purple-400 mt-2">
                                                Created on{" "}
                                                {course.timestamp
                                                    ? format(new Date(course.timestamp), "PPP")
                                                    : "Unknown Date"}
                                            </p>

                                            <Button
                                                className="mt-4 w-full bg-blue-600 text-xs sm:text-sm"
                                                onClick={() => navigate(`/mycourses/${course.id}`)}
                                            >
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* My Course table */}
                        <div className="mt-8 overflow-x-auto">
                            <h2 className="text-base sm:text-lg font-semibold mb-4">My Course</h2>
                            <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden min-w-[600px]">
                                <table className="w-full text-xs sm:text-sm">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="text-left p-2 sm:p-4">Course Name</th>
                                            <th className="text-center p-2 sm:p-4">Lessons</th>
                                            <th className="text-center p-2 sm:p-4">Status</th>
                                            <th className="text-center p-2 sm:p-4">Level</th>
                                            <th className="text-center p-2 sm:p-4">Category</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((course, index) => {
                                            const isCompleted = localStorage.getItem(`course-${course.id}-completed`) === "true";
                                            return (
                                                <tr key={index} className="border-t border-gray-700">
                                                    <td className="p-2 sm:p-4">
                                                        <span className='line-clamp-1'>{course.courseTitle}</span>
                                                    </td>
                                                    <td className="text-center">{course.totalLessons}</td>
                                                    <td className="p-2 sm:p-4 text-center">
                                                        <span className={`px-2 py-1 rounded text-xs sm:text-sm 
                                                            ${isCompleted ? "bg-green-800 text-green-200" : "bg-yellow-800 text-yellow-200"}`}>
                                                            {isCompleted ? "Completed" : "Ongoing"}
                                                        </span>
                                                    </td>
                                                    <td className="p-2 sm:p-4 text-center">{course.difficulty}</td>
                                                    <td className="p-2 sm:p-4 text-center">{course.category}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right column: Pie chart */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                        <h2 className="text-base sm:text-lg font-semibold mb-4 text-white">Course Distribution</h2>
                        {courseDistribution.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-center px-4">
                                <FaGraduationCap className="text-3xl sm:text-4xl text-blue-400 mb-2" />
                                <p className="text-sm sm:text-lg mb-1">No courses found</p>
                                <p className="text-xs sm:text-sm">
                                    Take an initial assessment to create your personalized courses.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="w-full h-48 sm:h-64">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={courseDistribution}
                                                dataKey="value"
                                                outerRadius="80%"
                                                label
                                            >
                                                {courseDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 text-white text-xs sm:text-sm">
                                    {courseDistribution.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center mb-2">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }} />
                                                <span>{item.name}</span>
                                            </div>
                                            <span>{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;