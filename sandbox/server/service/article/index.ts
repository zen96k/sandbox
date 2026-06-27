import type { ArticleType, PublisherType, ReadOptionType } from "../../repository/article"

export type ArticleRepositoryType = {
  readArticles(option?: ReadOptionType): Promise<ArticleType[]>
  countArticles(option?: ReadOptionType): Promise<number>
  readPublishers(): Promise<PublisherType[]>
}

export const generateArticleService = ({
  repository
}: {
  repository: ArticleRepositoryType
}) => {
  return {
    readArticles: async (option?: ReadOptionType): Promise<ArticleType[]> => {
      return await repository.readArticles(option)
    },

    countArticles: async (option?: ReadOptionType): Promise<number> => {
      return await repository.countArticles(option)
    },

    readPublishers: async (): Promise<PublisherType[]> => {
      return await repository.readPublishers()
    }
  }
}
