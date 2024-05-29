import { ref, reactive, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import { devicePage, deviceRule, setRules, OCRules, deleteDevice, upodateDevice } from '@/api/alarmList';
import { message, Modal } from 'ant-design-vue';
import to from '@/utils/awaitTo';
export default function useAlarmList(currentRecord) {
  const tableLoading = ref<boolean>(false);
  const current = ref<number>(1);
  const size = ref<number>(10);
  const total = ref<number>(0);
  const dataSource = ref<any>([]);
  const searchForm = reactive({
    deviceType: null,
    name: '',
    deviceSerial: '',
  });

  const columns = ref<any>([
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      key: 'deviceType',
      align: 'center',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '设备序列号',
      dataIndex: 'deviceSerial',
      key: 'deviceSerial',
      align: 'center',
    },
    {
      title: '设备IP地址',
      dataIndex: 'ipAddr',
      key: 'ipAddr',
      align: 'center',
    },
    // {
    //   title: '经纬度',
    //   dataIndex: 'lng',
    //   key: 'lng',
    //   align: 'center',
    //   ellipsis: true,
    // },
    {
      title: '启用/停用',
      dataIndex: 'rulesCount',
      key: 'rulesCount',
      align: 'center',
      width: 130,
    },
    {
      title: '状态',
      dataIndex: 'deviceStatus',
      key: 'deviceStatus',
      align: 'center',
      width: 130,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 320
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

  /**
   * 初始化表单数据。
   */
  function resetFormData() {
    searchForm.deviceType = null;
    searchForm.name = '';
    searchForm.deviceSerial = '';
  }

  //=====获取列表=====
  const getList = async (isReset?: boolean, isPagin?: boolean) => {
    if (isReset) {
      resetFormData();
      current.value = 1;
    }
    if (isPagin) {
      current.value = 1;
    }
    const params: any = {
      pageNum: current.value,
      pageSize: size.value,
      deviceType: searchForm.deviceType,
      name: searchForm.name,
      deviceSerial: searchForm.deviceSerial,
    };
    tableLoading.value = true;
    try {
      const res = await devicePage(params);
      dataSource.value = res.records
      current.value = res.current;
      total.value = res.total;
      size.value = res.size;
    }
    catch (error) {
      console.log('获取列表失败', error);
    }
    finally {
      tableLoading.value = false;
    }
  };
  // 表格分页功能
  const pageChange: any = (pag: { pageSize: number; current: number }) => {
    current.value = (pag.current);
    size.value = pag.pageSize;
    getList();
  };

  const setSatus = ($event, record, index) => {
    upodateDevice({
      "id": record.id,
      "deviceSerial": record.deviceSerial,
      "name": record.name,
      "deviceType": record.deviceType,
      "lng": record.lng,
      "lat": record.lat,
      "enabled": $event,
    }).then(res => {
      message.success('操作成功')
    }).catch(() => {
      message.warning('操作失败')
      dataSource.value[index].enabled = !$event
    })
  }

  //删除设备
  const deletUs = (id: any) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除该设备数据吗？',
      onOk: async () => {
        const [err] = await to(deleteDevice({ ids: [id] }));
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


  onMounted(() => {
    getList();
  })

  return {
    searchForm,
    columns,
    tableLoading,
    dataSource,
    pagination,
    pageChange,
    setSatus,
    getList,
    deletUs
  };
}
