import JobFormClient from "./JobFormClient";

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams: Promise<Record<string, string | undefined>>;
}) {
    const sp = await searchParams;
    return <JobFormClient initial={sp} />;
}