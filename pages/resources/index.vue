<script setup lang="ts">
const currentPage = ref(1)

const relationColumns = [
  {
    id: 'platform',
    key: 'platform',
    label: '平台',
    slot: 'platform-data',
  },
  {
    id: 'nickname',
    key: 'nickname',
    label: '昵称',
  },
  {
    id: 'relation',
    key: 'relation',
    label: '关系值',
  },
]

const relationData = [
  {
    platform: 'QQ',
    icon: 'i-heroicons-chat-bubble-left',
    nickname: '用户A',
    relation: 85,
  },
  {
    platform: '微信',
    icon: 'i-heroicons-chat-bubble-left-right',
    nickname: '用户B',
    relation: 92,
  },
  {
    platform: 'Discord',
    icon: 'i-heroicons-globe-alt',
    nickname: '用户C',
    relation: 78,
  },
]
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">
      资源管理
    </h1>

    <!-- 表情包数据 -->
    <div class="mb-8">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UIcon name="i-heroicons-face-smile" class="mr-2" />
              <h2 class="text-lg font-semibold">
                表情包数据
              </h2>
            </div>
            <UButton
              icon="i-heroicons-plus"
              color="primary"
              variant="soft"
            >
              添加表情包
            </UButton>
          </div>
        </template>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="i in 8" :key="i" class="relative group">
            <img
              src="https://via.placeholder.com/150"
              alt="表情包预览"
              class="w-full h-32 object-cover rounded"
            >
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              <UButton
                color="white"
                variant="ghost"
                icon="i-heroicons-eye"
                size="sm"
              />
              <UButton
                color="white"
                variant="ghost"
                icon="i-heroicons-trash"
                size="sm"
              />
            </div>
          </div>
        </div>
        <template #footer>
          <UPagination
            v-model="currentPage"
            :total="100"
            :per-page="12"
            class="flex justify-center"
          />
        </template>
      </UCard>
    </div>

    <!-- 平台关系数据 -->
    <div class="mb-8">
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-user-group" class="mr-2" />
            <h2 class="text-lg font-semibold">
              平台关系数据
            </h2>
          </div>
        </template>
        <UTable
          :columns="relationColumns"
          :rows="relationData"
          :loading="false"
        >
          <template #platform-data="{ row }">
            <div class="flex items-center">
              <UIcon :name="row.icon" class="mr-2" />
              {{ row.platform }}
            </div>
          </template>
        </UTable>
      </UCard>
    </div>

    <!-- 记忆图谱 -->
    <div class="mb-8">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UIcon name="i-heroicons-chart-pie" class="mr-2" />
              <h2 class="text-lg font-semibold">
                记忆图谱
              </h2>
            </div>
            <UButton
              icon="i-heroicons-arrows-pointing-out"
              color="primary"
              variant="soft"
            >
              全屏查看
            </UButton>
          </div>
        </template>
        <div class="h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
          <!-- 这里将集成图谱可视化组件 -->
          <p class="text-gray-500">
            记忆图谱可视化区域
          </p>
        </div>
      </UCard>
    </div>

    <!-- 聊天信息 -->
    <div class="mb-8">
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="mr-2" />
            <h2 class="text-lg font-semibold">
              聊天信息
            </h2>
          </div>
        </template>
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="p-4 bg-gray-50 dark:bg-gray-800 rounded">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <UAvatar
                  src="https://via.placeholder.com/40"
                  size="sm"
                  class="mr-2"
                />
                <span class="font-medium">用户名</span>
              </div>
              <span class="text-sm text-gray-500">2024-01-01 12:00:00</span>
            </div>
            <p class="text-gray-600 dark:text-gray-300">
              这是一条示例聊天消息内容...
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
