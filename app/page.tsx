import { Metadata } from "next"
import Link from "next/link"
import { Button } from "components/Button/Button"
import { LP_GRID_ITEMS } from "lp-items"
import "styles/tailwind.css"

export const metadata: Metadata = {
  title: "SpecPipe | An AI Data Pipeline for Spectrum Data",
  twitter: {
    card: "summary_large_image",
  },
  // TODO: add og after deployment and fix favicon
  icons: "/favicon.ico",
}

export default function Web() {
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
              SpecPipe <br></br> An AI Data Pipeline for Spectrum Data
            </h1>
            <p className="mb-6 max-w-2xl font-light text-primary-900 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
              SpecPipe is a data pipeline for processing and analyzing spectrum data. It is designed to be easy to use
              and to provide a wide range of features for processing and analyzing spectrum data.
            </p>
            <Button href="https://github.com/ml4wireless/specpipe" className="mr-3 border-primary-900 bg-primary-900">
              Get started
            </Button>
            <Link legacyBehavior href="/demo/dashboard">
              <Button href="/demo/dashboard" intent="secondary" className="border-primary-900 text-primary-900">
                See Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="dark:bg-grary-900 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
          <div className="justify-center space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
            {LP_GRID_ITEMS.map((singleItem) => (
              <div key={singleItem.title} className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary-100 p-1.5 text-primary-700 dark:bg-primary-900 lg:size-12">
                  {singleItem.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white">{singleItem.title}</h3>
                <p className="text-primary-800 dark:text-primary-400">{singleItem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
