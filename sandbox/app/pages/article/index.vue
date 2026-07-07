<template>
  <UContainer class="py-8">
    <h1 class="my-4 text-2xl font-bold">記事一覧</h1>
    <ArticlePublisherFilter
      v-model="selectedPublisher"
      :publishers="publishers"
    />
    <div class="my-8 flex justify-center">
      <UPagination
        v-model:page="page"
        :items-per-page="articleLimit"
        :total="total"
      />
    </div>
    <div
      v-if="status === 'pending'"
      class="flex justify-center py-12"
    >
      <UIcon
        class="animate-spin text-4xl text-gray-400"
        name="i-lucide-loader-circle"
      />
    </div>
    <div
      v-else-if="status === 'error'"
      class="py-12 text-center text-gray-500"
    >
      記事を取得できませんでした
      <template v-if="error?.statusMessage">
        ({{ error.statusMessage }})
      </template>
    </div>
    <div
      v-else-if="!articles.length"
      class="py-12 text-center text-gray-500"
    >
      記事がありません
    </div>
    <template v-else>
      <UPageGrid as="ul">
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
        />
      </UPageGrid>
      <div class="my-8 flex justify-center">
        <UPagination
          v-model:page="page"
          :items-per-page="articleLimit"
          :total="total"
        />
      </div>
    </template>
  </UContainer>
</template>

<script setup lang="ts">
  const requestUrl = useRequestURL()

  useSeoMeta({
    title: "Sandbox | 記事一覧",
    description: "Qiita/Zennの個人用RSSリーダー",
    ogTitle: "Sandbox | 記事一覧",
    ogDescription: "Qiita/Zennの個人用RSSリーダー",
    ogType: "website",
    ogUrl: `${requestUrl.origin}/article`,
    ogImage: `https://nuxt.com/assets/design-kit/logo-green-white.png`,
    twitterCard: "summary_large_image"
  })

  const articleLimit = 15

  const {
    selectedPublisher,
    page,
    total,
    articles,
    publishers,
    status,
    error
  } = await useArticles({ articleLimit })
</script>
