import Sidebar from "@/layouts/Sidebar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Search } from "lucide-react";
import useUserDetails from "@/hook/useUserDetails";
import useCourse from "@/hook/useCourse";
import { useNavigate } from "react-router-dom";
import { HiOutlineEmojiSad } from "react-icons/hi";

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
              <img src={userDetails?.photoUrl} alt="User Profile" className='w-8 h-8 rounded-full' />
              {/* <span className='rounded-full bg-gradient-to-r from-blue-400 to-green-600 w-8 h-8'/> */}
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
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg py-12 h-[500px]">
                <p>Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg py-12 h-[500px]">
                <HiOutlineEmojiSad className="text-7xl text-blue-400 mb-2" />
                <p className="text-lg font-semibold text-gray-300">No courses found</p>
                <p className="text-sm text-gray-400 mt-1">Take the initial assessment to create your personalized course.</p>
                <Button
                  className="mt-4 bg-blue-600"
                  onClick={() => navigate("/preferences-form")}
                >
                  Take Assessment
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {courses.map((course, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-blue-600" />
                    <div className="p-4">
                      <h3 className="font-medium mb-2 line-clamp-2">{course.courseTitle}</h3>
                      <div className="text-sm text-gray-400">
                        {course.totalLessons || 0} Lessons • 22 Hours
                      </div>
                      <p className="text-gray-600 text-xs line-clamp-2">{course.courseSummary}</p>
                      <p className="text-xs text-purple-400 mt-2">
                        Created on {course.timestamp ? format(new Date(course.timestamp), "PPP") : "Unknown Date"}
                      </p>

                      <Button
                        className="mt-4 w-full bg-blue-600"
                        onClick={() => navigate(`/mycourses/${course.id}`)}
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