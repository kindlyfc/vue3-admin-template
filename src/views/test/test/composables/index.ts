import { ref, reactive, computed } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { getOrg, addOrg, deleteOrg, editOrg } from '@/api/systemManagement';
import to from '@/utils/awaitTo';
export default function userManage(formRef) {
  const tableLoading = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);
  const visibleModel = ref<boolean>(false);
  const dataSource = ref<any>([]);
  const searchForm = reactive({
    name: undefined,
    enabled: undefined,
  });
  const orgForm = reactive<any>({
    code: undefined,
    name: undefined,
    remark: undefined,
    type: undefined,
    enabled: true,
    parentCode: undefined,
  });
  const typeMap = [{ label: '未知', value: 0 }, { label: '领导部门', value: 1 }, { label: '职能部门', value: 2 }, { label: '执行部门', value: 3 }]
  const columns = ref<any>([
    {
      title: '名称',
      dataIndex: 'name',
      width: 300,
    },
    {
      title: '类型',
      dataIndex: 'type',
      customRender: ({ record }) => typeMap.find(item => item.value === record.type)?.label,
      width: 300,
    },
    {
      title: '描述',
      dataIndex: 'remark',
      width: 300,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 300,
    },
  ]);

  const getList = async (isReset?: boolean) => {
    if (isReset) {
      Object.assign(searchForm, {
        name: undefined,
        enabled: undefined,
      });
    }
    tableLoading.value = true;
    try {
      dataSource.value = await getOrg(searchForm);
    } finally {
      tableLoading.value = false;
    }
  };
  //弹框关闭
  const closeHandleModal = () => {
    Object.assign(orgForm, {
      code: undefined,
      name: undefined,
      remark: undefined,
      type: undefined,
      enabled: true,
      parentCode: undefined,
    });
    formRef.value.resetFields();
    modalTitle.value = '新增机构';
  };
  //表单提交
  const onSubmit = () => {
    formRef.value.validate().then(async () => {
      const { code, name, remark, type, enabled, parentCode } = orgForm;
      console.log(type)
      const data: any = { code, name, type, remark, enabled, parentCode }
      submitLoading.value = true;
      const api = modalTitle.value === '编辑组织机构' ? editOrg : addOrg;
      try {
        await api(data);
        message.success(`操作成功`);
        visibleModel.value = false;
        getList(true);
      } finally {
        submitLoading.value = false;
      }
    });
  };
  //删除机构
  const deletUs = (code: string) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除该机构数据吗？',
      onOk: async () => {
        const [err] = await to(deleteOrg(code));
        if (err) {
          console.log('error', err);
          return;
        }
        message.success('删除成功');
        getList();
      },
    });
  };

  const modalTitle = ref('新增机构')
  const readOlny = ref(false)
  // 点击查看、编辑
  const editUs = (record: any, title: string) => {
    const { code, name, remark, enabled, type } = record;
    Object.assign(orgForm, { code, name, remark, enabled, type });
    visibleModel.value = true;
    modalTitle.value = title;
    readOlny.value = title === '查看组织结构'
  };
  // 点击添加子级
  const addChild = (code: string, title: string) => {
    orgForm.parentCode = code;
    visibleModel.value = true;
    modalTitle.value = title;
  };

  return {
    formRef,
    searchForm,
    columns,
    tableLoading,
    dataSource,
    submitLoading,
    visibleModel,
    orgForm,
    modalTitle,
    getList,
    closeHandleModal,
    onSubmit,
    deletUs,
    editUs,
    addChild,
    readOlny,
    typeMap,
  };
}
