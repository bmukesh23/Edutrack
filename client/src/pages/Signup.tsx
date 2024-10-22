import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';

const signupSchema = z.object({
    firstName: z.string().min(2, { message: 'First name is required and must be at least 2 characters.' }),
    lastName: z.string().min(2, { message: 'Last name is required and must be at least 2 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const navigate = useNavigate();

    const onSubmit = async (data: SignupFormValues) => {
        const { email, password } = data;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User signed up:', userCredential.user);
            navigate("/");
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    const handleGoogleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            console.log('User signed in with Google:', {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
            });

            navigate("/");
        } catch (error) {
            console.error('Error during Google sign-in:', error);
        }
    };

    return (
        <Card className="mx-auto border-none flex h-screen">
            {/* Left section (CardContent) */}
            <div className="w-1/2 flex p-44 flex-col justify-center">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Create a new account</CardTitle>
                    <CardDescription className="text-slate-500">
                        Enter your information to create an account
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
                                    Sign up with Google
                                </span>
                            </Button>
                            <div className="flex items-center justify-center my-4">
                                <hr className="flex-grow border-t border-gray-300" />
                                <span className="px-2 text-gray-600 text-xs">or</span>
                                <hr className="flex-grow border-t border-gray-300" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Input
                                    placeholder="First Name"
                                    className="shadow-xl outline-none"
                                    {...register('firstName')}
                                />
                                {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Input
                                    placeholder="Last Name"
                                    className="shadow-xl outline-none"
                                    {...register('lastName')}
                                />
                                {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                            </div>
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
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full btn_primary shadow-xl">
                            Create an account
                        </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400">
                            Log in
                        </Link>
                    </div>
                </CardContent>
            </div>

            {/* Right section (solid blue background) */}
            <div className="w-1/2 bg-blue-700"></div>
        </Card>
    );
}

export default SignupForm;