<template>
  <div class="relationship-manage">
    <el-table :data="relationshipList" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="唯一ID" width="180" />
      <el-table-column prop="platform" label="平台" width="120" />
      <el-table-column prop="user_id" label="用户ID" width="180" />
      <el-table-column prop="nickname" label="昵称" width="180" />
      <el-table-column label="关系值" width="180">
        <template #default="{ row }">
          <span>{{ formatRelationshipValue(row.relationship_value) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
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
    <el-dialog v-model="dialogVisible" title="关系详情" width="50%">
      <div class="relationship-detail" v-if="currentRelationship">
        <div class="detail-item">
          <span class="label">唯一ID：</span>
          <span>{{ currentRelationship.id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">平台：</span>
          <span>{{ currentRelationship.platform }}</span>
        </div>
        <div class="detail-item">
          <span class="label">用户ID：</span>
          <span>{{ currentRelationship.user_id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">昵称：</span>
          <span>{{ currentRelationship.nickname }}</span>
        </div>
        <div class="detail-item">
          <span class="label">关系值：</span>
          <span>{{ formatRelationshipValue(currentRelationship.relationship_value) }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dataService, type RelationshipData } from '@/api/dataApi'

const relationshipList = ref<RelationshipData[]>([])
const dialogVisible = ref(false)
const currentRelationship = ref<RelationshipData | null>(null)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取关系列表
const fetchRelationshipList = async () => {
  loading.value = true
  try {
    const offset = (currentPage.value - 1) * pageSize.value
    const response = await dataService.getRelationshipList(offset, pageSize.value)
    relationshipList.value = response.data
    total.value = response.data.length
  } catch (error) {
    ElMessage.error('获取关系列表失败')
  } finally {
    loading.value = false
  }
}

// 处理页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchRelationshipList()
}

// 处理每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchRelationshipList()
}

// 显示详情
const showDetail = async (relationship: RelationshipData) => {
  try {
    const detailData = await dataService.getRelationshipDetail(relationship.id)
    currentRelationship.value = detailData
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取关系详情失败')
  }
}

// 删除关系
const handleDelete = async (relationship: RelationshipData) => {
  try {
    await ElMessageBox.confirm('确认要删除该关系数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await dataService.deleteRelationship(relationship.id)
    ElMessage.success('删除成功')
    fetchRelationshipList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除关系数据失败')
    }
  }
}

// 格式化关系值，保留5位小数
const formatRelationshipValue = (value: number) => {
  return value.toFixed(5)
}

onMounted(() => {
  fetchRelationshipList()
})
</script>

<style scoped>
.relationship-manage {
  padding: 20px;
}

.relationship-detail {
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