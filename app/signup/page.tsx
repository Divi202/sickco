// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { signupSchema, SignupFormData } from '@/types/signup.types';

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import axios from 'axios';

// export default function SignupPage() {
//   const router = useRouter();
//   const [serverError, setServerError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const form = useForm<SignupFormData>({
//     resolver: zodResolver(signupSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//       confirmPassword: '',
//     },
//   });

//   const onSubmit = async (data: SignupFormData) => {
//     setLoading(true);
//     setServerError(null);

//     try {
//       const result = await axios.post('/api/v1/auth/signup', {
//         email: data.email,
//         password: data.password,
//       });

//       router.push('/dashboard');
//     } catch (error: any) {
//       setServerError(error.response?.data?.error || 'Something went wrong');
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="w-full max-w-md space-y-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
//         >
//           <h1 className="text-center text-2xl font-bold text-white mb-2">Create Account</h1>
//           <p className="text-center text-slate-400 text-sm mb-6">Join SickCo to get started</p>

//           {serverError && <p className="text-center text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{serverError}</p>}

//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-slate-200">Email</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="you@example.com"
//                     className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-green-500/50 focus:ring-green-500/20"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-slate-200">Password</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="password"
//                     placeholder="********"
//                     className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-green-500/50 focus:ring-green-500/20"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="confirmPassword"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-slate-200">Confirm Password</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="password"
//                     placeholder="********"
//                     className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-green-500/50 focus:ring-green-500/20"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button
//             type="submit"
//             className="w-full bg-green-600/90 hover:bg-green-600 text-white font-medium py-3 transition-all duration-200"
//             disabled={loading}
//           >
//             {loading ? 'Signing up...' : 'Sign Up'}
//           </Button>

//           <div className="text-center">
//             <p className="text-slate-400 text-sm">
//               Already have an account?{' '}
//               <button
//                 type="button"
//                 onClick={() => router.push('/login')}
//                 className="text-green-400 hover:text-green-300 font-medium transition-colors"
//               >
//                 Sign in
//               </button>
//             </p>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';

const signupSchema = z
  .object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const result = await axios.post('/api/v1/auth/signup', {
        email: data.email,
        password: data.password,
      });

      router.push('/dashboard');
    } catch (error: any) {
      setServerError(error.response?.data?.error || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 bg-card border border-border rounded-xl p-8 shadow-md"
      >
        <h1 className="text-center text-2xl font-semibold text-foreground mb-2">Create Account</h1>
        <p className="text-center text-sm text-muted-foreground mb-6">Join SickCo to get started</p>

        {serverError && (
          <p className="text-center text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
            {serverError}
          </p>
        )}

        {/* Email Field */}
        <Input placeholder="you@example.com" {...form.register('email')} />

        {/* Password Field */}
        <Input type="password" placeholder="********" {...form.register('password')} />

        {/* Confirm Password Field */}
        <Input type="password" placeholder="********" {...form.register('confirmPassword')} />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <LoaderCircle className="h-4 w-4"></LoaderCircle> : 'Sign Up'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-primary hover:opacity-90 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
