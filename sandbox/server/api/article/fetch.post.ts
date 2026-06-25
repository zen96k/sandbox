import { articleRepository } from "../../repository/article.repository"
import { generateArticleService } from "../../service/article/service"
import { bodySchema } from "./bodySchema"

const articleService = generateArticleService(articleRepository)

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, bodySchema.parse)

    const [articles, total, publishers] = await Promise.all([
      articleService.readArticles(body),
      articleService.countArticles({ where: body?.where }),
      articleService.readPublishers()
    ])

    return { articles, total, publishers }
  } catch (error) {
    if (isError(error) && error.statusCode === 422) {
      throw createError({
        statusCode: 422,
        message: "リクエストの形式が正しくありません"
      })
    }
    throw createError({
      statusCode: 500,
      message: "記事を取得できませんでした",
      cause: error
    })
  }
})
