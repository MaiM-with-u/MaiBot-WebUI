import axios from 'axios'

const BASE_URL = 'http://localhost:13000'

// 创建 axios 实例
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

// LLM统计数据接口
export interface LLMStatsData {
  [key: string]: {
    total_calls: number
    total_tokens: number
    total_cost: number
  }
}

// LLM统计服务
export const llmStatsService = {
  // 获取所有模型的调用统计信息
  async getTotalStats(): Promise<LLMStatsData> {
    const response = await instance.get('/stats/total')
    return response.data
  }
}