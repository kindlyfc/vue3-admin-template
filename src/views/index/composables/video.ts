import { nextTick, onUnmounted, ref, watch } from "vue";
import { chcekMonitorNum } from '@/api/systemManagement';
import { eventReportCameras, getURIByDeviceId } from '@/api/eventManage';
import { deviceList } from '@/api/common';

export default function useVideo(orgId) {
  const treeData: any = ref<any>([]); // 所有设备列表
  // const deviceIds = ref<string[]>([]); // 选中设备id列表
  const playingUrls = ref<any[]>([]); // 正在播放的视频地址
  const optionDevice = ref<any>([]);//设备列表
  const deviceIds = ref<any>([])//设备id集合
  let videoUrls: any[] = [] // 所有视频地址列表

  watch(orgId, async (newVal) => {
    if (newVal) {
      getDeviceList(newVal)
      // const res = await eventReportCameras({ sort: 2, orgId: newVal })
      // treeData.value = res.map((item) => ({
      //   label: item.name,
      //   value: item.id,
      // }))

      // deviceIds.value = res.map((item) => item.id).slice(0, 4)
      // deviceIds.value.forEach(async (item, index) => {
      //   try {
      //     const res = await getURIByDeviceId(item)
      //     playingUrls.value.push({
      //       id: item,
      //       url: res
      //     })s
      //   } catch {
      //     playingUrls.value.push({
      //       id: item,
      //       url: ''
      //     })
      //   }
      // if (index === 3) {
      //   videoCarousel()
      // }

    }
  })

  /**
   * 选择设备
   * @param ids 选中的设备id列表
   */
  const chooseDevice = (ids) => {
    // 对比ids和originDeviceIds，找出新增的和减少的，新增的放入deviceIds，减少的从deviceIds中删除
    // const addIds = ids.filter((item) => !originDeviceIds.includes(item))
    // const deleteIds = originDeviceIds.filter((item) => !ids.includes(item))
    // deviceIds.value = deviceIds.value.filter((item) => !deleteIds.includes(item))
    // deviceIds.value = deviceIds.value.concat(addIds)
    // originDeviceIds = ids

    // 获取新选择的设备播放地址
    // addIds.forEach(async (item) => {
    //   const res = await getURIByDeviceId(item)
    //   videoUrls.push({
    //     id: item,
    //     url: res
    //   })
    // })

    // 删除videoUrls中deleteIds对应的项
    // videoUrls = videoUrls.filter((item) => !deleteIds.includes(item.id))
  }

  // 设备列表
  const getDeviceList = async (id, name = '') => {
    const res = await deviceList(id, name);
    optionDevice.value = res.map((v) => {
      return {
        label: v.name,
        value: v.uuid,
      };
    });
    // deviceIds.value = optionDevice.value.map((item) => item.value).slice(0, 4)
    // getURL()
  };

  //视频流请求机制
  const getURL = () => {
    playingUrls.value = []
    for (let i = 0; i < 4; i++) {//为了常显4个播放框
      playingUrls.value.push({
        id: null,
        url: ''
      })
    }

    deviceIds.value.forEach(async (item, index) => {
      try {
        const res = await getURIByDeviceId(item)
        playingUrls.value[index] = {
          id: item,
          url: res
        }
      } catch {
        playingUrls.value[index] = {
          id: item,
          url: ''
        }
      }
    })
  }

  //最多选择4个设备
  const divceChange = ($event) => {
    if ($event.length > 4) {
      deviceIds.value.shift()
    }
    getURL()
  }

  /**
   * 视频轮播
   */
  let timer: any = null
  const videoCarousel = () => {
    const deviceIdList = treeData.value.map((item) => item.value) // 全部设备id
    let newPlayingDeviceIdList = [] // 轮播后新的设备id列表

    timer = setInterval(() => {
      console.log('轮播开始')

      let index = deviceIdList.indexOf(newPlayingDeviceIdList[0]) === -1 ? 0 : deviceIdList.indexOf(newPlayingDeviceIdList[0])
      const carouselSize = 2
      const palyingVideoCount = 4

      // 整理一次轮播后，新的设备id列表
      newPlayingDeviceIdList = deviceIdList.slice(index + carouselSize, index + carouselSize + palyingVideoCount)
      if (newPlayingDeviceIdList.length < palyingVideoCount) {
        console.log(newPlayingDeviceIdList, deviceIdList.slice(0, palyingVideoCount - newPlayingDeviceIdList.length))
        newPlayingDeviceIdList = newPlayingDeviceIdList.concat(deviceIdList.slice(0, palyingVideoCount - newPlayingDeviceIdList.length))
      }

      // 遍历“轮播后新的设备id列表”，若不存在播放地址的，则获取播放地址、更新播放地址
      newPlayingDeviceIdList.forEach((item) => {
        console.log(!playingUrls.value.map(item => item.id).includes(item), playingUrls.value, item)
        if (!playingUrls.value.map(item2 => item2.id).includes(item)) {
          getURIByDeviceId(item).then(res => {
            playingUrls.value.push({
              id: item,
              url: res
            })
          })
            .catch(() => {
              playingUrls.value.push({
                url: '',
                id: item
              })
            })
        }
      })

      // 删除前两个播放地址
      playingUrls.value.splice(0, carouselSize)

    }, 20 * 1000)
  }
  onUnmounted(() => {
    // clearInterval(timer)
    // timer = null
  })

  return {
    playingUrls,
    deviceIds,
    optionDevice,
    treeData,
    chooseDevice,
    divceChange
  }
}