// 中文到英文的映射
export const zhToEn = {
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
} as const

// 英文到中文的映射
export const enToZh = Object.entries(zhToEn).reduce(
  (acc, [zh, en]) => {
    acc[en] = zh
    return acc
  },
  {} as Record<string, string>,
)

// 翻译函数
export class Translator {
  /**
   * 将中文翻译为英文
   */
  static toEnglish(text: string): string {
    return zhToEn[text] || text
  }

  /**
   * 将英文翻译为中文
   */
  static toChinese(text: string): string {
    return enToZh[text] || text
  }

  /**
   * 自动检测并翻译
   * 如果包含中文字符则翻译为英文，否则翻译为中文
   */
  static translate(text: string): string {
    return /[\u4e00-\u9fa5]/.test(text)
      ? this.toEnglish(text)
      : this.toChinese(text)
  }

  /**
   * 检查是否存在该翻译
   */
  static has(text: string): boolean {
    return text in zhToEn || text in enToZh
  }
}
