import { Context } from 'koishi'
import { ZZZWikiData, ZZZWikiResponse } from '../type'
// import satori from 'satori'

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

  /**
   * 从wiki接口获取并更新图鉴数据
   *
   * @throws {Error} 当API请求失败或数据解析出错时抛出异常
   * @returns {Promise<void>}
   */
  async upsertData(): Promise<void> {
    this.ctx.logger.info('更新数据……')
    const response: ApiResponse = await this.ctx.http.get(
      `${this.apiUrl}/common/blackboard/zzz_wiki/v1/home/content/list?app_sn=zzz_wiki&channel_id=2`,
      {
        responseType: 'json',
      },
    )

    for (const c of response.data.list[0].children) {
      await this.ctx.database.upsert(
        'zzz_wiki',
        c.list.map((item) => {
          return {
            contentId: item.content_id,
            name: item.title,
            aliasName: item.alias_name,
            icon: item.icon,
            type: c.name,
          }
        }),
      )
    }
  }

  /**
   * 根据别名获取单个图鉴数据
   * @param aliasName 别名
   * @returns 图鉴数据或undefined
   */
  async getWikiDataByAlias(
    aliasName: string,
  ): Promise<ZZZWikiData | undefined> {
    const results = await this.ctx.database.get('zzz_wiki', { aliasName })
    return results[0]
  }

  /**
   * 根据类型获取图鉴数据列表
   * @param type 类型
   * @returns 图鉴数据数组
   */
  async getWikiDataByType(type: string): Promise<ZZZWikiData[]> {
    return await this.ctx.database.get('zzz_wiki', { type })
  }

  /**
   * 根据名称模糊搜索图鉴数据
   * @param name 名称关键词
   * @returns 图鉴数据数组
   */
  async searchWikiDataByName(name: string): Promise<ZZZWikiData[]> {
    // 假设数据库支持like查询
    return await this.ctx.database.get('zzz_wiki', {
      name: { $regex: name },
    })
  }

  async getCardByUrl(url: string) {
    const page = await this.ctx.puppeteer.page()

    // 设置视窗大小
    await page.setViewport({
      width: 1920,
      height: 1080,
    })

    // 访问页面
    await page.goto(url, {
      waitUntil: 'networkidle0', // 等待网络请求完成
    })

    // 等待目标元素加载完成
    await page.waitForSelector('#card')

    // 获取元素
    const element = await page.$('#card')

    if (!element) {
      return '未找到目标元素'
    }

    // 截取指定元素
    const screenshot = await element.screenshot({
      type: 'png',
      encoding: 'binary',
      omitBackground: true,
      path: './miyabi.png',
    })

    // 关闭页面
    await page.close()

    // 返回图片
    return (
      <img
        src={`data:image/png;base64,${Buffer.from(screenshot).toString('base64')}`}
      />
    )
  }
}
