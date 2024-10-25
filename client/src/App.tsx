import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Assignments from "./pages/Assignments";
import SavedCourses from "./pages/SavedCourses";
import Messages from "./pages/Messages";
import LearnerForm from "./pages/LearnerForm";
import Settings from "./pages/Settings";

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mycourses" element={<Courses />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/saved_courses" element={<SavedCourses />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/learner_form" element={<LearnerForm />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App
