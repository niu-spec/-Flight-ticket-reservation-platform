<template>
  <div class="orders">
    <el-card>
      <h2>我的订单</h2>
      <el-table :data="orders" v-loading="loading">
        <el-table-column prop="order_id" label="订单号" width="200" />
        <el-table-column prop="flight.flight_no" label="航班号" width="120" />
        <el-table-column prop="passenger_name" label="乘客" width="100" />
        <el-table-column prop="cabin_class" label="舱位" width="100">
          <template #default="{ row }">
            {{ getCabinClass(row.cabin_class) }}
          </template>
        </el-table-column>
        <el-table-column prop="total_amount" label="金额" width="100">
          <template #default="{ row }">
            ¥{{ row.total_amount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="$router.push(`/orders/${row.id}`)">
              详情
            </el-button>
            <el-button 
              v-if="row.status === 'pending'" 
              type="danger" 
              size="small" 
              @click="handleCancel(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { orderApi } from '@/api/order'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const orders = ref([])

const getCabinClass = (cabin) => {
  const map = { economy: '经济舱', business: '商务舱', first: '头等舱' }
  return map[cabin] || cabin
}

const getStatusText = (status) => {
  const map = { pending: '待支付', paid: '已支付', ticketed: '已出票', cancelled: '已取消' }
  return map[status] || status
}

const getStatusType = (status) => {
  const map = { pending: 'warning', paid: 'info', ticketed: 'success', cancelled: 'danger' }
  return map[status] || 'info'
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

const handleCancel = async (order) => {
  await ElMessageBox.confirm('确定取消订单吗？', '提示', { type: 'warning' })
  await orderApi.cancel(order.id)
  ElMessage.success('订单已取消')
  fetchOrders()
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const response = await orderApi.getList()
    orders.value = response.results || response
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>
