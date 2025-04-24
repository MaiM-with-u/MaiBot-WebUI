<template>
  <div class="p-6 h-full flex flex-col">
    <h1 class="text-2xl font-bold mb-6">本地聊天</h1>

    <!-- 聊天窗口 -->
    <UCard class="flex-1 flex flex-col">
      <!-- 消息列表 -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messageContainer">
        <template v-for="(message, index) in messages" :key="index">
          <div
            :class="[
              'flex',
              message.type === 'user' ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              :class="[
                'max-w-[70%] p-3 rounded-lg',
                message.type === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              ]"
            >
              <p class="whitespace-pre-wrap break-words">{{ message.content }}</p>
            </div>
          </div>
        </template>
      </div>

      <!-- 输入区域 -->
      <div class="border-t border-gray-200 dark:border-gray-700 p-4">
        <div class="flex space-x-2">
          <UTextarea
            v-model="inputMessage"
            :rows="2"
            class="flex-1"
            placeholder="输入消息..."
            @keydown.enter.prevent="sendMessage"
          />
          <UButton
            color="primary"
            :loading="isSending"
            @click="sendMessage"
          >
            发送
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { nextTick, watch } from 'vue'
interface Message {
  type: 'user' | 'bot'
  content: string
}

const messages = ref<Message[]>([
  {
    type: 'bot',
    content: '你好！我是麦麦，很高兴见到你！有什么我可以帮你的吗？'
  }
])

const inputMessage = ref('')
const isSending = ref(false)
const messageContainer = ref<HTMLElement | null>(null)

// 发送消息
async function sendMessage() {
  if (!inputMessage.value.trim() || isSending.value) return

  const userMessage = inputMessage.value.trim()
  inputMessage.value = ''

  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: userMessage
  })

  // 模拟发送中状态
  isSending.value = true

  try {
    // TODO: 调用后端API发送消息
    // 模拟接收回复
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    messages.value.push({
      type: 'bot',
      content: '我收到了你的消息！这里将集成实际的对话功能。'
    })
  } catch (error) {
    // 处理错误
    console.error('发送消息失败:', error)
  } finally {
    isSending.value = false
  }

  // 滚动到底部
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

// 监听消息列表变化，自动滚动到底部
watch(messages, async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}, { deep: true })
</script>

<style scoped>
/* 自定义滚动条样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>