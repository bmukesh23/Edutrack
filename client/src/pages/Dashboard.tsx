import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart2, Save, MessageSquareText, Pencil, BookMarked, Settings, LogOut } from 'lucide-react';
// import axios from 'axios';
import Logo from "/logo.svg";

interface SidebarNavProps {
    userName: string;
}

const SidebarNav: React.FC<SidebarNavProps> = () => {
    const navigate = useNavigate();
    //   const [userProfile, setUserProfile] = useState<{ displayName: string; photoURL: string; email: string } | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            //   try {
            //     const response = await axios.get('http://localhost:5000/api/users');
            //     console.log('API response:', response.data[1]); // Debugging line

            //     if (response.data && response.data.length > 0) {
            //       const { displayName, photoURL, email } = response.data[1];
            //       setUserProfile({ displayName, photoURL, email });
            //     } else {
            //       console.log('No user data found'); // Debugging line
            //     }
            //   } catch (error) {
            //     console.error('Error fetching user profile:', error);
            //   }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            navigate('/signup');
        }
    };

    return (
        <div className="w-64 h-screen bg-yellow-700 text-slate-200 p-6 flex flex-col justify-between">
            <nav>
                <div>
                    <div className="flex items-center gap-2 mb-10">
                        <img src={Logo} className='h-8 w-8' />
                        <h1 className='text-3xl font-semibold'>
                            <NavLink to="/dashboard">
                                edutrack
                            </NavLink>
                        </h1>
                    </div>
                    <p className='text-sm mb-4 tracking-widest'>MENU</p>
                    <ul className="space-y-2">
                        <li>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) => isActive ? "flex items-center space-x-2 p-2 rounded bg-yellow-800" : "flex items-center space-x-2 p-2 rounded hover:bg-yellow-800"}>
                                <BarChart2 size={20} />
                                <span>Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/city-map"
                                className={({ isActive }) => isActive ? "flex items-center space-x-2 p-2 rounded bg-yellow-800" : "flex items-center space-x-2 p-2 rounded hover:bg-yellow-800"}>
                                <BookMarked size={20} />
                                <span>My Courses</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/deliveries"
                                className={({ isActive }) => isActive ? "flex items-center space-x-2 p-2 rounded bg-yellow-800" : "flex items-center space-x-2 p-2 rounded hover:bg-yellow-800"}>
                                <Pencil size={20} />
                                <span>Assignments</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/leaderboard"
                                className={({ isActive }) => isActive ? "flex items-center space-x-2 p-2 rounded bg-yellow-800" : "flex items-center space-x-2 p-2 rounded hover:bg-yellow-800"}>
                                <Save size={20}/>
                                <span>Saved Courses</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/rewards"
                                className={({ isActive }) => isActive ? "flex items-center space-x-2 p-2 rounded bg-yellow-800" : "flex items-center space-x-2 p-2 rounded hover:bg-yellow-800"}>
                                <MessageSquareText size={20} />
                                <span>Messages</span>
                            </NavLink>
                        </li>
                    </ul>

                    <p className='text-sm mb-4 mt-8 tracking-widest'>GENERAL</p>
                    <ul className="space-y-2">
                        <li>
                            <NavLink
                                to="/settings"
                                className={({ isActive }) => isActive ? "flex items-center space-x-2 p-2 rounded bg-yellow-800" : "flex items-center space-x-2 p-2 rounded hover:bg-yellow-800"}>
                                <Settings size={20} />
                                <span>Settings</span>
                            </NavLink>
                        </li>
                        {/* Logout Button */}
                        <li>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 p-2 rounded hover:bg-yellow-800 w-full text-left">
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* User Profile Section */}
            {/* <div className="flex items-center mt-auto mb-4 border-t border-slate-300 pt-4">
        {userProfile ? (
          <div className="flex items-center">
            <img
              src={userProfile.photoURL}
              alt={userProfile.displayName}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className='flex flex-col'>
              <h2 className="text-md font-semibold">{userProfile.displayName}</h2>
              <p className='text-xs text-slate-300'>{userProfile.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-300">Loading user profile...</p>
        )}
      </div> */}
        </div>
    );
};

export default SidebarNav;