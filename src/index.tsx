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
}

export const name = 'zzz-wiki'
export const inject = {
  require: ['puppeteer', 'database'],
}

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export async function apply(ctx: Context) {
  const baseUrl = 'https://miyabi-cdn.hanasaki.tech'

  ctx.model.extend('zzz_wiki', {
    id: 'unsigned',
    name: 'string',
    aliasName: 'string',
    icon: 'string',
  })

  ctx.on('ready', async () => {
    try {
      const wiki = new ZZZWIKIService(ctx)
      await wiki.upsertData()
    } catch (error) {
      ctx.logger.error('Database initialization error:', error)
    }
  })

  // TODO: 创建数据库
  //从本地加载翻译json，若本地没有则从网络加载

  ctx
    .command('zzz图鉴 查看zzz图鉴')
    .option('list', '-l 查看可用图鉴列表')
    .option('update', '-u 更新插件数据')
    .option('card', '-c <value:string> 查看图鉴卡片')
    .action(async ({ options }, arg) => {
      if (arg) {
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

      if (options.list) {
        const list = Object.keys(zhToEn)
        return '可用图鉴列表：\n' + list.join('\n')
      }

      if (options.card) {
        if (!Translator.has(options.card)) {
          return '图鉴卡片不存在'
        }
        const info = await ctx.database.get('zzz_wiki', {
          aliasName: options.card,
        })
        return (
          <img
            src={`${baseUrl}/images/${Translator.translate(options.card)}/${info[0].id}.png`}
          />
        )
      }
    })
}
