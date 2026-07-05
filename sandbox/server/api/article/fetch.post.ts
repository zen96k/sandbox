import { db } from "../../db"
import { generateArticleRepository } from "../../repository/article"
import { generateArticleService } from "../../service/article"
import { requestBodySchema } from "./schema/request-body-schema"

const articleService = generateArticleService({
  repository: generateArticleRepository({ db })
})

export default defineEventHandler(async (event) => {
  const requestBody = await readValidatedBody(event, requestBodySchema.parse)

  try {
    const [articles, total, publishers] = await Promise.all([
      articleService.readArticlesByPublisherId(requestBody),
      articleService.countArticlesByPublisherId({
        publisherId: requestBody.publisherId
      }),
      articleService.readPublishers()
    ])

    return { articles, total, publishers }
  } catch (error) {
    throw createError({ statusCode: 500, cause: error })
  }
})
