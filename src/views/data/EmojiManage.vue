<template>
  <div class="emoji-manage">
    <el-table :data="emojiList" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column label="预览图" width="180">
        <template #default="{ row }">
          <el-image :src="`data:image/png;base64,${row.file_content}`" style="width: 100px; height: 100px" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述">
        <template #default="{ row }">
          <el-text class="description-text" :content="row.description">
            {{ truncateText(row.description, 50) }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="180">
        <template #default="{ row }">
          {{ new Date(row.timestamp * 1000).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="primary" @click="showDetail(row)">查看</el-button>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 详情弹窗 -->
    <el-dialog v-model="dialogVisible" title="表情包详情" width="50%">
      <div class="emoji-detail" v-if="currentEmoji">
        <div class="detail-item">
          <span class="label">ID：</span>
          <span>{{ currentEmoji.id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">预览图：</span>
          <el-image :src="`data:image/png;base64,${currentEmoji.file_content}`" style="width: 200px; height: 200px" fit="cover" />
        </div>
        <div class="detail-item">
          <span class="label">描述：</span>
          <span>{{ currentEmoji.description }}</span>
        </div>
        <div class="detail-item">
          <span class="label">添加时间：</span>
          <span>{{ new Date(currentEmoji.timestamp * 1000).toLocaleString() }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dataService, type EmojiData } from '@/api/dataApi'

const emojiList = ref<EmojiData[]>([])
const dialogVisible = ref(false)
const currentEmoji = ref<EmojiData | null>(null)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取表情包总数
const fetchEmojiTotal = async () => {
  try {
    total.value = await dataService.getEmojiTotal()
  } catch (error) {
    ElMessage.error('获取表情包总数失败')
  }
}

// 获取表情包列表
const fetchEmojiList = async () => {
  loading.value = true
  try {
    const offset = (currentPage.value - 1) * pageSize.value
    const response = await dataService.getEmojiList(offset, pageSize.value)
    emojiList.value = response.data
    await fetchEmojiTotal()
  } catch (error) {
    ElMessage.error('获取表情包列表失败')
  } finally {
    loading.value = false
  }
}

// 处理页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchEmojiList()
}

// 处理每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchEmojiList()
}

// 显示详情
const showDetail = async (emoji: EmojiData) => {
  try {
    const detail = await dataService.getEmojiDetail(emoji.id)
    currentEmoji.value = detail
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取表情包详情失败')
  }
}

// 删除表情包
const handleDelete = async (emoji: EmojiData) => {
  try {
    await ElMessageBox.confirm('确定要删除这个表情包吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await dataService.deleteEmoji(emoji.id)
    ElMessage.success('删除成功')
    await fetchEmojiList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 文本截断
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

onMounted(() => {
  fetchEmojiList()
})
</script>

<style scoped>
.emoji-manage {
  padding: 20px;
}

.description-text {
  display: block;
  word-break: break-all;
}

.emoji-detail {
  padding: 20px;
}

.detail-item {
  margin-bottom: 20px;
}

.label {
  font-weight: bold;
  margin-right: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>