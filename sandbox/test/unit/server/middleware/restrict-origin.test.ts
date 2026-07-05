import type { H3Event } from "h3"
import { afterAll, describe, expect, test, vi } from "vitest"

const ALLOWED_ORIGIN = "https://allowed.example.com"

const createEvent = ({ origin }: { origin?: string }) => {
  return {
    path: "/api/article/fetch",
    headers: origin ? { origin } : {}
  } as unknown as H3Event
}

vi.stubGlobal("defineEventHandler", (handler: (event: H3Event) => void) => {
  return handler
})
vi.stubGlobal("getHeader", (event: H3Event, name: string) => {
  return (event as unknown as { headers: Record<string, string> }).headers[name]
})
vi.stubGlobal(
  "createError",
  (input: { statusCode: number; statusMessage?: string }) => {
    return Object.assign(new Error(input.statusMessage), input)
  }
)
vi.stubGlobal("useRuntimeConfig", () => {
  return { allowedOrigin: ALLOWED_ORIGIN }
})

afterAll(() => {
  vi.unstubAllGlobals()
})

const { default: restrictOrigin } =
  await import("../../../../server/middleware/restrict-origin")

describe("restrictOrigin", () => {
  test("Origin ヘッダーがないとき許可する", () => {
    expect(() => {
      return restrictOrigin(createEvent({}))
    }).not.toThrow()
  })

  test("許可オリジンからのリクエストを許可する", () => {
    expect(() => {
      return restrictOrigin(createEvent({ origin: ALLOWED_ORIGIN }))
    }).not.toThrow()
  })

  test("許可外オリジンからのリクエストを拒否する", () => {
    let thrown: unknown

    try {
      restrictOrigin(createEvent({ origin: "https://disallowed.example.com" }))
    } catch (error) {
      thrown = error
    }

    expect(thrown).toMatchObject({ statusCode: 403 })
  })
})
