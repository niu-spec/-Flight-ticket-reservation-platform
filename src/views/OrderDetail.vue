<template>
  <div class="order-detail">
    <el-card v-loading="loading">
      <h2>订单详情</h2>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ order.order_id }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(order.status)">{{ getStatusText(order.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="航班号">{{ order.flight?.flight_no }}</el-descriptions-item>
        <el-descriptions-item label="航空公司">{{ order.flight?.airline }}</el-descriptions-item>
        <el-descriptions-item label="出发城市">{{ order.flight?.departure_city }}</el-descriptions-item>
        <el-descriptions-item label="到达城市">{{ order.flight?.arrival_city }}</el-descriptions-item>
        <el-descriptions-item label="舱位">{{ getCabinClass(order.cabin_class) }}</el-descriptions-item>
        <el-descriptions-item label="座位号">{{ order.seat_number || '未选座' }}</el-descriptions-item>
        <el-descriptions-item label="乘客姓名">{{ order.passenger_name }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ order.passenger_id_card }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ order.total_amount }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(order.created_at) }}</el-descriptions-item>
      </el-descriptions>

      <div style="margin-top: 20px;">
        <el-button v-if="order.status === 'pending'" type="primary" @click="handlePay">
          立即支付
        </el-button>
        <el-button v-if="order.status === 'pending'" type="danger" @click="handleCancel">
          取消订单
        </el-button>
      </div>
    </el-card>

    <el-dialog v-model="payDialogVisible" title="选择支付方式" width="400px">
      <el-form :model="payForm">
        <el-form-item label="支付方式">
          <el-radio-group v-model="payForm.payment_method">
            <el-radio label="wechat">微信支付</el-radio>
            <el-radio label="alipay">支付宝</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="payDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitPay" :loading="paying">确认支付</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderApi } from '@/api/order'
import { paymentApi } from '@/api/payment'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const paying = ref(false)
const order = ref({})
const payDialogVisible = ref(false)
const payForm = ref({ payment_method: 'wechat' })

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

const handlePay = () => {
  payDialogVisible.value = true
}

const handleSubmitPay = async () => {
  paying.value = true
  try {
    const response = await paymentApi.create(order.value.id, payForm.value)
    ElMessage.success('支付请求已发起')
    payDialogVisible.value = false
    fetchOrder()
  } finally {
    paying.value = false
  }
}

const handleCancel = async () => {
  await ElMessageBox.confirm('确定取消订单吗？', '提示', { type: 'warning' })
  await orderApi.cancel(order.value.id)
  ElMessage.success('订单已取消')
  fetchOrder()
}

const fetchOrder = async () => {
  loading.value = true
  try {
    order.value = await orderApi.getDetail(route.params.id)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrder()
})
</script>
