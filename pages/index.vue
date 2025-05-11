<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface SystemInfoData {
  system: string
  release: string
  version: string
  machine: string
  processor: string
}

interface MemoryUsageData {
  total_mb: number
  available_mb: number
  percent: number
  used_mb: number
  free_mb: number
}

interface ProcessMemoryUsageData {
  rss_mb: number
  vms_mb: number
  percent: number
}

interface DiskUsageData {
  total_gb: number
  used_gb: number
  free_gb: number
  percent: number
}

// This interface now represents the structure within the 'data' field of the API response
interface ApiInfoData {
  system_info: SystemInfoData
  python_version: string
  cpu_usage_percent: number
  process_cpu_usage_percent: number
  memory_usage: MemoryUsageData
  process_memory_usage: ProcessMemoryUsageData
  disk_usage_root: DiskUsageData
}

// New interface for the actual API response structure
interface ActualApiResponse {
  status: string
  data: ApiInfoData
}

const { data: apiData, pending, error, refresh } = await useFetch<ActualApiResponse>('http://127.0.0.1:8000/api/v1/info', {
  server: false, // We only want to fetch this on the client side after hydration
  lazy: true, // Set to true if you want to control the initial fetch manually or if await isn't top-level
})

const mmcStatus = computed(() => {
  if (pending.value)
    return { text: '加载中...', color: 'blue', icon: 'i-heroicons-arrow-path' }
  if (error.value)
    return { text: '获取失败', color: 'red', icon: 'i-heroicons-exclamation-triangle' }
  if (apiData.value && apiData.value.status === 'success' && apiData.value.data)
    return { text: '运行中', color: 'green', icon: 'i-heroicons-check-circle' }
  if (apiData.value && apiData.value.status !== 'success')
    return { text: `API错误: ${apiData.value.status}`, color: 'orange', icon: 'i-heroicons-exclamation-circle' }
  return { text: '数据不完整或未知', color: 'gray', icon: 'i-heroicons-question-mark-circle' }
})

// Helper computed property to safely access the nested data
const systemStats = computed(() => apiData.value?.data)

const cpuUsagePercent = computed(() => Math.round(systemStats.value?.cpu_usage_percent ?? 0))
const memoryUsagePercent = computed(() => Math.round(systemStats.value?.memory_usage?.percent ?? 0))
const diskUsagePercent = computed(() => Math.round(systemStats.value?.disk_usage_root?.percent ?? 0))

let refreshIntervalId: ReturnType<typeof setInterval> | null = null

// Hitokoto (一言) state
const hitokotoText = ref('正在获取一言...')
const hitokotoLoading = ref(false)

async function fetchHitokoto() {
  hitokotoLoading.value = true
  try {
    const response = await fetch('https://v1.hitokoto.cn/?encode=text&c=a&c=b&c=c&c=d&c=e&c=f&c=g&c=h&c=i&c=j&c=k&c=l') // Fetching various types of hitokoto as text
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    hitokotoText.value = await response.text()
  }
  catch (err) {
    console.error('Failed to fetch Hitokoto:', err)
    hitokotoText.value = '获取一言失败，请稍后重试。'
  }
  finally {
    hitokotoLoading.value = false
  }
}

onMounted(() => {
  // Initial fetch if lazy is true and not awaited, or just to ensure data is fresh
  if (!apiData.value && !pending.value) {
    refresh()
  }
  refreshIntervalId = setInterval(() => {
    refresh()
  }, 15000) // Refresh every 15 seconds

  fetchHitokoto() // Fetch initial Hitokoto
})

onUnmounted(() => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
  }
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">
      系统状态
    </h1>

    <!-- MMC运行状态 -->
    <div class="mb-6">
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-signal" class="mr-2" />
            <h2 class="text-lg font-semibold">
              MMC运行状态
            </h2>
          </div>
        </template>
        <!-- Show "正在加载状态..." only on initial load (when apiData is not yet available) -->
        <div v-if="pending && !apiData" class="flex items-center text-gray-500">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin mr-2 h-5 w-5" />
          <span>正在加载状态...</span>
        </div>
        <!-- Otherwise, mmcStatus computed property will determine the display for UStatusIndicator -->
        <div v-else>
          <UStatusIndicator :color="mmcStatus.color" class="mb-2">
            <div class="flex items-center">
              <UIcon v-if="mmcStatus.icon" :name="mmcStatus.icon" class="mr-1.5 flex-shrink-0 h-5 w-5" :class="{ 'animate-spin': mmcStatus.text === '加载中...' && pending }" />
              <span>{{ mmcStatus.text }}</span>
            </div>
          </UStatusIndicator>
        </div>
      </UCard>
    </div>

    <!-- 系统基本信息 -->
    <div v-if="systemStats" class="mb-6">
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-computer-desktop" class="mr-2" />
            <h2 class="text-lg font-semibold">
              系统基本信息
            </h2>
          </div>
        </template>
        <div class="space-y-2">
          <p>操作系统: <span class="font-semibold">{{ systemStats?.system_info?.system ?? 'N/A' }} {{ systemStats?.system_info?.release ?? '' }}</span></p>
          <p>Python 版本: <span class="font-semibold">{{ (systemStats?.python_version?.split(' ')[0]) ?? 'N/A' }}</span></p>
          <p>处理器架构: <span class="font-semibold">{{ systemStats?.system_info?.machine ?? 'N/A' }}</span></p>
        </div>
      </UCard>
    </div>

    <!-- 系统资源占用 -->
    <div class="mb-6">
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-cpu-chip" class="mr-2" />
            <h2 class="text-lg font-semibold">
              系统资源占用
            </h2>
          </div>
        </template>
        <!-- Show loading only on initial load (when systemStats is not yet available) -->
        <div v-if="pending && !systemStats" class="text-center">
          加载中...
        </div>
        <!-- Show error if an error occurs and there's no previous data to display -->
        <div v-else-if="error && !systemStats" class="text-center text-red-500">
          加载资源信息失败: {{ error.message }}
        </div>
        <!-- Show error if API status is not success and there's no previous data -->
        <div v-else-if="apiData && apiData.status !== 'success' && !systemStats" class="text-center text-red-500">
          加载资源信息失败 (API Status: {{ apiData.status }})
        </div>
        <!-- Display data if systemStats is available (will show old data during refresh) -->
        <div v-else-if="systemStats" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-500">
              CPU使用率 ({{ (systemStats?.cpu_usage_percent ?? 0).toFixed(1) }}%)
            </p>
            <UProgress v-model="cpuUsagePercent" class="mt-2" />
          </div>
          <div>
            <p class="text-sm text-gray-500">
              内存使用率 ({{ (systemStats?.memory_usage?.percent ?? 0).toFixed(1) }}%)
            </p>
            <UProgress v-model="memoryUsagePercent" class="mt-2" />
          </div>
          <div>
            <p class="text-sm text-gray-500">
              磁盘使用率 ({{ (systemStats?.disk_usage_root?.percent ?? 0).toFixed(1) }}%)
            </p>
            <UProgress v-model="diskUsagePercent" class="mt-2" />
          </div>
        </div>
        <!-- Fallback if no data and not loading/error -->
        <div v-else class="text-center text-gray-500">
          等待数据...
        </div>
      </UCard>
    </div>

    <!-- 进程资源占用 -->
    <div v-if="systemStats" class="mb-6">
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-cog" class="mr-2" />
            <h2 class="text-lg font-semibold">
              当前进程资源占用
            </h2>
          </div>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-500">
              进程CPU使用率
            </p>
            <p class="text-xl font-semibold">
              {{ (systemStats?.process_cpu_usage_percent ?? 0).toFixed(1) }}%
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">
              进程内存使用 (RSS)
            </p>
            <p class="text-xl font-semibold">
              {{ (systemStats?.process_memory_usage?.rss_mb ?? 0).toFixed(2) }} MB
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">
              进程内存使用率
            </p>
            <p class="text-xl font-semibold">
              {{ (systemStats?.process_memory_usage?.percent ?? 0).toFixed(2) }}%
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Adapter状态 -->
    <div class="mb-6">
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-puzzle-piece" class="mr-2" />
            <h2 class="text-lg font-semibold">
              Adapter状态
            </h2>
          </div>
        </template>
        <div class="space-y-2">
          <p>
            运行中Adapter: <span class="font-semibold">3</span>
          </p>
          <p>
            总Adapter数量: <span class="font-semibold">5</span>
          </p>
        </div>
      </UCard>
    </div>

    <!-- LLM模型使用统计 -->
    <div class="mb-6">
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-chart-bar" class="mr-2" />
            <h2 class="text-lg font-semibold">
              LLM模型使用统计
            </h2>
          </div>
        </template>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500 mb-2">
              Tokens消耗
            </p>
            <div class="flex justify-between items-center">
              <span>
                总消耗: 1,234,567
              </span>
              <span>
                今日消耗: 12,345
              </span>
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-2">
              资金消耗
            </p>
            <div class="flex justify-between items-center">
              <span>
                总消耗: $123.45
              </span>
              <span>
                今日消耗: $1.23
              </span>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 一言 -->
    <div class="mb-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UIcon name="i-heroicons-sparkles" class="mr-2" />
              <h2 class="text-lg font-semibold">
                一言
              </h2>
            </div>
            <UButton
              icon="i-heroicons-arrow-path-20-solid"
              size="sm"
              color="primary"
              square
              variant="ghost"
              :loading="hitokotoLoading"
              aria-label="刷新一言"
              @click="fetchHitokoto"
            />
          </div>
        </template>
        <p class="italic text-gray-600">
          {{ hitokotoText }}
        </p>
      </UCard>
    </div>
  </div>
</template>
