"use client";

import { useEffect, useState, Fragment } from "react";
import { useParams, useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { Job } from "@/lib/model/data"
import {useAuth} from "@/contexts/AuthContext";


export default function JobDetailPage() {
    const {user} = useAuth();
    const { id } = useParams();
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJob() {
            try {
                const res = await fetch(`/api/jobs/${id}`);
                const data = await res.json();
                setJob(data);
            } catch (err) {
                console.error("Failed to load job", err);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchJob();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">Job not found</p>
            </div>
        );
    }

    return (
        <Transition.Root show={true} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => router.push("/")}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white px-6 pt-5 pb-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900">
                                    {job.title}
                                </Dialog.Title>
                                <div className="mt-3">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Company:</span>{" "}
                                        {job.company_name}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Location:</span>{" "}
                                        {job.location}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Job Type:</span>{" "}
                                        {job.job_type || "-"}
                                    </p>
                                    <div className="mt-4 text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                                        {job.description}
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    {user ? (<button
                                        onClick={() =>
                                            router.push(
                                                `/job/create?id=${job.id}&title=${encodeURIComponent(
                                                    job.title
                                                )}&company=${encodeURIComponent(job.company_name)}&location=${encodeURIComponent(
                                                    job.location
                                                )}&description=${encodeURIComponent(job.description)}&type=${encodeURIComponent(job.job_type)}`
                                            )
                                        }
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                                    >
                                        Edit
                                    </button>) : null }
                                    <button
                                        onClick={() => router.back()}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}