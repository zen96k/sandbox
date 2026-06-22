import { articleRepository } from "../../repository/article.repository"
import {
  generateArticleService,
  type GetArticlesOption
} from "../../service/article.service"

const articleService = generateArticleService(articleRepository)

export default defineEventHandler(async (event) => {
  const body = await readBody<GetArticlesOption>(event)

  try {
    const [articles, total, publishers] = await Promise.all([
      articleService.readArticles(body),
      articleService.countArticles({ where: body?.where }),
      articleService.readPublishers()
    ])

    return { articles, total, publishers }
  } catch {
    throw createError({ statusCode: 500, message: "記事の取得に失敗しました" })
  }
})
