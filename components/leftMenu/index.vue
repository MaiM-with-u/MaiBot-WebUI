import type { NavigationMenuItem } from '@nuxt/ui'
import { ref } from 'vue'

const menuItems = ref<NavigationMenuItem[]>([
  { label: '主界面', icon: 'i-ph-house', to: '/' },
  { label: '配置管理', icon: 'i-ph-gear', to: '/config' },
  { label: '资源管理', icon: 'i-ph-folder', to: '/resources' },
  { label: '本地聊天', icon: 'i-ph-chat-circle', to: '/chat' },
  { label: '适配器广场', icon: 'i-ph-squares-four', to: '/adapters' },
  { label: '日志界面', icon: 'i-ph-file-text', to: '/logs' },
])
</script>

<template>
  <div class="h-full w-64 border-r border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
    <UNavigationMenu orientation="vertical" :items="menuItems" class="w-full data-[orientation=vertical]:w-full">
      <template #item="{ item }">
        <div class="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
          <UIcon :name="item.icon" class="flex-shrink-0 w-5 h-5" />
          <span class="text-sm">{{ item.label }}</span>
        </div>
      </template>
    </UNavigationMenu>
  </div>
</template>

<style scoped lang="postcss">
.menu-item {
  @apply text-gray-600 dark:text-white;
}

.router-link-active {
  @apply bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-white font-medium;
}
</style>
