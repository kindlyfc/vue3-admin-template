// 使用 useTableHooks.js 文件
import { reactive, watch, isRef, isReactive, toRefs, type Ref } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { debounce, cloneDeep, isObject } from 'lodash-es';

// 声明fetchData的类型及参数和返回值
type fetchData = (args: { current: number, pageSize: number, [key: string]: any }) => Promise<any>;

interface GetDataFnOptions {
  resetPage?: boolean;
  reset?: boolean;
}

interface GetDataFnParams {
  params?: any;
  options?: GetDataFnOptions;
}

type GetDataFn = (params: GetDataFnParams) => Promise<any>;

// 声明返回的数据类型
interface tableHookData {
  tableData: Ref<any>;
  isLoading: Ref<boolean>;
  error: Ref<unknown>;
  pagination: any;
  pageChange: (params: any) => void;
  resetPage: () => void;
  getData: GetDataFn;
}

interface PaginationData {
  pageSize?: number;
  [key: string]: any
}

interface HookParams {
  fetchData: fetchData;
  paginationData?: PaginationData;
  reqParams?: object;
}

export function useTableHooks(params: HookParams): tableHookData {

  const { fetchData, paginationData, reqParams } = params;

  let defaultData = {};
  let resetDataFlag = false;

  if (reqParams) {
    if (isRef(reqParams)) {
      console.warn('reqParams不接受 ref 对象类型');
    } else if (isObject(reqParams)) {
      defaultData = cloneDeep(reqParams);
      resetDataFlag = true;
    }
  }

  // 分页参数
  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '50', '100', '200'],
    showTotal: (total: number) => `共计 ${total} 条数据`,
    position: ['bottomCenter'],
    ...paginationData,
  });

  const { state, isLoading, error, execute } = useAsyncState((args) => {
    return fetchData(args).then((res: any) => res || {});
  }, { total: 0 }, { immediate: false, });

  /**
   * @description 获取数据方法
   * @returns 请求返回的数据
   */
  const getData: GetDataFn = async (params) => {
    const {
      params: inputParams,
      options,
    } = params;

    if (isLoading.value) return;

    let resetPage, reset;
    resetDataFlag = !isRef(reqParams) && isObject(reqParams);

    if (isObject(options)) {
      resetPage = options.resetPage || false;
      reset = options.reset || false;
    }

    if (resetPage) {
      pagination.current = 1;
      // pagination.pageSize = paginationData?.pageSize || 10;
    }

    if (reset) {
      pagination.current = 1;
      pagination.pageSize = paginationData?.pageSize || 10;

      if (resetDataFlag && reqParams && isObject(reqParams)) {
        for (const key in defaultData) {
          if (Object.prototype.hasOwnProperty.call(defaultData, key)) {
            reqParams[key] = defaultData[key];
          }
        }
      }
    }

    let { current, pageSize } = pagination;

    await execute(0, { current, pageSize, ...(resetDataFlag ? reqParams : {}), ...(inputParams || {}) });
    pagination.total = state?.value?.total || 0;

    return state.value;
  };

  /**
   * 重置分页参数
   */
  const resetPage = () => {
    pagination.current = 1;
    pagination.pageSize = 10;
  }

  // 监听分页变化
  // watch(
  //   () => [pagination.current, pagination.pageSize],
  //   debounce(getData, 300)
  // );

  /**
   * 分页变化
   * @param param0 分页参数
   */
  const pageChange = (param0) => {
    const { current, pageSize } = param0;
    pagination.current = current;
    pagination.pageSize = pageSize;
    getData({});
  }

  // 返回Table和Pagination相应的数据和方法
  return {
    tableData: state,
    isLoading,
    error,
    pagination,
    pageChange,
    resetPage,
    getData,
  };
}
