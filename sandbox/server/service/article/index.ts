import type {
  ArticleQueryOptionType,
  ArticleType,
  PublisherType
} from "../../repository/article"

export type ArticleRepositoryType = {
  readArticles(option?: ArticleQueryOptionType): Promise<ArticleType[]>
  countArticles(
    option?: Pick<ArticleQueryOptionType, "publisherId">
  ): Promise<number>
  readPublishers(): Promise<PublisherType[]>
}

export const generateArticleService = ({
  repository
}: {
  repository: ArticleRepositoryType
}) => {
  return {
    readArticles: async (
      option?: ArticleQueryOptionType
    ): Promise<ArticleType[]> => {
      return await repository.readArticles(option)
    },

    countArticles: async ({
      publisherId
    }: Pick<ArticleQueryOptionType, "publisherId"> = {}): Promise<number> => {
      return await repository.countArticles({ publisherId })
    },

    readPublishers: async (): Promise<PublisherType[]> => {
      return await repository.readPublishers()
    }
  }
}
