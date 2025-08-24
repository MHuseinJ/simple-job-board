"use client";

import { useState, useEffect, Fragment } from "react";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const jobTypes = ["Full-Time", "Part-Time", "Contract"];

export default function JobFormPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);

    // Use `job_type` to match your DB/API
    const [job, setJob] = useState({
        id: "",
        title: "",
        location: "",
        description: "",
        job_type: jobTypes[0],
    });

    // Prefill form from query params
    useEffect(() => {
        const id = searchParams.get("id") || "";
        const title = searchParams.get("title") || "";
        const location = searchParams.get("location") || "";
        const description = searchParams.get("description") || "";
        const job_type = searchParams.get("type") || jobTypes[0];

        if (id || title || location || description || job_type) {
            setJob({ id, title, location, description, job_type });
        }
    }, [searchParams]);

    // For inputs/textarea (event-based)
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setJob((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // For Listbox (value-based)
    const handleTypeChange = (value: string) => {
        setJob((prev) => ({ ...prev, job_type: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const method = job.id ? "PUT" : "POST";
        const url = job.id ? `/api/jobs/${job.id}` : "/api/jobs";

        // If your API expects `job_type`, this matches exactly.
        const {id, ...jobWithoutId} = job;
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jobWithoutId),
        });

        setLoading(false);

        if (res.ok) {
            setOpen(false);
            router.push("/job");
        } else {
            alert("Failed to save job");
        }
    };

    return (
        <Dialog open={open} onClose={() => router.push("/job")} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                    <Dialog.Title className="text-xl font-bold mb-4">
                        {job.id ? "Edit Job" : "Create Job"}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={job.title}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={job.location}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>

                        {/* Job Type (Headless UI Listbox) */}
                        <div>
                            <label className="block text-sm font-medium">Job Type</label>
                            <Listbox value={job.job_type} onChange={handleTypeChange}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                        <span className="block truncate">{job.job_type}</span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                                    </Listbox.Button>
                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {jobTypes.map((type) => (
                                                <Listbox.Option
                                                    key={type}
                                                    value={type}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                            active ? "bg-indigo-600 text-white" : "text-gray-900"
                                                        }`
                                                    }
                                                >
                                                    {({ selected }) => (
                                                        <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                {type}
                              </span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
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

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium">Description</label>
                            <textarea
                                name="description"
                                value={job.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => router.push("/job")}
                                className="rounded-md bg-gray-200 px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-md bg-blue-600 px-4 py-2 text-white"
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}