import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { useNavigate } from 'react-router-dom';

const learnerSchema = z.object({
  profile: z.object({
    age: z.number().min(1, "Age is required"),
    location: z.string().min(1, "Location is required"),
    profession: z.string().min(1, "Profession is required"),
    experience: z.number().min(0, "Experience must be a positive number"),
    interests: z.string().min(1, 'Interests field cannot be empty'),
    past_courses: z.string().min(1, 'Past courses field cannot be empty'),
    goals: z.string().min(1, "Goals are required"),
    preferences: z.object({
      learning_style: z.string().min(1, "Learning style is required"),
      available_time: z.string().min(1, "Available time is required"),
    }),
  }),
});

type LearnerFormData = z.infer<typeof learnerSchema>;

const LearnerForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LearnerFormData>({
    resolver: zodResolver(learnerSchema),
  });

  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/users');
        if (data) setUser({ name: data.name, email: data.email });
        console.log(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);

  const onSubmit = async (formData: LearnerFormData) => {
    const combinedData = {
      name: user.name,
      email: user.email,
      profile: {
        ...formData.profile,
        interests: formData.profile.interests.split(',').map((interest) => interest.trim()), // Split interests by comma
        past_courses: formData.profile.past_courses.split(',').map((course) => course.trim()), // Split courses by comma
      },
    };

    try {
      await axios.post('http://localhost:5000/api/learners', combinedData);
      navigate("/dashboard");
      reset(); 
    } catch (error) {
      console.error('Error submitting learner data:', error);
      alert('Failed to submit learner data.');
    }
  };

  return (
    <div className="max-w-lg mx-auto py-16 rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-center">Learner Profile Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input type="text" value={user.name} readOnly className="mt-1 block w-full border-gray-300" />
        </div>

        <div>
          <Input type="email" value={user.email} readOnly className="mt-1 block w-full border-gray-300" />
        </div>

        <div>
          <Input
            type="number"
            placeholder='Age'
            {...register('profile.age', { valueAsNumber: true })}
            className={`mt-1 block w-full ${errors.profile?.age ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.profile?.age && <p className="text-red-500 text-sm">{errors.profile.age.message}</p>}
        </div>

        <div>
          <Input
            type="text"
            placeholder='Location'
            {...register('profile.location')}
            className={`mt-1 block w-full ${errors.profile?.location ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.profile?.location && <p className="text-red-500 text-sm">{errors.profile.location.message}</p>}
        </div>

        <div>
          <Input
            type="text"
            placeholder='Profession'
            {...register('profile.profession')}
            className={`mt-1 block w-full ${errors.profile?.profession ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.profile?.profession && <p className="text-red-500 text-sm">{errors.profile.profession.message}</p>}
        </div>

        <div>
          <Input
            placeholder='Experience'
            type="number"
            {...register('profile.experience', { valueAsNumber: true })}
            className={`mt-1 block w-full ${errors.profile?.experience ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.profile?.experience && <p className="text-red-500 text-sm">{errors.profile.experience.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Interests</label>
          <Input
            type="text"
            placeholder="e.g., Math, Physics, Coding"
            {...register('profile.interests')}
            className={`mt-1 block w-full ${errors.profile?.interests ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.profile?.interests && <p className="text-red-500 text-sm">{errors.profile.interests.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Past Courses</label>
          <Input
            type="text"
            placeholder="e.g., Algebra 101, Python Basics"
            {...register('profile.past_courses')}
            className={`mt-1 block w-full ${errors.profile?.past_courses ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.profile?.past_courses && <p className="text-red-500 text-sm">{errors.profile.past_courses.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Goals</label>
          <Input
            type="text"
            {...register('profile.goals')}
            placeholder="e.g., Become proficient in data science"
            className={`mt-1 block w-full ${errors.profile?.goals ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.profile?.goals && <p className="text-red-500 text-sm">{errors.profile.goals.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Preferred Learning Style</label>
          <Input
            type="text"
            {...register('profile.preferences.learning_style')}
            placeholder="e.g., Video, Interactive"
            className={`mt-1 block w-full ${errors.profile?.preferences?.learning_style ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.profile?.preferences?.learning_style && <p className="text-red-500 text-sm">{errors.profile.preferences.learning_style.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Available Time (hours per week)</label>
          <Input
            type="text"
            {...register('profile.preferences.available_time')}
            className={`mt-1 block w-full ${errors.profile?.preferences?.available_time ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.profile?.preferences?.available_time && <p className="text-red-500 text-sm">{errors.profile.preferences.available_time.message}</p>}
        </div>

        <Button type="submit" className="w-full p-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-500">Submit</Button>
      </form>
    </div>
  );
};

export default LearnerForm;