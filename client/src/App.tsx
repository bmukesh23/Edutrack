import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import PreferencesForm from "./pages/PreferencesForm";
import Assessment from "./pages/Assessment";
import CourseDetails from "./pages/CourseDetails";
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz";

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/preferences-form" element={<PreferencesForm />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/mycourses" element={<Courses />} />
        <Route path="/mycourses/:courseId" element={<CourseDetails />} />
        <Route path="/mycourses/notes/:courseId" element={<Notes />} />
        <Route path="/mycourses/quiz/:courseId" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App