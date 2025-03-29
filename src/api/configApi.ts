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

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    if (config.method === 'post') {
      console.log('发送的数据:', JSON.stringify(config.data, null, 2))
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      console.error('响应错误:', {
        status: error.response.status,
        data: error.response.data
      })
    }
    return Promise.reject(error)
  }
)

export interface MainConfig {
  inner: {
    version: string
  }
  mai_version: {
    version: string
    'version-fix': string
  }
  bot: {
    qq: number
    nickname: string
    alias_names: string[]
  }
  groups: {
    talk_allowed: number[]
    talk_frequency_down: number[]
    ban_user_id: number[]
  }
  personality: {
    prompt_personality: string[]
    personality_1_probability: number
    personality_2_probability: number
    personality_3_probability: number
  }
  schedule: {
    enable_schedule_gen: boolean
    prompt_schedule_gen: string
    schedule_doing_update_interval: number
  }
  platforms: {
    qq: string
  }
  message: {
    max_context_size: number
    emoji_chance: number
    thinking_timeout: number
    max_response_length: number
    ban_words: string[]
    ban_msgs_regex: string[]
  }
  willing: {
    willing_mode: string
    response_willing_amplifier: number
    response_interested_rate_amplifier: number
    down_frequency_rate: number
    emoji_response_penalty: number
  }
  response: {
    model_r1_probability: number
    model_v3_probability: number
    model_r1_distill_probability: number
  }
  emoji: {
    check_interval: number
    register_interval: number
    auto_save: boolean
    enable_check: boolean
    check_prompt: string
  }
  memory: {
    build_memory_interval: number
    build_memory_distribution: number[]
    build_memory_sample_num: number
    build_memory_sample_length: number
    memory_compress_rate: number
    forget_memory_interval: number
    memory_forget_time: number
    memory_forget_percentage: number
    memory_ban_words: string[]
  }
  mood: {
    mood_update_interval: number
    mood_decay_rate: number
    mood_intensity_factor: number
  }
  keywords_reaction: {
    enable: boolean
    rules: Array<{
      enable: boolean
      keywords: string[]
      reaction: string
    }>
  }
  chinese_typo: {
    enable: boolean
    error_rate: number
    min_freq: number
    tone_error_rate: number
    word_replace_rate: number
  }
  response_spliter: {
    enable_response_spliter: boolean
    response_max_length: number
    response_max_sentence_num: number
  }
  remote: {
    enable: boolean
  }
  experimental: {
    enable_friend_chat: boolean
    enable_think_flow: boolean
  }
  model: {
    llm_reasoning: {
      name: string
      provider: string
      pri_in: number
      pri_out: number
    }
    llm_reasoning_minor: {
      name: string
      provider: string
      pri_in: number
      pri_out: number
    }
    llm_normal: {
      name: string
      provider: string
      pri_in: number
      pri_out: number
    }
    llm_emotion_judge: {
      name: string
      provider: string
      pri_in: number
      pri_out: number
    }
    llm_topic_judge: {
      name: string
      provider: string
      pri_in: number
      pri_out: number
    }
    llm_summary_by_topic: {
      name: string
      provider: string
      pri_in: number
      pri_out: number
    }
    moderation: {
      name: string
      provider: string
      pri_in: number
      pri_out: number
    }
    vlm: {
      name: string
      provider: string
      pri_in: number
      pri_out: number
    }
    embedding: {
      name: string
      provider: string
    }
    llm_outer_world: {
      name: string
      provider: string
      pri_in: number
      pri_out: number
    }
    llm_sub_heartflow: {
      name: string
      provider: string
      pri_in: number
      pri_out: number
    }
    llm_heartflow: {
      name: string
      provider: string
      pri_in: number
      pri_out: number
    }
  }
}

export interface EnvConfig {
  host: string
  port: number
  plugins: string
  mongodbHost: string
  mongodbPort: number
  databaseName: string
  mongodbUri: string
  mongodbUsername: string
  mongodbPassword: string
  mongodbAuthSource: string
  apiProviders: string
  [key: `${string}BaseUrl`]: string
  [key: `${string}Key`]: string
  simpleOutput: boolean
  consoleLogLevel: string
  fileLogLevel: string
  defaultConsoleLogLevel: string
  defaultFileLogLevel: string
}

export const configService = {
  async getMainConfig(): Promise<MainConfig> {
    const response = await instance.get(`/config/main/get`)
    return response.data
  },

  async saveMainConfig(config: MainConfig): Promise<void> {
    try {
      // 移除可能导致问题的空数组并转换数字类型
      const cleanConfig = JSON.parse(JSON.stringify(config))
      
      // 递归处理所有数字和空数组
      const processValue = (value: any): any => {
        if (Array.isArray(value)) {
          return value.map(v => processValue(v))
        } else if (typeof value === 'object' && value !== null) {
          const processed: any = {}
          for (const [k, v] of Object.entries(value)) {
            // 特别处理记忆构建分布数据，确保为float类型
            if (k === 'memoryBuildDistribution') {
              processed[k] = typeof v === 'string' ? parseFloat(v) : v
            } else {
              processed[k] = processValue(v)
            }
          }
          return processed
        } else if (typeof value === 'string' && !isNaN(Number(value))) {
          return parseFloat(value)
        } else if (typeof value === 'number') {
          return parseFloat(value.toString())
        }
        return value
      }

      const processedConfig = processValue(cleanConfig)
      
      // 打印发送的数据结构
      const requestData = { config: processedConfig }
      console.log('发送配置数据:', JSON.stringify(requestData, null, 2))
      
      const response = await instance.post(`/config/main/update`, requestData)
      console.log('保存成功:', response.data)
    } catch (error: any) {
      if (error.response?.data) {
        console.error('验证错误:', {
          status: error.response.status,
          message: error.response.data.detail || error.response.data.message,
          data: error.response.data
        })
      } else {
        console.error('请求错误:', error.message)
      }
      throw error
    }
  },

  // 获取环境配置
  getEnvConfig() {
    return instance.get<EnvConfig>(`/config/env`)
  },

  // 保存环境配置
  saveEnvConfig(config: EnvConfig) {
    return instance.post(`/config/env`, config)
  }
}