"use client";

import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import {useAuth} from "@/contexts/AuthContext";

const baseNavigation = [
    { name: "My Jobs", href: "/job", requireAuth: true  },
    { name: "Create Job", href: "/job/create", requireAuth: true }, // mark as protected
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/auth/signout", { method: "POST" });
        router.refresh();
    };

    const navigation = baseNavigation.filter(
        (item) => !item.requireAuth || user
    );

    return (
        <Disclosure as="nav" className="bg-indigo-600">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between items-center">
                            {/* Logo + Navigation */}
                            <div className="flex items-center">
                                <div
                                    onClick={() => router.push("/")}
                                    className="text-white font-bold text-lg cursor-pointer"
                                >
                                    Job Portal
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    {navigation.map((item) => (
                                        <button
                                            key={item.name}
                                            onClick={() => router.push(item.href)}
                                            className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Profile / Login */}
                            <div className="flex items-center">
                                {loading ? (
                                    <span className="text-sm text-white">Loading...</span>
                                ) : user ? (
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none">
                                                <span className="sr-only">Open user menu</span>
                                                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-200 font-semibold text-indigo-700">
                                                    {user.avatarInitial}
                                                </div>
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="py-1">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <span
                                                                className={classNames(
                                                                    active ? "bg-gray-100" : "",
                                                                    "block px-4 py-2 text-sm text-gray-700"
                                                                )}
                                                            >
                                {user.company_name}
                              </span>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={handleLogout}
                                                                className={classNames(
                                                                    active ? "bg-gray-100" : "",
                                                                    "block w-full text-left px-4 py-2 text-sm text-gray-700"
                                                                )}
                                                            >
                                                                Logout
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                ) : (
                                    <button
                                        onClick={() => router.push("/login")}
                                        className="bg-white text-indigo-600 px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-100"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>

                            {/* Mobile menu button */}
                            <div className="flex sm:hidden ml-2">
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-indigo-500 focus:outline-none">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile navigation */}
                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="button"
                                    onClick={() => router.push(item.href)}
                                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-500"
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}