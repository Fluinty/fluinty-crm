'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, BarChart3, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <aside className="flex h-screen w-64 flex-col overflow-y-hidden bg-gray-900 duration-300 ease-linear">
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
                <Link href="/" className="text-2xl font-bold text-white mt-4">
                    Fluinty CRM
                </Link>
            </div>

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-400">
                            MENU
                        </h3>

                        <ul className="mb-6 flex flex-col gap-1.5">
                            <li>
                                <Link
                                    href="/"
                                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-gray-200 duration-300 ease-in-out hover:bg-gray-700 ${pathname === '/' ? 'bg-gray-700' : ''
                                        }`}
                                >
                                    <LayoutDashboard className="h-5 w-5" />
                                    Prospekci
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/clients"
                                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-gray-200 duration-300 ease-in-out hover:bg-gray-700 ${pathname === '/clients' ? 'bg-gray-700' : ''
                                        }`}
                                >
                                    <Users className="h-5 w-5" />
                                    Klienci
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/forecast"
                                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-gray-200 duration-300 ease-in-out hover:bg-gray-700 ${pathname === '/forecast' ? 'bg-gray-700' : ''
                                        }`}
                                >
                                    <BarChart3 className="h-5 w-5" />
                                    Prognoza
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-400">
                            KONTO
                        </h3>
                        <ul className="mb-6 flex flex-col gap-1.5">
                            <li>
                                <button
                                    onClick={handleSignOut}
                                    className="group relative flex w-full items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-gray-200 duration-300 ease-in-out hover:bg-gray-700"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Wyloguj się
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </aside>
    )
}
