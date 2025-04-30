<script setup lang="ts">
import { nextTick, ref } from 'vue'

interface Message {
  id: number
  type: 'user' | 'bot'
  content: string
  time: Date
}

const messages = ref<Message[]>([
  {
    id: 0,
    type: 'bot',
    content: '你好！我是麦麦，很高兴见到你！有什么我可以帮你的吗？',
    time: new Date(),
  },
])

const newMessage = ref('')

function scrollToBottom() {
  const chatArea = document.querySelector('.chat-area')
  if (chatArea) {
    chatArea.scrollTop = chatArea.scrollHeight
  }
}

async function sendMessage() {
  const text = newMessage.value.trim()
  if (text) {
    messages.value.push({
      id: messages.value.length,
      type: 'user',
      content: text,
      time: new Date(),
    })
    newMessage.value = ''

    // Simulate bot response (replace with actual API call)
    await nextTick()
    scrollToBottom()
    setTimeout(() => {
      messages.value.push({
        id: messages.value.length,
        type: 'bot',
        content: `收到消息："${text}" (模拟回复)`,
        time: new Date(),
      })
      nextTick(scrollToBottom)
    }, 1000)
  }
}

function formatTimestamp(timestamp: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
  return new Intl.DateTimeFormat('zh-CN', options).format(timestamp)
}
</script>

<template>
  <div class="flex flex-col h-full p-6">
    <h1 class="text-2xl font-bold mb-6">
      本地聊天
    </h1>

    <!-- Chat Area -->
    <div class="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div v-for="message in messages" :key="message.id" class="mb-4">
        <div
          class="flex"
          :class="{
            'justify-end': message.type === 'user',
            'justify-start': message.type === 'bot',
          }"
        >
          <div
            class="max-w-[70%] p-3 rounded-lg"
            :class="{
              'bg-primary-500 text-white': message.type === 'user',
              'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white': message.type === 'bot',
            }"
          >
            <p class="text-sm">
              {{ message.content }}
            </p>
            <span class="text-xs mt-1 block text-right" :class="message.type === 'user' ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'">
              {{ formatTimestamp(message.time) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="flex items-center border-t border-gray-200 dark:border-gray-700 pt-4">
      <UTextarea
        v-model="newMessage"
        placeholder="输入消息..."
        :rows="1"
        autoresize
        class="flex-1 mr-4 resize-none"
        @keydown.enter.prevent="sendMessage"
      />
      <UButton
        icon="i-heroicons-paper-airplane"
        size="lg"
        :disabled="!newMessage.trim()"
        @click="sendMessage"
      />
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add custom styles if needed */
</style>
