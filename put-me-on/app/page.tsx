
'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[var(--brand-light)] text-[var(--brand-dark)]">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }} 
        animate={{ y: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between p-6 lg:px-8 sticky top-0 bg-[var(--brand-light)] z-50 shadow-md"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 text-2xl font-bold text-[var(--brand-primary)]">
            PutMeOn
          </a>
        </div>
        <div className="flex gap-x-12">
          <a href="#features" className="text-sm font-semibold leading-6 hover:text-[var(--brand-primary)] transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-semibold leading-6 hover:text-[var(--brand-primary)] transition-colors">Pricing</a>
          <a href="#" className="text-sm font-semibold leading-6 hover:text-[var(--brand-primary)] transition-colors">Marketplace</a>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="/login" className="text-sm font-semibold leading-6 hover:text-[var(--brand-primary)] transition-colors">
            Log in <span aria-hidden="true"></span>
          </Link>
          <Link href="/signup" className="ml-4 text-sm font-semibold leading-6 hover:text-[var(--brand-primary)] transition-colors">
            Sign up <span aria-hidden="true"></span>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Connect with local professionals and services
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Your bridge to local and niche market experts. Find and hire trusted professionals for any project, big or small.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-[var(--brand-primary)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-transform transform hover:scale-105"
              >
                Get started
              </a>
              <a href="#" className="text-sm font-semibold leading-6 hover:text-[var(--brand-primary)] transition-colors">
                Learn more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </motion.div>
        </div>
        <Image src="https://picsum.photos/1920/1080" alt="Placeholder" layout="fill" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20" />
      </main>

      {/* Features Section */}
      <div id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-[var(--brand-primary)]">Your Platform</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to connect
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We specialize in local markets and niche industries to ensure the best quality and matching.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <motion.div whileHover={{ scale: 1.05 }} className="relative pl-16">
                <dt className="text-base font-semibold leading-7">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-primary)]">
                    <Image src="/globe.svg" alt="Globe" width={24} height={24} />
                  </div>
                  Local Marketplace
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Find professionals in your area. We focus on local markets to provide you with the best services.
                </dd>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="relative pl-16">
                <dt className="text-base font-semibold leading-7">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-primary)]">
                    <Image src="/file.svg" alt="File" width={24} height={24} />
                  </div>
                  Quality Control
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  We verify our service providers to ensure you get the highest quality of work.
                </dd>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="relative pl-16">
                <dt className="text-base font-semibold leading-7">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-primary)]">
                    <Image src="/window.svg" alt="Window" width={24} height={24} />
                  </div>
                  Niche Industries
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  From artisans to specialized technicians, find experts in niche industries that you won't find anywhere else.
                </dd>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="relative pl-16">
                <dt className="text-base font-semibold leading-7">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-primary)]">
                    <Image src="/next.svg" alt="Next.js" width={24} height={24} />
                  </div>
                  Streamlined Process
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Our platform makes it easy to find, hire, and manage professionals for your projects.
                </dd>
              </motion.div>
            </dl>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Pricing</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Choose the plan that's right for your business. No hidden fees, ever.
            </p>
          </div>
          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Basic Plan */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">Basic</h3>
                <p className="mt-4 text-sm leading-6 text-gray-600">A plan that's perfect for starting out.</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">0 UGX</span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  <li className="flex gap-x-3">Upto 10 product/service listings</li>
                  <li className="flex gap-x-3">1 Daily Product/Service Boost</li>
                  <li className="flex gap-x-3">Basic support</li>
                </ul>
              </div>
              <a href="#" className="mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 text-[var(--brand-primary)] ring-1 ring-inset ring-[var(--brand-primary)] hover:ring-[var(--brand-secondary)]">Get plan</a>
            </motion.div>
            {/* Pro Plan */}
            <motion.div whileHover={{ scale: 1.05 }} className="relative flex flex-col justify-between rounded-3xl bg-white p-8 ring-2 ring-[var(--brand-primary)] xl:p-10">
              <div>
                <div className="absolute top-0 right-0 -z-10">
                  <span className="inline-flex items-center rounded-md bg-[var(--brand-primary)] px-2 py-1 text-xs font-medium text-white">Most popular</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">Pro</h3>
                <p className="mt-4 text-sm leading-6 text-gray-600">The perfect plan for growing businesses.</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">37,000 UGX</span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  <li className="flex gap-x-3">Upto 50 product/service listings</li>
                  <li className="flex gap-x-3">5 Daily Product/Service Boost</li>
                  <li className="flex gap-x-3">Advanced support</li>
                  
                </ul>
              </div>
              <a href="#" className="mt-8 block rounded-md bg-[var(--brand-primary)] py-2 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[var(--brand-secondary)]">Get plan</a>
            </motion.div>
            {/* Ultimate Plan */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">Ultimate</h3>
                <p className="mt-4 text-sm leading-6 text-gray-600">For businesses that need it all.</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">90,000 UGX</span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  <li className="flex gap-x-3">Unlimited product/services listings</li>
                  <li className="flex gap-x-3">50 Daily Product/Service Boost</li>
                    <li className="flex gap-x-3">24/7 priority support</li>
                  <li className="flex gap-x-3">Dedicated account manager</li>
                </ul>
              </div>
              <a href="#" className="mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 text-[var(--brand-primary)] ring-1 ring-inset ring-[var(--brand-primary)] hover:ring-[var(--brand-secondary)]">Get plan</a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[var(--brand-dark)] text-[var(--brand-light)]">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
          <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
            <div className="pb-6">
              <a href="#" className="text-sm leading-6 hover:text-[var(--brand-secondary)]">About</a>
            </div>
            <div className="pb-6">
              <a href="#" className="text-sm leading-6 hover:text-[var(--brand-secondary)]">Blog</a>
            </div>
            <div className="pb-6">
              <a href="#" className="text-sm leading-6 hover:text-[var(--brand-secondary)]">Jobs</a>
            </div>
            <div className="pb-6">
              <a href="#" className="text-sm leading-6 hover:text-[var(--brand-secondary)]">Press</a>
            </div>
            <div className="pb-6">
              <a href="#" className="text-sm leading-6 hover:text-[var(--brand-secondary)]">Accessibility</a>
            </div>
            <div className="pb-6">
              <a href="#" className="text-sm leading-6 hover:text-[var(--brand-secondary)]">Partners</a>
            </div>
          </nav>
          <p className="mt-10 text-center text-xs leading-5">
            &copy; 2025 PutMeOn, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
