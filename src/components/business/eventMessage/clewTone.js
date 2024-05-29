
import girl1 from '@/assets/girl1.mp3';

function getBrowTabIsHidden() {
  return !!window['isHiddenBrowTabs'];
}

// 预警提示音
export function playWaring() {
  
  // 判断该浏览器标签页是否隐藏，如果隐藏则不进行语音播报.
  if (getBrowTabIsHidden()) return;

  // 音频文件
  const src = girl1;
  // 初始化Aduio
  const audio = new Audio();
  audio.src = src;
  audio.autoplay = false;
  audio.play();
  return audio;
}
