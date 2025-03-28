import request from '@/utils/request'

export interface MainConfig {
  serverUrl: string
  port: number
  dbType: string
  logLevel: string
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
  // 获取主配置
  getMainConfig() {
    return request.get<MainConfig>('/api/config/main')
  },

  // 保存主配置
  saveMainConfig(config: MainConfig) {
    return request.post('/api/config/main', config)
  },

  // 获取环境配置
  getEnvConfig() {
    return request.get<EnvConfig>('/api/config/env')
  },

  // 保存环境配置
  saveEnvConfig(config: EnvConfig) {
    return request.post('/api/config/env', config)
  }
} 