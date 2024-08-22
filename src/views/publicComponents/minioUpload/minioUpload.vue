<template>
  <div class="container">
    <h2>Minio 上传示例</h2>
    <a-upload
      class="upload-demo mb-10px"
      ref="upload"
      :on-remove="handleRemove"
      @change="handleFileChange"
      :file-list="uploadFileList"
      :before-upload="handleBeforeUpload"
    >
      <template #default>
        <a-button type="primary" plain>选择文件</a-button>
      </template>
    </a-upload>
    <!-- <input type="file" @change="handleFileChange" /> -->
    <a-button class="mr-10px" @click="handleUpload" plain>上传</a-button>
    <a-button @click="clearFileHandler" plain>清空</a-button>
    <!-- 文件列表 -->
    <div class="file-list-wrapper">
      <a-collapse>
        <a-collapse-panel v-for="(item, index) in uploadFileList" :key="index" :header="item.name">
          <div class="upload-file-item">
            <div class="file-info-item file-name">文件名：{{ item.name }}</div>
            <div class="file-info-item file-size">文件大小：{{ transformByte(item.size) }}</div>
            <div class="file-info-item file-progress">
              <span class="file-progress-label">文件进度：</span>
              <a-progress :percent="item.uploadProgress" class="file-progress-value" />
            </div>
            <div class="file-info-item file-size">
              <span>状态：</span>
              <a-tag v-if="item.status === '等待上传'" color="blue">等待上传</a-tag>
              <a-tag v-else-if="item.status === '校验MD5'" color="orange">校验MD5</a-tag>
              <a-tag v-else-if="item.status === '正在上传'" color="green">正在上传</a-tag>
              <a-tag v-else-if="item.status === '上传成功'" color="green">上传完成</a-tag>
              <a-tag v-else color="red">上传错误</a-tag>
            </div>
          </div>
          <div class="file-chunk-list-wrapper">
            <!-- 分片列表 -->
            <a-table
              :dataSource="item.chunkList"
              :columns="chunkColumns"
              rowKey="chunkNumber"
              pagination="{false}"
            >
              <template #progress="{ text, record }">
                <a-progress
                  v-if="!record.status || record.progressStatus === 'normal'"
                  :percent="record.progress"
                />
                <a-progress
                  v-else
                  :percent="record.progress"
                  :status="record.progressStatus"
                  :stroke-width="16"
                />
              </template>
            </a-table>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script>
  import { ref, reactive } from 'vue';
  import SparkMD5 from 'spark-md5';
  import axios from 'axios';
  import { message } from 'ant-design-vue';

  const FILE_UPLOAD_ID_KEY = 'file_upload_id';
  const chunkSize = 10 * 1024 * 1024;
  let currentFileIndex = 0;
  const FileStatus = {
    wait: '等待上传',
    getMd5: '校验MD5',
    uploading: '正在上传',
    success: '上传成功',
    error: '上传错误',
  };

  export default {
    setup() {
      const uploadFileList = ref([]);
      const uploadIdInfo = ref(null);
      const simultaneousUploads = ref(3);
      const uploadAction = 'https://jsonplaceholder.typicode.com/posts/';

      const handleUpload = async () => {
        const files = uploadFileList.value;
        console.log('files:', files.length, files.name);
        if (files.length === 0) {
          message.error('请先选择文件');
          return;
        }

        // try {
        //   // 使用 FormData 上传文件
        //   const formData = new FormData();
        //   formData.append('file', files);

        //   const response = await axios.put('/bucket/hs-symbol/' + files.name, files, {
        //     headers: {
        //       'Content-Type': files.type,
        //     },
        //     auth: {
        //       username: 'minioadmin',
        //       password: 'minioadmin',
        //     },
        //   });

        //   console.log('上传成功:', response.data);
        // } catch (error) {
        //   console.error('上传失败:', error);
        // }

        const currentFile = files[currentFileIndex];
        currentFile.status = FileStatus.getMd5;
        getFileMd5(currentFile.raw, async (md5) => {
          const checkResult = await checkFileUploadedByMd5(md5);
          console.group(checkResult, 'checkResult');
          if (checkResult.data.data.status === 1) {
            message.success(`上传成功，文件地址：${checkResult.data.data.url}`);
            currentFile.status = FileStatus.success;
            currentFile.uploadProgress = 100;
            return;
          } else if (checkResult.data.data.status === 2) {
            let chunkUploadedList = checkResult.data.data.chunkUploadedList;
            currentFile.chunkUploadedList = chunkUploadedList;
          }

          let fileChunks = createFileChunk(currentFile.raw, chunkSize);
          let param = {
            fileName: currentFile.name,
            fileSize: currentFile.size,
            chunkSize: chunkSize,
            fileMd5: md5,
            contentType: 'application/octet-stream',
          };

          let uploadIdInfoResult = await getFileUploadUrls(param);
          console.log(uploadIdInfoResult, 'uploadIdInfoResult');
          uploadIdInfo.value = uploadIdInfoResult.data.data;
          saveFileUploadId(uploadIdInfoResult.data.data);
          let uploadUrls = uploadIdInfoResult.data.data.uploadUrls;
          if (fileChunks.length !== uploadUrls.length) {
            message.error('文件分片上传地址获取错误');
            return;
          }

          currentFile.chunkList = [];
          fileChunks.forEach((chunkItem, index) => {
            currentFile.chunkList.push({
              chunkNumber: index + 1,
              chunk: chunkItem,
              uploadUrl: uploadUrls[index],
              progress: 0,
              status: '—',
            });
          });

          currentFile.status = FileStatus.uploading;
          let tempFileChunks = processUploadChunkList([...currentFile.chunkList]);
          console.log(tempFileChunks, 'tempFileChunks');
          await uploadChunkBase(tempFileChunks);
          const mergeResult = await mergeFile({
            uploadId: uploadIdInfo.value.uploadId,
            fileName: currentFile.name,
            md5: md5,
          });
          console.log(mergeResult, 'mergeResult');
          if (mergeResult.data.code !== 0) {
            currentFile.status = FileStatus.error;
            message.error(mergeResult.error);
          } else {
            currentFile.status = FileStatus.success;
            message.success(`上传成功，文件地址：${mergeResult.data.url}`);
          }
        });
      };

      const clearFileHandler = () => {
        uploadFileList.value = [];
        uploadIdInfo.value = null;
      };

      // const handleFileChange = (event) => {
      //   uploadFileList.value = event.target.files[0];
      // };
      const handleFileChange = (file, fileList) => {
        uploadFileList.value = file.fileList;
        // uploadFileList.value.forEach((item) => {
        //   initFileProperties(item);
        // });
      };

      const initFileProperties = (file) => {
        file.chunkList = [];
        file.status = FileStatus.wait;
        file.progressStatus = 'warning';
        file.uploadProgress = 0;
      };

      const handleRemove = (file, fileList) => {
        uploadFileList.value = fileList;
      };

      const handleBeforeUpload = (file) => {
        file.raw = file;
        return false; // 阻止自动上传，改为手动上传
      };

      const getFileMd5 = (file, callback) => {
        const blobSlice =
          File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        const fileReader = new FileReader();
        const totalChunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        const spark = new SparkMD5.ArrayBuffer();
        fileReader.onload = (e) => {
          spark.append(e.target.result);
          if (currentChunk < totalChunks) {
            currentChunk++;
            loadNext();
          } else {
            callback(spark.end());
          }
        };
        fileReader.onerror = () => {
          console.warn('读取Md5失败，文件读取错误');
        };
        const loadNext = () => {
          const start = currentChunk * chunkSize;
          const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        };
        loadNext();
      };

      const createFileChunk = (file, size = chunkSize) => {
        const fileChunkList = [];
        let count = 0;
        while (count < file.size) {
          fileChunkList.push({ file: file.slice(count, count + size) });
          count += size;
        }
        return fileChunkList;
      };

      const processUploadChunkList = (chunkList) => {
        const currentFile = uploadFileList.value[currentFileIndex];
        let chunkUploadedList = currentFile.chunkUploadedList;
        if (!chunkUploadedList || chunkUploadedList.length === 0) return chunkList;
        for (let i = chunkList.length - 1; i >= 0; i--) {
          const chunkItem = chunkList[i];
          for (let j = 0; j < chunkUploadedList.length; j++) {
            if (chunkItem.chunkNumber === chunkUploadedList[j]) {
              chunkList.splice(i, 1);
              break;
            }
          }
        }
        return chunkList;
      };

      const uploadChunkBase = async (fileChunks) => {
        return new Promise((resolve) => {
          let index = 0;
          const currentFile = uploadFileList.value[currentFileIndex];
          const upload = async () => {
            if (index >= fileChunks.length) {
              resolve();
              return;
            }
            let chunk = fileChunks[index];
            currentFile.chunkList[chunk.chunkNumber - 1].status = '上传中';
            let formData = new FormData();
            formData.append('file', chunk.chunk);
            const res = await axios.put(chunk.uploadUrl, chunk.chunk);
            if (res.status === 200) {
              currentFile.chunkList[chunk.chunkNumber - 1].progress = 100;
              currentFile.chunkList[chunk.chunkNumber - 1].status = '上传完成';
            } else {
              currentFile.chunkList[chunk.chunkNumber - 1].progress = 0;
              currentFile.chunkList[chunk.chunkNumber - 1].status = '上传错误';
              this.$message.error('上传出错');
              resolve();
              return;
            }
            index++;
            currentFile.uploadProgress = parseInt((index / fileChunks.length) * 100);
            upload();
          };
          for (let i = 0; i < simultaneousUploads.value; i++) {
            upload();
          }
        });
      };

      const mergeFile = async (param) => {
        return await axios.post('/api/v1/minio/upload/merge', param);
      };

      const checkFileUploadedByMd5 = async (md5) => {
        return await axios.get('/api/v1/minio/upload/check', {
          params: { md5: md5 },
        });
      };

      const getFileUploadUrls = async (param) => {
        return await axios.post('/api/v1/minio/upload', param);
      };

      const saveFileUploadId = (uploadId) => {
        sessionStorage.setItem(FILE_UPLOAD_ID_KEY, JSON.stringify(uploadId));
      };

      const transformByte = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024,
          sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
      };

      const chunkColumns = [
        {
          title: '分片编号',
          dataIndex: 'chunkNumber',
          key: 'chunkNumber',
          width: 100,
        },
        {
          title: '上传进度',
          key: 'progress',
          scopedSlots: { customRender: 'progress' },
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
        },
      ];

      return {
        handleUpload,
        clearFileHandler,
        handleFileChange,
        handleRemove,
        handleBeforeUpload,
        uploadFileList,
        transformByte,
        chunkColumns,
      };
    },
  };
</script>

<style scoped>
  .container {
    margin: 20px;
  }

  .upload-demo {
    display: flex;
    align-items: center;
  }

  .file-list-wrapper {
    margin-top: 20px;
  }

  .upload-file-item {
    display: flex;
    justify-content: space-between;
  }

  .file-info-item {
    margin-right: 20px;
  }

  .file-name,
  .file-size,
  .file-progress {
    display: inline-block;
  }

  .file-progress-label {
    margin-right: 10px;
  }

  .file-progress-value {
    display: inline-block;
    width: 150px;
  }
</style>
