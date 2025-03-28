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
              <el-input v-model="configForm.mai_version['version-fix']" disabled />
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
            <el-form-item label="人格1提示词">
              <el-input
                v-model="configForm.personality.prompt_personality[0]"
                placeholder="输入人格1的提示词"
              />
            </el-form-item>
            <el-form-item label="人格2提示词">
              <el-input
                v-model="configForm.personality.prompt_personality[1]"
                placeholder="输入人格2的提示词"
              />
            </el-form-item>
            <el-form-item label="人格3提示词">
              <el-input
                v-model="configForm.personality.prompt_personality[2]"
                placeholder="输入人格3的提示词"
              />
            </el-form-item>
            <el-form-item label="人格1概率">
              <el-input-number
                v-model="configForm.personality.personality_1_probability"
                :min="0"
                :max="1"
                :step="0.1"
              />
            </el-form-item>
            <el-form-item label="人格2概率">
              <el-input-number
                v-model="configForm.personality.personality_2_probability"
                :min="0"
                :max="1"
                :step="0.1"
              />
            </el-form-item>
            <el-form-item label="人格3概率">
              <el-input-number
                v-model="configForm.personality.personality_3_probability"
                :min="0"
                :max="1"
                :step="0.1"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 日程设置 -->
        <el-tab-pane label="日程设置" name="schedule">
          <el-form :model="configForm.schedule" label-width="180px">
            <el-form-item label="启用日程生成">
              <el-switch v-model="configForm.schedule.enable_schedule_gen" />
            </el-form-item>
            <el-form-item label="日程生成提示词">
              <el-input
                v-model="configForm.schedule.prompt_schedule_gen"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
            <el-form-item label="日程更新间隔">
              <el-input-number
                v-model="configForm.schedule.schedule_doing_update_interval"
                :min="1"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 消息设置 -->
        <el-tab-pane label="消息设置" name="message">
          <el-form :model="configForm.message" label-width="180px">
            <el-form-item label="最小文本长度">
              <el-input-number v-model="configForm.message.max_response_length" :min="1" />
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
                v-model="configForm.willing.response_willing_amplifier"
                :min="0"
                :step="0.1"
              />
            </el-form-item>
            <el-form-item label="回复兴趣度放大系数">
              <el-input-number
                v-model="configForm.willing.response_interested_rate_amplifier"
                :min="0"
                :step="0.1"
              />
            </el-form-item>
            <el-form-item label="降低回复频率系数">
              <el-input-number
                v-model="configForm.willing.down_frequency_rate"
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
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <div class="param-item">
                        <div class="param-label">分布1均值</div>
                        <el-input-number
                          v-model="configForm.memory.build_memory_distribution[0]"
                          :min="0"
                          :step="0.1"
                          :precision="1"
                        />
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="param-item">
                        <div class="param-label">分布1标准差</div>
                        <el-input-number
                          v-model="configForm.memory.build_memory_distribution[1]"
                          :min="0"
                          :step="0.1"
                          :precision="1"
                        />
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="param-item">
                        <div class="param-label">分布1权重</div>
                        <el-input-number
                          v-model="configForm.memory.build_memory_distribution[2]"
                          :min="0"
                          :step="0.1"
                          :precision="1"
                        />
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20" style="margin-top: 10px;">
                    <el-col :span="8">
                      <div class="param-item">
                        <div class="param-label">分布2均值</div>
                        <el-input-number
                          v-model="configForm.memory.build_memory_distribution[3]"
                          :min="0"
                          :step="0.1"
                          :precision="1"
                        />
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="param-item">
                        <div class="param-label">分布2标准差</div>
                        <el-input-number
                          v-model="configForm.memory.build_memory_distribution[4]"
                          :min="0"
                          :step="0.1"
                          :precision="1"
                        />
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="param-item">
                        <div class="param-label">分布2权重</div>
                        <el-input-number
                          v-model="configForm.memory.build_memory_distribution[5]"
                          :min="0"
                          :step="0.1"
                          :precision="1"
                        />
                      </div>
                    </el-col>
                  </el-row>
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
            <!-- 回复分割器 -->
            <el-tab-pane label="回复分割器">
              <el-form :model="configForm.response_spliter" label-width="180px">
                <el-form-item label="启用回复分割器">
                  <el-switch v-model="configForm.response_spliter.enable_response_spliter" />
                </el-form-item>
                <el-form-item label="最大回复长度">
                  <el-input-number
                    v-model="configForm.response_spliter.response_max_length"
                    :min="1"
                  />
                </el-form-item>
                <el-form-item label="最大句子数量">
                  <el-input-number
                    v-model="configForm.response_spliter.response_max_sentence_num"
                    :min="1"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 中文错别字 -->
            <el-tab-pane label="中文错别字">
              <el-form :model="configForm.chinese_typo" label-width="180px">
                <el-form-item label="启用错别字生成">
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
                  <el-input-number
                    v-model="configForm.chinese_typo.min_freq"
                    :min="1"
                  />
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

            <!-- 实验性功能 -->
            <el-tab-pane label="实验性功能">
              <el-form :model="configForm.experimental" label-width="180px">
                <el-form-item label="启用好友聊天">
                  <el-switch v-model="configForm.experimental.enable_friend_chat" />
                </el-form-item>
                <el-form-item label="启用思维流">
                  <el-switch v-model="configForm.experimental.enable_think_flow" />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 远程设置 -->
            <el-tab-pane label="远程设置">
              <el-form :model="configForm.remote" label-width="180px">
                <el-form-item label="启用远程">
                  <el-switch v-model="configForm.remote.enable" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

        <!-- 模型设置 -->
        <el-tab-pane label="模型设置" name="models">
          <el-tabs type="border-card">
            <!-- 回复模型1 -->
            <el-tab-pane label="回复模型1">
              <el-form :model="configForm.model.llm_reasoning" label-width="180px">
                <el-form-item label="模型名称">
                  <el-input v-model="configForm.model.llm_reasoning.name" />
                </el-form-item>
                <el-form-item label="提供商">
                  <el-input v-model="configForm.model.llm_reasoning.provider" />
                </el-form-item>
                <el-form-item label="输入价格">
                  <el-input-number
                    v-model="configForm.model.llm_reasoning.pri_in"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
                <el-form-item label="输出价格">
                  <el-input-number
                    v-model="configForm.model.llm_reasoning.pri_out"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 回复模型2 -->
            <el-tab-pane label="回复模型2">
              <el-form :model="configForm.model.llm_normal" label-width="180px">
                <el-form-item label="模型名称">
                  <el-input v-model="configForm.model.llm_normal.name" />
                </el-form-item>
                <el-form-item label="提供商">
                  <el-input v-model="configForm.model.llm_normal.provider" />
                </el-form-item>
                <el-form-item label="输入价格">
                  <el-input-number
                    v-model="configForm.model.llm_normal.pri_in"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
                <el-form-item label="输出价格">
                  <el-input-number
                    v-model="configForm.model.llm_normal.pri_out"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 回复模型3 -->
            <el-tab-pane label="回复模型3">
              <el-form :model="configForm.model.llm_reasoning_minor" label-width="180px">
                <el-form-item label="模型名称">
                  <el-input v-model="configForm.model.llm_reasoning_minor.name" />
                </el-form-item>
                <el-form-item label="提供商">
                  <el-input v-model="configForm.model.llm_reasoning_minor.provider" />
                </el-form-item>
                <el-form-item label="输入价格">
                  <el-input-number
                    v-model="configForm.model.llm_reasoning_minor.pri_in"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
                <el-form-item label="输出价格">
                  <el-input-number
                    v-model="configForm.model.llm_reasoning_minor.pri_out"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 表情包判断模型 -->
            <el-tab-pane label="表情包判断模型">
              <el-form :model="configForm.model.llm_emotion_judge" label-width="180px">
                <el-form-item label="模型名称">
                  <el-input v-model="configForm.model.llm_emotion_judge.name" />
                </el-form-item>
                <el-form-item label="提供商">
                  <el-input v-model="configForm.model.llm_emotion_judge.provider" />
                </el-form-item>
                <el-form-item label="输入价格">
                  <el-input-number
                    v-model="configForm.model.llm_emotion_judge.pri_in"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
                <el-form-item label="输出价格">
                  <el-input-number
                    v-model="configForm.model.llm_emotion_judge.pri_out"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 记忆主题判断模型 -->
            <el-tab-pane label="记忆主题判断模型">
              <el-form :model="configForm.model.llm_topic_judge" label-width="180px">
                <el-form-item label="模型名称">
                  <el-input v-model="configForm.model.llm_topic_judge.name" />
                </el-form-item>
                <el-form-item label="提供商">
                  <el-input v-model="configForm.model.llm_topic_judge.provider" />
                </el-form-item>
                <el-form-item label="输入价格">
                  <el-input-number
                    v-model="configForm.model.llm_topic_judge.pri_in"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
                <el-form-item label="输出价格">
                  <el-input-number
                    v-model="configForm.model.llm_topic_judge.pri_out"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 概括模型 -->
            <el-tab-pane label="概括模型">
              <el-form :model="configForm.model.llm_summary_by_topic" label-width="180px">
                <el-form-item label="模型名称">
                  <el-input v-model="configForm.model.llm_summary_by_topic.name" />
                </el-form-item>
                <el-form-item label="提供商">
                  <el-input v-model="configForm.model.llm_summary_by_topic.provider" />
                </el-form-item>
                <el-form-item label="输入价格">
                  <el-input-number
                    v-model="configForm.model.llm_summary_by_topic.pri_in"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
                <el-form-item label="输出价格">
                  <el-input-number
                    v-model="configForm.model.llm_summary_by_topic.pri_out"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 图像识别模型 -->
            <el-tab-pane label="图像识别模型">
              <el-form :model="configForm.model.vlm" label-width="180px">
                <el-form-item label="模型名称">
                  <el-input v-model="configForm.model.vlm.name" />
                </el-form-item>
                <el-form-item label="提供商">
                  <el-input v-model="configForm.model.vlm.provider" />
                </el-form-item>
                <el-form-item label="输入价格">
                  <el-input-number
                    v-model="configForm.model.vlm.pri_in"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
                <el-form-item label="输出价格">
                  <el-input-number
                    v-model="configForm.model.vlm.pri_out"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 外世界判断模型 -->
            <el-tab-pane label="外世界判断模型">
              <el-form :model="configForm.model.llm_outer_world" label-width="180px">
                <el-form-item label="模型名称">
                  <el-input v-model="configForm.model.llm_outer_world.name" />
                </el-form-item>
                <el-form-item label="提供商">
                  <el-input v-model="configForm.model.llm_outer_world.provider" />
                </el-form-item>
                <el-form-item label="输入价格">
                  <el-input-number
                    v-model="configForm.model.llm_outer_world.pri_in"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
                <el-form-item label="输出价格">
                  <el-input-number
                    v-model="configForm.model.llm_outer_world.pri_out"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 心流模型 -->
            <el-tab-pane label="心流模型">
              <el-form :model="configForm.model.llm_heartflow" label-width="180px">
                <el-form-item label="模型名称">
                  <el-input v-model="configForm.model.llm_heartflow.name" />
                </el-form-item>
                <el-form-item label="提供商">
                  <el-input v-model="configForm.model.llm_heartflow.provider" />
                </el-form-item>
                <el-form-item label="输入价格">
                  <el-input-number
                    v-model="configForm.model.llm_heartflow.pri_in"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
                <el-form-item label="输出价格">
                  <el-input-number
                    v-model="configForm.model.llm_heartflow.pri_out"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 子心流模型 -->
            <el-tab-pane label="子心流模型">
              <el-form :model="configForm.model.llm_sub_heartflow" label-width="180px">
                <el-form-item label="模型名称">
                  <el-input v-model="configForm.model.llm_sub_heartflow.name" />
                </el-form-item>
                <el-form-item label="提供商">
                  <el-input v-model="configForm.model.llm_sub_heartflow.provider" />
                </el-form-item>
                <el-form-item label="输入价格">
                  <el-input-number
                    v-model="configForm.model.llm_sub_heartflow.pri_in"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
                <el-form-item label="输出价格">
                  <el-input-number
                    v-model="configForm.model.llm_sub_heartflow.pri_out"
                    :min="0"
                    :step="0.01"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 嵌入模型 -->
            <el-tab-pane label="嵌入模型">
              <el-form :model="configForm.model.embedding" label-width="180px">
                <el-form-item label="模型名称">
                  <el-input v-model="configForm.model.embedding.name" />
                </el-form-item>
                <el-form-item label="提供商">
                  <el-input v-model="configForm.model.embedding.provider" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

        <!-- 平台设置 -->
        <el-tab-pane label="平台设置" name="platforms">
          <el-form :model="configForm.platforms" label-width="180px">
            <el-form-item label="QQ平台API">
              <el-input v-model="configForm.platforms.qq" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 心情设置 -->
        <el-tab-pane label="心情设置" name="mood">
          <el-form :model="configForm.mood" label-width="180px">
            <el-form-item label="心情更新间隔">
              <el-input-number
                v-model="configForm.mood.mood_update_interval"
                :min="0"
                :step="0.1"
                :precision="1"
              />
            </el-form-item>
            <el-form-item label="心情衰减率">
              <el-input-number
                v-model="configForm.mood.mood_decay_rate"
                :min="0"
                :max="1"
                :step="0.01"
                :precision="2"
              />
            </el-form-item>
            <el-form-item label="心情强度因子">
              <el-input-number
                v-model="configForm.mood.mood_intensity_factor"
                :min="0"
                :step="0.1"
                :precision="1"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 关键词反应设置 -->
        <el-tab-pane label="关键词反应" name="keywords">
          <el-form :model="configForm.keywords_reaction" label-width="180px">
            <el-form-item label="启用关键词反应">
              <el-switch v-model="configForm.keywords_reaction.enable" />
            </el-form-item>
            <el-form-item label="规则列表">
              <div v-for="(rule, index) in configForm.keywords_reaction.rules" :key="index" class="rule-item">
                <el-card>
                  <template #header>
                    <div class="rule-header">
                      <span>规则 {{ index + 1 }}</span>
                      <div>
                        <el-switch v-model="rule.enable" class="rule-switch" />
                        <el-button type="danger" @click="handleRemoveRule(index)">删除</el-button>
                      </div>
                    </div>
                  </template>
                  <el-form-item label="关键词">
                    <div class="list-input">
                      <div class="list-tags">
                        <el-tag
                          v-for="(keyword, kidx) in rule.keywords"
                          :key="kidx"
                          closable
                          @close="handleRemoveKeyword(index, kidx)"
                          class="list-tag"
                        >
                          {{ keyword }}
                        </el-tag>
                      </div>
                      <div class="list-input-field">
                        <el-input
                          v-model="newKeywords[index]"
                          placeholder="输入关键词，按回车添加"
                          @keyup.enter="handleAddKeyword(index)"
                          clearable
                        >
                          <template #append>
                            <el-button @click="handleAddKeyword(index)">添加</el-button>
                          </template>
                        </el-input>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="反应">
                    <el-input
                      v-model="rule.reaction"
                      type="textarea"
                      :rows="3"
                    />
                  </el-form-item>
                </el-card>
              </div>
              <el-button type="primary" @click="handleAddRule">添加规则</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { configService, type MainConfig } from '@/api/configApi'

const activeTab = ref('bot')
const newAlias = ref('')
const newBanWord = ref('')
const newBanRegex = ref('')
const newMemoryBanWord = ref('')
const newTalkAllowed = ref('')
const newTalkFrequencyDown = ref('')
const newBanUserId = ref('')
const newKeywords = ref<string[]>([])
const newPersonalityPrompt = ref('')

const configForm = reactive<MainConfig>({
  inner: {
    version: '0.0.12'
  },
  mai_version: {
    version: '0.6.0',
    'version-fix': 'snapshot-2'
  },
  bot: {
    qq: 114514,
    nickname: '麦麦',
    alias_names: ['麦叠', '牢麦']
  },
  groups: {
    talk_allowed: [123, 123],
    talk_frequency_down: [],
    ban_user_id: []
  },
  personality: {
    prompt_personality: [
      '用一句话或几句话描述性格特点和其他特征',
      '例如，是一个热爱国家热爱党的新时代好青年',
      '例如，曾经是一个学习地质的女大学生，现在学习心理学和脑科学，你会刷贴吧'
    ],
    personality_1_probability: 0.7,
    personality_2_probability: 0.2,
    personality_3_probability: 0.1
  },
  schedule: {
    enable_schedule_gen: true,
    prompt_schedule_gen: '用几句话描述描述性格特点或行动规律，这个特征会用来生成日程表',
    schedule_doing_update_interval: 900
  },
  platforms: {
    qq: 'http://127.0.0.1:18002/api/message'
  },
  message: {
    max_context_size: 15,
    emoji_chance: 0.2,
    thinking_timeout: 120,
    max_response_length: 1024,
    ban_words: [],
    ban_msgs_regex: []
  },
  willing: {
    willing_mode: 'classical',
    response_willing_amplifier: 1,
    response_interested_rate_amplifier: 1,
    down_frequency_rate: 3,
    emoji_response_penalty: 0.1
  },
  response: {
    model_r1_probability: 0.8,
    model_v3_probability: 0.1,
    model_r1_distill_probability: 0.1
  },
  emoji: {
    check_interval: 15,
    register_interval: 60,
    auto_save: true,
    enable_check: false,
    check_prompt: '符合公序良俗'
  },
  memory: {
    build_memory_interval: 2000,
    build_memory_distribution: [4.0, 2.0, 0.6, 24.0, 8.0, 0.4],
    build_memory_sample_num: 10,
    build_memory_sample_length: 20,
    memory_compress_rate: 0.1,
    forget_memory_interval: 1000,
    memory_forget_time: 24,
    memory_forget_percentage: 0.01,
    memory_ban_words: []
  },
  mood: {
    mood_update_interval: 1.0,
    mood_decay_rate: 0.95,
    mood_intensity_factor: 1.0
  },
  keywords_reaction: {
    enable: true,
    rules: [
      {
        enable: true,
        keywords: ['人机', 'bot', '机器', '入机', 'robot', '机器人', 'ai', 'AI'],
        reaction: '有人说你是人机或者机器人，否定这一事实，攻击或反问他。注意，只有认为你是机器人才回复，否则不要否认'
      },
      {
        enable: false,
        keywords: ['测试关键词回复', 'test', ''],
        reaction: '回答"测试成功"'
      }
    ]
  },
  chinese_typo: {
    enable: true,
    error_rate: 0.001,
    min_freq: 9,
    tone_error_rate: 0.1,
    word_replace_rate: 0.006
  },
  response_spliter: {
    enable_response_spliter: true,
    response_max_length: 100,
    response_max_sentence_num: 4
  },
  remote: {
    enable: true
  },
  experimental: {
    enable_friend_chat: false,
    enable_think_flow: false
  },
  model: {
    llm_reasoning: {
      name: 'Pro/deepseek-ai/DeepSeek-R1',
      provider: 'SILICONFLOW',
      pri_in: 4,
      pri_out: 16
    },
    llm_reasoning_minor: {
      name: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
      provider: 'SILICONFLOW',
      pri_in: 1.26,
      pri_out: 1.26
    },
    llm_normal: {
      name: 'Pro/deepseek-ai/DeepSeek-V3',
      provider: 'SILICONFLOW',
      pri_in: 2,
      pri_out: 8
    },
    llm_emotion_judge: {
      name: 'Qwen/Qwen2.5-14B-Instruct',
      provider: 'SILICONFLOW',
      pri_in: 0.7,
      pri_out: 0.7
    },
    llm_topic_judge: {
      name: 'Pro/Qwen/Qwen2.5-7B-Instruct',
      provider: 'SILICONFLOW',
      pri_in: 0,
      pri_out: 0
    },
    llm_summary_by_topic: {
      name: 'Qwen/Qwen2.5-32B-Instruct',
      provider: 'SILICONFLOW',
      pri_in: 1.26,
      pri_out: 1.26
    },
    moderation: {
      name: '',
      provider: 'SILICONFLOW',
      pri_in: 1.0,
      pri_out: 2.0
    },
    vlm: {
      name: 'Pro/Qwen/Qwen2.5-VL-7B-Instruct',
      provider: 'SILICONFLOW',
      pri_in: 0.35,
      pri_out: 0.35
    },
    embedding: {
      name: 'BAAI/bge-m3',
      provider: 'SILICONFLOW'
    },
    llm_outer_world: {
      name: 'Qwen/Qwen2.5-7B-Instruct',
      provider: 'SILICONFLOW',
      pri_in: 0,
      pri_out: 0
    },
    llm_sub_heartflow: {
      name: 'Qwen/Qwen2.5-32B-Instruct',
      provider: 'SILICONFLOW',
      pri_in: 1.26,
      pri_out: 1.26
    },
    llm_heartflow: {
      name: 'Qwen/Qwen2.5-32B-Instruct',
      provider: 'SILICONFLOW',
      pri_in: 1.26,
      pri_out: 1.26
    }
  }
})

// 验证概率和
const validateProbabilities = () => {
  // 验证人格概率
  const personalitySum = 
    configForm.personality.personality_1_probability +
    configForm.personality.personality_2_probability +
    configForm.personality.personality_3_probability
  
  if (Math.abs(personalitySum - 1.0) > 0.000001) {
    ElMessage.warning('人格概率之和必须等于1.0')
  }

  // 验证模型概率
  const modelSum = 
    configForm.response.model_r1_probability +
    configForm.response.model_v3_probability +
    configForm.response.model_r1_distill_probability
  
  if (Math.abs(modelSum - 1.0) > 0.000001) {
    ElMessage.warning('模型概率之和必须等于1.0')
  }
}

// Bot相关方法
const handleAddAlias = () => {
  if (newAlias.value) {
    configForm.bot.alias_names.push(newAlias.value)
    newAlias.value = ''
  }
}

const handleRemoveAlias = (index: number) => {
  configForm.bot.alias_names.splice(index, 1)
}

// 消息相关方法
const handleAddBanWord = () => {
  if (newBanWord.value) {
    configForm.message.ban_words.push(newBanWord.value)
    newBanWord.value = ''
  }
}

const handleRemoveBanWord = (index: number) => {
  configForm.message.ban_words.splice(index, 1)
}

const handleAddBanRegex = () => {
  if (newBanRegex.value) {
    configForm.message.ban_msgs_regex.push(newBanRegex.value)
    newBanRegex.value = ''
  }
}

const handleRemoveBanRegex = (index: number) => {
  configForm.message.ban_msgs_regex.splice(index, 1)
}

// 记忆相关方法
const handleAddMemoryBanWord = () => {
  if (newMemoryBanWord.value) {
    configForm.memory.memory_ban_words.push(newMemoryBanWord.value)
    newMemoryBanWord.value = ''
  }
}

const handleRemoveMemoryBanWord = (index: number) => {
  configForm.memory.memory_ban_words.splice(index, 1)
}

// 群组相关方法
const handleAddTalkAllowed = () => {
  if (newTalkAllowed.value) {
    configForm.groups.talk_allowed.push(parseInt(newTalkAllowed.value))
    newTalkAllowed.value = ''
  }
}

const handleRemoveTalkAllowed = (index: number) => {
  configForm.groups.talk_allowed.splice(index, 1)
}

const handleAddTalkFrequencyDown = () => {
  if (newTalkFrequencyDown.value) {
    configForm.groups.talk_frequency_down.push(parseInt(newTalkFrequencyDown.value))
    newTalkFrequencyDown.value = ''
  }
}

const handleRemoveTalkFrequencyDown = (index: number) => {
  configForm.groups.talk_frequency_down.splice(index, 1)
}

const handleAddBanUserId = () => {
  if (newBanUserId.value) {
    configForm.groups.ban_user_id.push(parseInt(newBanUserId.value))
    newBanUserId.value = ''
  }
}

const handleRemoveBanUserId = (index: number) => {
  configForm.groups.ban_user_id.splice(index, 1)
}

// 关键词反应相关方法
const handleAddRule = () => {
  configForm.keywords_reaction.rules.push({
    enable: true,
    keywords: [],
    reaction: ''
  })
  newKeywords.value.push('')
}

const handleRemoveRule = (index: number) => {
  configForm.keywords_reaction.rules.splice(index, 1)
  newKeywords.value.splice(index, 1)
}

const handleAddKeyword = (ruleIndex: number) => {
  if (newKeywords.value[ruleIndex]) {
    configForm.keywords_reaction.rules[ruleIndex].keywords.push(newKeywords.value[ruleIndex])
    newKeywords.value[ruleIndex] = ''
  }
}

const handleRemoveKeyword = (ruleIndex: number, keywordIndex: number) => {
  configForm.keywords_reaction.rules[ruleIndex].keywords.splice(keywordIndex, 1)
}

const handleAddPersonalityPrompt = () => {
  if (newPersonalityPrompt.value) {
    configForm.personality.prompt_personality.push(newPersonalityPrompt.value)
    newPersonalityPrompt.value = ''
  }
}

const handleRemovePersonalityPrompt = (index: number) => {
  configForm.personality.prompt_personality.splice(index, 1)
}

const handleSave = async () => {
  validateProbabilities()
  try {
    await configService.saveMainConfig(configForm)
    ElMessage.success('配置保存成功')
  } catch (error) {
    ElMessage.error('配置保存失败')
  }
}

onMounted(async () => {
  try {
    const config = await configService.getMainConfig()
    Object.assign(configForm, config)
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

  .param-item {
    text-align: center;
    
    .param-label {
      margin-bottom: 8px;
      color: #606266;
      font-size: 14px;
    }
  }

  .rule-item {
    margin-bottom: 20px;

    .rule-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .rule-switch {
        margin-right: 16px;
      }
    }
  }
}
</style>