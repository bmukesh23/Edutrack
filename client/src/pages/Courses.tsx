import Sidebar from "@/layouts/Sidebar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Search } from "lucide-react";
import useUserDetails from "@/hook/useUserDetails";
import useCourse from "@/hook/useCourse";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const { userDetails, loading } = useUserDetails();
  const { courses } = useCourse();
  const navigate = useNavigate();

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
              <img src={userDetails?.photoURL} alt="User Profile" className='w-8 h-8 rounded-full' />
              <span className="font-medium pr-1">{userDetails.name}</span>
            </div>
          ) : (
            <span className="font-medium">Loading...</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">My Courses</h2>
              <button className="text-purple-400 text-sm">View All</button>
            </div>

            {loading ? (
              <p>Loading courses...</p>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {courses.map((course, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-blue-600" />
                    <div className="p-4">
                      <h3 className="font-medium mb-2">{course.course_title}</h3>
                      <div className="text-sm text-gray-400">
                        {course.totalLessons || 0} Lessons •  22 Hours
                      </div>
                      <p className="text-gray-600 text-xs line-clamp-2">{course.course_summary}</p>
                      <p className="text-xs text-purple-400 mt-2">
                        Created on {course.timestamp ? format(new Date(course.timestamp), "PPP") : "Unknown Date"}
                      </p>

                      <Button
                        className="mt-4 w-full bg-blue-600"
                        onClick={() => navigate(`/mycourses/${course._id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;