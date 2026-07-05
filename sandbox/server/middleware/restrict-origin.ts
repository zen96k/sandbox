export default defineEventHandler((event) => {
  const { allowedOrigin } = useRuntimeConfig(event)

  if (allowedOrigin && event.path.startsWith("/api")) {
    const origin = getHeader(event, "origin")

    if (origin && origin !== allowedOrigin) {
      throw createError({ statusCode: 403, statusMessage: "Forbidden" })
    }
  }
})
