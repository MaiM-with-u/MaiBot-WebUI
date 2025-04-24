<script setup lang="ts">
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <UHeader
    class="h-16 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
  >
    <template #left>
      <div class="flex items-center space-x-3">
        <NuxtLink to="/" class="flex items-center space-x-3">
          <span class="text-2xl font-bold text-gray-900 dark:text-white font-sans">MaiBot</span>
        </NuxtLink>
      </div>
    </template>

    <template #right>
      <div class="flex items-center space-x-4">
        <UButton
          icon="i-ph-moon"
          :ui="{ rounded: 'rounded-full' }"
          variant="ghost"
          class="dark:hidden"
          @click="toggleColorMode"
        />
        <UButton
          icon="i-ph-sun"
          :ui="{ rounded: 'rounded-full' }"
          variant="ghost"
          class="hidden dark:block"
          @click="toggleColorMode"
        />
        <UAvatar
          src="https://avatars.githubusercontent.com/u/739984?v=4"
          alt="User Avatar"
          size="sm"
          class="cursor-pointer transition-all duration-200 ease-in-out"
        />
      </div>
    </template>
  </UHeader>
</template>

<style scoped>
.u-header {
  @apply flex justify-between items-center;
}
</style>
