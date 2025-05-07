"use client";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [auth, setAuth] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: auth.email,
        password: auth.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/mainpage");
      }
    } catch (err: any) {
      setError(err.message || "Valami hiba történt a bejelentkezés során");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Bejelentkezés</title>
      </Head>
      <div className="min-h-[100dvh] bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-[#053BA8]">
              Jelentkezz be a fiókodba
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-100 rounded-lg">
                {error}
              </div>
            )}
            <div className="rounded-md space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                  className="appearance-none relative block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#053BA8] focus:border-[#053BA8] text-black"
                  placeholder="email"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Jelszó
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={(e) =>
                    setAuth({ ...auth, password: e.target.value })
                  }
                  className="appearance-none relative block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#053BA8] focus:border-[#053BA8] text-black"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#053BA8] hover:bg-[#042f85] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#053BA8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Bejelentkezés..." : "Bejelentkezés"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
