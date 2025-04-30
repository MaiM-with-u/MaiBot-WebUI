<script setup lang="ts">
const botConfig = ref('')
const envConfig = ref('')
const isEditingBotConfig = ref(false)
const isEditingEnvConfig = ref(false)

// 编辑bot配置
function editBotConfig() {
  isEditingBotConfig.value = true
}

// 保存bot配置
function saveBotConfig() {
  // TODO: 实现保存逻辑
  isEditingBotConfig.value = false
}

// 取消编辑bot配置
function cancelEditBotConfig() {
  // TODO: 恢复原始配置
  isEditingBotConfig.value = false
}

// 编辑环境配置
function editEnvConfig() {
  isEditingEnvConfig.value = true
}

// 保存环境配置
function saveEnvConfig() {
  // TODO: 实现保存逻辑
  isEditingEnvConfig.value = false
}

// 取消编辑环境配置
function cancelEditEnvConfig() {
  // TODO: 恢复原始配置
  isEditingEnvConfig.value = false
}

// 在组件挂载时获取配置
onMounted(async () => {
  // TODO: 从后端API获取配置
  botConfig.value = '# MMC Bot Configuration\n# Add your configuration here'
  envConfig.value = '# Environment Variables\n# Add your environment variables here'
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">
      配置管理
    </h1>

    <!-- MMC本体配置 -->
    <div class="mb-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UIcon name="i-heroicons-document-text" class="mr-2" />
              <h2 class="text-lg font-semibold">
                MMC本体配置 (bot_config.toml)
              </h2>
            </div>
            <UButton
              icon="i-heroicons-pencil-square"
              color="primary"
              variant="soft"
              @click="editBotConfig"
            >
              编辑
            </UButton>
          </div>
        </template>
        <UTextarea
          v-model="botConfig"
          :rows="10"
          :disabled="!isEditingBotConfig"
          class="font-mono text-sm"
        />
        <template #footer>
          <div v-if="isEditingBotConfig" class="flex justify-end space-x-2">
            <UButton
              color="neutral"
              variant="soft"
              @click="cancelEditBotConfig"
            >
              取消
            </UButton>
            <UButton
              color="primary"
              @click="saveBotConfig"
            >
              保存
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <!-- 环境配置 -->
    <div class="mb-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UIcon name="i-heroicons-cog-6-tooth" class="mr-2" />
              <h2 class="text-lg font-semibold">
                环境配置 (.env)
              </h2>
            </div>
            <UButton
              icon="i-heroicons-pencil-square"
              color="primary"
              variant="soft"
              @click="editEnvConfig"
            >
              编辑
            </UButton>
          </div>
        </template>
        <UTextarea
          v-model="envConfig"
          :rows="10"
          :disabled="!isEditingEnvConfig"
          class="font-mono text-sm"
        />
        <template #footer>
          <div v-if="isEditingEnvConfig" class="flex justify-end space-x-2">
            <UButton
              color="neutral"
              variant="soft"
              @click="cancelEditEnvConfig"
            >
              取消
            </UButton>
            <UButton
              color="primary"
              @click="saveEnvConfig"
            >
              保存
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
