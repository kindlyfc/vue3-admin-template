<template>
  <div class="flex justify-between flex-wrap">
    <a-card title="身份证识别" class="w-855px">
      <div class="flex">
        <imageUpload></imageUpload>
        <a-descriptions class="ml-50px">
          <a-descriptions-item :span="2" label="身份证号">{{
            idCardInfo.cardNum || '--'
          }}</a-descriptions-item>
          <a-descriptions-item :span="2" label="姓名">{{
            idCardInfo.name || '--'
          }}</a-descriptions-item>
          <a-descriptions-item :span="2" label="性别">{{
            idCardInfo.sex || '--'
          }}</a-descriptions-item>
          <a-descriptions-item :span="2" label="民族">{{
            idCardInfo.nation || '--'
          }}</a-descriptions-item>
          <a-descriptions-item :span="2" label="年龄">{{
            idCardInfo.age || '--'
          }}</a-descriptions-item>
          <a-descriptions-item :span="2" label="地址"
            >{{ idCardInfo.idCardAddress || '--' }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>
    <a-card title="银行卡识别" class="w-855px">
      <div class="flex">
        <imageUpload></imageUpload>
        <a-descriptions class="ml-50px">
          <a-descriptions-item :span="2" label="银行名称">{{
            bankCardInfo.bankName || '--'
          }}</a-descriptions-item>
          <a-descriptions-item :span="2" label="银行卡号">{{
            bankCardInfo.cardNo || '--'
          }}</a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>
    <a-card title="营业执照" class="w-855px mt-18px">
      <div class="flex">
        <imageUpload></imageUpload>
        <a-descriptions class="ml-50px">
          <a-descriptions-item :span="2" label="名称">Zhou Maomao</a-descriptions-item>
          <a-descriptions-item :span="2" label="类型">1810000000</a-descriptions-item>
          <a-descriptions-item :span="2" label="住所">Hangzhou, Zhejiang</a-descriptions-item>
          <a-descriptions-item :span="2" label="法定代表人">empty</a-descriptions-item>
          <a-descriptions-item :span="2" label="注册资本">empty</a-descriptions-item>
          <a-descriptions-item :span="2" label="成立日期">No. 18</a-descriptions-item>
          <a-descriptions-item :span="2" label="营业期限">No. 18</a-descriptions-item>
          <a-descriptions-item :span="2" label="经营范围">No. 18</a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import imageUpload from '@/components/basic/image-upload/index.vue';
  import { reactive } from 'vue';

  const idCardInfo = reactive({
    name: undefined,
    age: undefined,
    cardNum: undefined,
    idCardAddress: undefined,
    sex: undefined,
    nation: undefined,
  });

  const bankCardInfo = reactive({
    cardNo: '',
    bankName: '',
  });
</script>
<style scoped lang="less"></style>
