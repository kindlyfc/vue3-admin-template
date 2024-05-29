<template>
  <div :id="mapId" class="amap-container"></div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { message } from 'ant-design-vue';

  const { AMapLoader } = window as any;
  import markerImg from '@/assets/images/marker.png';

  export interface markerOption {
    position: number[];
    offset?: number[];
    icon?: any;
    content?: string;
    innerText?: string;
    animation?: string;
    autoRotation?: boolean;
  }

  export interface BaseAmapReturns {
    getMap(): any;
    getAMap(): any;
    creatMarker(markerOption: markerOption): any;
    map: any;
    AMap: any;
  }

  /**
   * 基础地图组件
   */
  export default defineComponent({
    name: 'BaseAmap',
    props: {
      mapId: {
        type: String,
        default: 'amap-' + new Date().getTime(),
      },
      option: {
        type: Object,
        default: () => {},
      },
    },
    setup(props, { emit }): BaseAmapReturns {
      const map = ref<any>(null);
      const AMap = ref<any>(null);

      /**
       * 初始化地图。
       *
       * @param {type} paramName - 参数描述
       * @return {type} 返回值描述
       */
      function initMap() {
        if (AMapLoader) {
          AMapLoader.load({
            key: '560942d6fa951f83be7e8fa701d99693', // 申请好的Web端开发者Key，首次调用 load 时必填
            version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          })
            .then((_AMap) => {
              AMap.value = _AMap;
              map.value = new AMap.value.Map(
                props.mapId,
                Object.assign(
                  {
                    zoom: 10, // 设置初始缩放级别
                  },
                  props.option,
                ),
              );

              map.value.on('complete', () => {
                // 触发地图加载事件
                emit('loaded', map);
              });
              map.value.on('zoomchange', function (e) {
                //获取当前最新的地图层级
                const zoom = map.value.getZoom();
                // 触发地图加载事件
                emit('zoom', zoom);
              });
            })
            .catch((e) => {
              console.error('加载地图失败', e); //加载错误提示
            });
        } else {
          message.warning('地图功能未开启，请检查相关设置。');
        }
      }

      /**
       * 获取地图实例
       */
      function getMap() {
        return map;
      }
      /**
       * 获取地图对象
       */
      function getAMap() {
        return AMap;
      }
      /**
       * 创建一个在地图上创建锚点的方法
       * @param {type} markerOption - 高德地图锚点所有参数
       * {
       *   position: [116.922361, 36.679222],
       *   offset: [0, 0],
       *   icon: '图片地址或base64或者icon类',
       *   animation: 'AMAP_ANIMATION_DROP',
       *   autoRotation: true
       * }
       */
      function creatMarker(markerOption: markerOption) {
        if (!markerOption) return;

        const position = markerOption.position;

        if (!Array.isArray(position) || position.length !== 2) return;

        if (!map.value) return;

        // const icon = new AMap.Icon({
        //   size: new AMap.Size(22, 30),
        //   image: markerImg,
        //   imageSize: new AMap.Size(22, 30),
        // });

        const content = `
          <div
            style="
              width: 22px;
              height: 30px;
              position: relative;
            "
          >
            <img style="width: 100%; height: 100%; position: absolute; left: 0; top: 0" src="${markerImg}" />
            <span style="position:absolute;top:1px;left:50%;transform:translateX(-50%);color: #fff;font-size: 14px;font-weight: bold;">${
              markerOption?.innerText || ''
            }</span>
          </div>
        `;

        try {
          const marker = new AMap.value.Marker(Object.assign({ content }, markerOption));
          map.value.add(marker);
          return marker;
        } catch (e) {
          console.error('创建锚点失败：', e);
        }
      }

      onMounted(() => {
        initMap();
      });

      return { AMap, map, getMap, creatMarker, getAMap };
    },
  });
</script>

<style scoped>
  .amap-container {
    width: 100%;
    height: 100%;
  }

  :deep(.amap-logo),
  :deep(.amap-copyright) {
    display: none !important;
  }
</style>
