export type Job = {
    id: string;
    title: string;
    profiles: Profile;
    location: string;
    description: string;
    job_type: string;
}

export type Profile = {
    username: string;
    full_name: string;
}