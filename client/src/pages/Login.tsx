import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';

// Zod Schema for form validation
const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate(); // Initialize useNavigate

    const onSubmit = async (data: LoginFormValues) => {
        const { email, password } = data;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in:', userCredential.user);
            navigate("/");
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const handleGoogleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Print the details of the user who logged in with Google
            console.log('User signed in with Google:', {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
            });

            navigate("/"); // Redirect after Google sign-in
        } catch (error) {
            console.error('Error during Google sign-in:', error);
        }
    };

    return (
        <Card className="mx-auto border-none flex h-screen">
            {/* Left section (CardContent) */}
            <div className="w-1/2 flex p-44 flex-col justify-center">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
                    <CardDescription className="text-slate-500">
                        Welcome back! Please enter your details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <Button
                                variant="outline"
                                className="w-full btn-primary bg-blue-700 text-white hover:bg-blue-500 hover:text-white shadow-xl"
                                onClick={handleGoogleSignIn}
                            >
                                <span className="flex_center gap-1 ">
                                    <FaGoogle className="mt-[2px]" />
                                    Login with Google
                                </span>
                            </Button>
                            <div className="flex items-center justify-center my-4">
                                <hr className="flex-grow border-t border-gray-300" />
                                <span className="px-2 text-gray-600 text-xs">or</span>
                                <hr className="flex-grow border-t border-gray-300" />
                            </div>
                            <div className="grid gap-2">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    className="shadow-xl outline-none"
                                    {...register('email')}
                                />
                                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    className="shadow-xl outline-none"
                                    {...register('password')}
                                />
                                <div className="flex items-center">
                                    <Link to="/forgot-password" className="ml-auto inline-block text-sm font-semibold underline">
                                        Forgot password
                                    </Link>
                                </div>
                                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                            </div>
                            <Button type="submit" className="w-full btn_primary shadow-xl">
                                Log In
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-400">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </div>

            {/* Right section (solid blue background) */}
            <div className="w-1/2 bg-blue-700"></div>
        </Card>
    );
}

export default LoginForm;