import { ref, reactive } from 'vue';
import {
  sendCmd,
  dataConfigPage
} from '@/api/alarmList';
import to from '@/utils/awaitTo';
import { message, Modal } from 'ant-design-vue';
import router from '@/router';
export default function modal() {
  const modalVisible = ref<boolean>(false);
  const cmdlVisible = ref<boolean>(false);
  const cnVisible = ref<boolean>(false);
  const isDisable = ref<boolean>(false);
  const cmdLoading = ref<boolean>(false);
  const imagVisible = ref<boolean>(false);
  const currentRecord = ref<any>([]);
  const rulesOptions = ref<any>([]);
  const snapshot = ref<any>('');
  const hasImage = ref<boolean>(false);
  const formRef = ref<any>();
  const deviceSerial = ref<any>();
  const form = ref<any>({
    configId: ""
  });
  const deviceId = ref<any>();
  const rules = reactive({
    configId: [{ required: true, message: '必填项' }]
  });
  /**
   * 当日识别记录
   * @param record 记录数据
   */
  const showModal = (record?) => {
    if (!record) { modalVisible.value = true; }
    else {
      switch (record.deviceType) {
        case 1:
          router.push({
            path: '/iotDevice/dataConfiguration',
          });
          break;

        default:
          modalVisible.value = true
          currentRecord.value = record
          isDisable.value = true
          break;
      }
    }

  }

  /* 获取数据配置分页列表 */
  const getConfigPage = () => {
    dataConfigPage({ pageNum: 1, pageSize: 100 }).then((res) => {
      rulesOptions.value = res.records.map((v) => {
        return {
          label: v.cmd,
          value: v.id,
        };
      });
    });
  };
  getConfigPage();
  /**
   * 显示记录弹窗
   * @param record 记录信息
   */
  function showRecordModal(record: any) {
    deviceSerial.value = record.deviceSerial
    cmdlVisible.value = true
  }
  /**
 * 显示内容弹窗
 * @param record 记录信息
 */
  function showContentModal(record: any) {
    cnVisible.value = true
  }
  /**
    * 显示抓拍弹窗
    * @param record 抓拍信息
    */
  function showImageModal(record: any) {
    if (!record.snapshot) {
      message.warning('暂无抓拍图片');
      return
    }
    snapshot.value = (import.meta.env.VITE_BASE_API || 'http://182.148.114.142:2670') +
      '/v1/file?uri=' + record.snapshot
    imagVisible.value = true
    hasImage.value = !!record.snapshot
  }
  /**
   * 显示下发弹窗
   * @param record 下发信息
   */
  const UPSDetail = ref<any>()
  async function submitCmd(record: any) {
    formRef.value.validate().then(async () => {
      cmdLoading.value = true;
      try {
        const res = await sendCmd({
          "deviceSerial": deviceSerial.value,
          "configId": form.value.configId
        })
        UPSDetail.value = res
        cnVisible.value = true
        form.value.configId = '';
        cmdlVisible.value = false;
        message.success('下发成功');
      } finally {
        cmdLoading.value = false;
      }
    });
  }
  /**
   * 弹窗关闭
   */
  const closeModal = () => {
    modalVisible.value = false;
    currentRecord.value = {};
    isDisable.value = false;
  }

  return {
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
    showImageModal
  };
}
