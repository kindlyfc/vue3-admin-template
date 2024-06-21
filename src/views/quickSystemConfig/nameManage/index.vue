<template>
  <div>
    <div class="ca_region">
      <div class="titleSty">系统名称</div>
      <a-table
        v-if="dataSource.length"
        :columns="columns"
        :row-key="(record) => record.namePositionCode"
        :data-source="dataSource"
        :scroll="{ y: '62vh' }"
        :loading="tableLoading1"
        :pagination="false"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : undefined)"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'textColor'">
            <div
              class="color_box"
              :style="`background-image: linear-gradient( ${
                record.gradientType == 1 ? 'to bottom' : 'to right'
              },${record.startGradientColor},${record.endGradientColor});`"
            >
            </div>
          </template>
          <template v-if="column.key === 'fontSize'">
            <span>{{ record.fontSize || '--' }} px</span>
          </template>
          <template v-if="column.key === 'fontInterval'">
            <span>{{ record.fontInterval || '--' }} px</span>
          </template>
          <template v-if="column.key === 'operation'">
            <div>
              <a-button type="link" @click="editUs(record)">编辑</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <div class="ca_region">
      <div class="titleSty">系统LOGO</div>
      <div flex>
        <div
          relative
          m20px
          mr60px
          class="image_cont"
          v-for="item in dataSourceLogo"
          :key="item.namePositionCode"
        >
          <img
            style="max-width: 300px"
            :src="item.imageUrl ? item.url : chooseUrl"
            alt=""
            @click="showUpdateImg(item)"
          />
          <!-- <img
            v-if="item.imageUrl"
            class="deleteIcon"
            src="@/assets/images/shanchu.png"
            alt=""
            @click="item.imageUrl = null"
          /> -->
          <div class="my-10px!" text-center mt4px
            >{{ item.width || '--' }} x {{ item.height || '--' }}（px）</div
          >
          <div text-center mt4px>{{ item.namePosition || '--' }}</div>
        </div>
      </div>
    </div>

    <div class="ca_region">
      <div class="titleSty">登录背景图</div>
      <div flex>
        <div
          relative
          m20px
          mr60px
          class="image_cont"
          v-for="item in dataSourceBgImg"
          :key="item.namePositionCode"
        >
          <img
            w240px
            style="width: 400px; height: 200px; object-fit: cover"
            :src="item.imageUrl ? item.url : chooseUrl"
            alt=""
            @click="showUpdateImg(item)"
          />
          <!-- <img
            v-if="item.imageUrl"
            class="deleteIcon"
            src="@/assets/images/shanchu.png"
            @click="item.imageUrl = null"
            alt=""
          /> -->
          <!-- <div
            v-if="
              item.namePositionCode != 'web_login_backend' &&
              item.namePositionCode != 'mobile_login_backend'
            "
            text-center
            mt4px
            >{{ item.width || '--' }} X {{ item.height || '--' }}</div
          > -->
          <div class="mt-20px!" text-center mt4px>{{ item.namePosition || '--' }}</div>
        </div>
      </div>
    </div>
    <!-- 编辑弹框 -->
    <a-modal
      v-model:visible="EidtVisible"
      :width="600"
      title="名称编辑"
      @cancel="clearForm()"
      centered
      @ok="sbumit"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        relative
      >
        <a-form-item label="名称位置">
          <a-input style="width: 300px" v-model:value="formData.namePosition" disabled></a-input>
        </a-form-item>
        <a-form-item
          label="标题名称"
          name="titleName"
          :rules="{ required: true, message: '请输入标题名称' }"
        >
          <a-input
            style="width: 300px"
            placeholder="请输入标题名称"
            v-model:value="formData.titleName"
          ></a-input>
        </a-form-item>
        <a-form-item label="字体颜色">
          <ColorSelect
            @form-data-change="getColorData"
            v-model:formData="formDataColor"
          ></ColorSelect>
        </a-form-item>
        <a-form-item label="字体大小">
          <div flex
            ><a-input-number
              style="width: 300px"
              v-model:value="formData.fontSize"
              placeholder="请输入字体大小"
              :min="12"
              :max="32"
            ></a-input-number
            ><div w40px ml10px mt3px>px</div></div
          >
        </a-form-item>
        <a-form-item label="字体间距">
          <div flex
            ><a-input-number
              style="width: 300px"
              v-model:value="formData.fontInterval"
              placeholder="请输入字体间距"
              :min="1"
              :max="100"
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
      title="图片编辑"
      centered
      @cancel="clearForm()"
      @ok="imgSbumit"
    >
      <a-form
        ref="formRef"
        :model="logoData"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        relative
      >
        <a-form-item label="logo位置">
          <a-input style="width: 300px" v-model:value="logoData.namePosition" disabled></a-input>
        </a-form-item>
        <a-form-item
          v-if="
            logoData.namePositionCode != 'web_login_backend' &&
            logoData.namePositionCode != 'mobile_login_backend'
          "
          label="logo高度"
          :min="10"
          :max="100"
          name="height"
          :rules="{ required: true, message: '输入logo高度' }"
        >
          <div flex
            ><a-input-number
              style="width: 300px"
              v-model:value="logoData.height"
              placeholder="请输入logo高度"
            ></a-input-number
            ><div w40px ml10px mt3px>px</div></div
          >
        </a-form-item>
        <a-form-item
          v-if="
            logoData.namePositionCode != 'web_login_backend' &&
            logoData.namePositionCode != 'mobile_login_backend'
          "
          label="logo宽度"
          :min="10"
          :max="500"
          name="width"
          :rules="{ required: true, message: '输入logo宽度' }"
        >
          <div flex
            ><a-input-number
              style="width: 300px"
              v-model:value="logoData.width"
              placeholder="请输入logo宽度"
            ></a-input-number
            ><div w40px ml10px mt4px>px</div></div
          >
        </a-form-item>
        <a-form-item
          label="图片"
          :rules="{ required: true, message: '请上传图片' }"
          name="imageUrl"
        >
          <imgUpdate
            v-if="EidtVisible1"
            v-model:value="logoData.imageUrl"
            :echoList="[IMAGPATH + logoData.imageUrl]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import chooseUrl from '@/assets/images/update.png';
  import imgUpdate from './components/imgUpdate.vue';
  import ColorSelect from '@/components/basic/color-select/color-select.vue';
  import { nameList, editName, imgList, editLogo } from '@/api/uiConfig';
  import { useUiStore } from '@/store/modules/uiConfig';
  import { message } from 'ant-design-vue';
  import type { TableColumnsType } from 'ant-design-vue';

  const IMAGPATH = ref(import.meta.env.VITE_BASE_IMAGE_PATH);
  const uiStore = useUiStore();
  const formData = reactive<any>({
    namePositionCode: '',
    namePosition: '',
    fontSize: '',
    titleName: '',
    fontInterval: '',
  });
  const initColor = () => ({
    hex8: '#FFFFFFFF',
    hex: '#FFFFFF',
    a: 1,
  });
  const initFormColor = () => {
    return {
      gradation: false,
      irRotb: '',
      /* 颜色选择器 */
      colors: initColor(),
      colorsShow: false,
      /* 颜色选择器0% */
      colors0: initColor(),
      colorsShow0: false,
      /* 颜色选择器100% */
      colors100: initColor(),
      colorsShow100: false,
    };
  };

  const formDataColor = reactive<any>(initFormColor());

  const logoData = reactive<any>({
    namePositionCode: '',
    namePosition: '',
    height: null,
    width: null,
    imageUrl: '',
  });

  const formRef = ref();
  const tableLoading1 = ref<boolean>(false);
  const EidtVisible = ref<boolean>(false);
  const EidtVisible1 = ref<boolean>(false);
  const dataSource = ref<any>([]);
  const dataSourceBgImg = ref<any>([]);
  const dataSourceLogo = ref<any>([]);
  const columns: TableColumnsType = [
    {
      title: '名称位置',
      dataIndex: 'namePosition',
      key: 'namePosition',
      align: 'center',
    },
    {
      title: '标题名称',
      dataIndex: 'titleName',
      key: 'titleName',
      align: 'center',
    },
    {
      title: '字体颜色',
      dataIndex: 'textColor',
      key: 'textColor',
      align: 'center',
    },
    {
      title: '字体大小',
      dataIndex: 'fontSize',
      key: 'fontSize',
      align: 'center',
    },
    {
      title: '字体间距',
      dataIndex: 'fontInterval',
      key: 'fontInterval',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 140,
    },
  ];

  const getColorData = (data) => {
    Object.assign(formDataColor, data);
  };
  const getList = async () => {
    // nameList().then((res) => {
    dataSource.value = [];
    const res = await uiStore.getSysName();
    dataSource.value = res;
    // });
  };
  const getList1 = async () => {
    // imgList().then((res) => {
    const res = await uiStore.getSysLogo();
    dataSourceBgImg.value = res
      ?.filter((v) => v.type == 2)
      .map((v) => {
        v.url = import.meta.env.VITE_BASE_IMAGE_PATH + v.imageUrl;
        return v;
      });
    dataSourceLogo.value = res
      ?.filter((v) => v.type == 1)
      .map((v) => {
        v.url = import.meta.env.VITE_BASE_IMAGE_PATH + v.imageUrl;
        return v;
      });
    // });
  };

  getList();
  getList1();
  const editUs = (record) => {
    const {
      namePosition,
      titleName,
      fontInterval,
      fontSize,
      startGradientColor,
      namePositionCode,
      endGradientColor,
      gradient,
      gradientType,
    } = record;
    formData.namePosition = namePosition;
    Object.assign(formData, { namePositionCode, namePosition, fontSize, fontInterval, titleName });
    formDataColor.colors.hex8 = gradient == 1 ? '' : startGradientColor;
    formDataColor.colors0.hex8 = gradient == 1 ? startGradientColor : '';
    formDataColor.colors100.hex8 = gradient == 1 ? endGradientColor : '';
    formDataColor.gradation = gradient == 1 ? true : false;
    formDataColor.irRotb = gradientType == 1 ? 'to bottom' : gradientType == 2 ? 'to right' : '';
    EidtVisible.value = true;
  };

  const sbumit = () => {
    formRef.value.validate().then((res) => {
      const { namePosition, titleName, fontInterval, fontSize, namePositionCode } = formData;
      const { colors, colors0, colors100, gradation, irRotb } = formDataColor;
      const data = {
        namePosition,
        titleName,
        fontInterval,
        fontSize,
        startGradientColor: gradation ? colors0.hex8 : colors.hex8,
        namePositionCode,
        endGradientColor: gradation ? colors100.hex8 : colors.hex8,
        gradient: gradation ? 1 : 0,
        gradientType: irRotb == 'to bottom' ? 1 : irRotb == 'to right' ? 2 : '',
      };
      editName(data).then((res) => {
        message.success('操作成功');
        EidtVisible.value = false;
        getList();
        clearForm();
      });
    });
  };

  const showUpdateImg = (record) => {
    const { namePositionCode, namePosition, height, width, imageUrl } = record;
    Object.assign(logoData, {
      namePositionCode,
      namePosition,
      height,
      width,
      imageUrl,
    });
    EidtVisible1.value = true;
  };

  const imgSbumit = () => {
    formRef.value.validate().then((res) => {
      const { namePositionCode, namePosition, height, width, imageUrl } = logoData;
      const data = {
        namePositionCode,
        namePosition,
        height,
        width,
        imageUrl,
      };
      editLogo(data).then((res) => {
        message.success('操作成功');
        EidtVisible1.value = false;
        getList1();
        clearForm();
      });
    });
  };

  const clearForm = () => {
    Object.assign(logoData, {
      namePositionCode: '',
      namePosition: '',
      height: null,
      width: null,
      imageUrl: null,
    });
    Object.assign(formData, {
      namePositionCode: '',
      namePosition: '',
      fontSize: '',
      titleName: '',
      fontInterval: '',
    });
    Object.assign(formDataColor, initFormColor());
    formRef.value.resetFields();
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
    margin: 0 auto;
  }

  // :deep(.vc-botton-right) {
  //   display: none !important;
  // }

  .deleteIcon {
    position: absolute;
    right: -8px;
    top: -8px;
    width: 20px;
    height: 20px;
    z-index: 10;
  }

  .image_cont {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
