
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-[var(--brand-light)]">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-[var(--brand-dark)]">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-[var(--brand-dark)]">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--brand-primary)] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-[var(--brand-dark)]">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-secondary)]">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--brand-primary)] sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[var(--brand-primary)] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[var(--brand-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-6">
          <button
            type="button"
            className="flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.0003 4.75C14.0003 4.75 15.7233 5.456 17.0343 6.606L20.5053 3.135C18.4473 1.193 15.4843 0 12.0003 0C7.27533 0 3.19733 2.698 1.19733 6.607L4.66833 9.068C5.52733 6.339 8.48433 4.75 12.0003 4.75Z" fill="#EA4335"/>
              <path d="M23.4993 12.272C23.4993 11.488 23.4293 10.721 23.3023 9.976H12.0003V14.264H18.4843C18.1873 15.801 17.2613 17.083 16.0003 17.942V21.413H20.0003C22.2473 19.355 23.4993 16.292 23.4993 12.272Z" fill="#4285F4"/>
              <path d="M12.0003 24C15.4843 24 18.4473 22.807 20.5053 20.865L17.0343 17.394C15.7233 18.544 14.0003 19.25 12.0003 19.25C8.48433 19.25 5.52733 17.661 4.66833 14.932L1.19733 17.393C3.19733 21.302 7.27533 24 12.0003 24Z" fill="#FBBC05"/>
              <path d="M1.19733 6.607L4.66833 9.068C4.02133 10.088 3.69833 11.193 3.69833 12.272C3.69833 13.351 4.02133 14.456 4.66833 15.476L1.19733 17.937C0.436333 16.686 0 14.932 0 12.272C0 9.612 0.436333 7.858 1.19733 6.607Z" fill="#34A853"/>
            </svg>
            Sign in with Google
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member? {' '}
          <Link href="/signup" className="font-semibold leading-6 text-[var(--brand-primary)] hover:text-[var(--brand-secondary)]">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
