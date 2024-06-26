import { Disclosure } from "@headlessui/react"
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Link from "next/link"
import "styles/tailwind.css"

import favicon from "../../favicon.ico"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

type NavbarProps = {
  children: React.ReactNode
  currentPage: string
}

export default function Navbar({ children, currentPage }: NavbarProps) {
  const navigation = [
    { name: "Dashboard", href: "/demo/dashboard", current: currentPage === "Dashboard" },
    { name: "Speech to Text", href: "/demo/speech-to-text", current: currentPage === "Speech To Text" },
    { name: "Controller", href: "/demo/controller", current: currentPage === "Controller" },
    { name: "IQ Engine", href: "/demo/iq-engine", current: currentPage === "IQ Engine" },
  ]

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-primary-1000">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <Link legacyBehavior href="/">
                        <a href="/">
                          <Image
                            className="size-8 hover:text-white"
                            src={favicon}
                            width={32}
                            height={32}
                            alt="SpecPipe"
                            style={{ filter: "invert(1)" }}
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-primary-900 text-white"
                                : "text-gray-300 hover:bg-primary-700 hover:text-white",
                              "text-sm rounded-md px-3 py-2 font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-primary-900 text-white"
                          : "text-gray-300 hover:bg-primary-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <main>
          <div
            className={classNames(
              currentPage === "Dashboard" || currentPage === "IQ Engine"
                ? "mx-auto max-w-7xl sm:px-6 lg:px-8"
                : "mx-auto max-w-7xl py-6 sm:px-6 lg:px-8"
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
