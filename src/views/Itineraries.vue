<template>
  <div class="itineraries">
    <el-card>
      <h2>我的行程</h2>
      <el-table :data="itineraries" v-loading="loading">
        <el-table-column prop="itinerary_id" label="行程ID" width="200" />
        <el-table-column prop="flight_no" label="航班号" width="120" />
        <el-table-column prop="airline" label="航空公司" width="150" />
        <el-table-column prop="departure_city" label="出发城市" width="100" />
        <el-table-column prop="arrival_city" label="到达城市" width="100" />
        <el-table-column prop="departure_time" label="起飞时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.departure_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="cabin_class" label="舱位" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleRefresh(row)">
              刷新状态
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { itineraryApi } from '@/api/itinerary'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const itineraries = ref([])

const getStatusText = (status) => {
  const map = {
    upcoming: '即将出行',
    in_progress: '行程中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const getStatusType = (status) => {
  const map = {
    upcoming: 'info',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

const handleRefresh = async (itinerary) => {
  await itineraryApi.refresh(itinerary.id)
  ElMessage.success('行程状态已刷新')
  fetchItineraries()
}

const fetchItineraries = async () => {
  loading.value = true
  try {
    const response = await itineraryApi.getList()
    itineraries.value = response.results || response
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchItineraries()
})
</script>
