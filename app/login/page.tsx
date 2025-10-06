// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { loginSchema, LoginFormData } from '@/types/login.types';

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

// export default function LoginPage() {
//   const router = useRouter();
//   const [serverError, setServerError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const form = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { email: '', password: '' },
//   });

//   const onSubmit = async (data: LoginFormData) => {
//     setLoading(true);
//     setServerError(null);

//     try {
//       const result = await axios.post('/api/v1/auth/login', data);
//       router.push('/dashboard');
//     } catch (error: any) {
//       setServerError(error.response?.data?.error || 'Invalid email or password');
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
//           <h1 className="text-center text-2xl font-bold text-white mb-2">Welcome Back</h1>
//           <p className="text-center text-slate-400 text-sm mb-6">Sign in to your SickCo account</p>

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

//           <Button
//             type="submit"
//             className="w-full bg-green-600/90 hover:bg-green-600 text-white font-medium py-3 transition-all duration-200"
//             disabled={loading}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </Button>

//           <div className="text-center">
//             <p className="text-slate-400 text-sm">
//               Don't have an account?{' '}
//               <button
//                 type="button"
//                 onClick={() => router.push('/signup')}
//                 className="text-green-400 hover:text-green-300 font-medium transition-colors"
//               >
//                 Sign up
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

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // const searchParams = useSearchParams();
  // // Pre-fill email from query
  // const emailFromQuery = searchParams.get('email') || '';

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const result = await axios.post('/api/v1/auth/login', data);
      router.push('/dashboard');
    } catch (error: any) {
      setServerError(error.response?.data?.error || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 bg-card border border-border rounded-xl p-8 shadow-md"
      >
        <h1 className="text-center text-2xl font-semibold text-foreground mb-2">Welcome Back</h1>
        <p className="text-center text-sm text-muted-foreground mb-6">
          Sign in to your SickCo account
        </p>

        {serverError && (
          <p className="text-center text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
            {serverError}
          </p>
        )}

        {/* Email Field */}
        <Input placeholder="you@example.com" {...form.register('email')} />

        {/* Password Field */}
        <Input type="password" placeholder="********" {...form.register('password')} />

        <Button
          type="submit"
          className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin"></LoaderCircle> : 'Login'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="text-primary hover:opacity-90 font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
