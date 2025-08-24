"use client";

import { useEffect, useState } from "react";
import { Job } from "@/lib/model/data";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [job, setJob] = useState<Job | null>(null);
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const unwrapped = await params;   // ✅ unwrap the promise
            setId(unwrapped.id);
        })();
    }, [params]);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/jobs/${id}`)
            .then((res) => res.json())
            .then(setJob);
    }, [id]);

    if (!job) return <p>Loading...</p>;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-gray-600">{job.profiles.full_name} — {job.location}</p>
            <p className="mt-4">{job.description}</p>
        </main>
    );
}
