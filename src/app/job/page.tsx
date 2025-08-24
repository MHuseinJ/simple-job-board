"use client";

import { useEffect, useState } from "react";
import { Job } from '@/lib/model/data'

export default function JobListPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchJobs() {
        try {
            const res = await fetch("/api/jobs");
            if (!res.ok) throw new Error("Failed to fetch jobs");
            const data = await res.json();
            setJobs(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function deleteJobs(id: string) {
        try {
            const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete jobs");
            await fetchJobs();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function redirectNewJob() {
        window.location.href = "/job/create";
    }

    useEffect(() => {
        fetchJobs().then(() => {
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading jobs...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="p-4">
            <button onClick={() => redirectNewJob()} className="rounded-md border px-3 py-2">
                Create New Job
            </button>
            <h1 className="text-2xl font-bold mb-4">Jobs</h1>
            <ul className="space-y-2">
                {jobs.map((job) => (
                    <li key={job.id} className="border p-2">
                        <a href={`/job/${job.id}`} className="text-blue-600">
                            {job.title} — {job.profiles.full_name}
                        </a>
                        <button onClick={() => deleteJobs(`${job.id}`)} className="rounded-md border px-3 py-2">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}