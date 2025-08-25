export type Job = {
    id: string;
    title: string;
    profiles: Profile;
    location: string;
    description: string;
    job_type: string;
    company_name: string;
}

export type Profile = {
    username: string;
    company_name: string;
}