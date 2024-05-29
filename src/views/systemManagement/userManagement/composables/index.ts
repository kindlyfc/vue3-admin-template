import { ref, reactive, computed, watch, nextTick } from 'vue';
import { Base64 } from 'js-base64';
import { message, Modal } from 'ant-design-vue';
import { USER_MENU } from '@/enums/cacheEnum';
import { Storage } from '@/utils/Storage';
import { debounce } from 'lodash-es'
import { useRoleOpt } from '@/hooks/useRoleOpt';
import {
  getUserpage,
  creatUser,
  deletUser,
  resetPPwd,
  updateUser,
  getOrg,
  getUserRoles,
  getUserOrgs,
  getRoles,
  downtemplate,
  importFile,
  gridDownList,
  resetPwd,
  getGrids
} from '@/api/systemManagement';
import to from '@/utils/awaitTo';
export default function userManage() {
  const { roleOptData } = useRoleOpt();
  const tableLoading = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);
  const visibleModel = ref<boolean>(false);
  const visibleModel1 = ref<boolean>(false);
  const visibleModelPassword = ref<boolean>(false);
  const downloading = ref<boolean>(false);
  const isUpdate = ref<boolean>(false);
  const formRef = ref<any>();
  const current = ref<number>(1);
  const size = ref<string>('10');
  const total = ref<number>(0);
  const dataSource = ref<any>([]);
  const checkedKeys = ref<any>([]);
  const selectedKeys = ref<any>([]);
  const treeData = ref<any>([]);
  const selectUserData = ref<any>([]);
  const grids = ref<any>([]);
  const file = ref<any>()
  const hasJG = ref<boolean>(false);
  const searchForm = reactive({
    name: '',
    mobile: '',
    roleId: undefined,
    enable: null,
  });
  const passWordForm = reactive({
    uid: "",
    originalPassword: "",
    password: ""
  });
  const userInfoForm = reactive<any>({
    uid: '',
    name: '',
    gender: '男',
    password: '',
    confirmPassword: '',
    mobile: '',
    enable: true,
    orgIds: [],
    roleIds: [],
    gridIds: []
  });
  const columns = ref([
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      align: 'center',
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
    },
    {
      title: '所属机构',
      dataIndex: 'orgCount',
      key: 'orgCount',
      align: 'center',
    },
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

  watch(
    () => userInfoForm.roleIds,
    (value) => {
      let nameArr: any = []
      if (!!value?.length) {
        roleOptData.value.forEach(v => {
          if (value.includes(v.value)) {
            nameArr.push(v.label)
          }
        });
        console.log(nameArr);

        if (nameArr.includes('监管人员')) {
          hasJG.value = true
        } else {
          hasJG.value = false
        }
      } else {
        hasJG.value = false
      }
    },
    {
      deep: true,
    },
  );

  const getList = async (isReset?: boolean, isPagin?: boolean) => {
    if (isReset) {
      Object.assign(searchForm, {
        name: '',
        mobile: '',
        roleId: '',
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
      mobile: searchForm.mobile,
      roleId: searchForm.roleId,
      enable: searchForm.enable,
    };
    tableLoading.value = true;
    try {
      const res = await getUserpage(params);
      dataSource.value = res.records;
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
  //弹框关闭
  const closeHandleModal = () => {
    formRef.value.resetFields();
    Object.assign(userInfoForm, {
      uid: '',
      name: '',
      gender: '男',
      password: '',
      mobile: '',
      enable: true,
      orgIds: [],
      roleIds: [],
      gridIds: []
    });
    hasJG.value = false
    // getOrgName();
  };
  //表单提交
  const onSubmit = () => {
    formRef.value.validate().then(async () => {
      const { uid, name, password, gender, mobile, orgIds, confirmPassword, enable, roleIds, gridIds } = userInfoForm;
      //如果全选
      const data: any = {
        uid,
        name,
        gender,
        password: Base64.encode(password),
        mobile,
        enable,
        confirmPassword: Base64.encode(confirmPassword),
        orgIds,
        roleIds,
        gridIds
      };
      if (confirmPassword.trim() !== password.trim()) {
        message.warning(`两次密码不相同`);
        return
      }
      const promise = isUpdate.value ? updateUser : creatUser;
      if (!isUpdate.value) delete data.uid;
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
  //重置密码提交
  const onSubmitPassword = () => {
    formRef.value.validate().then(async () => {
      const { uid, originalPassword, password } = passWordForm;
      if (originalPassword.trim() === password.trim()) {
        message.warning(`两次密码相同`);
        return
      }
      //如果全选
      const data: any = {
        uid,
        originalPassword: Base64.encode(originalPassword),
        password: Base64.encode(password),
      };
      submitLoading.value = true;
      try {
        await resetPwd(data);
        message.success(`修改成功`);
        visibleModelPassword.value = false;
        getList(true);
      } finally {
        submitLoading.value = false;
      }
    });
  };
  //删除用户
  const deletUs = (id: any) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除该用户数据吗？',
      onOk: async () => {
        const [err] = await to(deletUser({ uid: id }));
        if (err) {
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
  //重置用户密码
  const resetPassword = (id: any) => {
    visibleModelPassword.value = true
    passWordForm.uid = id
  };

  //填充编辑数据
  const editUs = async (record: any, type: boolean) => {
    if (type) {
      visibleModel.value = true;
      isUpdate.value = true;
    } else {
      visibleModel1.value = true;
    }
    const { uid, name, mobile, gender, enable, roleIds, gridIds } = record;
    await getOrgRoles(uid);
    await getOrgCount(uid);
    await getGridsC(uid);
    findGridName(gridIds);
    const data = {
      uid,
      name,
      mobile,
      gender,
      roleIds,
      enable,
      gridIds
    };
    Object.assign(userInfoForm, data);
  };

  const findGridName = (gridIds) => {
    grids.value = gridList.value.filter((v) => { return gridIds?.includes(v.value) })
  }

  //获取组织树
  const expandedKeys = ref<any>([]);
  const getOrgName = async (value?: string) => {
    const params: any = {
      isFromQuery: false
    };
    const res = await getOrg(params);
    treeData.value = recursionDaTa(res);
    expandedKeys.value = [treeData.value[0].key]
  };
  getOrgName();
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
        key: v.id,
        disabled: v.disabled,
        children,
      });
    });

    return tree;
  };

  //树节点选择
  const onCheck = (checkedKeys) => {
    userInfoForm.orgIds = checkedKeys;
  };
  //获取单个用户区域
  const getGridsC = (uid) => {
    nextTick(() => {
      getGrids({ uid }).then(res => {
        grids.value = res
        userInfoForm.gridIds = grids.value.map((v) => {
          return v.id;
        });
      })
    })
  };
  //获取单个用户机构
  const getOrgCount = (uid) => {
    nextTick(() => {
      getUserOrgs(uid).then(res => {
        selectUserData.value = res
        userInfoForm.orgIds = selectUserData.value.map((v) => {
          return v.id;
        });
      })
    })
  };
  //获取单个用户角色
  const roles = ref<any>([])
  const getOrgRoles = (uid) => {
    nextTick(() => {
      getUserRoles(uid).then(res => {
        roles.value = res
        userInfoForm.roleIds = roles.value.map((v) => {
          return v.id;
        });
      })
    })
  };
  //获取区域数据
  const gridList = ref<any>([])
  const getgridDownList = () => {
    nextTick(() => {
      gridDownList().then(res => {
        gridList.value = res.map(v => {
          return {
            value: v.id,
            label: v.name,
          }
        }
        )
      })
    })
  };
  getgridDownList()
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
  //下载导入模板
  const downTemple = () => {
    downtemplate().then(() => {
      message.success('下载成功')
    })
  }
  /* 导入 */
  const fileInfo = ($event) => {
    // 获取input标签选择的文件,并选择第一条
    let resultFile: any = $event.srcElement.files[0]
    if (resultFile?.name?.split('.')[1] !== 'xlsx') {
      message.warning('导入文件格式应该为xlsx')
      return
    }
    // 若是文件存在
    if (resultFile) {
      // 获取文件信息
      file.value = resultFile
      const formData = new FormData();
      formData.append('file', resultFile);
      downloading.value = true
      importFile(formData).then(() => {
        message.success('导入成功')
        getList()
      }).catch(() => {
        message.warning('导入失败')
      }).finally(() => {
        downloading.value = false
      })
    }
  }
  return {
    formRef,
    searchForm,
    columns,
    tableLoading,
    hasJG,
    dataSource,
    pagination,
    submitLoading,
    visibleModel,
    visibleModel1,
    pageChange,
    userInfoForm,
    downloading,
    isUpdate,
    treeData,
    checkedKeys,
    selectedKeys,
    selectUserData,
    expandedKeys,
    roles,
    gridList,
    grids,
    visibleModelPassword,
    onSubmitPassword,
    passWordForm,
    fileInfo,
    onCheck,
    getOrgName,
    getList,
    downTemple,
    closeHandleModal,
    onSubmit,
    getOrgRoles,
    deletUs,
    editUs,
    getOrgCount,
    resetPassword,
  };
}
