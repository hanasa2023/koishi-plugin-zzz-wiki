export interface ZZZWikiData {
  id: number
  name: string
  aliasName: string
  icon: string
}

export interface ZZZWikiCharacter extends ZZZWikiData {
  rarity: string
  traites: string
  element: string
  faction: string
}

export interface ZZZWikiWeapon extends ZZZWikiData {
  rarity: string
  traites: string
}

export interface ZZZWikiBangBu extends ZZZWikiData {
  rarity: string
}

export interface ZZZWikiCD extends ZZZWikiData {
  effect: string[]
}

export interface ZZZWikiMiniGame extends ZZZWikiData {}

export interface ZZZWikiEnemy extends ZZZWikiData {
  type: string
  grade: string
  weakness: string
  resistance: string
}

export interface ZZZWikiMaterial extends ZZZWikiData {
  rarity: string
  type: string
}

export interface ZZZWikiMap extends ZZZWikiData {}

export interface ZZZWikiAssignment extends ZZZWikiData {
  type: string
}

export interface ZZZWikiAchievement extends ZZZWikiData {}

export interface ZZZWikiStreet extends ZZZWikiData {}

export interface ZZZWikiFaction extends ZZZWikiData {}

export interface ZZZWikiRecord extends ZZZWikiData {}

export interface ZZZWikiInfomation extends ZZZWikiData {}

interface ZZZWikiResponseList {
  content_id: number
  title: string
  ext: string
  icon: string
  bbs_url: string
  article_user_name: string
  article_time: string
  avatar_url: string
  summary: string
  alias_name: string
  corner_mark: string
}

export interface ZZZWikiResponse {
  id: number
  name: string
  list: ZZZWikiResponseList[]
}
