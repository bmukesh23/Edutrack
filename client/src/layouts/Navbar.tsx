import logo from "/logo.svg"

const Navbar = () => {
    return (
        <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-1.5">
                <img src={logo} alt="logo" className="mt-[0.1rem] sm:mt-[0.15rem] w-6 h-6" />
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold py-2">edutrack</h2>
            </div>
        </div>
    )
}
export default Navbar