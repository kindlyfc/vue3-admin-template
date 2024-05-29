import { ref, reactive, computed } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { getOrg, creatOrg, deletOrg, updateOrg, getRoots } from '@/api/systemManagement';
import to from '@/utils/awaitTo';
export default function userManage() {
  const tableLoading = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);
  const visibleModel = ref<boolean>(false);
  const visibleModel1 = ref<boolean>(false);
  const formRef = ref<any>();
  const current = ref<number>(1);
  const size = ref<string>('10');
  const total = ref<number>(0);
  const dataSource = ref<any>();
  const isUpdate = ref<boolean>(false)
  const isHaveParent = ref<boolean>(false)
  const searchForm = reactive({
    orgName: '',
    status: null,
  });
  const orgForm = reactive({
    id: '',
    name: "",
    description: "",
    enable: true,
    parentId: "",
    parentName: "",
    adminName: '',
    adminMobile: '',
  });
  const columns = ref([
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 300,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'enable',
      key: 'enable',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 300,
    },
  ]);
  const pagination: any = computed(() => ({
    sizeOptions: [10, 50, 100, 200],
    showQuickJumper: true,
    showSizeChanger: true,
    total: total.value,
    current: current.value,
    size: size.value,
    showTotal: (total: number) => `共计 ${total} 条数据`,
    position: ['bottomCenter'],
  }));

  const getList = async (isReset?: boolean) => {
    if (isReset) {
      Object.assign(searchForm, {
        orgName: '',
        status: null,
      });
    }

    const params: any = {
      name: searchForm.orgName,
      enable: searchForm.status,
    };
    tableLoading.value = true;
    try {
      const res = await getOrg(params);
      dataSource.value = res
    } finally {
      tableLoading.value = false;
    }
  };

  //新增加子集
  const addChild = (id, name) => {
    isHaveParent.value = true
    orgForm.parentId = id
    orgForm.parentName = name
    isUpdate.value = false
    visibleModel.value = true
  }

  //弹框关闭
  const closeHandleModal = () => {
    formRef.value.resetFields();
    Object.assign(orgForm, {
      id: '',
      name: "",
      description: "",
      enable: true,
      parentId: "",
      adminName: '',
      adminMobile: '',
    });
  };
  //表单提交
  const onSubmit = () => {
    formRef.value.validate().then(async () => {
      const {
        id,
        name,
        description,
        enable,
        parentId,
        adminName,
        adminMobile,
      } = orgForm;
      const data: any = {
        id,
        name,
        description,
        enable,
        parentId,
        adminName,
        adminMobile,
      };

      if (!isUpdate.value) delete data.id
      if (!isHaveParent.value) delete data.parentId
      const promise = !isUpdate.value ? creatOrg : updateOrg
      submitLoading.value = true;
      try {
        await promise(data);
        message.success(`操作成功`);
        visibleModel.value = false;
        closeHandleModal()
        getList(true);
      } finally {
        submitLoading.value = false;
      }
    });
  };
  //删除机构
  const deletUs = (id: any) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除该机构数据吗？',
      onOk: async () => {
        const [err] = await to(deletOrg({ id }));
        if (err) {
          // message.destroy();
          // message.error('删除失败');
          return;
        }
        message.success('删除成功');
        // // 若删除得是非首页得最后一条，pageNum-1
        // if (current.value > 1 && dataSource.value.length === 1) {
        //   current.value--;
        // }
        getList();
      },
    });
  };

  //填充编辑数据
  const editUs = (record: any, type) => {
    const { id,
      name,
      description,
      enable,
      parentId,
      adminName,
      adminMobile,
    } = record;
    const data = {
      id,
      name,
      description,
      enable,
      parentId,
      adminName,
      adminMobile,
    };
    Object.assign(orgForm, data);
    if (type) {
      visibleModel.value = true;
      isUpdate.value = true
    } else {
      visibleModel1.value = true;
    }
  };

  //获取根组织
  const options = ref<any>([]);
  const getOrgName = async () => {
    const res = await getRoots();
    options.value = res.map((v) => {
      return {
        label: v.orgName,
        value: v.id,
      };
    });
  };
  return {
    formRef,
    searchForm,
    columns,
    tableLoading,
    dataSource,
    pagination,
    submitLoading,
    visibleModel,
    orgForm,
    isUpdate,
    options,
    isHaveParent,
    visibleModel1,
    getOrgName,
    getList,
    addChild,
    closeHandleModal,
    onSubmit,
    deletUs,
    editUs,
  };
}
