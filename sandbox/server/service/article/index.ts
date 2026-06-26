import type { Article, Publisher, ReadOption } from "../../repository/article"
import type { WhereCondition } from "../../repository/article/query-builder"

export type ArticleRepository = {
  readArticles(option?: ReadOption): Promise<Article[]>
  countArticles(option?: { where?: WhereCondition[] }): Promise<number>
  readPublishers(): Promise<Publisher[]>
}

export const generateArticleService = ({
  repository
}: {
  repository: ArticleRepository
}) => {
  return {
    readArticles: async (option?: ReadOption): Promise<Article[]> => {
      return await repository.readArticles(option)
    },

    countArticles: async ({
      where
    }: { where?: WhereCondition[] } = {}): Promise<number> => {
      return await repository.countArticles({ where })
    },

    readPublishers: async (): Promise<Publisher[]> => {
      return await repository.readPublishers()
    }
  }
}
