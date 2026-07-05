export const useArticles = async ({
  articleLimit
}: {
  articleLimit: number
}) => {
  const route = useRoute()
  const router = useRouter()

  const _page = ref(Number(route.query.page) || 1)

  watch(
    () => {
      return route.query.page
    },
    (value) => {
      _page.value = Number(value) || 1
    }
  )

  const page = computed({
    get: () => {
      return _page.value
    },
    set: (value: number) => {
      _page.value = value
      router.push({
        query: {
          page: value === 1 ? undefined : value,
          publisher: (route.query.publisher as string) || undefined
        }
      })
    }
  })

  const selectedPublisher = computed({
    get: () => {
      const value = Number(route.query.publisher)
      return route.query.publisher && !Number.isNaN(value) ? value : null
    },
    set: (value: number | null) => {
      _page.value = 1
      router.push({ query: { publisher: value ?? undefined } })
    }
  })

  const { data, status, error } = await useFetch("/api/article/fetch", {
    method: "POST",
    body: computed(() => {
      return {
        publisherId: selectedPublisher.value ?? undefined,
        limit: articleLimit,
        offset: (page.value - 1) * articleLimit
      }
    })
  })

  const articles = computed(() => {
    return data.value?.articles ?? []
  })
  const total = computed(() => {
    return data.value?.total ?? 0
  })
  const publishers = computed(() => {
    return data.value?.publishers ?? []
  })

  return { selectedPublisher, page, total, articles, publishers, status, error }
}
