<script setup lang="ts">
import Header from '~/components/header/index.vue'
import LeftMenu from '~/components/leftMenu/index.vue'
</script>

<template>
  <UApp>
    <div class="flex flex-col h-screen">
      <Header />
      <div class="flex flex-1 overflow-hidden">
        <LeftMenu class="h-full overflow-y-auto" />
        <div class="flex-1 h-full overflow-auto">
          <NuxtPage />
        </div>
      </div>
    </div>
  </UApp>
</template>
