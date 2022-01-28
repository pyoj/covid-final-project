import React from "react";
import { Link, Head } from "@inertiajs/inertia-react";

export default function Welcome(props) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0 px-48">
                <div className="flex-1 sm:px-10 lg:px-14">
                    {props.auth.user ? (
                        <>
                            <Link
                                href={route("dashboard")}
                                className="bg-red-500 text-white text-center px-8 py-2 mt-4 rounded"
                            >
                                Redirect to dashboard
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="py-6">
                                <h1>
                                    Register to get COVID-19 statistics for any
                                    country
                                </h1>
                            </div>
                            <Link
                                href={route("login")}
                                className="bg-red-500 text-white text-center px-8 py-2 mt-4 rounded mx-2"
                            >
                                Log In
                            </Link>
                            <Link
                                href={route("register")}
                                className="bg-red-500 text-white text-center px-8 py-2 mt-4 rounded mx-2"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
                <img src="/assets/virus.svg" />
            </div>
        </>
    );
}
