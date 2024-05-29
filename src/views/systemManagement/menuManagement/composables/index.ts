import { ref, reactive, computed } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { getMenu, creatMenu, deleteMenu, updateMenu } from '@/api/systemManagement';
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
  const treeData = ref<any>();
  const isUpdate = ref<boolean>(false)
  const isHaveParent = ref<boolean>(false)
  const searchForm = reactive({
    orgName: '',
    status: null,
  });
  const orgForm = reactive({
    id: '',
    name: "",
    permKey: "",
    iconClass: "",
    sort: "",
    routing: "",
    parentId: 0,
    type: 0,
    isCache: true,
    display: true,
    routingParam: "",
    enable: true,
  });
  const columns = ref([
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      align: 'center',
    },
    {
      title: '图标',
      dataIndex: 'iconClass',
      key: 'iconClass',
      align: 'center',
    },
    {
      title: '路由地址',
      dataIndex: 'routing',
      key: 'routing',
      align: 'center',
    },
    {
      title: '权限字符',
      dataIndex: 'permKey',
      key: 'permKey',
      align: 'center',
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'creatTime',
    //   key: 'creatTime',
    //   align: 'center',
    //   width: 100,
    // },
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
      const res = await getMenu(params);
      dataSource.value = res
      treeData.value = [{
        label: `主类目(${recursionDaTa(res).length})`,
        value: 0,
        children: recursionDaTa(res)
      }]
    } finally {
      tableLoading.value = false;
    }
  };
  //递归赋值
  const recursionDaTa = (data: Array<any>) => {
    const tree: any = [];
    data.forEach((v) => {
      let children: any = [];
      if (v.children?.length > 0) {
        children = recursionDaTa(v.children);
      }
      tree.push({
        label: v.name,
        value: v.id,
        children,
      });
    });

    return tree;
  };

  //弹框关闭
  const closeHandleModal = () => {
    formRef.value.resetFields();
    Object.assign(orgForm, {
      id: '',
      name: "",
      permKey: "",
      iconClass: "",
      sort: "",
      routing: "",
      parentId: 0,
      type: 0,
      isCache: true,
      display: true,
      routingParam: "",
      enable: true,
    });
  };
  //表单提交
  const onSubmit = () => {
    formRef.value.validate().then(async () => {
      const {
        id,
        name,
        permKey,
        iconClass,
        sort,
        routing,
        parentId,
        type,
        isCache,
        display,
        routingParam,
        enable,
      } = orgForm;
      const data: any = {
        id,
        name,
        permKey,
        iconClass,
        sort,
        routing,
        parentId,
        type,
        isCache,
        display,
        routingParam,
        enable,
      };

      if (!isUpdate.value) delete data.id
      // if (!isHaveParent.value) delete data.parentId
      const promise = !isUpdate.value ? creatMenu : updateMenu
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
  //删除菜单
  const deletUs = (id: any) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除该菜单数据吗？',
      onOk: async () => {
        const [err] = await to(deleteMenu({ id }));
        if (err) {
          // message.destroy();
          // message.error('删除失败');
          return;
        }
        message.success('删除成功');
        getList();
      },
    });
  };

  //填充编辑数据
  const editUs = (record: any, types) => {
    const {
      id,
      name,
      permKey,
      iconClass,
      sort,
      routing,
      parentId,
      type,
      isCache,
      display,
      routingParam,
      enable,
    } = record;
    const data = {
      id,
      name,
      permKey,
      iconClass,
      sort,
      routing,
      parentId,
      type,
      isCache,
      display,
      routingParam,
      enable,
    };
    Object.assign(orgForm, data);
    if (types) {
      visibleModel.value = true;
      isUpdate.value = true
    } else {
      visibleModel1.value = true;
    }
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
    isHaveParent,
    visibleModel1,
    treeData,
    getList,
    closeHandleModal,
    onSubmit,
    deletUs,
    editUs,
  };
}
