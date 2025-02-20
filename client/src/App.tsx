import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import PreferencesForm from "./pages/PreferencesForm";
import Assessment from "./pages/Assessment";
import CourseDetails from "./pages/CourseDetails";

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/preferences-form" element={<PreferencesForm />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/mycourses" element={<Courses />} />
        <Route path="/mycourses/:courseId" element={<CourseDetails/>} />
      </Routes>
    </Router>
  );
}

export default App