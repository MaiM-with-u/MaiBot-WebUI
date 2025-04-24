<!-- <script setup lang="ts">
import Header from '~/components/header/index.vue'
import LeftMenu from '~/components/leftMenu/index.vue'
</script> -->

<template>
  <UApp>
    <div class="flex flex-col h-screen">
      <hader />
      <div class="flex flex-1">
        <leftMenu />
        <div class="flex-1 overflow-auto">
          <NuxtPage />
        </div>
      </div>
    </div>
  </UApp>
</template>
