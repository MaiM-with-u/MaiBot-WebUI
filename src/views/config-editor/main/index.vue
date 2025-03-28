<template>
  <div class="config-editor-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>主配置文件编辑</span>
          <el-button type="primary" @click="handleSave">保存配置</el-button>
        </div>
      </template>

      <!-- 版本信息部分 -->
      <div class="version-info">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="配置文件版本">
              <el-input v-model="configForm.inner.version" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="麦麦版本">
              <el-input v-model="configForm.mai_version.version" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="麦麦测试版版本">
              <el-input v-model="configForm.mai_version.version_fix" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 配置标签页 -->
      <el-tabs v-model="activeTab" type="card">
        <!-- Bot基础设置 -->
        <el-tab-pane label="Bot基础设置" name="bot">
          <el-form :model="configForm.bot" label-width="120px">
            <el-form-item label="机器人QQ号">
              <el-input-number v-model="configForm.bot.qq" :min="1" />
            </el-form-item>
            <el-form-item label="机器人名称">
              <el-input v-model="configForm.bot.nickname" />
            </el-form-item>
            <el-form-item label="机器人昵称">
              <div class="list-input">
                <div class="list-tags">
                  <el-tag
                    v-for="(name, index) in configForm.bot.alias_names"
                    :key="index"
                    closable
                    @close="handleRemoveAlias(index)"
                    class="list-tag"
                  >
                    {{ name }}
                  </el-tag>
                </div>
                <div class="list-input-field">
                  <el-input
                    v-model="newAlias"
                    placeholder="输入昵称，按回车添加"
                    @keyup.enter="handleAddAlias"
                    clearable
                  >
                    <template #append>
                      <el-button @click="handleAddAlias">添加</el-button>
                    </template>
                  </el-input>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 人格设置 -->
        <el-tab-pane label="人格设置" name="personality">
          <el-form :model="configForm.personality" label-width="180px">
            <el-form-item label="人格提示词1">
              <el-input
                v-model="configForm.personality.prompt_personality[0]"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
            <el-form-item label="人格提示词2">
              <el-input
                v-model="configForm.personality.prompt_personality[1]"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
            <el-form-item label="人格提示词3">
              <el-input
                v-model="configForm.personality.prompt_personality[2]"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
            <el-form-item label="人格1概率">
              <el-input-number
                v-model="configForm.personality.personality_1_probability"
                :min="0"
                :max="1"
                :step="0.1"
                @change="validateProbabilities"
              />
            </el-form-item>
            <el-form-item label="人格2概率">
              <el-input-number
                v-model="configForm.personality.personality_2_probability"
                :min="0"
                :max="1"
                :step="0.1"
                @change="validateProbabilities"
              />
            </el-form-item>
            <el-form-item label="人格3概率">
              <el-input-number
                v-model="configForm.personality.personality_3_probability"
                :min="0"
                :max="1"
                :step="0.1"
                @change="validateProbabilities"
              />
            </el-form-item>
            <el-form-item label="日程生成提示词">
              <el-input
                v-model="configForm.personality.prompt_schedule"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 消息设置 -->
        <el-tab-pane label="消息设置" name="message">
          <el-form :model="configForm.message" label-width="180px">
            <el-form-item label="最小文本长度">
              <el-input-number v-model="configForm.message.min_text_length" :min="1" />
            </el-form-item>
            <el-form-item label="最大上下文数量">
              <el-input-number v-model="configForm.message.max_context_size" :min="1" />
            </el-form-item>
            <el-form-item label="表情包概率">
              <el-input-number
                v-model="configForm.message.emoji_chance"
                :min="0"
                :max="1"
                :step="0.1"
              />
            </el-form-item>
            <el-form-item label="思考超时时间">
              <el-input-number v-model="configForm.message.thinking_timeout" :min="1" />
            </el-form-item>
            <el-form-item label="回复意愿放大系数">
              <el-input-number
                v-model="configForm.message.response_willing_amplifier"
                :min="0"
                :step="0.1"
              />
            </el-form-item>
            <el-form-item label="回复兴趣度放大系数">
              <el-input-number
                v-model="configForm.message.response_interested_rate_amplifier"
                :min="0"
                :step="0.1"
              />
            </el-form-item>
            <el-form-item label="降低回复频率系数">
              <el-input-number
                v-model="configForm.message.down_frequency_rate"
                :min="1"
                :step="0.1"
              />
            </el-form-item>
            <el-form-item label="禁用词列表">
              <div class="list-input">
                <div class="list-tags">
                  <el-tag
                    v-for="(word, index) in configForm.message.ban_words"
                    :key="index"
                    closable
                    @close="handleRemoveBanWord(index)"
                    class="list-tag"
                  >
                    {{ word }}
                  </el-tag>
                </div>
                <div class="list-input-field">
                  <el-input
                    v-model="newBanWord"
                    placeholder="输入禁用词，按回车添加"
                    @keyup.enter="handleAddBanWord"
                    clearable
                  >
                    <template #append>
                      <el-button @click="handleAddBanWord">添加</el-button>
                    </template>
                  </el-input>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="禁用消息正则">
              <div class="list-input">
                <div class="list-tags">
                  <el-tag
                    v-for="(regex, index) in configForm.message.ban_msgs_regex"
                    :key="index"
                    closable
                    @close="handleRemoveBanRegex(index)"
                    class="list-tag"
                  >
                    {{ regex }}
                  </el-tag>
                </div>
                <div class="list-input-field">
                  <el-input
                    v-model="newBanRegex"
                    placeholder="输入正则表达式，按回车添加"
                    @keyup.enter="handleAddBanRegex"
                    clearable
                  >
                    <template #append>
                      <el-button @click="handleAddBanRegex">添加</el-button>
                    </template>
                  </el-input>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 表情包&记忆设置 -->
        <el-tab-pane label="表情包&记忆设置" name="emoji_memory">
          <el-tabs type="border-card">
            <el-tab-pane label="表情包设置">
              <el-form :model="configForm.emoji" label-width="180px">
                <el-form-item label="检查间隔">
                  <el-input-number v-model="configForm.emoji.check_interval" :min="1" />
                </el-form-item>
                <el-form-item label="注册间隔">
                  <el-input-number v-model="configForm.emoji.register_interval" :min="1" />
                </el-form-item>
                <el-form-item label="自动保存">
                  <el-switch v-model="configForm.emoji.auto_save" />
                </el-form-item>
                <el-form-item label="启用过滤">
                  <el-switch v-model="configForm.emoji.enable_check" />
                </el-form-item>
                <el-form-item label="过滤要求">
                  <el-input v-model="configForm.emoji.check_prompt" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="记忆设置">
              <el-form :model="configForm.memory" label-width="180px">
                <el-form-item label="记忆构建间隔">
                  <el-input-number v-model="configForm.memory.build_memory_interval" :min="1" />
                </el-form-item>
                <el-form-item label="记忆构建分布">
                  <el-input-number
                    v-model="configForm.memory.build_memory_distribution[0]"
                    :min="0"
                    placeholder="分布1均值"
                  />
                  <el-input-number
                    v-model="configForm.memory.build_memory_distribution[1]"
                    :min="0"
                    placeholder="分布1标准差"
                  />
                  <el-input-number
                    v-model="configForm.memory.build_memory_distribution[2]"
                    :min="0"
                    placeholder="分布1权重"
                  />
                  <el-input-number
                    v-model="configForm.memory.build_memory_distribution[3]"
                    :min="0"
                    placeholder="分布2均值"
                  />
                  <el-input-number
                    v-model="configForm.memory.build_memory_distribution[4]"
                    :min="0"
                    placeholder="分布2标准差"
                  />
                  <el-input-number
                    v-model="configForm.memory.build_memory_distribution[5]"
                    :min="0"
                    placeholder="分布2权重"
                  />
                </el-form-item>
                <el-form-item label="采样数量">
                  <el-input-number v-model="configForm.memory.build_memory_sample_num" :min="1" />
                </el-form-item>
                <el-form-item label="采样长度">
                  <el-input-number v-model="configForm.memory.build_memory_sample_length" :min="1" />
                </el-form-item>
                <el-form-item label="记忆压缩率">
                  <el-input-number
                    v-model="configForm.memory.memory_compress_rate"
                    :min="0"
                    :max="1"
                    :step="0.1"
                  />
                </el-form-item>
                <el-form-item label="记忆遗忘间隔">
                  <el-input-number v-model="configForm.memory.forget_memory_interval" :min="1" />
                </el-form-item>
                <el-form-item label="记忆遗忘时间">
                  <el-input-number v-model="configForm.memory.memory_forget_time" :min="1" />
                </el-form-item>
                <el-form-item label="记忆遗忘比例">
                  <el-input-number
                    v-model="configForm.memory.memory_forget_percentage"
                    :min="0"
                    :max="1"
                    :step="0.01"
                  />
                </el-form-item>
                <el-form-item label="记忆禁用词">
                  <div class="list-input">
                    <div class="list-tags">
                      <el-tag
                        v-for="(word, index) in configForm.memory.memory_ban_words"
                        :key="index"
                        closable
                        @close="handleRemoveMemoryBanWord(index)"
                        class="list-tag"
                      >
                        {{ word }}
                      </el-tag>
                    </div>
                    <div class="list-input-field">
                      <el-input
                        v-model="newMemoryBanWord"
                        placeholder="输入禁用词，按回车添加"
                        @keyup.enter="handleAddMemoryBanWord"
                        clearable
                      >
                        <template #append>
                          <el-button @click="handleAddMemoryBanWord">添加</el-button>
                        </template>
                      </el-input>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

        <!-- 群组设置 -->
        <el-tab-pane label="群组设置" name="groups">
          <el-form :model="configForm.groups" label-width="180px">
            <el-form-item label="允许回复群组">
              <div class="list-input">
                <div class="list-tags">
                  <el-tag
                    v-for="(groupId, index) in configForm.groups.talk_allowed"
                    :key="index"
                    closable
                    @close="handleRemoveTalkAllowed(index)"
                    class="list-tag"
                  >
                    {{ groupId }}
                  </el-tag>
                </div>
                <div class="list-input-field">
                  <el-input
                    v-model="newTalkAllowed"
                    placeholder="输入群号，按回车添加"
                    @keyup.enter="handleAddTalkAllowed"
                    clearable
                  >
                    <template #append>
                      <el-button @click="handleAddTalkAllowed">添加</el-button>
                    </template>
                  </el-input>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="降低回复频率群组">
              <div class="list-input">
                <div class="list-tags">
                  <el-tag
                    v-for="(groupId, index) in configForm.groups.talk_frequency_down"
                    :key="index"
                    closable
                    @close="handleRemoveTalkFrequencyDown(index)"
                    class="list-tag"
                  >
                    {{ groupId }}
                  </el-tag>
                </div>
                <div class="list-input-field">
                  <el-input
                    v-model="newTalkFrequencyDown"
                    placeholder="输入群号，按回车添加"
                    @keyup.enter="handleAddTalkFrequencyDown"
                    clearable
                  >
                    <template #append>
                      <el-button @click="handleAddTalkFrequencyDown">添加</el-button>
                    </template>
                  </el-input>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="禁用用户">
              <div class="list-input">
                <div class="list-tags">
                  <el-tag
                    v-for="(userId, index) in configForm.groups.ban_user_id"
                    :key="index"
                    closable
                    @close="handleRemoveBanUserId(index)"
                    class="list-tag"
                  >
                    {{ userId }}
                  </el-tag>
                </div>
                <div class="list-input-field">
                  <el-input
                    v-model="newBanUserId"
                    placeholder="输入QQ号，按回车添加"
                    @keyup.enter="handleAddBanUserId"
                    clearable
                  >
                    <template #append>
                      <el-button @click="handleAddBanUserId">添加</el-button>
                    </template>
                  </el-input>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 其他设置 -->
        <el-tab-pane label="其他设置" name="others">
          <el-tabs type="border-card">
            <el-tab-pane label="中文错别字设置">
              <el-form :model="configForm.chinese_typo" label-width="180px">
                <el-form-item label="启用错别字">
                  <el-switch v-model="configForm.chinese_typo.enable" />
                </el-form-item>
                <el-form-item label="单字替换概率">
                  <el-input-number
                    v-model="configForm.chinese_typo.error_rate"
                    :min="0"
                    :max="1"
                    :step="0.001"
                  />
                </el-form-item>
                <el-form-item label="最小字频阈值">
                  <el-input-number v-model="configForm.chinese_typo.min_freq" :min="1" />
                </el-form-item>
                <el-form-item label="声调错误概率">
                  <el-input-number
                    v-model="configForm.chinese_typo.tone_error_rate"
                    :min="0"
                    :max="1"
                    :step="0.1"
                  />
                </el-form-item>
                <el-form-item label="整词替换概率">
                  <el-input-number
                    v-model="configForm.chinese_typo.word_replace_rate"
                    :min="0"
                    :max="1"
                    :step="0.001"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="其他功能设置">
              <el-form :model="configForm.others" label-width="180px">
                <el-form-item label="启用读空气">
                  <el-switch v-model="configForm.others.enable_kuuki_read" />
                </el-form-item>
                <el-form-item label="启用好友聊天">
                  <el-switch v-model="configForm.others.enable_friend_chat" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { configService } from '@/api/configApi'

const activeTab = ref('bot')
const newAlias = ref('')
const newBanWord = ref('')
const newBanRegex = ref('')
const newMemoryBanWord = ref('')
const newTalkAllowed = ref('')
const newTalkFrequencyDown = ref('')
const newBanUserId = ref('')

const configForm = ref({
  inner: {
    version: '0.0.11'
  },
  mai_version: {
    version: '0.6.0',
    version_fix: 'snapshot-1'
  },
  bot: {
    qq: 123,
    nickname: '麦麦',
    alias_names: ['麦叠', '牢麦']
  },
  personality: {
    prompt_personality: [
      '用一句话或几句话描述性格特点和其他特征',
      '用一句话或几句话描述性格特点和其他特征',
      '例如，是一个热爱国家热爱党的新时代好青年'
    ],
    personality_1_probability: 0.7,
    personality_2_probability: 0.2,
    personality_3_probability: 0.1,
    prompt_schedule: '用一句话或几句话描述描述性格特点和其他特征'
  },
  message: {
    min_text_length: 2,
    max_context_size: 15,
    emoji_chance: 0.2,
    thinking_timeout: 120,
    response_willing_amplifier: 1,
    response_interested_rate_amplifier: 1,
    down_frequency_rate: 3,
    ban_words: [],
    ban_msgs_regex: []
  },
  emoji: {
    check_interval: 300,
    register_interval: 20,
    auto_save: true,
    enable_check: false,
    check_prompt: '符合公序良俗'
  },
  memory: {
    build_memory_interval: 2000,
    build_memory_distribution: [4, 2, 0.6, 24, 8, 0.4],
    build_memory_sample_num: 10,
    build_memory_sample_length: 20,
    memory_compress_rate: 0.1,
    forget_memory_interval: 1000,
    memory_forget_time: 24,
    memory_forget_percentage: 0.01,
    memory_ban_words: []
  },
  groups: {
    talk_allowed: [],
    talk_frequency_down: [],
    ban_user_id: []
  },
  chinese_typo: {
    enable: true,
    error_rate: 0.002,
    min_freq: 9,
    tone_error_rate: 0.2,
    word_replace_rate: 0.006
  },
  others: {
    enable_kuuki_read: true,
    enable_friend_chat: false
  }
})

// 验证人格概率之和是否为1
const validateProbabilities = () => {
  const sum = 
    configForm.value.personality.personality_1_probability +
    configForm.value.personality.personality_2_probability +
    configForm.value.personality.personality_3_probability
  
  if (Math.abs(sum - 1) > 0.0001) {
    ElMessage.warning('三种人格的概率之和必须为1')
  }
}

// Bot相关方法
const handleAddAlias = () => {
  if (!newAlias.value.trim()) {
    ElMessage.warning('请输入昵称')
    return
  }
  if (configForm.value.bot.alias_names.includes(newAlias.value.trim())) {
    ElMessage.warning('该昵称已存在')
    return
  }
  configForm.value.bot.alias_names.push(newAlias.value.trim())
  newAlias.value = ''
}

const handleRemoveAlias = (index: number) => {
  configForm.value.bot.alias_names.splice(index, 1)
}

// 消息相关方法
const handleAddBanWord = () => {
  if (!newBanWord.value.trim()) {
    ElMessage.warning('请输入禁用词')
    return
  }
  if (configForm.value.message.ban_words.includes(newBanWord.value.trim())) {
    ElMessage.warning('该禁用词已存在')
    return
  }
  configForm.value.message.ban_words.push(newBanWord.value.trim())
  newBanWord.value = ''
}

const handleRemoveBanWord = (index: number) => {
  configForm.value.message.ban_words.splice(index, 1)
}

const handleAddBanRegex = () => {
  if (!newBanRegex.value.trim()) {
    ElMessage.warning('请输入正则表达式')
    return
  }
  if (configForm.value.message.ban_msgs_regex.includes(newBanRegex.value.trim())) {
    ElMessage.warning('该正则表达式已存在')
    return
  }
  configForm.value.message.ban_msgs_regex.push(newBanRegex.value.trim())
  newBanRegex.value = ''
}

const handleRemoveBanRegex = (index: number) => {
  configForm.value.message.ban_msgs_regex.splice(index, 1)
}

// 记忆相关方法
const handleAddMemoryBanWord = () => {
  if (!newMemoryBanWord.value.trim()) {
    ElMessage.warning('请输入禁用词')
    return
  }
  if (configForm.value.memory.memory_ban_words.includes(newMemoryBanWord.value.trim())) {
    ElMessage.warning('该禁用词已存在')
    return
  }
  configForm.value.memory.memory_ban_words.push(newMemoryBanWord.value.trim())
  newMemoryBanWord.value = ''
}

const handleRemoveMemoryBanWord = (index: number) => {
  configForm.value.memory.memory_ban_words.splice(index, 1)
}

// 群组相关方法
const handleAddTalkAllowed = () => {
  const groupId = parseInt(newTalkAllowed.value.trim())
  if (isNaN(groupId)) {
    ElMessage.warning('请输入有效的群号')
    return
  }
  if (configForm.value.groups.talk_allowed.includes(groupId)) {
    ElMessage.warning('该群号已存在')
    return
  }
  configForm.value.groups.talk_allowed.push(groupId)
  newTalkAllowed.value = ''
}

const handleRemoveTalkAllowed = (index: number) => {
  configForm.value.groups.talk_allowed.splice(index, 1)
}

const handleAddTalkFrequencyDown = () => {
  const groupId = parseInt(newTalkFrequencyDown.value.trim())
  if (isNaN(groupId)) {
    ElMessage.warning('请输入有效的群号')
    return
  }
  if (configForm.value.groups.talk_frequency_down.includes(groupId)) {
    ElMessage.warning('该群号已存在')
    return
  }
  configForm.value.groups.talk_frequency_down.push(groupId)
  newTalkFrequencyDown.value = ''
}

const handleRemoveTalkFrequencyDown = (index: number) => {
  configForm.value.groups.talk_frequency_down.splice(index, 1)
}

const handleAddBanUserId = () => {
  const userId = parseInt(newBanUserId.value.trim())
  if (isNaN(userId)) {
    ElMessage.warning('请输入有效的QQ号')
    return
  }
  if (configForm.value.groups.ban_user_id.includes(userId)) {
    ElMessage.warning('该QQ号已存在')
    return
  }
  configForm.value.groups.ban_user_id.push(userId)
  newBanUserId.value = ''
}

const handleRemoveBanUserId = (index: number) => {
  configForm.value.groups.ban_user_id.splice(index, 1)
}

const handleSave = async () => {
  try {
    await configService.saveMainConfig(configForm.value)
    ElMessage.success('配置保存成功')
  } catch (error) {
    ElMessage.error('配置保存失败')
  }
}

onMounted(async () => {
  try {
    const config = await configService.getMainConfig()
    configForm.value = { ...configForm.value, ...config }
  } catch (error) {
    ElMessage.error('获取配置失败')
  }
})
</script>

<style lang="scss" scoped>
.config-editor-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .version-info {
    margin-bottom: 20px;
    padding: 20px;
    background-color: #f5f7fa;
    border-radius: 4px;
  }

  .list-input {
    .list-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
      
      .list-tag {
        margin-right: 8px;
        margin-bottom: 8px;
      }
    }

    .list-input-field {
      width: 100%;
    }
  }

  :deep(.el-tabs__content) {
    padding: 20px 0;
  }
}
</style> 