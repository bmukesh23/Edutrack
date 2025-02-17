import { Search, Bookmark } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';
import Sidebar from '@/layouts/Sidebar';
import useUserDetails from '@/hook/useUserDetails';
import useCourse from '@/hook/useCourse';

const Dashboard = () => {
    const metricsData = [
        { label: 'Ongoing', value: 4, color: '#3B82F6' },
        { label: 'Complete', value: 0, color: '#22C55E' },
        { label: 'Certificate', value: 0, color: '#F97316' },
        { label: 'Hour Spent', value: 5, color: '#8B5CF6' },
    ];

    const courseDistribution = [
        { name: 'Design', value: 40, color: '#8B5CF6' },
        { name: 'Code', value: 30, color: '#6366F1' },
        { name: 'Business', value: 20, color: '#EC4899' },
        { name: 'Data', value: 10, color: '#14B8A6' },
    ];

    const popularCourses = [
        {
            title: 'Create 3D With Blender',
            category: 'DESIGN',
            lessons: 16,
            hours: 48,
            price: 100,
        },
        {
            title: 'Digital Marketing',
            category: 'BUSINESS',
            lessons: 30,
            hours: 48,
            price: 100,
        },
        {
            title: 'Slicing UI Design With Tailwind',
            category: 'CODE',
            lessons: 30,
            hours: 48,
            price: 100,
        },
    ];

    const { userDetails } = useUserDetails();
    const { courses } = useCourse();

    return (
        <section className="flex min-h-screen bg-gray-900 text-white">
            <Sidebar />

            <div className="flex-1 p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 14px)' }}>
                <div className="flex justify-between items-center mb-8">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Try search programming course"
                            className="pl-10 pr-4 py-2 border rounded-lg w-64 bg-gray-800 text-white border-gray-700"
                        />
                    </div>

                    {userDetails ? (
                        <div className="flex items-center space-x-3">
                            <img src={userDetails?.photoURL} className='w-8 h-8 rounded-full' />
                            <span className="font-medium pr-1">{userDetails.name}</span>
                        </div>
                    ) : (
                        <span className="font-medium">Loading...</span>
                    )}

                </div>

                {/* The rest of the dashboard content */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {metricsData.map((metric, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-sm">
                            <div className="text-3xl font-bold mb-1" style={{ color: metric.color }}>
                                {metric.value}
                            </div>
                            <div className="text-gray-400 text-sm">{metric.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Recommended Course</h2>
                            <button className="text-purple-400 text-sm">View All</button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {popularCourses.map((course, index) => (
                                <div key={index} className="bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                                    <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                                    <div className="p-4">
                                        <div className="text-sm text-purple-400 mb-1">{course.category}</div>
                                        <h3 className="font-medium mb-2">{course.title}</h3>
                                        <div className="text-sm text-gray-400">
                                            {course.lessons} Lessons • {course.hours} Hours
                                        </div>
                                        <div className="mt-3 flex justify-between items-center">
                                            <span className="font-medium">${course.price}</span>
                                            <button className="text-purple-400">
                                                <Bookmark className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <h2 className="text-lg font-semibold mb-4">My Course</h2>
                            <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="text-left p-4">Course Name</th>
                                            <th className="text-center p-4">Lessons</th>
                                            <th className="text-center p-4">Status</th>
                                            <th className="text-center p-4">Level</th>
                                            <th className="text-center p-4">Category</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((course, index) => (
                                            <tr key={index} className="border-t border-gray-700">
                                                <td className="p-4">
                                                    <div className="flex items-center">
                                                        <span className='line-clamp-1'>{course.course_title}</span>
                                                    </div>
                                                </td>
                                                <td className="text-center">{course.totalLessons}</td>
                                                <td className="p-4 text-center">
                                                    <span className="px-2 py-1 rounded text-sm bg-yellow-800 text-yellow-200">Ongoing</span>
                                                </td>
                                                <td className="p-4 text-center">Advanced</td>
                                                <td className="p-4 text-center">Code</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Course Distribution</h2>
                        <PieChart width={300} height={300}>
                            <Pie
                                data={courseDistribution}
                                dataKey="value"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                                isAnimationActive={true}
                                animationDuration={500}
                            >
                                {courseDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                        <div className="mt-4">
                            {courseDistribution.map((item, index) => (
                                <div key={index} className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></div>
                                        <span>{item.name}</span>
                                    </div>
                                    <span>{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Dashboard;