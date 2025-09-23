import { type MetaFunction } from '@remix-run/node'
import Contact from '~/components/contact'
import FAQs from '~/components/faqs'
import Footer from '~/components/footer'
import Hero from '~/components/hero'
import Navbar from '~/components/navbar'
import HowItWorks from '~/components/how-it-works'
import FeaturedCategories from '~/components/featured-categories'
import Testimonials from '~/components/testimonials'
import WhyChooseUs from '~/components/why-choose-us'
import PricingSection from '~/components/pricing-section'
import TopTalent from '~/components/top-talent'
import DemoSection from '~/components/demo-section'
import CallToAction from '~/components/call-to-action'
import TrustSafety from '~/components/trust-safety'
import Newsletter from '~/components/newsletter'
import AuthRedirect from '~/components/AuthRedirect'

export const meta: MetaFunction = () => {
    return [
        { title: 'PutMeOn - Connect with Top Local Talent' },
        {
            name: 'description',
            content:
                'Find and hire top local service providers including developers, designers, wedding organizers, and more. Chat, hire, and pay all in one secure platform.',
        },
        {
            name: 'keywords',
            content:
                'service marketplace, freelancers, local talent, hire professionals, graphic designers, developers, wedding organizers, service providers, chat platform, secure payments, verified professionals',
        },
        {
            name: 'robots',
            content: 'index, follow',
        },
        {
            name: 'author',
            content: 'Cedric Ahumuza',
        },
        {
            tagName: 'link',
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/apple-touch-icon.png',
        },
        {
            tagName: 'link',
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/favicon-32x32.png',
        },
        {
            tagName: 'link',
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: '/favicon-16x16.png',
        },
        {
            tagName: 'link',
            rel: 'manifest',
            href: '/site.webmanifest',
        },
        {
            tagName: 'link',
            rel: 'mask-icon',
            href: '/safari-pinned-tab.svg',
            color: '#5bbad5',
        },
        {
            name: 'msapplication-TileColor',
            content: '#da532c',
        },
        {
            name: 'theme-color',
            content: '#ffffff',
        },
        {
            property: 'og:title',
            content:
                'PutMeOn - Connect with Top Local Talent',
        },
        {
            property: 'og:description',
            content:
                'Find and hire top local service providers including developers, designers, wedding organizers, and more. Chat, hire, and pay all in one secure platform.',
        },
        
        {
            property: 'og:url',
            content: 'https://ahumuzacedric.netlify.app',
        },
        {
            property: 'og:type',
            content: 'website',
        },
        {
            name: 'twitter:card',
            content: 'summary_large_image',
        },
        {
            name: 'twitter:title',
            content:
                'PutMeOn - Connect with Top Local Talent',
        },
        
    ]
}

export default function Index() {
    return (
        <AuthRedirect>
            <div className='dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsla(var(--primary)_/_30%),#ffffff00)]'>
                <Navbar />
                <Hero />
                <HowItWorks />
                <FeaturedCategories />
                {/* <Testimonials /> */}
                <WhyChooseUs />
                <PricingSection />
                {/* <TopTalent /> */}
                {/* <DemoSection /> */}
                <CallToAction />
                <TrustSafety />
                <Newsletter />
                <Footer />
            </div>
        </AuthRedirect>
    )
}
