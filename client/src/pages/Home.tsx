import Navbar from "@/layouts/Navbar"

const Home = () => {
  return (
    <main>
      <div className="flex items-center gap-3 justify-evenly">
        <Navbar />
        <p>home</p>
        <p>courses</p>
        <p>assessments</p>
      </div>
    </main>
  )
}
export default Home