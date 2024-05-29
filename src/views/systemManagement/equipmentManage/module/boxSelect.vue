<template>
  <!-- 详情弹框 -->
  <div class="flex">
    <div>
      <div id="image_container" @mouseup="doMouseup">
        <img @mousedown="doMousedown" @mousemove.prevent="doMousemove" @mouseup="doMouseup" :src="imgData.img"
          class="main_image" id="movebox" alt="" />
        <div v-for="(item, index) in boxList" :key="index"
          :style="`position: absolute;left:${item.left}px;top:${item.top}px;width:${item.width}px;height:${item.height}px;border-color:${item.color};`">
        </div>
      </div>
      <div class="btn_container">
        <a-button type="danger" class="mr20px!" b-rd-6px @click="closeOCR">
          关闭OCR识别
        </a-button>
        <a-button b-rd-6px class="mr20px!" @click="back">
          <svg-icon name="ht" size="16" class="mr-6px"></svg-icon>
          回退
        </a-button>
        <a-button type="primary" b-rd-6px @click="painting">
          <svg-icon v-if="!isPending" name="jt" size="18" class="text-white mr-6px"></svg-icon>
          {{ isPending ? '取消' : '开始框选' }}
        </a-button>
      </div>
    </div>
    <div class="list_container">
      <div class="list_title">识别内容配置</div>
      <div class="list_bodaytitle">
        <div>文本区域</div>
        <div>字段名称</div>
        <div>操作</div>
      </div>
      <div v-if="boxList.length > 0" class="list_body">
        <div class="list_bodaytitle list_th" v-for="( item, index ) in  boxList " :key="index">
          <div :style="{ color: item.color }"><span style="color: red">*</span> 文本区域{{ index + 1 }}</div>
          <!-- <div><a-input placeholder="请输入" v-model:value="item.content"></a-input></div> -->
          <div>
            <a-tree-select v-model:value="item.content" show-search style="width: 100%" :tree-data="props.treeData"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :disabled="index == boxList.length - 1 ? isPending : false" placeholder="请选择" allow-clear
              tree-default-expand-all @change="onChange($event, index)" />
          </div>
          <div><a-button type="link" danger @click="delet(index)">删除</a-button></div>
        </div>
      </div>
      <div v-if="boxList.length == 0" class="nodata"> 暂无配置内容,请在左侧图中框选</div>
      <div class="btn_container1" v-if="boxList.length > 0">
        <a-button type="primary" class="text-#3A6DFE mr20px!" ghost b-rd-6px @click="cancel">
          取消
        </a-button>
        <a-button type="primary" b-rd-6px @click="save" :loading="props.loading">
          保存
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { TreeSelect, Modal, message } from 'ant-design-vue';
const boxList = ref<any>([]);
const isPending = ref<boolean>(false);
const props = defineProps({
  imgData: {
    type: Object,
    required: true,
    defauit: () => { },
  },
  treeData: {
    type: TreeSelect.DefaultOptionType,
    required: true,
    defauit: () => [],
  },
  itemData: {
    type: Object,
    required: true,
    defauit: () => { },
  },
  loading: {
    type: Boolean,
    required: true,
    defauit: false,
  },
});
//生成随机色
const getRandomColor = () => {
  let str = '#';
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  for (let i = 0; i < 6; i++) {
    const num = parseInt(Math.random() * 16);
    str += arr[num];
  }
  return str;
};
watch(
  () => props.itemData.ocrDeviceAreaConfig,
  (newValue) => {
    if (newValue?.length > 0) {
      boxList.value = []
      const heightNUM: any = (props.imgData.height / 730).toFixed(4)//高比例
      const widthNUM: any = (props.imgData.width / 1240).toFixed(4)//宽比例
      newValue.forEach(v => {
        boxList.value.unshift({
          color: getRandomColor(),//随机颜色
          content: `${v.fieldName}-${v.standardValue}-${v.type}`,
          width: v.width / widthNUM,
          height: v.height / heightNUM,
          InitialT: v.leftTopY / heightNUM, //初始点top
          InitialL: v.leftTopX / widthNUM, //初始点left
          top: v.leftTopY / heightNUM,
          left: v.leftTopX / widthNUM,
          isAbsW: '', //是否为负数的宽 true 是 false 不是
          isAbsH: '', //是否为负数的高 true 是 false 不是
          isPending: false, //当前是否在进行画图
        })
      });
    }
  },
  { deep: true, immediate: true },
);
//开始绘画
const doMousedown = ($event) => {
  const index = boxList?.value.length - 1
  if (isPending.value && boxList?.value[index]?.top == '' && boxList?.value[index]?.left == '') {
    boxList.value[index].top = $event.offsetY;
    boxList.value[index].InitialT = $event.offsetY;
    boxList.value[index].left = $event.offsetX;
    boxList.value[index].InitialL = $event.offsetX;
  }
  boxList.value[index].isPending = true;
};
//拖动
const doMousemove = ($event) => {
  const movebox: any = document.getElementById('movebox');
  movebox.addEventListener('mousedown', function (e) {
    e.preventDefault && e.preventDefault();
  }); //去除默认图片拖动事件
  const index = boxList?.value.length - 1
  if (isPending.value && boxList.value[index].isPending) {
    let height = $event.offsetY - boxList.value[index].InitialT;
    let width = $event.offsetX - boxList.value[index].InitialL;
    //$event.offsetY > 5是为了避免初始时$event.offsetY值为负数(浏览器误差)时框选混乱
    if ($event.offsetY > 5 && Number(height) < 0) {
      boxList.value[index].isAbsH = true;
      boxList.value[index].top = $event.offsetY;
      height = Math.abs(height);
    }
    if ($event.offsetX > 5 && Number(width) < 0) {
      boxList.value[index].isAbsW = true;
      boxList.value[index].left = $event.offsetX;
      width = Math.abs(width);
    }

    boxList.value[index].height = height;
    boxList.value[index].width = width;
  }
};

//抬起
const doMouseup = () => {
  const index = boxList?.value.length - 1
  boxList.value[index].isPending = false;
  isPending.value = false;
};
const back = () => {
  boxList.value.pop();
  isPending.value = false;
};

// offsetX
const painting = () => {
  if (!isPending.value) {
    boxList.value.push({
      color: getRandomColor(),//随机颜色
      content: '',
      width: '',
      height: '',
      InitialT: '', //初始点top
      InitialL: '', //初始点left
      top: '',
      left: '',
      isAbsW: '', //是否为负数的宽 true 是 false 不是
      isAbsH: '', //是否为负数的高 true 是 false 不是
      isPending: false, //当前是否在进行画图
    });
    isPending.value = true;
  } else {
    const index = boxList?.value.length - 1
    if (boxList?.value[index]?.InitialT == '' || boxList?.value[index]?.InitialL == '') {
      boxList.value.pop();
    }
    isPending.value = false;
  }
};


//删除
const delet = (index) => {
  boxList.value.splice(index, 1);
  isPending.value = false;
};

const emit = defineEmits(['update:value', 'cancel', 'save', 'closeOCR']);

const cancel = () => {
  emit('cancel')
}

//关闭ocr
const closeOCR = () => {
  Modal.confirm({
    title: '您确定要关闭此设备的OCR识别吗？',
    centered: true,
    onOk: async () => {
      emit('closeOCR')
    },
  });
}

//下拉树选中
const onChange = ($event, index) => {
  for (let i = 0; i < boxList.value.length; i++) {
    const v = boxList.value[i];
    if (index !== i && $event == v.content) {
      message.warning('字段名称重复');
      boxList.value[index].content = ''
      return
    }
  }
}

//保存
const save = () => {
  console.log(boxList.value);
  for (let i = 0; i < boxList.value.length; i++) {
    const v = boxList.value[i];
    if (!v.content || v.content?.length == 0) {
      message.warning('请将字段名称填写完整');
      return
    }
  }
  const arr: any = []
  const heightNUM: any = (props.imgData.height / 730).toFixed(4)//高比例
  const widthNUM: any = (props.imgData.width / 1240).toFixed(4)//宽比例
  boxList.value.forEach(v => {
    const str = v.content.split('-')
    arr.push({
      "standardValue": str[1],
      "fieldName": str[0],
      "width": v.width * widthNUM,
      "leftTopX": v.left * widthNUM,
      "deviceName": props.itemData.name,
      "height": v.height * heightNUM,
      "leftTopY": v.top * heightNUM,
      "deviceUuid": props.itemData.uuid,
      "cameraId": props.itemData.id,
      "type": Number(str[2])
    })
  });
  emit('save', arr)
}


defineExpose({});
</script>
<style lang="less" scoped>
#image_container {
  width: 100%;
  overflow: hidden;
  position: relative;

  >div {
    // border: 2px solid #09ff53;
    border: 2px solid;
    z-index: 1000000;
  }
}

.main_image {
  width: 1240px; //前端规定的宽
  height: 730px; //前端规定的高
  margin: 0 !important;
  overflow: hidden;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: default;
  border-radius: 6px;
}

.btn_container {
  text-align: center;
  margin: 20px 0;

  .ant-btn {
    border-radius: 6px !important;
    height: 30px !important;
    box-sizing: border-box !important;
  }

  .ant-btn-primary {
    width: 110px !important;

    .svg-icon {
      vertical-align: -4px;
    }
  }

  .ant-btn-danger {
    width: 114px !important;
  }
}

.btn_container1 {
  text-align: center;
  margin: 20px 0;

  .ant-btn {
    border-radius: 6px !important;
    height: 30px !important;
    box-sizing: border-box !important;
  }
}

.list_container {
  margin-left: 20px;
  flex: 1;

  .list_title {
    font-weight: 500;
    font-size: 17px;
  }

  .list_bodaytitle {
    margin-top: 15px;
    display: flex;
    height: 40px;
    background-color: #e4f6ff;

    >div {
      flex: 2;
      text-align: center !important;
      line-height: 40px;
    }

    >div:nth-child(2) {
      flex: 4 !important;
      padding: 0 10px;
    }

    >div:nth-child(3) {
      flex: 1 !important;
      text-align: center;
      padding: 0;
    }
  }

  .list_body {
    width: 100%;
    overflow-y: auto;
    min-height: 80px;
    max-height: 650px;
    border-top: 1px solid #eee;

    .list_th {
      height: 50px;
      margin-top: 0;
      background-color: #fff;
      border-bottom: 1px solid #eee;

      >div {
        line-height: 50px;
      }
    }
  }
}

.nodata {
  text-align: center;
  line-height: 160px;
  font-size: 15px;
  color: #333;
}
</style>
