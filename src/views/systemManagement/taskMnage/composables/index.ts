import { ref, reactive, computed } from 'vue';
import { message, Modal, } from 'ant-design-vue';
import {
  getTaskList,
  deleteTask,
  startTask,
  stopTask,
} from '@/api/systemManagement'
import useGetPersonOpt from '@/hooks/useGetPersonOpt';
import useGetCameraOpt from '@/hooks/useGetCameraOpt';
import to from '@/utils/awaitTo';
export default function userManage() {
  const tableLoading = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);
  const visibleModel = ref<boolean>(false);
  const visibleModel1 = ref<boolean>(false);
  const visibleModel2 = ref<boolean>(false);
  const visibleModel3 = ref<boolean>(false);
  const formRef = ref<any>();
  const current = ref<number>(1);
  const size = ref<string>('10');
  const total = ref<number>(0);
  const dataSource = ref<any>([]);
  const dataSource1 = ref<any>([]);
  const riskList = ref<any>([]);
  const formData = ref<any>({});
  const searchForm = reactive({
    name: '',
    enable: undefined,
    alarmStranger: undefined,
  });
  const treeSelectedKeys = ref<any>([]);

  const columns = ref<any>([
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '摄像头',
      dataIndex: 'camerasName',
      key: 'camerasName',
      align: 'center',
    },
    {
      title: '人员库',
      dataIndex: 'libsName',
      key: 'libsName',
      align: 'center',
    },
    // {
    //   title: '最小阈值',
    //   dataIndex: 'scoreThreshold',
    //   key: 'scoreThreshold',
    //   align: 'center',
    //   width: 90,
    // },
    {
      title: '陌生人告警',
      dataIndex: 'alarmStranger',
      key: 'alarmStranger',
      align: 'center',
      width: 110,
    },
    {
      title: '识别间隔（毫秒）',
      dataIndex: 'recognizeInterval',
      key: 'recognizeInterval',
      align: 'center',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      width: 110,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'enable',
      key: 'enable',
      align: 'center',
      width: 70,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 250,
    },
  ]);

  const { personMap } = useGetPersonOpt();
  const { cameraMap } = useGetCameraOpt();

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
        // disabled: v.disabled,
        children,
      });
    });

    return tree;
  };




  const getList = async (isReset?: boolean, isPagin?: boolean) => {
    if (isReset) {
      Object.assign(searchForm, {
        name: '',
        enable: undefined,
        alarmStranger: undefined,
      });
      treeSelectedKeys.value = [];
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
      alarmStranger: searchForm.alarmStranger,
    };
    tableLoading.value = true;
    try {
      const res = await getTaskList(params);
      dataSource.value = res?.records?.map((v) => {
        v.isActive = v.isActive == 1 ? true : false;
        v.camerasName = v.cameraIds?.map((v) => cameraMap.value[v]).join(',');
        v.libsName = v.libIds?.map((v) => personMap.value[v]).join(',');
        return v;
      }) || [];
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
  };

  /**
   * 删除任务
   * @param id 
   */
  const deletUs = (id: any) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除该任务吗？',
      onOk: async () => {
        const [err] = await to(deleteTask(id));
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

  /**
   * 改变任务状态
   * @param event 
   * @param id 
   */
  const changeStatus = (event: any, record, permObj) => {
    if (event && !permObj?.start) {
      message.warning('您没有权限');
      record.enable = !event;
      return;
    }

    if (!event && !permObj?.stop) {
      message.warning('您没有权限');
      record.enable = !event;
      return;
    }

    Modal.confirm({
      title: '提示',
      content: '确定改变任务状态吗？',
      onOk: async () => {
        (event ? startTask : stopTask)(
          record.taskId
        )
          .then((res) => {
            message.success(`${event ? '启用成功' : '禁用成功'}`);
            getList();
          })
          .catch(() => {
            message.warning(`${event ? '启用失败' : '禁用失败'}`);
            record.enable = !event;
          });
      },
      onCancel: () => {
        record.enable = !event;
      },
    });

  };


  return {
    formRef,
    searchForm,
    treeSelectedKeys,
    columns,
    tableLoading,
    dataSource,
    dataSource1,
    pagination,
    submitLoading,
    visibleModel,
    visibleModel1,
    visibleModel2,
    visibleModel3,
    pageChange,
    formData,
    riskList,
    getList,
    closeHandleModal,
    deletUs,
    changeStatus,
  };
}
