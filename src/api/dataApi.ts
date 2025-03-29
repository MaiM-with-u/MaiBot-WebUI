import axios from 'axios'
import type { AxiosResponse } from 'axios'

const BASE_URL = 'http://localhost:13000'

// 创建 axios 实例
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

// 表情包数据接口
export interface EmojiData {
  id: string
  file_content: string
  description: string
  timestamp: number
}

// 表情包列表响应接口
export interface EmojiListResponse {
  data: EmojiData[]
  total: number
}

// 关系数据接口
export interface RelationshipData {
  id: string
  platform: string
  user_id: number
  nickname: string
  relationship_value: number
}

// 数据管理服务
export const dataService = {
  // 获取表情包总数
  async getEmojiTotal(): Promise<number> {
    const response = await instance.get('/emoji/total')
    return response.data.total
  },
  // 获取表情包列表
  async getEmojiList(offset: number, batch: number): Promise<EmojiListResponse> {
    const response = await instance.get('/emoji/get', {
      params: {
        offset,
        batch
      }
    })
    return response.data
  },

  // 获取表情包详情
  async getEmojiDetail(id: string): Promise<EmojiData> {
    const response = await instance.get('/emoji/detail', {
      params: {
        emoji_id: id
      }
    })
    return response.data
  },

  // 删除表情包
  async deleteEmoji(id: string): Promise<void> {
    await instance.post('/emoji/delete', { id })
  },

  // 获取关系列表
  async getRelationshipList(offset: number, batch: number): Promise<{ data: RelationshipData[] }> {
    const response = await instance.get('/relationships/get', {
      params: {
        offset,
        batch
      }
    })
    return response.data
  },

  // 获取关系详情
  async getRelationshipDetail(id: string): Promise<RelationshipData> {
    const response = await instance.get('/relationships/detail', {
      params: {
        relationship_id: id
      }
    })
    return response.data
  },

  // 删除关系
  async deleteRelationship(id: string): Promise<void> {
    await instance.post('/relationships/delete', { id })
  }
}