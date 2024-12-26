import {} from 'koishi-plugin-puppeteer'
import {} from '@koishijs/plugin-database-sqlite'
import { Context, Schema } from 'koishi'

export const name = 'zzz-wiki'
export const inject = {
  require: ['puppeteer', 'database'],
}

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export async function apply(ctx: Context) {
  const baseUrl = 'https://miyabi-cdn.hanasaki.tech'
  const translate = {
    代理人: 'agent',
    音擎: 'weapon',
    邦布: 'bangbu',
    驱动盘: 'cd',
    敌人: 'enemy',
    材料: 'material',
    地图: 'map',
    委托: 'assign',
    成就: 'achievement',
    街道: 'street',
    录像带: 'record',
  }

  // TODO: 创建数据库
  //从本地加载翻译json，若本地没有则从网络加载
  let translateJson: { [x: string]: { [x: string]: { [x: string]: any } } }
  ctx.on('ready', async () => {
    if (!translateJson) {
      ctx.logger.info('本地没有翻译json，从网络下载')
      translateJson = await (
        await fetch(`${baseUrl}/data/name-id-mapping.json`)
      ).json()
    }
  })

  ctx
    .command('zzz图鉴 [name:string] 查看zzz图鉴')
    .option('list', '-l 查看可用图鉴列表')
    .option('update', '-u 更新插件数据')
    .option('card', '-c <value:string> 查看图鉴卡片')
    .action(({ options }, arg) => {
      if (arg) {
        if (translate[arg]) {
          return <img src={`${baseUrl}/images/${translate[arg]}/total.png`} />
        } else {
          return '图鉴不存在'
        }
      }

      if (options.list) {
        const list = Object.keys(translate)
        return '可用图鉴列表：\n' + list.join('\n')
      }

      // TODO: 重写card
      if (options.card) {
        ctx.logger.info(translateJson)
        return (
          <img
            src={`${baseUrl}/images/agent/${
              translateJson['aliasToId']['agent'][options.card]
            }.png`}
          />
        )
      }
    })
}
