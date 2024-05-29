import { ref, reactive, computed, watch } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { uniq } from 'lodash-es';
import {
  getRoles,
  creatRoles,
  deleteRoles,
  updateRoles,
  treePerms
} from '@/api/systemManagement';
// import { useUserStore } from '@/store/modules/user';
import to from '@/utils/awaitTo';
import { useTreeSelect } from '@/hooks/useTreeSelect';
export default function userManage() {
  const tableLoading = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);
  const visibleModel = ref<boolean>(false);
  const visibleModel1 = ref<boolean>(false);
  const isUpdate = ref<boolean>(false);
  const formRef = ref<any>();
  const current = ref<number>(1);
  const size = ref<string>('10');
  const total = ref<number>(0);
  const dataSource = ref<any>([]);
  const selectedKeys = ref<any>([]);
  const expandedKeys = ref<any>([]);
  const treeData = ref<any>([]);
  const selectUserData = ref<any>([]);

  const searchForm = reactive({
    name: '',
    enable: null,
  });
  const userInfoForm = reactive<any>({
    id: '',
    name: '',
    roleKey: '',
    sort: '',
    enable: true,
    remark: '',
    permPattern: [],
  });

  const { checkedKeys, getRealCheckedKeys, onCheck } = useTreeSelect(treeData, selectedKeys);

  watch(selectedKeys, (newV) => {
    userInfoForm.permPattern = newV;
  }, { deep: true });


  const columns = ref([
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    // {
    //   title: '角色标识符',
    //   dataIndex: 'roleKey',
    //   key: 'roleKey',
    //   align: 'center',
    // },
    {
      title: '菜单权限',
      dataIndex: 'permPattern',
      key: 'permPattern',
      align: 'center',
    },
    // {
    //   title: '显示顺序',
    //   dataIndex: 'sort',
    //   key: 'sort',
    //   align: 'center',
    // },
    {
      title: '状态',
      dataIndex: 'enable',
      key: 'enable',
      align: 'center',
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

  watch(treeData, (newV) => {
    dataSource.value.forEach((v) => {
      v.realCheckedKeys = getRealCheckedKeys(v.permPattern);
    });
  }, { deep: true });


  //获取列表
  const getList = async (isReset?: boolean, isPagin?: boolean) => {
    if (isReset) {
      Object.assign(searchForm, {
        name: '',
        enable: null,
      });
      current.value = 1;
    }
    if (isPagin) {
      current.value = 1;
    }
    const params: any = {
      current: current.value,
      size: size.value,
      name: searchForm.name,
      enable: searchForm.enable,
    };
    tableLoading.value = true;
    try {
      const res = await getRoles(params);
      dataSource.value = res.records.map((v) => {
        v.realCheckedKeys = getRealCheckedKeys(v.permPattern);
        return v;
      });
      current.value = res.current;
      total.value = res.total;
      size.value = '' + res.size;
    } finally {
      tableLoading.value = false;
    }
  };
  // 表格分页功能
  const pageChange: any = (pag: { pageSize: string; current: number }) => {
    current.value = pag.current;
    size.value = '' + pag.pageSize;
    getList();
  };

  //获取组织树
  const getOrgName = async () => {
    const res = await treePerms();
    treeData.value = recursionDaTa(res);
    expandedKeys.value = [treeData.value[0].key]
  };
  getOrgName()

  //弹框关闭
  const closeHandleModal = () => {
    formRef.value.resetFields();
    Object.assign(userInfoForm, {
      id: '',
      name: '',
      roleKey: '',
      sort: '',
      enable: true,
      remark: '',
      permPattern: [],
    });

    selectedKeys.value = userInfoForm.permPattern;
  };
  //表单提交
  const onSubmit = () => {
    formRef.value.validate().then(async () => {
      const { id, name, roleKey, sort, permPattern, enable, remark } = userInfoForm;
      //如果全选
      const data: any = {
        id, name, roleKey, sort, permPattern, enable, remark
      };
      const promise = isUpdate.value ? updateRoles : creatRoles;
      if (!isUpdate.value) delete data.id;
      submitLoading.value = true;
      try {
        await promise(data);
        message.success(`${isUpdate.value ? '编辑' : '新增'}成功`);
        visibleModel.value = false;
        getList(true);
      } finally {
        submitLoading.value = false;
      }
    });
  };
  //删除角色
  const deletUs = (id: any) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除该角色数据吗？',
      onOk: async () => {
        const [err] = await to(deleteRoles({ id }));
        if (err) {
          console.log('error', err);
          // message.destroy();
          // message.error('删除失败');
          return;
        }
        message.success('删除成功');
        // 若删除得是非首页得最后一条，pageNum-1
        if (current.value > 1 && dataSource.value.length === 1) {
          current.value--;
        }
        getList();
      },
    });
  };


  //填充编辑数据
  const editUs = async (record: any, type: boolean) => {
    if (type) {
      visibleModel.value = true;
      isUpdate.value = true;
    } else {
      visibleModel1.value = true;
    }
    const { id, name, roleKey, sort, permPattern, enable, remark } = record;
    const data = {
      id, name, roleKey, sort, permPattern, enable, remark
    };
    Object.assign(userInfoForm, data);
    selectedKeys.value = userInfoForm.permPattern;
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
        title: v.name,
        key: v.permKey,
        children,
      });
    });


    return tree;
  };

  //过滤权限树数据
  // watch(
  //   () => userMenu.value,
  //   (newV) => {
  //     treeData.value = recursionDaTa(newV);
  //     userInfoForm.roleIds = treeData.value.map((v) => {
  //       return v.key;
  //     });
  //   },
  //   { deep: true, immediate: true },
  // );


  //递归获取菜单key
  const recursion = (data) => {
    const keyArr: any = [];
    data.forEach((v) => {
      if (!v.children || !v.children?.length) {
        keyArr.push(v.permKey);
      } else {
        keyArr.push(...recursion(v.children));
      }
    });
    return keyArr;
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
    visibleModel1,
    pageChange,
    userInfoForm,
    isUpdate,
    treeData,
    checkedKeys,
    selectedKeys,
    expandedKeys,
    selectUserData,
    onCheck,
    getList,
    closeHandleModal,
    onSubmit,
    deletUs,
    editUs,
  };
}
