<template>
  <div class="page-content user">
    <div class="content">
      <div class="left-wrap">
        <div class="user-wrap box-style">
          <img class="bg" src="@imgs/user/bg.png" />
          <img class="avatar" :src="botInfo.avatar" />
          <h2 class="name">{{ botInfo.nickname }}</h2>
          <p class="des">QQ: {{ botInfo.qq }}</p>

          <div class="outer-info">
            <div>
              <i class="iconfont-sys">&#xe72e;</i>
              <span>运行状态: {{ botInfo.status ? '在线' : '离线' }}</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe608;</i>
              <span>版本: {{ botInfo.version }}</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe736;</i>
              <span>协议: {{ botInfo.protocol }}</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe811;</i>
              <span>运行时间: {{ botInfo.uptime }}</span>
            </div>
          </div>

          <div class="lables">
            <h3>功能标签</h3>
            <div>
              <div v-for="item in featureList" :key="item">
                {{ item }}
              </div>
            </div>
          </div>
        </div>

        <!-- <el-carousel class="gallery" height="160px"
          :interval="5000"
          indicator-position="none"
        >
          <el-carousel-item class="item" v-for="item in galleryList" :key="item">
            <img :src="item"/>
          </el-carousel-item>
        </el-carousel> -->
      </div>
      <div class="right-wrap">
        <div class="info box-style">
          <h1 class="title">机器人设置</h1>

          <el-form
            :model="form"
            class="form"
            ref="ruleFormRef"
            :rules="rules"
            label-width="86px"
            label-position="top"
          >
            <el-row>
              <el-form-item label="QQ号" prop="qq">
                <el-input v-model="form.qq" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="昵称" prop="nickname" class="right-input">
                <el-input v-model="form.nickname" :disabled="!isEdit" />
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="登录协议" prop="protocol">
                <el-select v-model="form.protocol" placeholder="选择登录协议" :disabled="!isEdit">
                  <el-option
                    v-for="item in protocolOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="自动登录" prop="autoLogin" class="right-input">
                <el-switch v-model="form.autoLogin" :disabled="!isEdit" />
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="主人QQ" prop="masterQQ">
                <el-input v-model="form.masterQQ" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="管理员群" prop="adminGroup" class="right-input">
                <el-input v-model="form.adminGroup" :disabled="!isEdit" />
              </el-form-item>
            </el-row>

            <el-form-item label="签名" prop="sign" :style="{ height: '130px' }">
              <el-input type="textarea" :rows="4" v-model="form.sign" :disabled="!isEdit" />
            </el-form-item>

            <div class="el-form-item-right">
              <el-button type="primary" style="width: 90px" v-ripple @click="edit">
                {{ isEdit ? '保存' : '编辑' }}
              </el-button>
            </div>
          </el-form>
        </div>

        <div class="info box-style" style="margin-top: 20px">
          <h1 class="title">更改密码</h1>

          <el-form :model="pwdForm" class="form" label-width="86px" label-position="top">
            <el-form-item label="当前密码" prop="password">
              <el-input v-model="pwdForm.password" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="pwdForm.newPassword" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="pwdForm.confirmPassword" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <div class="el-form-item-right">
              <el-button type="primary" style="width: 90px" v-ripple @click="editPwd">
                {{ isEditPwd ? '保存' : '编辑' }}
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import { FormInstance, FormRules } from 'element-plus'

const userStore = useUserStore()
const botInfo = computed(() => ({
  qq: '123456789',
  nickname: 'MaiBot',
  avatar: userStore.getUserInfo.avatar,
  status: true,
  version: 'v1.0.0',
  protocol: 'Android Pad',
  uptime: '3天4小时25分钟'
}))

const isEdit = ref(false)
const isEditPwd = ref(false)

const form = reactive({
  qq: '123456789',
  nickname: 'MaiBot',
  protocol: 'android_pad',
  autoLogin: true,
  masterQQ: '987654321',
  adminGroup: '123456789',
  sign: '我是一个可爱的QQ机器人~'
})

const pwdForm = reactive({
  password: '',
  newPassword: '',
  confirmPassword: ''
})

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  qq: [
    { required: true, message: '请输入QQ号', trigger: 'blur' },
    { pattern: /^\d+$/, message: 'QQ号必须为数字', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
  ],
  protocol: [{ required: true, message: '请选择登录协议', trigger: 'change' }],
  masterQQ: [
    { required: true, message: '请输入主人QQ', trigger: 'blur' },
    { pattern: /^\d+$/, message: 'QQ号必须为数字', trigger: 'blur' }
  ],
  adminGroup: [
    { required: true, message: '请输入管理员群', trigger: 'blur' },
    { pattern: /^\d+$/, message: '群号必须为数字', trigger: 'blur' }
  ]
})

const protocolOptions = [
  { value: 'android_pad', label: 'Android Pad' },
  { value: 'android_phone', label: 'Android Phone' },
  { value: 'macos', label: 'MacOS' },
  { value: 'ipad', label: 'iPad' }
]

const featureList: Array<string> = [
  '群管理',
  '智能对话',
  '图片生成',
  '音乐点播',
  '定时任务',
  '自定义插件'
]

const edit = async () => {
  if (!isEdit.value) {
    isEdit.value = true
    return
  }
  
  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate((valid) => {
    if (valid) {
      // TODO: 调用保存API
      ElMessage.success('保存成功')
      isEdit.value = false
    }
  })
}

const editPwd = async () => {
  if (!isEditPwd.value) {
    isEditPwd.value = true
    return
  }
  
  if (pwdForm.newPassword !== pwdForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  
  // TODO: 调用修改密码API
  ElMessage.success('密码修改成功')
  isEditPwd.value = false
  pwdForm.password = ''
  pwdForm.newPassword = ''
  pwdForm.confirmPassword = ''
}
</script>

<style lang="scss">
.user {
  .icon {
    width: 1.4em;
    height: 1.4em;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentcolor;
  }
}
</style>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;

    $box-radius: calc(var(--custom-radius) + 4px);

    .box-style {
      border: 1px solid var(--art-border-color);
    }

    .content {
      position: relative;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      .left-wrap {
        width: 450px;
        margin-right: 25px;

        .user-wrap {
          position: relative;
          height: 600px;
          padding: 35px 40px;
          overflow: hidden;
          text-align: center;
          background: var(--art-main-bg-color);
          border-radius: $box-radius;

          .bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 200px;
            object-fit: cover;
          }

          .avatar {
            position: relative;
            z-index: 10;
            width: 80px;
            height: 80px;
            margin-top: 120px;
            object-fit: cover;
            border: 2px solid #fff;
            border-radius: 50%;
          }

          .name {
            margin-top: 20px;
            font-size: 22px;
            font-weight: 400;
          }

          .des {
            margin-top: 20px;
            font-size: 14px;
          }

          .outer-info {
            width: 300px;
            margin: auto;
            margin-top: 30px;
            text-align: left;

            > div {
              margin-top: 10px;

              span {
                margin-left: 8px;
                font-size: 14px;
              }
            }
          }

          .lables {
            margin-top: 40px;

            h3 {
              font-size: 15px;
              font-weight: 500;
            }

            > div {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              margin-top: 15px;

              > div {
                padding: 3px 6px;
                margin: 0 10px 10px 0;
                font-size: 12px;
                background: var(--art-main-bg-color);
                border: 1px solid var(--art-border-color);
                border-radius: 2px;
              }
            }
          }
        }

        .gallery {
          margin-top: 25px;
          border-radius: 10px;

          .item {
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }

      .right-wrap {
        flex: 1;
        overflow: hidden;
        border-radius: $box-radius;

        .info {
          background: var(--art-main-bg-color);
          border-radius: $box-radius;

          .title {
            padding: 15px 25px;
            font-size: 20px;
            font-weight: 400;
            color: var(--art-text-gray-800);
            border-bottom: 1px solid var(--art-border-color);
          }

          .form {
            box-sizing: border-box;
            padding: 30px 25px;

            > .el-row {
              .el-form-item {
                width: calc(50% - 10px);
              }

              .el-input,
              .el-select {
                width: 100%;
              }
            }

            .right-input {
              margin-left: 20px;
            }

            .el-form-item-right {
              display: flex;
              align-items: center;
              justify-content: end;

              .el-button {
                width: 110px !important;
              }
            }
          }
        }
      }
    }
  }

  @media only screen and (max-width: $device-ipad-vertical) {
    .page-content {
      .content {
        display: block;
        margin-top: 5px;

        .left-wrap {
          width: 100%;
        }

        .right-wrap {
          width: 100%;
          margin-top: 15px;
        }
      }
    }
  }
</style>
