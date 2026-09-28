import { NextResponse } from "next/server"

export function json<T>(data: T, options?: { status?: number }) {
  return NextResponse.json({ ok: true, data }, { status: options?.status || 200 })
}

export function badRequest(message: string) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "BAD_REQUEST",
        message,
      },
    },
    { status: 400 },
  )
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        message,
      },
    },
    { status: 401 },
  )
}

export function forbidden(message = "Access denied") {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "FORBIDDEN",
        message,
      },
    },
    { status: 403 },
  )
}

export function notFound(message = "Resource not found") {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "NOT_FOUND",
        message,
      },
    },
    { status: 404 },
  )
}

export function serverError(err: unknown, message = "Internal server error") {
  console.error("[v0] Server error:", err)
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message,
      },
    },
    { status: 500 },
  )
}
