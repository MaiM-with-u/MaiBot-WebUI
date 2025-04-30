<script setup lang="ts">
import { ref } from 'vue'

interface Adapter {
  id: string
  name: string
  description: string
  version: string
  author: string
  icon: string
  tags: string[]
  installed: boolean
  enabled: boolean
}

// 示例数据
const adapters = ref<Adapter[]>([
  {
    id: 'qq',
    name: 'QQ适配器',
    description: '支持QQ平台的消息收发、群管理等功能',
    version: '1.0.0',
    author: 'MaiBot Team',
    icon: 'i-heroicons-chat-bubble-left',
    tags: ['即时通讯', '群聊'],
    installed: true,
    enabled: true,
  },
])

function toggleAdapter(_adapter: Adapter) {
  // TODO: Implement adapter toggle logic
  // console.log(`Toggling adapter ${_adapter.name}: ${_adapter.enabled}`)
}

function installAdapter(_adapter: Adapter) {
  // TODO: Implement adapter installation logic
  // console.log(`Installing adapter ${_adapter.name}`)
  _adapter.installed = true
}

function uninstallAdapter(adapter: Adapter) {
  // TODO: Implement adapter uninstallation logic
  // console.log(`Uninstalling adapter ${adapter.name}`)
  adapter.installed = false
  adapter.enabled = false
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">
      适配器广场
    </h1>

    <!-- 适配器列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard v-for="adapter in adapters" :key="adapter.id" class="relative">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UIcon :name="adapter.icon" class="mr-2" />
              <h3 class="text-lg font-semibold">
                {{ adapter.name }}
              </h3>
            </div>
            <UBadge
              :color="adapter.installed ? 'success' : 'error'"
              variant="subtle"
            >
              {{ adapter.installed ? '已安装' : '未安装' }}
            </UBadge>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ adapter.description }}
          </p>

          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span>版本: {{ adapter.version }}</span>
            <span>|</span>
            <span>作者: {{ adapter.author }}</span>
          </div>

          <div class="flex items-center space-x-2">
            <UTag
              v-for="tag in adapter.tags"
              :key="tag"
              size="sm"
              color="gray"
            >
              {{ tag }}
            </UTag>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <USwitch
                v-if="adapter.installed"
                v-model="adapter.enabled"
                @change="toggleAdapter(adapter)"
              />
              <span v-if="adapter.installed" class="text-sm">
                {{ adapter.enabled ? '已启用' : '已禁用' }}
              </span>
            </div>
            <UButton
              :color="adapter.installed ? 'warning' : 'primary'"
              :icon="adapter.installed ? 'i-heroicons-trash' : 'i-heroicons-plus'"
              variant="soft"
              @click="adapter.installed ? uninstallAdapter(adapter) : installAdapter(adapter)"
            >
              {{ adapter.installed ? '卸载' : '安装' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
