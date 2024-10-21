import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom'; 
import { FaGoogle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/utils/firebaseConfig';

// Zod schema for form validation
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
            navigate('/');
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    const handleGoogleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log('User signed in with Google:', result.user);

            // Print user details to console
            const userData = {
                uid: result.user.uid,
                displayName: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
            };
            console.log('Google User Data:', userData);

            navigate('/');
        } catch (error) {
            console.error('Error during Google sign-in:', error);
        }
    };

    return (
        <Card className="mx-auto max-w-sm border-none flex_center flex-col h-screen">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Create a new account</CardTitle>
                <CardDescription className="text-slate-500">
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input
                                    id="first-name"
                                    placeholder="Max"
                                    className=""
                                    {...register('firstName')}
                                />
                                {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Robinson"
                                    className=""
                                    {...register('lastName')}
                                />
                                {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                            </div>
                        </div>
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
                            <Label htmlFor="password">Password</Label>
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
                            Create an account
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full btn-primary bg-blue-700 text-white hover:bg-blue-500 hover:text-white"
                            onClick={handleGoogleSignIn}
                        >
                            <span className="flex_center gap-1">
                                <FaGoogle className="mt-[2px]" />
                                Sign up with Google
                            </span>
                        </Button>
                    </div>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default SignupForm;