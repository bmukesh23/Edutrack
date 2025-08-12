import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/utils/firebaseConfig";
import { FaGoogle } from "react-icons/fa6";
import Navbar from "@/layouts/Navbar";
import Loader from "@/components/ui/Loader";
import axiosInstance from "@/utils/axiosInstance";

const SignUp = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();

            if (!user.email) {
                throw new Error("Google authentication failed: No email provided.");
            }

            const userData = {
                idToken: idToken,
            };

            const response = await axiosInstance.post('/api/auth', userData);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                // console.log("signed-in successful. Token stored.");
                navigate("/dashboard");
            } else {
                console.error("signed-in response did not contain a token.");
            }
        } catch (error) {
            console.error("Authentication error:", error);
            alert("Authentication failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main>
            <Navbar />
            <div className="relative pt-28">
                <div className="bg-yellow-500 absolute top-[-6rem] h-[20.25rem] w-[50rem] rounded-full blur-[10rem] -z-10 right-[14rem] sm:w-[68.75rem]" />

                <div className="flex flex-col justify-center items-center gap-2 md:gap-4 mt-8 text-center">
                    <h1 className="text-xl md:text-4xl lg:text-5xl font-bold leading-tight w-[80%] md:w-[65%] lg:w-[50%]">
                        Learn Smarter, Not Harder
                        <br />
                        <span className="text-xl md:text-4xl lg:text-5xl">Personalized Education at Your Fingertips</span>
                    </h1>
                    <p className="text-xs md:text-sm lg:text-lg text-slate-400 w-4/5 md:w-1/2 lg:w-[45%]">
                        Edutrack is a platform that personalizes your learning journey, offering tailored content and assessments to enhance your skills efficiently.
                    </p>

                    <button onClick={handleAuth} className="flex justify-center items-center text-[12px] md:text-[13px] lg:text-base gap-2 bg-yellow-600 py-[0.35rem] px-2 sm:px-4 rounded-lg hover:bg-yellow-500">
                        {isLoading ? (
                            <div className="flex justify-center items-center gap-2 px-12">
                                <Loader />
                            </div>
                        ) : (
                            <>
                                <FaGoogle />
                                Sign-in with Google
                            </>
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default SignUp;