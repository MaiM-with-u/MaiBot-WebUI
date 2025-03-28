<template>
  <div class="env-config-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>环境配置文件编辑</span>
          <el-button type="primary" @click="handleSave">保存配置</el-button>
        </div>
      </template>
      <el-form :model="envForm" label-width="180px">
        <!-- 基础配置 -->
        <el-divider content-position="left">基础配置</el-divider>
        <el-form-item label="主机地址">
          <el-input v-model="envForm.host" placeholder="请输入主机地址" />
        </el-form-item>
        <el-form-item label="端口号">
          <el-input-number v-model="envForm.port" :min="1" :max="65535" />
        </el-form-item>
        <el-form-item label="插件列表">
          <div class="plugin-list">
            <div class="plugin-tags">
              <el-tag
                v-for="(plugin, index) in pluginList"
                :key="index"
                closable
                @close="handleRemovePlugin(index)"
                class="plugin-tag"
              >
                {{ plugin }}
              </el-tag>
            </div>
            <div class="plugin-input">
              <el-input
                v-model="newPlugin"
                placeholder="输入插件路径，按回车添加"
                @keyup.enter="handleAddPlugin"
                clearable
              >
                <template #append>
                  <el-button @click="handleAddPlugin">添加</el-button>
                </template>
              </el-input>
            </div>
          </div>
        </el-form-item>

        <!-- MongoDB配置 -->
        <el-divider content-position="left">MongoDB配置</el-divider>
        <el-form-item label="MongoDB主机">
          <el-input v-model="envForm.mongodbHost" placeholder="请输入MongoDB主机地址" />
        </el-form-item>
        <el-form-item label="MongoDB端口">
          <el-input-number v-model="envForm.mongodbPort" :min="1" :max="65535" />
        </el-form-item>
        <el-form-item label="数据库名称">
          <el-input v-model="envForm.databaseName" placeholder="请输入数据库名称" />
        </el-form-item>
        <el-form-item label="MongoDB URI">
          <el-input v-model="envForm.mongodbUri" placeholder="请输入MongoDB URI（可选）" />
        </el-form-item>
        <el-form-item label="MongoDB用户名">
          <el-input v-model="envForm.mongodbUsername" placeholder="请输入MongoDB用户名（可选）" />
        </el-form-item>
        <el-form-item label="MongoDB密码">
          <el-input v-model="envForm.mongodbPassword" type="password" placeholder="请输入MongoDB密码（可选）" />
        </el-form-item>
        <el-form-item label="MongoDB认证源">
          <el-input v-model="envForm.mongodbAuthSource" placeholder="请输入MongoDB认证源（可选）" />
        </el-form-item>

        <!-- API配置 -->
        <el-divider content-position="left">API配置</el-divider>
        <el-form-item label="API提供商">
          <div class="api-provider-list">
            <div class="api-provider-tags">
              <el-tag
                v-for="(provider, index) in apiProviders"
                :key="index"
                closable
                @close="handleRemoveProvider(index)"
                class="api-provider-tag"
              >
                {{ provider }}
              </el-tag>
            </div>
            <div class="api-provider-input">
              <el-input
                v-model="newProvider"
                placeholder="输入API提供商名称，按回车添加"
                @keyup.enter="handleAddProvider"
                clearable
              >
                <template #append>
                  <el-button @click="handleAddProvider">添加</el-button>
                </template>
              </el-input>
            </div>
          </div>
        </el-form-item>

        <el-tabs v-model="activeProvider" type="card" class="api-tabs">
          <el-tab-pane
            v-for="provider in apiProviders"
            :key="provider"
            :label="provider"
            :name="provider"
          >
            <el-form-item :label="`${provider}基础URL`">
              <el-input 
                v-model="envForm[`${provider.toLowerCase()}BaseUrl`]" 
                :placeholder="`请输入${provider}基础URL`" 
              />
            </el-form-item>
            <el-form-item :label="`${provider} API Key`">
              <el-input 
                v-model="envForm[`${provider.toLowerCase()}Key`]" 
                type="password" 
                :placeholder="`请输入${provider} API Key`" 
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>

        <!-- 日志配置 -->
        <el-divider content-position="left">日志配置</el-divider>
        <el-form-item label="精简输出">
          <el-switch v-model="envForm.simpleOutput" />
        </el-form-item>
        <el-form-item label="控制台日志级别">
          <el-select v-model="envForm.consoleLogLevel" placeholder="请选择控制台日志级别">
            <el-option label="DEBUG" value="DEBUG" />
            <el-option label="INFO" value="INFO" />
            <el-option label="WARNING" value="WARNING" />
            <el-option label="ERROR" value="ERROR" />
            <el-option label="SUCCESS" value="SUCCESS" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件日志级别">
          <el-select v-model="envForm.fileLogLevel" placeholder="请选择文件日志级别">
            <el-option label="DEBUG" value="DEBUG" />
            <el-option label="INFO" value="INFO" />
            <el-option label="WARNING" value="WARNING" />
            <el-option label="ERROR" value="ERROR" />
            <el-option label="SUCCESS" value="SUCCESS" />
          </el-select>
        </el-form-item>
        <el-form-item label="默认控制台日志级别">
          <el-select v-model="envForm.defaultConsoleLogLevel" placeholder="请选择默认控制台日志级别">
            <el-option label="DEBUG" value="DEBUG" />
            <el-option label="INFO" value="INFO" />
            <el-option label="WARNING" value="WARNING" />
            <el-option label="ERROR" value="ERROR" />
            <el-option label="SUCCESS" value="SUCCESS" />
            <el-option label="NONE" value="NONE" />
          </el-select>
        </el-form-item>
        <el-form-item label="默认文件日志级别">
          <el-select v-model="envForm.defaultFileLogLevel" placeholder="请选择默认文件日志级别">
            <el-option label="DEBUG" value="DEBUG" />
            <el-option label="INFO" value="INFO" />
            <el-option label="WARNING" value="WARNING" />
            <el-option label="ERROR" value="ERROR" />
            <el-option label="SUCCESS" value="SUCCESS" />
            <el-option label="NONE" value="NONE" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { configService } from '@/api/configApi'

const newPlugin = ref('')
const pluginList = ref<string[]>([])

const newProvider = ref('')
const apiProviders = ref<string[]>(['ChatAnyWhere', 'SiliconFlow', 'DeepSeek'])
const activeProvider = ref('ChatAnyWhere')

// 计算属性：将插件列表转换为JSON字符串
const pluginsJson = computed(() => {
  return JSON.stringify(pluginList.value)
})

// 监听pluginsJson的变化，更新envForm
watch(pluginsJson, (newValue) => {
  envForm.value.plugins = newValue
})

const handleAddPlugin = () => {
  if (!newPlugin.value.trim()) {
    ElMessage.warning('请输入插件路径')
    return
  }
  if (pluginList.value.includes(newPlugin.value.trim())) {
    ElMessage.warning('该插件已存在')
    return
  }
  pluginList.value.push(newPlugin.value.trim())
  newPlugin.value = ''
}

const handleRemovePlugin = (index: number) => {
  pluginList.value.splice(index, 1)
}

// 计算属性：将API提供商列表转换为JSON字符串
const providersJson = computed(() => {
  return JSON.stringify(apiProviders.value)
})

// 监听providersJson的变化，更新envForm
watch(providersJson, (newValue) => {
  envForm.value.apiProviders = newValue
})

const handleAddProvider = () => {
  if (!newProvider.value.trim()) {
    ElMessage.warning('请输入API提供商名称')
    return
  }
  if (apiProviders.value.includes(newProvider.value.trim())) {
    ElMessage.warning('该API提供商已存在')
    return
  }
  const provider = newProvider.value.trim()
  apiProviders.value.push(provider)
  // 为新添加的提供商初始化配置
  envForm.value[`${provider.toLowerCase()}BaseUrl`] = ''
  envForm.value[`${provider.toLowerCase()}Key`] = ''
  newProvider.value = ''
  activeProvider.value = provider
}

const handleRemoveProvider = (index: number) => {
  const provider = apiProviders.value[index]
  // 删除相关的配置
  delete envForm.value[`${provider.toLowerCase()}BaseUrl`]
  delete envForm.value[`${provider.toLowerCase()}Key`]
  apiProviders.value.splice(index, 1)
  // 如果删除的是当前激活的标签，切换到第一个标签
  if (activeProvider.value === provider && apiProviders.value.length > 0) {
    activeProvider.value = apiProviders.value[0]
  }
}

const envForm = ref({
  host: '127.0.0.1',
  port: 8080,
  plugins: '["src2.plugins.chat"]',
  mongodbHost: '127.0.0.1',
  mongodbPort: 27017,
  databaseName: 'MegBot',
  mongodbUri: '',
  mongodbUsername: '',
  mongodbPassword: '',
  mongodbAuthSource: '',
  apiProviders: '["ChatAnyWhere","SiliconFlow","DeepSeek"]',
  chatanywhereBaseUrl: 'https://api.chatanywhere.tech/v1',
  siliconflowBaseUrl: 'https://api.siliconflow.cn/v1/',
  deepseekBaseUrl: 'https://api.deepseek.com/v1',
  chatanywhereKey: '',
  siliconflowKey: '',
  deepseekKey: '',
  simpleOutput: true,
  consoleLogLevel: 'INFO',
  fileLogLevel: 'DEBUG',
  defaultConsoleLogLevel: 'SUCCESS',
  defaultFileLogLevel: 'DEBUG'
})

// 初始化插件列表
const initPluginList = () => {
  try {
    pluginList.value = JSON.parse(envForm.value.plugins)
  } catch (error) {
    pluginList.value = []
    envForm.value.plugins = '[]'
  }
}

// 初始化API提供商列表
const initApiProviders = () => {
  try {
    apiProviders.value = JSON.parse(envForm.value.apiProviders)
  } catch (error) {
    apiProviders.value = ['ChatAnyWhere', 'SiliconFlow', 'DeepSeek']
    envForm.value.apiProviders = JSON.stringify(apiProviders.value)
  }
}

const handleSave = async () => {
  try {
    await configService.saveEnvConfig(envForm.value)
    ElMessage.success('配置保存成功')
  } catch (error) {
    ElMessage.error('配置保存失败')
  }
}

onMounted(async () => {
  try {
    const config = await configService.getEnvConfig()
    envForm.value = { ...envForm.value, ...config }
    initPluginList()
    initApiProviders()
  } catch (error) {
    ElMessage.error('获取配置失败')
  }
})
</script>

<style lang="scss" scoped>
.env-config-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :deep(.el-divider__text) {
    font-size: 16px;
    font-weight: bold;
    color: #409EFF;
  }

  .plugin-list, .api-provider-list {
    .plugin-tags, .api-provider-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
      
      .plugin-tag, .api-provider-tag {
        margin-right: 8px;
        margin-bottom: 8px;
      }
    }

    .plugin-input, .api-provider-input {
      width: 100%;
    }
  }

  .api-tabs {
    margin-top: 20px;
  }
}
</style> 