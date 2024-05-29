
import { ref } from 'vue';
import { getCameraList } from '@/api/systemManagement';

export default function useGetCameraOpt() {

  const cameraOptions = ref<any>([]);
  const cameraMap = ref<any>({});


  /**
   * 获取摄像头列表
   */
  const getCameraOptions = async () => {
    const res = await getCameraList();
    cameraMap.value = {}
    cameraOptions.value = res.map((v) => {
      cameraMap.value[v.id] = v.name;
      return {
        label: v.name,
        value: v.id,
      };
    });
  };

  getCameraOptions();

  return { getCameraOptions, cameraOptions, cameraMap, };

}