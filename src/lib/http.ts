import { NextResponse } from "next/server";

export type ApiError = {
    error: string;      // human-readable
    code?: string;      // machine-readable (optional)
    details?: unknown;  // extra info (optional)
};

export function ok<T>(data: T, init?: number | ResponseInit) {
    return NextResponse.json(data, init);
}

export function fail(message: string, init?: number | ResponseInit, extra?: Omit<ApiError, "error">) {
    const status = typeof init === "number" ? init : (init as ResponseInit | undefined)?.status ?? 400;
    return NextResponse.json<ApiError>({ error: message, ...extra }, { status, ...(typeof init === "object" ? init : {}) });
}