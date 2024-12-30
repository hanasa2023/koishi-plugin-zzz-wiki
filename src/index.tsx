import {} from 'koishi-plugin-puppeteer'
import {} from '@koishijs/plugin-database-sqlite'
import { Context, Schema } from 'koishi'
import { ZZZWikiData } from './type'
import { ZZZWIKIService } from './service'
import { Translator, zhToEn } from './utils'

declare module 'koishi' {
  interface Tables {
    zzz_wiki: ZZZWikiData
  }

  interface Context {
    zzzWiki: ZZZWIKIService
  }
}

export const name = 'zzz-wiki'
export const inject = {
  required: ['database', 'puppeteer'],
}

export interface Config {
  apiUrl: string
}

// TODO: 更换API URL
export const Config: Schema<Config> = Schema.object({
  apiUrl: Schema.string()
    .default('http://localhost:3000')
    .description('API接口url'),
})

export async function apply(ctx: Context) {
  const baseUrl = 'https://miyabi-cdn.hanasaki.tech'

  ctx.zzzWiki = new ZZZWIKIService(ctx)

  ctx.model.extend(
    'zzz_wiki',
    {
      contentId: 'unsigned',
      name: 'string',
      aliasName: 'string',
      icon: 'string',
      type: 'string',
    },
    {
      primary: 'contentId',
      autoInc: false,
    },
  )

  ctx.on('ready', async () => {
    try {
      await ctx.zzzWiki.upsertData()
    } catch (error) {
      ctx.logger.error('Database initialization error:', error)
    }
  })

  ctx
    .command('zzzWiki [name:string] 查看图鉴')
    .option('list', '-l [value:string] 查看可用图鉴列表', { value: 'all' })
    .option('card', '-c <value:string> 查看图鉴卡片')
    .option('update', '-u 更新插件数据')
    .action(async ({ options }, arg) => {
      if (arg) {
        const info = await ctx.zzzWiki.searchWikiDataByName(arg)
        const url = `${ctx.config.apiUrl}/${Translator.translate(info[0].type)}/${info[0].contentId}`
        console.info(url)
        const img = await ctx.zzzWiki.getCardByUrl(url)
        return img
      }

      if (options.list) {
        if (options.list === 'all') {
          const iList = Object.keys(zhToEn)
          return '可用图鉴列表：\n' + iList.join('\n')
        } else {
          if (Translator.has(arg)) {
            return (
              <img
                src={`${baseUrl}/images/${Translator.translate(arg)}/total.png`}
              />
            )
          } else {
            return '图鉴不存在'
          }
        }
      }

      if (options.card) {
        const info = await ctx.zzzWiki.searchWikiDataByName(options.card)
        if (!info.length) {
          return '图鉴卡片不存在'
        }
        const url = `${baseUrl}/images/${Translator.translate(info[0].type)}/${
          info[0].contentId
        }.png`
        return <img src={url} />
      }

      if (options.update) {
        await ctx.zzzWiki.upsertData()
      }
    })
}
