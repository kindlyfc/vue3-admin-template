<template>
  <div class="content">
    <a-button v-if="btnText" :type="type" :loading="exportLoading" @click="exportHandle">{{
      btnText
    }}</a-button>
    <a-button v-else type="link" :loading="exportLoading" class="flex-ac! exportRecords" @click="exportHandle">
      <svg-icon name="export" size="14" class="mr-4px"></svg-icon>
      <span>导出</span>
    </a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { message } from 'ant-design-vue';
import { exportData } from '@/api/common';

export default defineComponent({
  props: {
    btnText: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'primary',
    },
    url: {
      type: String,
      required: true,
    },
    params: {
      type: Object,
      required: true,
    },
    method: {
      type: String,
      required: false,
    },
  },
  setup(props, { emit }) {
    const exportLoading = ref(false);

    const exportHandle = () => {
      const { url, params, method } = props;

      if (!url) {
        console.log('导出url不能为空');
        return;
      }

      exportLoading.value = true;
      // console.log({ url, params, method });
      // return;

      exportData({ url, params, method })
        .then((result) => {
          // console.log('导出成功：', result);
          emit('success', result);
          console.log(result);
          // blob转json
          if (result instanceof Blob && result.type === 'application/json') {
            const reader = new FileReader(); // 创建读取文件对象
            reader.readAsText(result, 'utf-8'); // 设置读取的数据以及返回的数据类型为utf-8
            reader.addEventListener('loadend', function () {
              //
              const resData = JSON.parse(reader.result as string); // 返回的数据
              if (`${resData.code}`.startsWith('800')) {
                message.info(resData.msg || '导出失败');
                // message.info(`${resData.msg}，请在大数据导出列表中查看。`);
              }
            });
          } else {
            message.success('导出成功');
          }
        })
        .catch((err) => {
          console.log('导出失败：', err);
          emit('fail', err);
        })
        .finally(() => {
          exportLoading.value = false;
        });
    };
    return {
      exportLoading,
      exportHandle,
    };
  },
});
</script>

<style lang="less" scoped>
.content {
  display: inline;
}
</style>
