import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";

function App() {

  return (
    <Router>
        <Routes>
          <Route path='/' element={<Signup />} />
          <Route path="/home" element={<Home />} />
        </Routes>
    </Router>
  );
}

export default App
