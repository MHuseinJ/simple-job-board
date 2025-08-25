"use client";

import { useEffect, useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type Job = {
    id: string;
    title: string;
    location: string;
    job_type: string;
    description: string;
    company_name?: string; // if using job_company view
    profiles?: { company_name?: string }; // if still using join
};

const jobTypes = ["All", "Full-Time", "Part-Time", "Contract"]; // 👈 includes All

export default function JobListPage() {
    const {user} = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [jobType, setJobType] = useState<string>("All"); // 👈 filter state

    useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: "10",
                    search,
                    job_type: jobType, // 👈 pass to API
                });
                if (user?.id) params.set("id_company", user.id);
                const res = await fetch(`/api/jobs?${params.toString()}`, {
                    signal: controller.signal,
                });
                const json = await res.json();
                // If your API returns just an array, setJobs(json); setTotalPages(???)
                setJobs(json.jobs ?? []);
                setTotalPages(json.totalPages ?? 1);
            } catch (e: unknown) {
                if (e instanceof DOMException && e.name === "AbortError") {
                    // ignore fetch abort
                } else {
                    console.error(e);
                }
            } finally {
                setLoading(false);
            }
        };
        load();
        return () => controller.abort();
    }, [page, search, jobType]);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this job?")) return;
        await fetch(`/api/jobs/${id}`, { method: "DELETE" });
        setJobs((prev) => prev.filter((j) => j.id !== id));
    };

    const companyOf = (job: Job) =>
        job.company_name ?? job.profiles?.company_name ?? "Unknown";

    return (
        <main className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Jobs</h1>

            {/* Controls row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {/* Search */}
                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    placeholder="Search Jobs Location"
                    className="w-full sm:flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-indigo-200"
                />

                {/* Job Type Filter (Headless UI) */}
                <div className="w-full sm:w-56">
                    <Listbox value={jobType} onChange={(v) => { setJobType(v); setPage(1); }}>
                        <div className="relative">
                            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                <span className="block truncate">{jobType}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
                            </Listbox.Button>
                            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {jobTypes.map((t) => (
                                        <Listbox.Option
                                            key={t}
                                            value={t}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                                                }`
                                            }
                                        >
                                            {({ selected }) => (
                                                <>
                          <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                            {t}
                          </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                              <CheckIcon className="h-5 w-5" />
                            </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <ul className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <li key={i} className="border rounded p-4 animate-pulse">
                            <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                            <div className="h-3 w-24 bg-gray-100 rounded" />
                        </li>
                    ))}
                </ul>
            ) : jobs.length === 0 ? (
                <p className="text-gray-500">No jobs found.</p>
            ) : (
                <ul className="space-y-3">
                    {jobs.map((job) => (
                        <li key={job.id} className="border rounded p-4 flex justify-between items-center">
                            <div>
                                <a href={`/job/${job.id}`} className="text-indigo-600 font-semibold hover:underline">
                                    {job.title}
                                </a>
                                <p className="text-sm text-gray-600">
                                    {companyOf(job)} — {job.location} · <span className="font-medium">{job.job_type}</span>
                                </p>
                            </div>

                            {/* Optional: gate by auth if you have AuthContext */}
                            {/* {user && ( ... edit/delete ... )} */}
                            { user ? (<div className="hidden sm:flex gap-2">
                                <a
                                    href={`/job/create?id=${job.id}&title=${encodeURIComponent(job.title)}&location=${encodeURIComponent(
                                        job.location
                                    )}&description=${encodeURIComponent(job.description)}&type=${encodeURIComponent(job.job_type)}`}
                                    className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Edit
                                </a>
                                <button
                                    onClick={() => handleDelete(job.id)}
                                    className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>) : null }
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
                <span className="px-2 py-1">{page} / {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </main>
    );
}