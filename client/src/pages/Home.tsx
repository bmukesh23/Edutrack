import Navbar from "@/layouts/Navbar"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <main>
      <div className="flex items-center gap-3 justify-evenly">
        <Navbar />
        <p>home</p>
        <Link to='/dashboard'>dashboard</Link>
        <p>courses</p>
        <p>assessments</p>
      </div>
    </main>
  )
}
export default Home