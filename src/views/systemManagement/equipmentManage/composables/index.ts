import { ref, reactive, computed, watch } from 'vue';
import { message, Modal } from 'ant-design-vue';
import type { TableProps } from 'ant-design-vue';
import {
  deviceList,
  deviceAdd,
  deletDevice,
  deviceUpdate,
  getOrg,
  discovery,
  getConfig,
  setConfig
} from '@/api/systemManagement';
import to from '@/utils/awaitTo';
import { object } from 'vue-types';
export default function userManage() {
  const tableLoading = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);
  const visibleModel = ref<boolean>(false);
  const visibleModel1 = ref<boolean>(false);
  const visibleModel2 = ref<boolean>(false);
  const visibleModel3 = ref<boolean>(false);
  const visibleModel4 = ref<boolean>(false);
  const isUpdate = ref<boolean>(false);
  const formRef = ref<any>();
  const current = ref<number>(1);
  const size = ref<string>('10');
  const total = ref<number>(0);
  const dataSource = ref<any>([]);
  const dataSource1 = ref<any>([]);
  const selectedRowKeys = ref<Key[]>([]);
  const selectedRows = ref<any>([]);
  const checkedKeys = ref<any>([]);
  const treeData = ref<any>([]);
  const selectUserData = ref<any>([]);
  const rowSelection: TableProps['rowSelection'] = {
    onChange: (rowKeys: string[], rows: any[]) => {
      console.log(`selectedRowKeys: ${rowKeys}`, 'selectedRows: ', rows);
      selectedRowKeys.value = rowKeys;
      selectedRows.value = rows;
    },
    columnWidth: 110,
    selectedRowKeys: selectedRowKeys as any,
  };
  const searchForm = reactive({
    type: null,
    name: null,
    orgId: null,
    manufacturer: null,
  });
  const deviceForm = reactive<any>({
    id: null,
    name: '',
    type: '',
    orgId: '',
    rtsp: '',
    location: '',
    manufacturer: '',
    ip: '',
    port: '',
    username: '',
    password: ''
  });

  const argumentSetdata = reactive<any>({
    captureInterval: null,
    detectInterval: null,
    anglePitch: null,
    angleYaw: null,
    angleRoll: null,
    keypointsConfidence: null,
    videoCodec: null
  });
  const columns = ref([
    {
      title: '摄像头名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
    },
    {
      title: '所属机构',
      dataIndex: 'orgName',
      key: 'orgName',
      align: 'center',
    },
    {
      title: '设备摆放位置',
      dataIndex: 'location',
      key: 'location',
      align: 'center',
    },
    {
      title: '设备厂商',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 320,
    },
  ]);
  const columns1 = ref([
    {
      title: 'ip地址',
      dataIndex: 'ip',
      key: 'ip',
      align: 'center',
    },
    {
      title: 'rtsp地址',
      dataIndex: 'rtsp',
      key: 'rtsp',
      align: 'center',
    },
    {
      title: '设备厂商',
      dataIndex: 'mfrs',
      key: 'mfrs',
      align: 'center',
    },
    {
      title: '添加',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
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
  //切换事件
  const chooseDetail = (num: number) => {
    Object.assign(searchForm, {
      type: null,
      name: null,
      orgId: null,
      manufacturer: null,
    });
    dataSource.value = [];
    total.value = 0;
    getList(true);
  };

  //列表数据
  const getList = async (isReset?: boolean, isPagin?: boolean) => {
    if (isReset) {
      Object.assign(searchForm, {
        type: null,
        name: null,
        orgId: null,
        manufacturer: null,
      });
      current.value = 1;
    }
    if (isPagin) {
      current.value = 1;
    }
    const params: any = {
      current: current.value,
      size: size.value,
      orgId: searchForm.orgId,
      type: searchForm.type,
      name: searchForm.name,
      manufacturer: searchForm.manufacturer,
    };
    tableLoading.value = true;
    try {
      const res = await deviceList(params);
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
    Object.assign(deviceForm, {
      id: null,
      name: '',
      type: '',
      orgId: '',
      rtsp: '',
      location: '',
      manufacturer: '',
      ip: '',
      port: '',
      username: '',
      password: ''
    });
  };
  //表单提交
  const onSubmit = () => {
    formRef.value.validate().then(async () => {
      const { id, name,
        type,
        orgId,
        rtsp,
        location,
        manufacturer,
        ip,
        port,
        username,
        password } =
        deviceForm;
      const data: any = {
        id,
        name,
        type,
        orgId,
        rtsp,
        location,
        manufacturer,
        ip,
        port,
        username,
        password
      };
      const promise = isUpdate.value ? deviceUpdate : deviceAdd;
      if (!isUpdate.value) delete data.id;
      submitLoading.value = true;
      try {
        await promise(data);
        message.success(`${isUpdate.value ? '编辑' : '新增'}成功`);
        visibleModel.value = false;
        closeHandleModal()
        getList(true);
      } finally {
        submitLoading.value = false;
      }
    });
  };
  //删除设备
  const deletUs = (id: any) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除该摄像头数据吗？',
      onOk: async () => {
        const [err] = await to(deletDevice(id));
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

  //填充编辑数据-智慧盒子
  const editUs = async (record: any, types: boolean) => {
    const {
      id,
      name,
      type,
      orgId,
      rtsp,
      location,
      manufacturer,
      ip,
      port,
      username,
      orgName,
      password } =
      record;
    const data = {
      id,
      name,
      type,
      orgId,
      rtsp,
      location,
      manufacturer,
      ip,
      port,
      orgName,
      username,
      password
    };
    Object.assign(deviceForm, data);
    if (types) {
      visibleModel.value = true;
      isUpdate.value = true;
    } else {
      visibleModel1.value = true;
    }
  };
  //获取当前用户下组织机构
  const getOrgName = async (value?: string) => {
    const res = await getOrg({});
    treeData.value = recursionDaTa(res)
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


  //开启全局设置弹框
  const setDeviceData = () => {
    visibleModel3.value = true
    getConfig().then(res => {
      Object.assign(argumentSetdata, res)
    })
  }

  //发现摄像头列表
  const findDevice = () => {
    visibleModel2.value = true
    discovery().then(res => {
      dataSource1.value = res
    })
  }

  //列表添加摄像头
  const AddDevice = (record: any) => {
    visibleModel.value = true
    Object.assign(deviceForm, {
      ip: record.ip,
      rtsp: record.rtsp
    })
  }

  //全局摄像头提交
  const onSubmit1 = () => {
    formRef.value.validate().then(async () => {
      const { captureInterval,
        detectInterval,
        anglePitch,
        angleYaw,
        angleRoll,
        keypointsConfidence,
        videoCodec } =
        argumentSetdata;
      const data: any = {
        captureInterval,
        detectInterval,
        anglePitch,
        angleYaw,
        angleRoll,
        keypointsConfidence,
        videoCodec
      };

      submitLoading.value = true;
      try {
        await setConfig(data);
        message.success(`操作成功`);
        visibleModel3.value = false;
        closeHandleModal1()
      } finally {
        submitLoading.value = false;
      }
    });
  }
  //参数设置弹框关闭
  const closeHandleModal1 = () => {
    formRef.value.resetFields();
    Object.assign(argumentSetdata, {
      captureInterval: null,
      detectInterval: null,
      anglePitch: null,
      angleYaw: null,
      angleRoll: null,
      keypointsConfidence: null,
      videoCodec: null
    });
  };
  return {
    formRef,
    searchForm,
    columns,
    columns1,
    tableLoading,
    dataSource,
    dataSource1,
    treeData,
    pagination,
    submitLoading,
    visibleModel,
    visibleModel1,
    visibleModel2,
    visibleModel3,
    pageChange,
    deviceForm,
    isUpdate,
    checkedKeys,
    selectedRowKeys,
    selectUserData,
    rowSelection,
    selectedRows,
    visibleModel4,
    argumentSetdata,
    getOrgName,
    getList,
    closeHandleModal,
    closeHandleModal1,
    onSubmit,
    deletUs,
    editUs,
    setDeviceData,
    chooseDetail,
    findDevice,
    AddDevice,
    onSubmit1
  };
}
