<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">系统状态</h1>
    
    <!-- MMC运行状态 -->
    <div class="mb-6">
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-signal" class="mr-2" />
            <h2 class="text-lg font-semibold">MMC运行状态</h2>
          </div>
        </template>
        <!-- 状态内容将通过API获取 -->
        <UStatusIndicator color="green" class="mb-2">运行中</UStatusIndicator>
      </UCard>
    </div>

    <!-- 系统资源占用 -->
    <div class="mb-6">
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-cpu-chip" class="mr-2" />
            <h2 class="text-lg font-semibold">系统资源占用</h2>
          </div>
        </template>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-500">CPU使用率</p>
            <UProgress value="45" class="mt-2" />
          </div>
          <div>
            <p class="text-sm text-gray-500">内存使用率</p>
            <UProgress value="60" class="mt-2" />
          </div>
          <div>
            <p class="text-sm text-gray-500">磁盘使用率</p>
            <UProgress value="30" class="mt-2" />
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
            <h2 class="text-lg font-semibold">Adapter状态</h2>
          </div>
        </template>
        <div class="space-y-2">
          <p>运行中Adapter: <span class="font-semibold">3</span></p>
          <p>总Adapter数量: <span class="font-semibold">5</span></p>
        </div>
      </UCard>
    </div>

    <!-- LLM模型使用统计 -->
    <div class="mb-6">
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-chart-bar" class="mr-2" />
            <h2 class="text-lg font-semibold">LLM模型使用统计</h2>
          </div>
        </template>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500 mb-2">Tokens消耗</p>
            <div class="flex justify-between items-center">
              <span>总消耗: 1,234,567</span>
              <span>今日消耗: 12,345</span>
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-2">资金消耗</p>
            <div class="flex justify-between items-center">
              <span>总消耗: $123.45</span>
              <span>今日消耗: $1.23</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 一言 -->
    <div class="mb-6">
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-sparkles" class="mr-2" />
            <h2 class="text-lg font-semibold">一言</h2>
          </div>
        </template>
        <p class="italic text-gray-600">"生活中最棒的事情就是，永远不知道下一秒会发生什么。"</p>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑将在这里实现
</script>