import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoginForm from "./pages/Login";
import SignupForm from "./pages/Signup";

function App() {

  return (
    <Router>
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/signup' element={<SignupForm />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App
