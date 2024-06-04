<template>
  <div>
    <div class="ca_region">
      <div class="titleSty">系统名称</div>
      <a-table
        :columns="columns1"
        :row-key="(record) => record.id"
        :data-source="dataSource1"
        :scroll="{ y: '62vh' }"
        :loading="tableLoading1"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : undefined)"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <div>
              <a-button type="link" @click="editUs1()">编辑</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <div class="ca_region">
      <div class="titleSty">系统LOGO</div>
      <div flex>
        <div relative m20px mr60px @click="showUpdateImg('web端登录页系统名称')">
          <img w240px h164px :src="chooseUrl" alt="" />
          <img class="deleteIcon" src="@/assets/images/shanchu.png" alt="" />
          <div text-center mt4px>200px*200px</div>
          <div text-center mt4px>web端登录页系统名称</div>
        </div>

        <div relative m20px mr60px @click="showUpdateImg('移动端登录页系统名称')">
          <img w240px h164px :src="chooseUrl" alt="" />
          <img class="deleteIcon" src="@/assets/images/shanchu.png" alt="" />
          <div text-center mt4px>100px*100px</div>
          <div text-center mt4px>移动端登录页系统名称</div>
        </div>

        <div relative m20px @click="showUpdateImg('web端平台系统名称')">
          <img w240px h164px :src="chooseUrl" alt="" />
          <img class="deleteIcon" src="@/assets/images/shanchu.png" alt="" />
          <div text-center mt4px>200px*200px</div>
          <div text-center mt4px>web端平台系统名称</div>
        </div>
      </div>
    </div>

    <div class="ca_region">
      <div class="titleSty">登录背景图</div>
      <div flex>
        <div relative m20px mr60px @click="showUpdateImg('web端登录页')">
          <img w240px h164px :src="chooseUrl" alt="" />
          <img class="deleteIcon" src="@/assets/images/shanchu.png" alt="" />
          <div text-center mt4px>200px*200px</div>
          <div text-center mt4px>web端登录页</div>
        </div>

        <div relative m20px mr60px @click="showUpdateImg('移动端登录页')">
          <img w240px h164px :src="chooseUrl" alt="" />
          <img class="deleteIcon" src="@/assets/images/shanchu.png" alt="" />
          <div text-center mt4px>100px*100px</div>
          <div text-center mt4px>移动端登录页</div>
        </div>
      </div>
    </div>
    <!-- 编辑弹框 -->
    <a-modal
      v-model:visible="EidtVisible"
      :width="600"
      title="名称编辑"
      centeredzl
      @cancel="() => {}"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        relative
      >
        <a-form-item label="名称位置">
          <a-input style="width: 300px" v-model:value="formData.fonSize" disabled></a-input>
        </a-form-item>
        <a-form-item label="标题名称">
          <a-input style="width: 300px" v-model:value="formData.fonSize"></a-input>
        </a-form-item>
        <a-form-item label="字体颜色">
          <a-checkbox v-model:checked="formData.isGradation" class="mt6px">是否渐变</a-checkbox>
          <a-radio-group v-show="formData.isGradation" ml20px v-model:value="formData.lrRotb">
            <a-radio :value="1">从上到下</a-radio>
            <a-radio :value="2" ml10px>从左往右</a-radio>
          </a-radio-group>
          <div v-show="!formData.isGradation" mt20px flex>
            <div
              class="color_box"
              :style="{ backgroundColor: formData.colors?.hex8 }"
              @click="formData.colorsShow = !formData.colorsShow"
            />
            <span ml10px mt2px>{{ formData.colors?.hex8 }}</span></div
          >

          <div v-show="formData.isGradation" mt20px flex>
            <span mt2px>0%处: </span>
            <div
              ml4px
              class="color_box"
              @click="formData.colorsShow0 = !formData.colorsShow0"
              :style="{ backgroundColor: formData.colors0?.hex8 }"
            /><span ml6px mt2px>{{ formData.colors0?.hex8 }}</span>
            <span mt2px ml20px>100%处:</span>
            <div
              ml4px
              class="color_box"
              :style="{ backgroundColor: formData.colors100?.hex8 }"
              @click="formData.colorsShow100 = !formData.colorsShow100"
            />
            <span ml6px mt2px>{{ formData.colors100?.hex8 }}</span></div
          >
          <Sketch
            v-if="formData.colorsShow && !formData.isGradation"
            class="sketch"
            v-model="formData.colors"
            @changButton="changeColor(1)"
          />
          <Sketch
            v-if="formData.colorsShow0 && formData.isGradation"
            class="sketch ml42px"
            v-model="formData.colors0"
            @changButton="changeColor(2)"
          />
          <Sketch
            v-if="formData.colorsShow100 && formData.isGradation"
            class="sketch ml182px"
            v-model="formData.colors100"
            @changButton="changeColor(3)"
          />
        </a-form-item>
        <a-form-item label="字体大小">
          <div flex
            ><a-input-number
              style="width: 300px"
              v-model:value="formData.fonSize"
              placeholder="请输入字体大小"
            ></a-input-number
            ><div w40px ml10px mt3px>px</div></div
          >
        </a-form-item>
        <a-form-item label="字体间距">
          <div flex
            ><a-input-number
              style="width: 300px"
              v-model:value="formData.fonSize"
              placeholder="请输入字体间距"
            ></a-input-number
            ><div w40px ml10px mt4px>px</div></div
          >
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 图片上传弹框 -->
    <a-modal
      v-model:visible="EidtVisible1"
      :width="580"
      title="LOGO图片编辑"
      centeredzl
      @cancel="() => {}"
    >
      <a-form
        ref="formRef"
        :model="logoData"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        relative
      >
        <a-form-item label="logo位置">
          <a-input style="width: 300px" v-model:value="logoData.name" disabled></a-input>
        </a-form-item>
        <a-form-item label="logo长度">
          <div flex
            ><a-input-number
              style="width: 300px"
              v-model:value="logoData.logoH"
              placeholder="请输入字体大小"
            ></a-input-number
            ><div w40px ml10px mt3px>px</div></div
          >
        </a-form-item>
        <a-form-item label="logo宽度">
          <div flex
            ><a-input-number
              style="width: 300px"
              v-model:value="logoData.logoW"
              placeholder="请输入字体间距"
            ></a-input-number
            ><div w40px ml10px mt4px>px</div></div
          >
        </a-form-item>
        <a-form-item label="图片">
          <imgUpdate v-model:value="logoData.img" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { Sketch } from '@ans1998/vue3-color';
  import chooseUrl from '@/assets/images/update.png';
  import imgUpdate from './components/imgUpdate.vue';
  import type { log } from 'console';

  const searchForm = reactive<any>({
    name: '',
  });
  const formData = reactive<any>({
    fonSize: '',
    interval: '',
    fontColor: '',
    isGradation: false,
    lrRotb: 1,
    /* 颜色选择器 */
    colors: {},
    colorsShow: false,
    /* 颜色选择器0% */
    colors0: {},
    colorsShow0: false,
    /* 颜色选择器100% */
    colors100: {},
    colorsShow100: false,
  });

  const logoData = reactive<any>({
    logoW: '',
    logoH: '',
    name: '',
    img: '',
  });
  const formRef = ref();
  const tableLoading1 = ref<boolean>(false);
  const EidtVisible = ref<boolean>(false);
  const EidtVisible1 = ref<boolean>(false);
  const dataSource1 = ref<any>([]);
  const columns1 = ref<any>([
    {
      title: '名称位置',
      dataIndex: 'deviceName',
      key: 'deviceName',
      align: 'center',
    },
    {
      title: '标题名称',
      dataIndex: 'departmentName',
      key: 'departmentName',
      align: 'center',
    },
    {
      title: '字体颜色',
      dataIndex: 'routeAddr',
      key: 'routeAddr',
      align: 'center',
    },
    {
      title: '字体大小',
      dataIndex: 'macAddr',
      key: 'macAddr',
      align: 'center',
    },
    {
      title: '字体间距',
      dataIndex: 'macAddr',
      key: 'macAddr',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 140,
    },
  ]);

  const getList1 = () => {};
  const editUs1 = () => {};

  const changeColor = (type) => {
    switch (type) {
      case 1:
        formData.colorsShow = false;
        break;
      case 2:
        formData.colorsShow0 = false;
        break;
      case 3:
        formData.colorsShow100 = false;
        break;
      default:
        break;
    }
  };

  const showUpdateImg = (name) => {
    logoData.name = name;
    EidtVisible1.value = true;
  };
</script>

<style lang="less" scoped>
  .ca_region {
    border-radius: 6px;
    margin-bottom: 18px;
    background-color: #fff;
    padding: 0 20px 20px;

    .titleSty {
      font-weight: 600;
      font-size: 14px;
      color: #1f2122c5;
      padding: 16px;
      padding-left: 0;
      border-bottom: 1px solid #e6e3e3;
    }
  }

  .color_box {
    width: 62px;
    height: 26px;
    border: 1px solid #dfd9d9;
    border-radius: 4px;
  }

  .sketch {
    position: absolute;
    margin-top: 10px;
    z-index: 100000;
  }

  :deep(.vc-botton-right) {
    display: none !important;
  }

  .deleteIcon {
    position: absolute;
    right: -8px;
    top: -8px;
    width: 20px;
    height: 20px;
    z-index: 10;
  }
</style>
