import { NextResponse } from "next/server";

export type ApiError = {
    error: string;      // human-readable
    code?: string;      // optional machine code
    details?: unknown;  // optional extra info
};

function toInit(init?: number | ResponseInit): ResponseInit | undefined {
    if (typeof init === "number") return { status: init };
    return init;
}

export function ok<T>(data: T, init?: number | ResponseInit) {
    return NextResponse.json<T>(data, toInit(init));
}

export function fail(
    message: string,
    init?: number | ResponseInit,
    extra?: Omit<ApiError, "error">
) {
    const base = toInit(init) ?? {};
    const status = base.status ?? 400;
    return NextResponse.json<ApiError>(
        { error: message, ...(extra ?? {}) },
        { ...base, status }
    );
}