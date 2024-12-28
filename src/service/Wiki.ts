import { Context } from 'koishi'
import { ZZZWikiResponse } from '../type'

interface ApiResponse {
  data: {
    list: Array<{
      children: ZZZWikiResponse[]
    }>
  }
}

export class ZZZWIKIService {
  private readonly apiUrl = 'https://api-takumi-static.mihoyo.com'

  constructor(private ctx: Context) {}

  async upsertData() {
    this.ctx.inject(['database'], async (ctx) => {
      ctx.logger.info('更新数据……')
      const response: ApiResponse = await this.ctx.http.get(
        `${this.apiUrl}/common/blackboard/zzz_wiki/v1/home/content/list?app_sn=zzz_wiki&channel_id=2`,
        {
          responseType: 'json',
        }
      )

      for (const c of response.data.list[0].children) {
        await ctx.database.upsert(
          'zzz_wiki',
          c.list.map((item) => {
            return {
              contentId: item.content_id,
              name: item.title,
              aliasName: item.alias_name,
              icon: item.icon,
              type: c.name
            }
          })
        )
      }
    })
  }
}
