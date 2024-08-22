<template>
  <div id="app">
    <h1>{{ title }}</h1>
    <br />

    <form @submit.prevent="getPolicyForm">
      <label>
        桶名
        <input type="text" v-model="policyParams.bucket" />
      </label>
      <br />
      <label>
        文件名
        <input type="text" v-model="policyParams.filename" />
      </label>
      <br />
      <button type="submit">获取上传凭证</button>
      <br />
      <div v-for="(val, key) in policy" :key="key">
        {{ key }}: <span>{{ val }}</span>
      </div>
    </form>

    <br />

    <form @submit.prevent="uploadFileForm" v-show="policy !== null">
      <label>
        文件
        <input type="file" @change="fileChange" />
      </label>
      <br />
      <br />
      <button type="submit" v-show="file !== null">上传文件</button>
    </form>

    ---
    <br />

    <div v-show="file !== null">
      <button @click="sliceEvent">测试文件分片上传</button>
      |
      <button @click="sliceComposeEvent">分片文件合并</button>
    </div>

    <br />
    <br />
    <br />
    <p>{{ uploadResult }}</p>
    <ul>
      <li v-for="(item, index) in sliceUploadResult" :key="index">
        {{ item }}
      </li>
    </ul>
    <br />
  </div>
</template>

<script>
  import { ref } from 'vue';
  import axios from 'axios';
  import SparkMD5 from 'spark-md5';

  export default {
    setup() {
      const title = ref('Minio测试');
      const policyParams = ref({});
      const policy = ref(null);
      const file = ref(null);
      const uploadResult = ref(null);
      const sliceUploadResult = ref(null);

      const getPolicyForm = () => {
        policyParams.value.fileName = 'idCard1.jpg';
        requestPolicy(policyParams.value);
      };

      const requestPolicy = (params) => {
        return axios
          .get(`api/v1/minio/access/param?fileName=${params.fileName}`)
          .then((result) => {
            policy.value = result.data;
          })
          .catch((error) => {
            console.error(error);
          });
      };

      const fileChange = (event) => {
        const selectedFile = event.target.files[0];
        file.value = selectedFile;
      };

      const uploadFileForm = () => {
        uploadFile(file.value, policy.value);
      };

      const uploadFile = (file, policy) => {
        console.log(file);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('key', policy.key || file.name);
        formData.append('x-amz-algorithm', policy['x-amz-algorithm']);
        formData.append('x-amz-credential', policy['x-amz-credential']);
        formData.append('x-amz-signature', policy['x-amz-signature']);
        formData.append('x-amz-date', policy['x-amz-date']);
        formData.append('policy', policy.policy);

        axios
          .put(`/bucket/hs-symbol`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: 'Bearer abc' },
            onUploadProgress: (progressEvent) => {
              const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              uploadResult.value = `${percentage}%: ${policy.key}`;
            },
          })
          .then((result) => {
            uploadResult.value = `文件上传成功: ${policy.key}`;
          })
          .catch((error) => {
            console.error(error);
          });
      };

      const sliceEvent = () => {
        const chunkSize = 5 * 1024 * 1024;
        const totalChunk = Math.ceil(file.value.size / chunkSize);
        const chunks = [];
        for (let i = 0; i < totalChunk; i++) {
          const start = i * chunkSize;
          const end = Math.min(file.value.size, start + chunkSize);
          const blob = file.value.slice(start, end);
          chunks.push(blob);
        }

        sliceUploadResult.value = Array(totalChunk).fill(0);

        chunks.forEach((chunk, index) => {
          calculateMD5(chunk).then((md5) => {
            console.log(md5);
          });
        });

        let index = 0;
        while (index < totalChunk) {
          const params = {
            bucket: 'slice',
            filename: `${index}寂寞的季节.mp4`,
          };
          requestPolicy(params).then((result) => {
            const filename = result.key;
            uploadFile(chunks[index], result).then(() => {
              sliceUploadResult.value[index] = `分片文件上传成功: ${filename}`;
            });
          });
          index++;
        }
      };

      const sliceComposeEvent = () => {
        axios
          .post('http://localhost:8888/compose', new FormData(), {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then((result) => {
            uploadResult.value = `文件上传成功: ${policy.value.key}`;
          })
          .catch((error) => {
            console.error(error);
          });
      };

      const calculateMD5 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = () => {
            const spark = new SparkMD5.ArrayBuffer();
            spark.append(reader.result);
            const md5 = spark.end();
            resolve(md5);
          };
          reader.onerror = (error) => {
            reject(error);
          };
        });
      };

      return {
        title,
        policyParams,
        policy,
        file,
        uploadResult,
        sliceUploadResult,
        getPolicyForm,
        requestPolicy,
        fileChange,
        uploadFileForm,
        uploadFile,
        sliceEvent,
        sliceComposeEvent,
        calculateMD5,
      };
    },
  };
</script>

<style scoped>
  /* Add your styles here */
</style>
