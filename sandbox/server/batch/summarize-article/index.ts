import { setTimeout as sleep } from "timers/promises"
import { db } from "../../db"
import { summarizeArticle } from "./openrouter"
import { generateArticleSummaryRepository } from "./repository"
import { generateArticleSummaryService } from "./service"

const articleLimit = 50
const delayBetweenRequestsMilliSeconds = 5_000

const articleSummaryService = generateArticleSummaryService({
  repository: generateArticleSummaryRepository({ db }),
  summarizeArticle
})

const pendingArticles = await articleSummaryService.readPendingArticles({
  limit: articleLimit
})

if (!pendingArticles.length) {
  console.log("要約対象の記事はありません")
} else {
  console.log(`${pendingArticles.length} 件の記事を要約します`)
}

for (const [index, article] of pendingArticles.entries()) {
  if (index > 0) {
    await sleep(delayBetweenRequestsMilliSeconds)
  }
  try {
    await articleSummaryService.summarizeArticle({ article })
  } catch (error) {
    console.error(`${article.title} の要約に失敗しました:`, error)
    await articleSummaryService.updateArticleSummaryStatusFailed({
      articleId: article.id,
      error
    })
  }
}
