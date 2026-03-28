import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await register(email, password, fullName);
      navigate('/dashboard', { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel w-full max-w-md p-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.18em] text-brand-cyan">ArmanX AI</p>
          <h1 className="mt-3 text-3xl font-bold text-white light:text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400 light:text-slate-500">
            Set up secure access for your LinkedIn AI operations workspace.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300 light:text-slate-700">Full name</span>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-brand-cyan light:border-slate-200 light:bg-white light:text-slate-900"
              placeholder="Arman Khan"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300 light:text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-brand-cyan light:border-slate-200 light:bg-white light:text-slate-900"
              placeholder="you@armanx.ai"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300 light:text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-brand-cyan light:border-slate-200 light:bg-white light:text-slate-900"
              placeholder="Create a secure password"
              required
            />
          </label>

          {error && <div className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300 light:text-rose-600">{error}</div>}

          <Button type="submit" className="w-full py-3" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-400 light:text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-cyan">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
