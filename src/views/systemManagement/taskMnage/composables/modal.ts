import { ref } from "vue";
import { message } from 'ant-design-vue';
// import {
// personAdd,
// personModify,
// } from '@/api/rskPersonnel';
/**
 * 弹窗控制
 * @returns 
 */
export default function useModal(getList) {
  // 新增弹窗控制
  const addVisible = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);
  const editRecord = ref<any>({});
  const addType = ref<string>('add');
  const isUpdate = ref<boolean>(false);
  // 显示通过记录弹窗
  const recordVisible = ref<boolean>(false);
  const levelVisible = ref<boolean>(false);
  const currentRecord = ref<any>({})

  //等级列表
  const columnsLevel = ref<any>([
    {
      title: '风险人员等级',
      dataIndex: 'level',
      key: 'level',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
    },
  ]);


  function showAddModal(type: string, record?: any) {
    addVisible.value = true;
    addType.value = type;
    isUpdate.value = type === 'edit';
    if (record) {
      editRecord.value = record;
    }
  }

  /**
   * 显示记录弹窗
   * @param record 记录信息
   */
  function showRecordModal(record: any) {
    recordVisible.value = true;
    currentRecord.value = record;
  }

  /**
  * 显示等级管理弹窗
  */
  function showLevelModal() {
    levelVisible.value = true;
  }

  /**
   * 记录弹窗关闭
   */
  function closeRecordModal() {
    recordVisible.value = false;
    currentRecord.value = {};
  }


  /* 提交表单数据 */
  const personSbumit = async (form) => {
    if (form.imgUrl?.length > 0 && Array.isArray(form.imgUrl)) {
      form.imgUrl = form.imgUrl[0].split(',')[1]
    }
    // if (!isUpdate.value) delete data.uuid;
    // if (!isUpdate.value) delete data.imageUrl;
    // if (!data.file) delete data.file;
    // const params = getFormData(data);
    // const promise = isUpdate.value ? personModify : personAdd;
    // submitLoading.value = true;
    try {
      // await promise(form);
      // message.success(`${isUpdate.value ? '编辑' : '新增'}成功`);
      // addVisible.value = false;
      // getList(true);
    } finally {
      submitLoading.value = false;
    }
  }

  return {
    addVisible,
    editRecord,
    isUpdate,
    submitLoading,
    recordVisible,
    currentRecord,
    levelVisible,
    columnsLevel,
    showRecordModal,
    showLevelModal,
    showAddModal,
    personSbumit,
    closeRecordModal,
  }
}