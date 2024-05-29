<template>
  <div class="box">
    <!-- 顶部搜索 -->
    <div class="top_search">
      <div class="mr1.5vw">
        <span class="label">所属机构</span>
        <a-tree-select
          v-model:value="searchForm.orgId"
          style="width: 100%"
          :tree-data="treeData"
          allow-clear
          placeholder="请选择"
          tree-node-filter-prop="label"
        />
      </div>
      <div class="mr1.5vw">
        <span class="label">摄像头名称名称</span>
        <a-input v-model:value="searchForm.name" placeholder="请输入"></a-input>
      </div>
      <div class="mr1.5vw">
        <span class="label">摄像头类型</span>
        <a-select
          v-model:value="searchForm.type"
          placeholder="请选择"
          :options="[
            { value: 1, label: '网络摄像头' },
            { value: 2, label: '网络抓拍机' },
            { value: 4, label: '双光摄像头' },
          ]"
        ></a-select>
      </div>
      <div class="mr1.5vw">
        <span class="label">设备厂商</span>
        <a-select
          v-model:value="searchForm.type"
          placeholder="请选择"
          :options="[
            { value: 0, label: '未知' },
            { value: 1, label: '海康' },
            { value: 2, label: '大华' },
            { value: 3, label: '宇视' },
            { value: 4, label: '华三' },
            { value: 5, label: '澳瞳' },
            { value: 6, label: '华信' },
            { value: 7, label: '地平线' },
          ]"
        ></a-select>
      </div>
      <div class="flex-1 text-right">
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
    <!-- 表格主体 -->
    <div class="bg-white">
      <!-- 表格切换 -->
      <!-- <div class="choose_table">
        <div :class="{ active1: detailNum == 1 }" @click="chooseDetail(1)">智慧盒子</div>
        <div :class="{ active2: detailNum == 2 }" @click="chooseDetail(2)">视频监控</div>
      </div> -->
      <!-- 表格上方操作按钮 -->
      <div class="flex justify-end pr12px pt10px pb10px">
        <a-button
          type="link"
          @click="
            {
              visibleModel = true;
              isUpdate = false;
            }
          "
          ><svg-icon name="add" size="15" class="mr-5px"></svg-icon>新增</a-button
        >
        <a-button type="link" @click="findDevice"
          ><svg-icon name="fx" size="15" class="mr-5px relative top-1.5px"></svg-icon
          >发现摄像头</a-button
        >

        <a-button type="link" @click="setDeviceData"
          ><svg-icon name="sz" size="18" class="mr-5px relative top-3px"></svg-icon
          >设置全局摄像头</a-button
        >

        <a-button type="link" @click="urlControlModalVisible = true"
          ><svg-icon name="add" size="18" class="mr-5px relative top-3px"></svg-icon
          >设置报警推送地址</a-button
        >
      </div>

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
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <span>{{
              record.type == 1 ? '网络摄像头' : record.type == 2 ? '网络抓拍机' : '双光摄像头'
            }}</span>
          </template>
          <template v-if="column.key === 'manufacturer'">
            <span>{{
              ['未知', '海康', '大华', '宇视', '华三', '澳瞳', '华信', '地平线'][
                record.manufacturer
              ]
            }}</span>
          </template>
          <template v-if="column.key === 'operation'">
            <div>
              <a-button type="link" @click="editUs(record, false)">查看</a-button>
              <a-button type="link" @click="editUs(record, true)">编辑</a-button>
              <a-button type="link" danger @click="deletUs(record.id)">删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新增编辑弹框 -->
    <a-modal
      v-model:visible="visibleModel"
      :width="600"
      :title="isUpdate ? '编辑设备' : '新增设备'"
      :ok-button-props="{ loading: submitLoading }"
      centered
      @cancel="closeHandleModal"
      @ok="onSubmit"
    >
      <div class="pr40px">
        <a-form
          ref="formRef"
          :rules="rulesRef"
          :model="deviceForm"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item label="所属机构" name="orgId">
            <a-tree-select
              v-model:value="deviceForm.orgId"
              style="width: 100%"
              :tree-data="treeData"
              allow-clear
              placeholder="请选择"
              tree-node-filter-prop="label"
            />
          </a-form-item>
          <a-form-item label="设备名称" name="name">
            <a-input v-model:value="deviceForm.name" placeholder="请输入"></a-input>
          </a-form-item>
          <a-form-item label="设备类型" name="type">
            <a-select
              v-model:value="deviceForm.type"
              placeholder="请选择"
              :options="[
                { value: 1, label: '网络摄像头' },
                { value: 2, label: '网络抓拍机' },
                { value: 4, label: '双光摄像头' },
              ]"
            ></a-select>
          </a-form-item>
          <a-form-item label="摄像头摆放位置" name="location">
            <a-input v-model:value="deviceForm.location" placeholder="请输入"></a-input>
          </a-form-item>
          <a-form-item label="rtsp地址" name="rtsp">
            <a-input v-model:value="deviceForm.rtsp" placeholder="请输入"></a-input>
          </a-form-item>
          <a-form-item label="设备厂商" name="manufacturer">
            <a-select
              v-model:value="deviceForm.manufacturer"
              placeholder="请选择"
              :options="[
                { value: 0, label: '未知' },
                { value: 1, label: '海康' },
                { value: 2, label: '大华' },
                { value: 3, label: '宇视' },
                { value: 4, label: '华三' },
                { value: 5, label: '澳瞳' },
                { value: 6, label: '华信' },
                { value: 7, label: '地平线' },
              ]"
            ></a-select>
          </a-form-item>
          <a-form-item label="设备IP" name="ip">
            <a-input v-model:value="deviceForm.ip" placeholder="请输入"></a-input>
          </a-form-item>
          <a-form-item label="设备端口" name="port">
            <a-input v-model:value="deviceForm.port" :maxlength="8" placeholder="请输入"></a-input>
          </a-form-item>
          <a-form-item label="设备账号" name="username">
            <a-input v-model:value="deviceForm.username" placeholder="请输入"></a-input>
          </a-form-item>
          <a-form-item label="设备密码" name="password">
            <a-input v-model:value="deviceForm.password" placeholder="请输入"></a-input>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 盒子详情弹框 -->
    <a-modal
      v-model:visible="visibleModel1"
      :width="700"
      title="设备详情"
      centered
      :footer="null"
      @cancel="
        () => {
          Object.assign(deviceForm, {
            name: '',
            type: '',
            orgId: '',
            rtsp: '',
            location: '',
            manufacturer: '',
            ip: '',
            port: '',
            username: '',
            password: '',
          });
        }
      "
    >
      <div class="pr30px pl30px">
        <a-descriptions :column="2">
          <a-descriptions-item label="所属机构" name="orgId" :span="1">
            {{ deviceForm.orgName || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="设备名称" :span="1">
            {{ deviceForm.name || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="设备类型" :span="1">
            {{
              deviceForm.type == 1
                ? '网络摄像头'
                : deviceForm.type == 2
                ? '网络抓拍机'
                : '双光摄像头'
            }}
          </a-descriptions-item>
          <a-descriptions-item label="设备摆放位置" :span="1">
            {{ deviceForm.location || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="设备厂商" :span="1">
            <span>{{
              ['未知', '海康', '大华', '宇视', '华三', '澳瞳', '华信', '地平线'][
                deviceForm.manufacturer
              ]
            }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="rtsp地址" :span="1">
            {{ deviceForm.rtsp || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="设备IP" :span="1">
            {{ deviceForm.ip || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="设备端口" :span="1">
            {{ deviceForm.port || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="设备账号" :span="1">
            {{ deviceForm.username || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="设备密码" :span="1">
            {{ deviceForm.password || '--' }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
    <!-- 发现摄像头 -->
    <a-modal
      v-model:visible="visibleModel2"
      :width="800"
      title="摄像头列表"
      centered
      :footer="null"
    >
      <a-table
        :columns="columns1"
        :row-key="(record) => record.ip"
        :data-source="dataSource1"
        :pagination="false"
        :scroll="{ y: '62vh' }"
        :loading="tableLoading"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : undefined)"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <div>
              <a-button type="link" @click="AddDevice(record)">添加摄像头</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </a-modal>
    <!-- 设置全局摄像头 -->
    <a-modal
      v-model:visible="visibleModel3"
      :width="600"
      title="设置全局摄像头"
      :ok-button-props="{ loading: submitLoading }"
      centered
      @cancel="closeHandleModal1"
      @ok="onSubmit1"
    >
      <div class="pr40px">
        <a-form
          ref="formRef"
          :rules="rulesRef"
          :model="argumentSetdata"
          :label-col="{ span: 10 }"
          :wrapper-col="{ span: 14 }"
        >
          <a-form-item label="抓拍间隔" name="captureInterval">
            <a-input-number
              style="width: 100%"
              id="inputNumber"
              v-model:value="argumentSetdata.captureInterval"
              :min="0"
            />
          </a-form-item>
          <a-form-item label="检测间隔帧" name="detectInterval">
            <a-input-number
              id="inputNumber"
              style="width: 100%"
              v-model:value="argumentSetdata.detectInterval"
              :min="0"
            />
          </a-form-item>
          <a-form-item label="人脸仰视角" name="anglePitch">
            <a-input-number
              id="inputNumber"
              style="width: 100%"
              v-model:value="argumentSetdata.anglePitch"
              :min="0"
            />
          </a-form-item>
          <a-form-item label="人脸偏航角" name="angleYaw">
            <a-input-number
              id="inputNumber"
              style="width: 100%"
              v-model:value="argumentSetdata.angleYaw"
              :min="0"
            />
          </a-form-item>
          <a-form-item label="人脸滚转角" name="angleRoll">
            <a-input-number
              id="inputNumber"
              style="width: 100%"
              v-model:value="argumentSetdata.angleRoll"
              :min="0"
            />
          </a-form-item>
          <a-form-item label="人脸关键可信度（0.0~1.0）" name="keypointsConfidence">
            <a-input-number
              id="inputNumber"
              style="width: 100%"
              v-model:value="argumentSetdata.keypointsConfidence"
              :min="0"
            />
          </a-form-item>
          <a-form-item label="解码方式" name="videoCodec">
            <a-select
              v-model:value="argumentSetdata.videoCodec"
              placeholder="请选择"
              :options="[
                { value: 1, label: 'cuda' },
                { value: 2, label: 'dxva' },
                { value: 3, label: 'dad11va' },
                { value: 4, label: 'vaapi' },
                { value: 5, label: 'cpu' },
                { value: 6, label: 'opencv' },
              ]"
            ></a-select>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <AlarmDataPushAddressModal v-model:visible="urlControlModalVisible" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import userManage from './composables/index';
  import { regCheck } from '@/utils/validate';
  import AlarmDataPushAddressModal from '@/components/modal/AlarmDataPushAddressModal/AlarmDataPushAddressModal.vue';
  const downLoading = ref<boolean>(false);
  const formatter = (value: number) => {
    return `${value}%`;
  };
  const rulesRef = reactive({
    orgId: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    name: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    type: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    rtsp: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    manufacturer: [
      {
        required: true,
        message: '请选择该项',
      },
    ],
    location: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    captureInterval: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    detectInterval: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    keypointsConfidence: [
      {
        required: true,
        message: '请填写该项',
      },
      {
        validator: regCheck(/^(0(\.\d+)?|1(\.0+)?)$/),
        message: '输入范围或格式不正确',
        trigger: 'change',
      },
    ],
    videoCodec: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
  });

  const urlControlModalVisible = ref(false);

  const {
    formRef,
    searchForm,
    columns,
    columns1,
    tableLoading,
    dataSource,
    dataSource1,
    pagination,
    submitLoading,
    visibleModel,
    visibleModel1,
    visibleModel2,
    visibleModel3,
    deviceForm,
    pageChange,
    isUpdate,
    treeData,
    argumentSetdata,
    getOrgName,
    editUs,
    getList,
    closeHandleModal,
    closeHandleModal1,
    onSubmit,
    onSubmit1,
    deletUs,
    setDeviceData,
    findDevice,
    AddDevice,
  } = userManage();
  getList();
  getOrgName();
</script>

<style lang="less" scoped>
  .hoverData {
    color: #1686ee;
    cursor: pointer;
  }

  .tree_content {
    border: 1px solid #dad5d5;
    border-radius: 6px;
    max-height: 400px;
    padding: 12px;
    overflow-y: auto;
  }

  .data_content {
    min-width: 300px;
    min-height: 120px;
    max-height: 480px;
    padding: 30px;
    overflow-y: scroll;

    div {
      font-weight: 500;
    }
  }

  .bg-white {
    position: relative;
    margin-top: 50px;
  }

  .top_search {
    :deep(.ant-tree-select) {
      width: 210px !important;
    }
  }
</style>
