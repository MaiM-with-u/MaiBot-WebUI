<template>
  <div class="analysis-dashboard">
    <!-- 状态卡片 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="custom-card art-custom-card today-sales">
          <div class="custom-card-header">
            <span class="title">机器人状态</span>
            <span class="subtitle">实时运行状态监控</span>
            <div class="export-btn" @click="handleRestart">
              <i class="iconfont-sys">&#xe7d9;</i>
              <span>重启机器人</span>
            </div>
          </div>
          <div class="sales-summary">
            <el-row :gutter="20">
              <el-col :span="6" :xs="24">
                <div class="sales-card art-custom-card">
                  <i class="iconfont-sys bg-primary" v-html="'&#xe77f;'"></i>
                  <h2>
                    <CountTo
                      class="number box-title"
                      :endVal="messageCount"
                      :duration="1000"
                      separator=""
                    ></CountTo>
                  </h2>
                  <p>消息处理</p>
                  <small>
                    <el-tag :type="botStatus ? 'success' : 'danger'" size="small">
                      {{ botStatus ? '在线' : '离线' }}
                    </el-tag>
                  </small>
                </div>
              </el-col>
              <el-col :span="6" :xs="24">
                <div class="sales-card art-custom-card">
                  <i class="iconfont-sys bg-success" v-html="'&#xe70f;'"></i>
                  <h2>
                    <CountTo
                      class="number box-title"
                      :endVal="totalGroups"
                      :duration="1000"
                      separator=""
                    ></CountTo>
                  </h2>
                  <p>群组数量</p>
                  <small>活跃群组: {{ activeGroups }}</small>
                </div>
              </el-col>
              <el-col :span="6" :xs="24">
                <div class="sales-card art-custom-card">
                  <i class="iconfont-sys bg-warning" v-html="'&#xe712;'"></i>
                  <h2>{{ uptime }}</h2>
                  <p>运行时间</p>
                  <small>响应: {{ responseTime }}ms</small>
                </div>
              </el-col>
              <el-col :span="6" :xs="24">
                <div class="sales-card art-custom-card">
                  <i class="iconfont-sys bg-error" v-html="'&#xe6d1;'"></i>
                  <h2>
                    <CountTo
                      class="number box-title"
                      :endVal="cpuUsage"
                      :duration="1000"
                      separator=""
                    ></CountTo>%
                  </h2>
                  <p>CPU使用率</p>
                  <small>内存: {{ memoryUsage }}%</small>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- LLM统计卡片 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <div class="custom-card art-custom-card llm-stats">
          <div class="custom-card-header">
            <span class="title">LLM使用统计</span>
            <span class="subtitle">大语言模型调用统计</span>
          </div>
          <div class="sales-summary">
            <el-row :gutter="20">
              <el-col :span="6" :xs="24">
                <div class="sales-card art-custom-card">
                  <i class="iconfont-sys bg-primary" v-html="'&#xe6d7;'"></i>
                  <h2>
                    <CountTo
                      class="number box-title"
                      :endVal="llmStats.totalRequests"
                      :duration="1000"
                      separator=","
                    ></CountTo>
                  </h2>
                  <p>总请求数</p>
                  <small>在线时间: {{ llmStats.onlineTime }}分钟</small>
                </div>
              </el-col>
              <el-col :span="6" :xs="24">
                <div class="sales-card art-custom-card">
                  <i class="iconfont-sys bg-success" v-html="'&#xe6d8;'"></i>
                  <h2>
                    <CountTo
                      class="number box-title"
                      :endVal="llmStats.totalTokens"
                      :duration="1000"
                      separator=","
                    ></CountTo>
                  </h2>
                  <p>总Token数</p>
                  <small>平均: {{ (llmStats.totalTokens / llmStats.totalRequests).toFixed(2) }}</small>
                </div>
              </el-col>
              <el-col :span="6" :xs="24">
                <div class="sales-card art-custom-card">
                  <i class="iconfont-sys bg-warning" v-html="'&#xe6d9;'"></i>
                  <h2>{{ llmStats.totalCost }}￥</h2>
                  <p>总花费</p>
                  <small>平均: {{ (llmStats.totalCost / llmStats.totalRequests).toFixed(4) }}￥/次</small>
                </div>
              </el-col>
              <el-col :span="6" :xs="24">
                <div class="sales-card art-custom-card">
                  <i class="iconfont-sys bg-info" v-html="'&#xe6da;'"></i>
                  <h2>{{ llmStats.modelCount }}</h2>
                  <p>模型数量</p>
                  <small>活跃模型: {{ llmStats.activeModels }}</small>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 模型使用详情 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <div class="custom-card art-custom-card">
          <div class="custom-card-header">
            <span class="title">模型使用详情</span>
            <span class="subtitle">各模型Token使用统计</span>
          </div>
          <div class="model-stats-content">
            <el-table :data="modelStats" style="width: 100%" :stripe="true">
              <el-table-column prop="name" label="模型名称" min-width="200" />
              <el-table-column prop="inputTokens" label="输入Token" width="150">
                <template #default="scope">
                  <CountTo
                    :endVal="scope.row.inputTokens"
                    :duration="1000"
                    separator=","
                  ></CountTo>
                </template>
              </el-table-column>
              <el-table-column prop="outputTokens" label="输出Token" width="150">
                <template #default="scope">
                  <CountTo
                    :endVal="scope.row.outputTokens"
                    :duration="1000"
                    separator=","
                  ></CountTo>
                </template>
              </el-table-column>
              <el-table-column prop="totalTokens" label="总Token" width="150">
                <template #default="scope">
                  <CountTo
                    :endVal="scope.row.totalTokens"
                    :duration="1000"
                    separator=","
                  ></CountTo>
                </template>
              </el-table-column>
              <el-table-column label="使用占比" width="200">
                <template #default="scope">
                  <el-progress
                    :percentage="Number(((scope.row.totalTokens / llmStats.totalTokens) * 100).toFixed(2))"
                    :color="getProgressColor(scope.$index)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :xl="14" :lg="14" :xs="24">
        <div class="custom-card art-custom-card">
          <div class="custom-card-header">
            <span class="title">消息统计</span>
            <span class="subtitle">最近7天的消息处理情况</span>
          </div>
          <div class="chart-container" ref="messageChart"></div>
        </div>
      </el-col>
      <el-col :xl="10" :lg="10" :xs="24">
        <div class="custom-card art-custom-card">
          <div class="custom-card-header">
            <span class="title">群组活跃度</span>
            <span class="subtitle">Top 5 活跃群组</span>
          </div>
          <div class="chart-container" ref="groupChart"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 日志和消息区域 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :xl="12" :lg="12" :xs="24">
        <div class="custom-card art-custom-card">
          <div class="custom-card-header">
            <span class="title">系统日志</span>
            <span class="subtitle">实时系统运行日志</span>
          </div>
          <div class="log-content">
            <el-scrollbar height="300px">
              <div v-for="(log, index) in systemLogs" :key="index" class="log-item">
                <span class="log-time">{{ log.time }}</span>
                <el-tag size="small" :type="getLogType(log.level)">{{ log.level }}</el-tag>
                <span class="log-message">{{ log.message }}</span>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </el-col>
      <el-col :xl="12" :lg="12" :xs="24">
        <div class="custom-card art-custom-card">
          <div class="custom-card-header">
            <span class="title">最近消息</span>
            <span class="subtitle">实时消息记录</span>
          </div>
          <div class="message-content">
            <el-scrollbar height="300px">
              <div v-for="(msg, index) in recentMessages" :key="index" class="message-item">
                <div class="message-header">
                  <el-tag size="small" type="info">{{ msg.groupName }}</el-tag>
                  <span class="message-time">{{ msg.time }}</span>
                </div>
                <div class="message-content">
                  <span class="sender">{{ msg.sender }}</span>
                  <span class="content">{{ msg.content }}</span>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 快捷操作区域 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <div class="custom-card art-custom-card">
          <div class="custom-card-header">
            <span class="title">快捷操作</span>
            <span class="subtitle">机器人管理操作</span>
          </div>
          <div class="action-content">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="action-card" @click="handleRestart">
                  <i class="iconfont-sys">&#xe7d9;</i>
                  <h3>重启机器人</h3>
                  <p>重新启动机器人服务</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="action-card" @click="handleUpdate">
                  <i class="iconfont-sys">&#xe70f;</i>
                  <h3>更新配置</h3>
                  <p>更新机器人配置信息</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="action-card" @click="handleClearCache">
                  <i class="iconfont-sys">&#xe712;</i>
                  <h3>清理缓存</h3>
                  <p>清理机器人缓存数据</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CountTo } from 'vue3-count-to'
import * as echarts from 'echarts'
  import { useSettingStore } from '@/store/modules/setting'
  import { useCommon } from '@/composables/useCommon'

  const settingStore = useSettingStore()
  const currentGlopTheme = computed(() => settingStore.systemThemeType)

  // 系统主题风格变化时，刷新页面重写渲染 Echarts
  watch(currentGlopTheme, () => {
    settingStore.reload()
  })

// 状态数据
const botStatus = ref(true)
const uptime = ref('0天0小时0分钟')
const messageCount = ref(0)
const responseTime = ref(0)
const totalGroups = ref(0)
const activeGroups = ref(0)
const todayMessages = ref(0)
const totalUsers = ref(0)
const activeUsers = ref(0)
const todayInteractions = ref(0)
const cpuUsage = ref(0)
const memoryUsage = ref(0)
const diskUsage = ref(0)

// 日志数据
const systemLogs = ref([
  { time: '2024-01-01 12:00:00', level: 'info', message: '系统启动成功' },
  { time: '2024-01-01 12:01:00', level: 'warning', message: '检测到新版本' },
  { time: '2024-01-01 12:02:00', level: 'error', message: '连接服务器失败' }
])

// 最近消息数据
const recentMessages = ref([
  {
    groupName: '测试群1',
    sender: '用户A',
    content: '你好，机器人',
    time: '12:00:00'
  },
  {
    groupName: '测试群2',
    sender: '用户B',
    content: '今天天气真好',
    time: '12:01:00'
  }
])

// LLM统计数据
const llmStats = ref({
  totalRequests: 62080,
  totalTokens: 23596214,
  totalCost: 11.1945,
  onlineTime: 270,
  modelCount: 9,
  activeModels: 5
})

// 模型使用统计
const modelStats = ref([
  {
    name: 'BAAI/bge-m3',
    inputTokens: 2354,
    outputTokens: 94823,
    totalTokens: 97177
  },
  {
    name: 'Pro/BAAI/bge-m3',
    inputTokens: 2000,
    outputTokens: 85000,
    totalTokens: 87000
  },
  {
    name: 'Pro/Qwen/Qwen2-VL-7B-Instruct',
    inputTokens: 1800,
    outputTokens: 75000,
    totalTokens: 76800
  },
  {
    name: 'Pro/deepseek-ai/DeepSeek-V3',
    inputTokens: 1600,
    outputTokens: 65000,
    totalTokens: 66600
  },
  {
    name: 'Qwen/Qwen2-VL-72B-Instruct',
    inputTokens: 1400,
    outputTokens: 55000,
    totalTokens: 56400
  },
  {
    name: 'Qwen/Qwen2.5-72B-Instruct-128K',
    inputTokens: 1200,
    outputTokens: 45000,
    totalTokens: 46200
  },
  {
    name: 'Qwen/Qwen2.5-VL-72B-Instruct',
    inputTokens: 1000,
    outputTokens: 35000,
    totalTokens: 36000
  },
  {
    name: 'deepseek-ai/DeepSeek-V2.5',
    inputTokens: 800,
    outputTokens: 25000,
    totalTokens: 25800
  },
  {
    name: 'deepseek-chat',
    inputTokens: 600,
    outputTokens: 15000,
    totalTokens: 15600
  }
])

// 图表实例
let messageChart: echarts.ECharts | null = null
let groupChart: echarts.ECharts | null = null

// 获取日志类型对应的标签类型
const getLogType = (level: string) => {
  switch (level) {
    case 'info':
      return 'info'
    case 'warning':
      return 'warning'
    case 'error':
      return 'danger'
    default:
      return 'info'
  }
}

// 获取进度条颜色
const getProgressColor = (index: number) => {
  const colors = [
    '#409EFF',
    '#67C23A',
    '#E6A23C',
    '#F56C6C',
    '#909399',
    '#626AEF',
    '#36D399',
    '#FFB020',
    '#FF6B6B'
  ]
  return colors[index % colors.length]
}

// 初始化图表
const initCharts = () => {
  // 消息统计图表
  messageChart = echarts.init(document.querySelector('.chart-container') as HTMLElement)
  messageChart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: 30,
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '消息数量',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210],
        areaStyle: {
          opacity: 0.1
        }
      }
    ]
  })

  // 活跃群组图表
  groupChart = echarts.init(document.querySelectorAll('.chart-container')[1] as HTMLElement)
  groupChart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '群组活跃度',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '群组1' },
          { value: 735, name: '群组2' },
          { value: 580, name: '群组3' },
          { value: 484, name: '群组4' },
          { value: 300, name: '群组5' }
        ]
      }
    ]
  })
}

// 处理快捷操作
const handleRestart = () => {
  ElMessageBox.confirm('确定要重启机器人吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // TODO: 调用重启API
    ElMessage.success('重启成功')
  })
}

const handleUpdate = () => {
  ElMessageBox.confirm('确定要更新配置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // TODO: 调用更新API
    ElMessage.success('更新成功')
  })
}

const handleClearCache = () => {
  ElMessageBox.confirm('确定要清理缓存吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // TODO: 调用清理API
    ElMessage.success('清理成功')
  })
}

// 定时更新数据
let timer: number | null = null
const updateData = () => {
  // TODO: 调用API更新数据
  messageCount.value++
  responseTime.value = Math.floor(Math.random() * 1000)
  todayMessages.value++
  todayInteractions.value++
  cpuUsage.value = Math.floor(Math.random() * 100)
  memoryUsage.value = Math.floor(Math.random() * 100)
  diskUsage.value = Math.floor(Math.random() * 100)
}

onMounted(() => {
  initCharts()
  timer = window.setInterval(updateData, 5000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
  if (messageChart) {
    messageChart.dispose()
  }
  if (groupChart) {
    groupChart.dispose()
  }
})
</script>

<style lang="scss" scoped>
.analysis-dashboard {
  padding: 20px;

  :deep(.custom-card) {
      background: var(--art-main-bg-color);
      border-radius: calc(var(--custom-radius) + 4px) !important;
    }

  // 卡片头部
  :deep(.custom-card-header) {
    position: relative;
    box-sizing: border-box;
      display: flex;
    align-items: center;
      justify-content: space-between;
    padding: 18px 20px;

    .title {
      font-size: 20px;
      font-weight: 400;
      color: var(--art-text-gray-900);
    }

    .subtitle {
      position: absolute;
      bottom: 2px;
      left: 21px;
      font-size: 13px;
      color: var(--art-gray-600);
    }

    .export-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 66px;
      padding: 6px 12px;
      color: var(--art-gray-600);
      cursor: pointer;
      border: 1px solid var(--art-border-dashed-color);
      border-radius: 6px;
      transition: all 0.3s;

      &:hover {
        color: var(--main-color);
        border-color: var(--main-color);
      }

      .iconfont-sys {
        margin-right: 5px;
        font-size: 14px;
      }

      span {
        font-size: 12px;
      }
    }
  }

  .sales-summary {
    padding: 20px;

    .sales-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 220px;
      padding: 0 20px;
      overflow: hidden;
      border-radius: calc(var(--custom-radius) / 2 + 4px) !important;

      .iconfont-sys {
        width: 48px;
        height: 48px;
        font-size: 20px;
        line-height: 48px;
        color: #fff;
        text-align: center;
        border-radius: 50%;

        &.bg-primary {
          background-color: var(--el-color-primary);
        }

        &.bg-success {
          background-color: var(--el-color-success);
        }

        &.bg-warning {
          background-color: var(--el-color-warning);
        }

        &.bg-error {
          background-color: var(--el-color-danger);
        }
      }

      h2 {
        margin-top: 10px;
        font-size: 26px;
        font-weight: 400;
        color: var(--art-text-gray-900) !important;
      }

      p {
        margin-top: 10px;
        font-size: 16px;
        color: var(--art-text-gray-700) !important;
      }

      small {
        display: block;
        margin-top: 10px;
        color: var(--art-text-gray-500) !important;
      }
    }
  }

  .chart-container {
    height: 300px;
    padding: 20px;
  }

  .log-content,
  .message-content {
    padding: 0 20px;

    .log-item,
    .message-item {
      padding: 10px 0;
      border-bottom: 1px solid var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
      }
    }

    .log-item {
      display: flex;
      align-items: center;
      gap: 10px;

      .log-time {
        color: var(--el-text-color-secondary);
        font-size: 12px;
        min-width: 150px;
      }

      .log-message {
        flex: 1;
        color: var(--el-text-color-regular);
      }
    }

    .message-item {
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;

        .message-time {
          color: var(--el-text-color-secondary);
          font-size: 12px;
        }
      }

      .message-content {
        .sender {
          color: var(--el-color-primary);
          margin-right: 8px;
          font-weight: 500;
        }

        .content {
          color: var(--el-text-color-regular);
        }
      }
    }
  }

  .action-content {
    padding: 20px;

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 180px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      background: var(--el-fill-color-blank);
      border: 1px solid var(--el-border-color-lighter);
      border-radius: var(--el-border-radius-base);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--el-box-shadow-light);
      }

      .iconfont-sys {
        font-size: 36px;
        color: var(--el-color-primary);
      }

      h3 {
        margin: 16px 0 8px;
        font-size: 18px;
        color: var(--el-text-color-primary);
      }

      p {
        font-size: 14px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .mt-20 {
          margin-top: 20px;
  }
}

// 暗黑模式
.dark {
  .analysis-dashboard {
    :deep(.custom-card) {
      box-shadow: 0 4px 20px rgb(0 0 0 / 50%);
    }
  }
}

// 移动端适配
@media (max-width: $device-notebook) {
  .analysis-dashboard {
    .sales-summary {
      .sales-card {
        height: 180px;
      }
    }

    .action-content {
      .action-card {
        height: 150px;
        margin-bottom: 20px;
      }
    }
  }
}

@media (width <= 768px) {
  .analysis-dashboard {
    .mt-20 {
      margin-top: 0;
    }

    :deep(.custom-card) {
      margin-bottom: 20px;
    }

    .sales-summary {
      .sales-card {
        margin-bottom: 20px;
      }
    }
  }
}

.model-stats-content {
  padding: 20px;

  :deep(.el-table) {
    --el-table-border-color: var(--el-border-color-lighter);
    --el-table-header-bg-color: var(--el-fill-color-light);
    --el-table-row-hover-bg-color: var(--el-fill-color);
    
    th {
      background-color: var(--el-table-header-bg-color);
      color: var(--el-text-color-primary);
      font-weight: 500;
    }

    td {
      color: var(--el-text-color-regular);
      }
    }
  }
</style>
