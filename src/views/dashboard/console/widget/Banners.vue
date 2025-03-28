<template>
  <div class="banners">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12">
        <BasicBanner
          title="欢迎使用本系统!"
          subtitle="这是一个基于Vue3和Element Plus的后台管理系统模板。"
          buttonText="开始使用"
          buttonColor="rgb(var(--art-success))"
          buttonTextColor="#fff"
          backgroundColor="#D4F1F7"
          titleColor="#333"
          subtitleColor="#666"
          @click="handleBannerClick"
        />
      </el-col>
    </el-row>

  
  </div>
</template>

<script setup lang="ts">

  const handleBannerClick = () => {
    console.log('banner clicked')
  }

</script>

<style lang="scss" scoped>
  .banners {
    padding-top: 20px;

    .page-title {
      margin: 20px 0 15px;
      font-size: 22px;
      font-weight: 500;

      &:first-child {
        margin-top: 0;
      }
    }

    .el-col {
      margin-bottom: 20px;
    }
  }
</style>
