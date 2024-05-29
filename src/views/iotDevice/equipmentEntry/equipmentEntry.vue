<template>
  <div class="box">
    <!-- 顶部搜索 S -->
    <div class="top_search">
      <div class="mr1.5vw item">
        <span class="label">设备类型</span>
        <a-select
          v-model:value="searchForm.deviceType"
          placeholder="请选择"
          :options="[
            { value: null, label: '全部' },
            { value: 1, label: 'UPS' },
            { value: 2, label: '摄像头' },
          ]"
        ></a-select>
      </div>
      <div class="mr1.5vw item">
        <span class="label">设备名称</span>
        <a-input v-model:value="searchForm.name" placeholder="请输入"></a-input>
      </div>
      <div class="mr1.5vw item">
        <span class="label">设备序列号</span>
        <a-input v-model:value="searchForm.deviceSerial" placeholder="请输入"></a-input>
      </div>

      <div class="flex-1 text-right min-w-200px">
        <a-button type="primary" class="mr-20px" b-rd-6px @click="getList(false, true)">
          <svg-icon name="search" size="16" class="text-white mr-6px"></svg-icon>
          查询
        </a-button>
        <a-button type="primary" class="text-#3A6DFE" ghost b-rd-6px @click="getList(true, true)">
          <svg-icon name="reset" size="16" class="mr-6px"></svg-icon>
          刷新
        </a-button>
      </div>
    </div>
    <!-- 顶部搜索 E -->

    <!-- 表格主体 -->
    <div class="bg-white">
      <!-- 表格上方操作按钮 -->
      <div class="flex justify-end pr12px pt10px pb10px">
        <a-button type="link" @click="showModal()"
          ><svg-icon name="add" size="15" class="mr-5px"></svg-icon>新增设备</a-button
        ></div
      >
      <a-table
        :columns="columns"
        :row-key="(record) => record.id"
        :data-source="dataSource"
        :pagination="pagination"
        :scroll="{ y: '62vh' }"
        :loading="tableLoading"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : undefined)"
        @change="pageChange"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'deviceType'">
            <span>{{
              record.deviceType == 1 ? 'UPS' : record.deviceType == 2 ? '摄像机' : '--'
            }}</span>
          </template>
          <template v-if="column.key === 'lng'">
            <div>
              <div>{{ record.lng }}</div>
              <div>{{ record.lat }}</div>
            </div>
          </template>
          <template v-if="column.key === 'deviceStatus'">
            <span :style="{ color: record.deviceStatus == 1 ? '#5389d8' : 'red' }">
              {{ record.deviceStatus == 1 ? '在线' : '离线' }}
            </span>
          </template>
          <template v-if="column.key === 'rulesCount'">
            <a-switch v-model:checked="record.enabled" @change="setSatus($event, record, index)" />
          </template>
          <template v-if="column.key === 'operation'">
            <div>
              <a-button type="link" v-if="record.deviceType == 1" @click="showRecordModal(record)">
                下发指令
              </a-button>
              <!-- <a-button type="link" v-if="record.deviceType == 1" @click="showContentModal(record)">
                查看
              </a-button> -->
              <a-button type="link" v-if="record.deviceType == 2" @click="showImageModal(record)">
                抓拍图片
              </a-button>
              <a-button type="link" v-if="record.deviceType == 2" @click="showModal(record)"
                >配置</a-button
              >
              <a-button type="link" danger @click="deletUs(record.id)">删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>
    <!-- 表格主体 -->

    <!--新增弹窗 S -->
    <addDevice
      v-model:visible="modalVisible"
      :recordData="currentRecord"
      :deviceId="deviceId"
      :isDisable="isDisable"
      @close="closeModal"
      @getList="getList"
    />
    <!--新增弹窗 S -->

    <!-- 下发弹窗 -->
    <a-modal
      :visible="cmdlVisible"
      :width="450"
      title="规则编辑"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="
        () => {
          form.configId = '';
          cmdlVisible = false;
        }
      "
    >
      <div class="top">
        <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 5 }">
          <a-form-item name="configId" label="指令">
            <a-select
              v-model:value="form.configId"
              placeholder="请选择指令"
              :options="rulesOptions"
            ></a-select>
          </a-form-item>
        </a-form>
      </div>
      <!-- 信息录入区域 E -->
      <!-- 底部按钮区域 S -->
      <div class="flex items-center justify-center">
        <!-- 确认按钮 -->
        <a-button class="mr-20px" :loading="cmdLoading" type="primary" @click="submitCmd"
          >确认</a-button
        >
        <!-- 取消按钮 -->
        <a-button
          class="w88px!"
          @click="
            () => {
              form.configId = '';
              cmdlVisible = false;
            }
          "
          >取消</a-button
        >
      </div>
      <!-- 底部按钮区域 E -->
    </a-modal>
    <!-- 下发弹窗 -->

    <!-- ups详情弹窗 -->
    <a-modal
      :visible="cnVisible"
      :width="650"
      title="参数详情"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="
        () => {
          cnVisible = false;
          UPSDetail = '';
        }
      "
    >
      <div class="top">
        <a-descriptions
          :column="2"
          size="small"
          :labelStyle="{
            width: '160px',
            color: '#333333',
            fontSize: '14px',
            textAlign: 'center',
          }"
          :contentStyle="{ color: '#333333', fontSize: '14px', fontWeight: 'bold' }"
        >
          <a-descriptions-item label="输入电压">
            <span :style="{ color: UPSDetail?.inputVolt?.color }"
              >{{ UPSDetail?.inputVolt?.value || UPSDetail?.inputVolt || '--' }}V</span
            >
          </a-descriptions-item>
          <a-descriptions-item label="最近异常输出电压">
            <span :style="{ color: UPSDetail?.lastErrVolt?.color }"
              >{{ UPSDetail?.lastErrVolt?.value || UPSDetail?.lastErrVolt || '--' }}V</span
            >
          </a-descriptions-item>
          <a-descriptions-item label="输出电压">
            <span :style="{ color: UPSDetail?.outputVolt?.color }"
              >{{ UPSDetail?.outputVolt?.value || UPSDetail?.outputVolt || '--' }}V</span
            >
          </a-descriptions-item>
          <a-descriptions-item label="输出负载百分比">
            <span :style="{ color: UPSDetail?.outputLoadPer?.color }"
              >{{ UPSDetail?.outputLoadPer?.value || UPSDetail?.outputLoadPer || '--' }}%</span
            >
          </a-descriptions-item>
          <a-descriptions-item label="输入频率">
            <span :style="{ color: UPSDetail?.inputFreq?.color }"
              >{{ UPSDetail?.inputFreq?.value || UPSDetail?.inputFreq || '--' }}Hz</span
            >
          </a-descriptions-item>
          <a-descriptions-item label="机器内部电池单体电压">
            <span :style="{ color: UPSDetail?.batteryCellVolt?.color }"
              >{{ UPSDetail?.batteryCellVolt?.value || UPSDetail?.batteryCellVolt || '--' }}V</span
            >
          </a-descriptions-item>
          <a-descriptions-item label="机器内部温度">
            <span :style="{ color: UPSDetail?.internalTemp?.color }"
              >{{ UPSDetail?.internalTemp?.value || UPSDetail?.internalTemp || '--' }}℃</span
            >
          </a-descriptions-item>
          <a-descriptions-item label="电池模式提示音消除">
            <span :style="{ color: UPSDetail?.batteryModeSoundMute ? 'red' : '' }">{{
              UPSDetail?.batteryModeSoundMute ? '是' : '否'
            }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="市电异常">
            <span :style="{ color: UPSDetail?.cityPowerErr ? 'red' : '' }">{{
              UPSDetail?.cityPowerErr ? '是' : '否'
            }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="接收到关机指令关机中">
            <span :style="{ color: UPSDetail?.powerOff ? 'red' : '' }">{{
              UPSDetail?.powerOff ? '是' : '否'
            }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="自检中">
            <span :style="{ color: UPSDetail?.selfCheck ? 'red' : '' }">{{
              UPSDetail?.selfCheck ? '是' : '否'
            }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="UPS故障">
            <span :style="{ color: UPSDetail?.failure ? 'red' : '' }">{{
              UPSDetail?.failure ? '是' : '否'
            }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="旁路工作">
            <span :style="{ color: UPSDetail?.bypass ? 'red' : '' }">{{
              UPSDetail?.bypass ? '是' : '否'
            }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="电池电量低">
            <span :style="{ color: UPSDetail?.lowBattery ? 'red' : '' }">{{
              UPSDetail?.lowBattery ? '是' : '否'
            }}</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <!-- 信息录入区域 E -->
      <!-- 底部按钮区域 S -->
      <div class="flex items-center justify-center">
        <!-- 确认按钮 -->
        <!-- <a-button class="mr-20px" :loading="cmdLoading" type="primary" @click="submitCmd"
          >确认</a-button
        > -->
        <!-- 取消按钮 -->
        <a-button
          class="w88px! mt30px"
          @click="
            () => {
              UPSDetail = '';
              cnVisible = false;
            }
          "
          >取消</a-button
        >
      </div>
      <!-- 底部按钮区域 E -->
    </a-modal>
    <!-- ups详情弹窗 -->
    <!-- 抓拍图片 -->
    <a-modal
      :visible="imagVisible"
      :width="650"
      title="抓拍图片"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="
        () => {
          snapshot = '';
          imagVisible = false;
        }
      "
    >
      <div class="top">
        <a-image
          v-if="hasImage"
          style="width: 610px; height: 400px; margin-bottom: 20px"
          :src="snapshot"
        />
      </div>
      <!-- 信息录入区域 E -->
      <!-- 底部按钮区域 S -->
      <div class="flex items-center justify-center">
        <!-- 确认按钮 -->
        <a-button class="mr-20px" :loading="cmdLoading" type="primary" @click="submitCmd"
          >确认</a-button
        >
        <!-- 取消按钮 -->
        <a-button
          class="w88px!"
          @click="
            () => {
              snapshot = '';
              imagVisible = false;
            }
          "
          >取消</a-button
        >
      </div>
      <!-- 底部按钮区域 E -->
    </a-modal>
    <!-- 抓拍图片 -->
  </div>
</template>

<script lang="ts" setup>
  import useAlarmList from './composables/index';
  import modal from './composables/modal';
  import addDevice from '@/components/modal/addDevice/addDevice.vue';

  const {
    modalVisible,
    currentRecord,
    cmdlVisible,
    cnVisible,
    deviceId,
    formRef,
    isDisable,
    cmdLoading,
    imagVisible,
    form,
    rules,
    rulesOptions,
    snapshot,
    hasImage,
    UPSDetail,
    submitCmd,
    showRecordModal,
    showContentModal,
    showModal,
    closeModal,
    showImageModal,
  } = modal(); //弹窗数据
  const {
    searchForm,
    columns,
    tableLoading,
    dataSource,
    pagination,
    pageChange,
    setSatus,
    getList,
    deletUs,
  } = useAlarmList(currentRecord); //列表数据
</script>

<style lang="less" scoped>
  .bg-white {
    position: relative;
    margin-top: 20px;
  }

  .choose_table {
    top: -50px;
    width: 492px;
    height: 50px;
    position: absolute;
    background: url('@/assets/images/370.png') no-repeat !important;
    background-size: 100% 100% !important;
    background-position: 0 0;
  }

  .choose_table > div {
    text-align: center;
    line-height: 50px;
    font-size: 14px;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    cursor: pointer;
  }

  .choose_table > div:nth-child(1) {
    width: 130px;
    height: 50px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .choose_table > div:nth-child(2) {
    width: 140px;
    height: 50px;
    position: absolute;
    left: 110px;
    top: 0;
  }

  .choose_table > div:nth-child(3) {
    width: 140px;
    height: 50px;
    position: absolute;
    left: 230px;
    top: 0;
  }

  .choose_table > div:nth-child(4) {
    width: 140px;
    height: 50px;
    position: absolute;
    left: 350px;
    top: 0;
  }

  .active1 {
    background: url('@/assets/images/tabstitle.png') no-repeat !important;
    background-size: 100% 100% !important;
    background-position: 0 0;
    font-size: 14px;
    font-family: PingFang SC-Bold, PingFang SC;
    font-weight: bold !important;
    color: #5389d8 !important;
  }

  .active2 {
    background: url('@/assets/images/140.png') no-repeat !important;
    background-size: 100% 100% !important;
    background-position: 0 0;
    font-size: 14px;
    font-family: PingFang SC-Bold, PingFang SC;
    font-weight: bold !important;
    color: #5389d8 !important;
  }

  :deep(.ant-progress-text) {
    color: #fd9a1c !important;
    font-size: 12px !important;
  }

  .detail_sty {
    font-size: 14px;
    font-family: PingFang SC-Bold, PingFang SC;
    font-weight: bold;
    color: #333333;
  }

  .detail_cont {
    .ant-form-item {
      margin-bottom: 10px !important;
    }
  }

  .detail_cont1 {
    margin-top: 20px;

    .ant-form-item {
      margin-bottom: 0px !important;
    }
  }

  textarea {
    height: 90px !important;
  }

  .contras_ {
    display: flex;
    flex-direction: column;
  }

  .contras_title {
    height: 40px;
    background: #f1f6fc;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    font-family: PingFang SC-Bold, PingFang SC;
    font-weight: bold;
    color: #333333;
    border: 1px solid #d7e8f5;
  }

  .contras_cont {
    flex: 1;
    border: 1px solid #d7e8f5;
  }

  .progress_ {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .normalC {
    width: 18px;
    height: 18px;
    background: #00ae34;
    border-radius: 50%;
    text-align: center;
    line-height: 16px;
    color: #fff;
    font-size: 15px;
    margin: 0 auto;
  }

  .wrong {
    background-color: red;
  }

  .notallowed {
    cursor: not-allowed !important;
    color: #ccc !important;
  }
</style>
