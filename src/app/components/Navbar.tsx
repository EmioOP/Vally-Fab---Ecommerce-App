"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react"

const categories = [
  {
    name: "Women",
    subcategories: ["New In", "Clothing", "Accessories", "Sale"],
  },
  {
    name: "Kids",
    subcategories: ["Girls", "Boys", "Baby", "Shoes", "Sale"],
  },
  {
    name: "Accessories",
    subcategories: ["Jewelry", "Bags", "Sunglasses", "Watches", "Hats"],
  },
  {
    name: "Sale",
    subcategories: [],
  },
]

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const cartItemCount = 3 // This would come from your cart state/context

  const userMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Automatically update dark mode based on system preference (using Tailwind's "class" strategy)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    // Set the initial mode
    if (mediaQuery.matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest("[data-mobile-trigger]")
      ) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close menus when pressing escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setUserMenuOpen(false)
        setMobileMenuOpen(false)
        setSearchOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  function toggleCategory(category: string) {
    setExpandedCategory((prev) => (prev === category ? null : category))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 bottom-0 z-50 w-[300px] bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            {/* <Image src={"/logo.png"} alt="Vally Fashions" width={40} height={40} /> */}
            <img src="/logo.png" alt="logo"  />
            <span className="text-xl font-thin text-gray-900 dark:text-white">Vally</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-64px)] p-4">
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/category/${category.name.toLowerCase()}`}
                    className="text-lg font-medium text-gray-900 dark:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedCategory === category.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {expandedCategory === category.name && category.subcategories.length > 0 && (
                  <div className="ml-4 space-y-2 border-l pl-4 dark:border-gray-700">
                    {category.subcategories.map((subcat) => (
                      <Link
                        key={subcat}
                        href={`/category/${category.name.toLowerCase()}/${subcat.toLowerCase().replace(" ", "-")}`}
                        className="block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subcat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t mt-6 pt-4 dark:border-gray-700">
            <Link
              href="/account"
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              My Account
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="h-4 w-4" />
              Wishlist
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingBag className="h-4 w-4" />
              Shopping Bag
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Mobile Menu Trigger */}
        <button
          data-mobile-trigger
          className="p-2 -ml-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 md:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Vally Fashions" width={40} height={40} priority />
          
          <span className="hidden text-xl font-medium text-gray-900 dark:text-white sm:inline-block">Vally Fab</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:gap-6">
          {categories.map((category) => (
            <div key={category.name} className="relative group">
              <Link
                href={`/category/${category.name.toLowerCase()}`}
                className="flex items-center gap-1 text-sm font-medium py-2 text-gray-900 dark:text-white"
              >
                {category.name}
                {category.subcategories.length > 0 && (
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                )}
              </Link>

              {category.subcategories.length > 0 && (
                <div className="absolute left-0 top-full z-50 hidden w-48 rounded-md border bg-white dark:bg-gray-900 dark:border-gray-700 p-2 shadow-lg group-hover:block">
                  <div className="grid gap-1">
                    {category.subcategories.map((subcat) => (
                      <Link
                        key={subcat}
                        href={`/category/${category.name.toLowerCase()}/${subcat.toLowerCase().replace(" ", "-")}`}
                        className="block rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        {subcat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full md:w-[200px] lg:w-[300px] h-9 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent"
                autoFocus
              />
              <button
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close search</span>
              </button>
            </div>
          ) : (
            <button
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </button>
          )}

          {/* Wishlist - Hidden on mobile */}
          <Link
            href="/wishlist"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hidden sm:flex"
          >
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Link>

          {/* Shopping Bag */}
          <Link
            href="/cart"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 relative"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white dark:bg-white dark:text-black">
                {cartItemCount}
              </span>
            )}
            <span className="sr-only">Shopping Bag</span>
          </Link>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <Image
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                alt="User"
                width={32}
                height={32}
                className="object-cover"
              />
              <span className="sr-only">User menu</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white dark:bg-gray-900 dark:border-gray-700 p-1 shadow-lg">
                <Link
                  href="/account"
                  className="flex items-center justify-between rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </div>
                  <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200">
                    New
                  </span>
                </Link>
                <Link
                  href="/orders"
                  className="block rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  href="/settings"
                  className="block rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Settings
                </Link>
                <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                <button
                  className="w-full text-left rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  onClick={() => {
                    // Handle logout logic here
                    setUserMenuOpen(false)
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
