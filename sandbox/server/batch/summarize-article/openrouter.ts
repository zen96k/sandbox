import { OpenRouter } from "@openrouter/sdk"
import "dotenv/config"

const openrouterApiKey = process.env.OPENROUTER_API_KEY
const openrouterModel = "openai/gpt-oss-20b:free"
const maxContentCharacterLength = 30_000

if (!openrouterApiKey) {
  throw new Error("OPENROUTER_API_KEY が未設定です")
}

const client = new OpenRouter({ apiKey: openrouterApiKey })

export const summarizeArticle = async ({
  title,
  text
}: {
  title: string
  text: string
}) => {
  const sourceText = text.slice(0, maxContentCharacterLength)
  const prompt = [
    "次の記事を日本語で要約してください。",
    '{"summary": "起承転結が分かる1つの文章"} の形式のJSONオブジェクトのみを返してください。',
    "summaryは起承転結の展開が読み取れる1つの文章にしてください。",
    "起: 記事の背景・課題・導入",
    "承: 本論の展開・詳細",
    "転: 気づき・転換点・比較・補足",
    "結: 結論・まとめ・今後の展望",
    "記事に書かれていない推測は含めないでください。",
    "",
    "出力例:",
    '{"summary": "モノリシックなシステムでは機能追加のたびにデプロイ全体が止まり開発速度が落ちていたが、サービスをドメインごとに分割してマイクロサービス化したところ、各チームが独立してリリースできるようになり平均リリース頻度が週1回から日次に向上し、今後は残る機能の段階的な移行を進めていく予定である"}',
    "",
    `タイトル: ${title}`,
    "",
    sourceText
  ].join("\n")

  const response = await client.chat.send({
    chatRequest: {
      model: openrouterModel,
      messages: [{ role: "user", content: prompt }],
      responseFormat: {
        type: "json_schema",
        jsonSchema: {
          name: "article_summary",
          strict: true,
          schema: {
            type: "object",
            properties: { summary: { type: "string" } },
            required: ["summary"],
            additionalProperties: false
          }
        }
      }
    }
  })

  const content = response.choices[0]?.message?.content
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("OpenRouter の要約が空です")
  }

  const parsed: unknown = JSON.parse(content.trim())
  const summary =
    typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)["summary"]
      : undefined

  if (typeof summary !== "string" || !summary.trim()) {
    throw new Error("OpenRouter の要約が期待する JSON 形式ではありません")
  }

  return summary
}
