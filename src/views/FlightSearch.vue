<template>
  <div class="flight-search">
    <el-card>
      <h2>航班查询</h2>
      <el-form :model="searchForm" inline>
        <el-form-item label="出发城市">
          <el-input v-model="searchForm.departure_city" placeholder="出发城市" />
        </el-form-item>
        <el-form-item label="到达城市">
          <el-input v-model="searchForm.arrival_city" placeholder="到达城市" />
        </el-form-item>
        <el-form-item label="出发日期">
          <el-date-picker v-model="searchForm.departure_date" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px;">
      <el-table :data="flights" v-loading="loading">
        <el-table-column prop="flight_no" label="航班号" width="120" />
        <el-table-column prop="airline" label="航空公司" width="150" />
        <el-table-column prop="departure_city" label="出发城市" width="100" />
        <el-table-column prop="arrival_city" label="到达城市" width="100" />
        <el-table-column prop="departure_time" label="起飞时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.departure_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="base_price" label="票价" width="100">
          <template #default="{ row }">
            ¥{{ row.base_price }}
          </template>
        </el-table-column>
        <el-table-column prop="available_seats" label="剩余座位" width="100" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleBook(row)" :disabled="!row.is_available">
              预订
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="预订航班" width="500px">
      <el-form :model="bookForm" :rules="bookRules" ref="bookFormRef">
        <el-form-item label="舱位等级" prop="cabin_class">
          <el-select v-model="bookForm.cabin_class">
            <el-option label="经济舱" value="economy" />
            <el-option label="商务舱" value="business" />
            <el-option label="头等舱" value="first" />
          </el-select>
        </el-form-item>
        <el-form-item label="乘客姓名" prop="passenger_name">
          <el-input v-model="bookForm.passenger_name" />
        </el-form-item>
        <el-form-item label="身份证号" prop="passenger_id_card">
          <el-input v-model="bookForm.passenger_id_card" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitBook" :loading="submitting">提交订单</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { flightApi } from '@/api/flight'
import { orderApi } from '@/api/order'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const submitting = ref(false)
const flights = ref([])
const dialogVisible = ref(false)
const bookFormRef = ref()
const selectedFlight = ref(null)

const searchForm = ref({
  departure_city: '',
  arrival_city: '',
  departure_date: null
})

const bookForm = ref({
  cabin_class: 'economy',
  passenger_name: '',
  passenger_id_card: ''
})

const bookRules = {
  cabin_class: [{ required: true, message: '请选择舱位', trigger: 'change' }],
  passenger_name: [{ required: true, message: '请输入乘客姓名', trigger: 'blur' }],
  passenger_id_card: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /^\d{17}[\dXx]$/, message: '身份证号格式不正确', trigger: 'blur' }
  ]
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

const handleSearch = async () => {
  loading.value = true
  try {
    const params = {}
    if (searchForm.value.departure_city) params.departure_city = searchForm.value.departure_city
    if (searchForm.value.arrival_city) params.arrival_city = searchForm.value.arrival_city
    if (searchForm.value.departure_date) {
      params.departure_date = new Date(searchForm.value.departure_date).toISOString().split('T')[0]
    }
    
    const response = await flightApi.getList(params)
    flights.value = response.results || response
  } finally {
    loading.value = false
  }
}

const handleBook = (flight) => {
  selectedFlight.value = flight
  dialogVisible.value = true
}

const handleSubmitBook = async () => {
  await bookFormRef.value.validate()
  submitting.value = true
  try {
    const data = {
      flight: selectedFlight.value.id,
      ...bookForm.value
    }
    const response = await orderApi.create(data)
    ElMessage.success('订单创建成功')
    dialogVisible.value = false
    router.push(`/orders/${response.id}`)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  handleSearch()
})
</script>
