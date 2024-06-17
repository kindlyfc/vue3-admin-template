<template>
  <div
    class="login-box"
    :style="`background: url(${bgImageUrl}) no-repeat; background-size: 100%;`"
  >
    <div class="login-center">
      <div class="login-logo">
        <img
          :src="logoImageUrl"
          alt="网页标题"
          :style="{
            height: webLogin?.height ? webLogin?.height + 'px' : '55px',
            width: webLogin?.width ? webLogin?.width + 'px' : '477px',
          }"
        />
      </div>
      <a-form
        layout="horizontal"
        class="sbumit_form"
        :model="state.formInline"
        @submit.prevent="handleSubmit"
      >
        <a-form-item>
          <a-input
            v-model:value="state.formInline.mobile"
            size="large"
            placeholder="请输入账号"
            @focus="changeSvg('user')"
            @blur="
              {
                focusIcon = '';
              }
            "
          >
            <template #prefix
              ><user-outlined :class="{ focusSty: focusIcon == 'user' }" type="user"
            /></template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-model:value="state.formInline.password"
            size="large"
            type="password"
            placeholder="请输入密码"
            autocomplete="new-password"
            @focus="changeSvg('password')"
            @blur="
              {
                focusIcon = '';
              }
            "
          >
            <template #prefix
              ><lock-outlined :class="{ focusSty: focusIcon == 'password' }" type="user"
            /></template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-model:value="state.formInline.captcha"
            placeholder="请输入验证码"
            size="large"
            @focus="changeSvg('code')"
            @blur="
              {
                focusIcon = '';
              }
            "
          >
            <template #prefix>
              <SafetyOutlined :class="{ focusSty: focusIcon == 'code' }" />
            </template>
            <template #suffix>
              <img
                :src="state.captcha"
                class="absolute right-0 h-full cursor-pointer captcha"
                @click="setCaptcha"
              />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            class="login_btn"
            type="primary"
            html-type="submit"
            size="large"
            :loading="state.loading"
            block
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, computed } from 'vue';
  import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Base64 } from 'js-base64';
  import { message, Modal } from 'ant-design-vue';
  import { useUserStore } from '@/store/modules/user';
  import { useUiStore } from '@/store/modules/uiConfig';
  import { getImageCaptcha, getToken } from '@/api/login';
  import bgImg from '@/assets/images/bgimg.png';
  import { to } from '@/utils/awaitTo';
  const state = reactive({
    loading: false,
    captcha: '',
    formInline: {
      password: '',
      mobile: '',
      captcha: '',
    },
  });

  const uiStore = useUiStore();
  const bgImageUrl = computed(() => {
    return import.meta.env.VITE_BASE_IMAGE_PATH + uiStore.systemLogoConfig?.webSysTem?.imageUrl;
  });
  const logoImageUrl = computed(() => {
    return import.meta.env.VITE_BASE_IMAGE_PATH + uiStore.systemLogoConfig?.webLogin?.imageUrl;
  });
  const webLogin = computed(() => {
    return uiStore.systemLogoConfig?.webLogin;
  });
  const temporarytoken = ref<string>('');
  const route = useRoute();
  const router = useRouter();
  const focusIcon = ref<string>();
  const userStore = useUserStore();

  const setCaptcha = async () => {
    const { token } = await getToken(); //登录接口的零时token
    temporarytoken.value = token;
    const img = await getImageCaptcha(temporarytoken.value);
    const blob = new Blob([img], { type: 'image/gif' });
    const imageUrl = (window.URL || window.webkitURL).createObjectURL(blob);
    state.captcha = imageUrl;
  };

  setCaptcha();
  const handleSubmit = async () => {
    const { mobile, password, captcha } = state.formInline;
    if (mobile.trim() == '' || password.trim() == '') {
      return message.warning('用户名或密码不能为空！');
    }
    if (!captcha) {
      return message.warning('请输入验证码！');
    }
    const passwor = Base64.encode(state.formInline.password);
    const data = {
      password: passwor,
      mobile: state.formInline.mobile,
      captcha: state.formInline.captcha,
    };

    message.loading('登录中...', 0);
    state.loading = true;
    const [err] = await to(userStore.login(data, temporarytoken.value));
    if (err) {
      Modal.error({
        title: () => '提示',
        content: () => err.message,
      });
      setCaptcha();
    } else {
      message.success('登录成功！');
      setTimeout(() => router.replace('/'));
    }
    state.loading = false;
    message.destroy();
  };
  const changeSvg = (type: string) => {
    focusIcon.value = type;
  };
</script>

<style lang="less" scoped>
  .login-box {
    display: flex;
    width: 100vw;
    height: 100vh;
    padding-right: 100px;
    flex-direction: column;
    align-items: end;
    justify-content: center;

    .login-center {
      width: 598px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .login-logo {
      margin-bottom: 45px;
      border-bottom: 1px solid #ccccd1;
      width: 100%;
      height: 136px !important;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 477px;
        height: 55px;
      }
    }

    .login_btn {
      width: 400px !important;
      height: 50px !important;
      background: linear-gradient(0deg, #74b0e4, #3768ce) !important;
      border-radius: 23px !important;
    }

    .sbumit_form {
      padding: 0 40px;
    }

    :deep(.ant-form) {
      width: 400px;
      padding: 0;

      .ant-col {
        width: 100%;
      }

      .ant-form-item-label {
        padding-right: 6px;
      }
    }

    .ant-input-affix-wrapper {
      width: 400px !important;
      height: 40px !important;
      background: #ffffff !important;
      border: 2px solid #d5d5d6 !important;
      border-radius: 20px !important;
      margin: 7px 0 2px;

      :deep(.ant-input-lg) {
        border-left: 1.5px solid #d8d6d6 !important;
        padding-left: 10px;
      }

      :deep(.ant-input-prefix) {
        margin: 0 12px;
        font-size: 24px !important;
        color: #c0c0c2;
      }
    }
  }

  .focusSty {
    color: #74b0e4 !important;
  }

  .captcha {
    width: 100px;
    border-radius: 0 25px 25px 0;
  }
</style>
