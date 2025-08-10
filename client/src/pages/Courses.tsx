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

      <div
        className="flex-1 px-4 sm:p-6 md:p-8 overflow-y-auto min-w-0 md:ml-64 transition-all duration-150"
        style={{ maxHeight: "calc(100vh - 14px)" }}
      >
        {/* Top Bar */}
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

        {/* Courses Section */}
        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold">
                My Courses
              </h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg py-12 h-[500px]">
                <p className="text-sm sm:text-base md:text-lg">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg py-12 h-[500px] text-center px-4">
                <HiOutlineEmojiSad className="text-6xl sm:text-7xl text-blue-400 mb-2" />
                <p className="text-base sm:text-lg font-semibold text-gray-300">
                  No courses found
                </p>
                <p className="text-sm sm:text-base text-gray-400 mt-1">
                  Take the initial assessment to create your personalized course.
                </p>
                <Button
                  className="mt-4 bg-blue-600 text-sm sm:text-base md:text-lg"
                  onClick={() => navigate("/preferences-form")}
                >
                  Take Assessment
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {courses.map((course, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-blue-600" />
                    <div className="p-4">
                      <h3 className="font-medium mb-2 line-clamp-2 text-sm md:text-base">
                        {course.courseTitle}
                      </h3>
                      <div className="text-xs md:text-sm text-gray-400">
                        {course.totalLessons || 0} Lessons • 22 Hours
                      </div>
                      <p className="text-gray-300 text-xs md:text-sm line-clamp-2">
                        {course.courseSummary}
                      </p>
                      <p className="text-xs sm:text-sm text-purple-400 mt-2">
                        Created on{" "}
                        {course.timestamp
                          ? format(new Date(course.timestamp), "PPP")
                          : "Unknown Date"}
                      </p>

                      <Button
                        className="mt-4 w-full bg-blue-600 text-sm md:text-base"
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