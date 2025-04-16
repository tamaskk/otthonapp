// pages/login.tsx
import Head from 'next/head';
import { useState } from 'react';

export default function LoginPage() {
    const [auth, setAuth] = useState({
        email: '',
        password: '',
    })

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-[#053BA8]">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
            <div className="rounded-md space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                    onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                  className="appearance-none relative block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#053BA8] focus:border-[#053BA8]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                    onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                  className="appearance-none relative block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#053BA8] focus:border-[#053BA8]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#053BA8] hover:bg-[#042f85] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#053BA8]"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
