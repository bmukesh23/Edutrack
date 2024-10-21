import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
            navigate("/"); // Redirect after successful login
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
        <Card className="mx-auto max-w-sm border-none flex_center flex-col h-screen items-stretch">
            <CardHeader className='text-center'>
                <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
                <CardDescription className="text-slate-500">
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="mail@example.com"
                                className=""
                                {...register('email')}
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link to="/forgot-password" className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                className=""
                                {...register('password')}
                            />
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full btn_primary">
                            Log In
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full btn-primary bg-blue-700 text-white hover:bg-blue-500 hover:text-white"
                            onClick={handleGoogleSignIn}
                        >
                            <span className="flex_center gap-1">
                                <FaGoogle className="mt-[2px]" />
                                Login with Google
                            </span>
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
        </Card>
    );
}

export default LoginForm;