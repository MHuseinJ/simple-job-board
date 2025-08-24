"use client";

import { useState, useEffect } from "react";



export default function NewJobPage() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("Full-Time");
    const [companyId, setCompanyId] = useState(""); // You'd fetch this from profile

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, location, job_type: jobType, company_id: companyId }),
        });
        const data = await res.json();
        console.log(data);
        window.location.href = "/job";
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="border p-2 w-full" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="border p-2 w-full" />
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="border p-2 w-full" />
            <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="border p-2 w-full">
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract</option>
            </select>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Job</button>
        </form>
    );
}