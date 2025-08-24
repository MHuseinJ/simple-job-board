"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { Job } from "@/lib/model/data";

export default function JobListPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [deleteJob, setDeleteJob] = useState<Job | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/jobs?page=${page}&location=${search}`);
                const data = await res.json();
                setJobs(data.jobs);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [page, search]);

    const handleDeleteConfirm = async () => {
        if (!deleteJob) return;
        await fetch(`/api/jobs/${deleteJob.id}`, { method: "DELETE" });
        setJobs((prev) => prev.filter((job) => job.id !== deleteJob.id));
        setDeleteJob(null);
    };

    const handleEdit = (job: Job) => {
        router.push(
            `/job/create?id=${job.id}&title=${encodeURIComponent(
                job.title
            )}&company=${encodeURIComponent(job.profiles.full_name)}&location=${encodeURIComponent(
                job.location
            )}&description=${encodeURIComponent(job.description)}&type=${encodeURIComponent(job.job_type)}`
        );
    };

    const handleDetail = (job: Job) => {
        router.push(
            `/job/${job.id}`
        );
    };

    return (
        <main className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Jobs</h1>

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search Location jobs..."
                    value={search}
                    onChange={(e) => {
                        setPage(1);
                        setSearch(e.target.value);
                    }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-blue-300"
                />
            </div>

            {/* Job List */}
            {loading ? (
                <ul className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <li
                            key={i}
                            className="flex justify-between items-center border rounded-lg p-4 shadow-sm animate-pulse"
                        >
                            <div>
                                <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>
                                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-8 w-16 bg-gray-300 rounded"></div>
                        </li>
                    ))}
                </ul>
            ) : !jobs ? (
                <p>No jobs found.</p>
            ) : (
                <ul className="space-y-3">
                    {jobs.map((job) => (
                        <li
                            key={job.id}
                            className="flex justify-between items-center border rounded-lg p-4 shadow-sm"
                        >
                            <div>
                                <p className="text-lg font-semibold">{job.title}</p>
                                <p className="text-sm text-gray-600">
                                    {job.profiles.full_name} — {job.location}
                                </p>
                            </div>

                            {/* HeadlessUI Menu for actions */}
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button className="inline-flex justify-center w-full rounded-md border px-3 py-1 bg-white text-sm font-medium shadow-sm hover:bg-gray-50">
                                        Actions
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
                                    <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                        <div className="px-1 py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => handleDetail(job)}
                                                        className={`${
                                                            active ? "bg-blue-100" : ""
                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                    >
                                                        Detail
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => handleEdit(job)}
                                                        className={`${
                                                            active ? "bg-blue-100" : ""
                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => setDeleteJob(job)}
                                                        className={`${
                                                            active ? "bg-red-100" : ""
                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-600`}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </li>
                    ))}
                </ul>
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="px-2 py-1">
          {page} / {totalPages}
        </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* HeadlessUI Dialog for delete confirmation */}
            <Transition.Root show={!!deleteJob} as={Fragment}>
                <Dialog as="div" className="relative z-20" onClose={() => setDeleteJob(null)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
                                <Dialog.Title className="text-lg font-bold">
                                    Delete Job
                                </Dialog.Title>
                                <p className="mt-2 text-sm text-gray-600">
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold">{deleteJob?.title}</span>?
                                </p>
                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => setDeleteJob(null)}
                                        className="px-3 py-1 rounded border"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteConfirm}
                                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </main>
    );
}