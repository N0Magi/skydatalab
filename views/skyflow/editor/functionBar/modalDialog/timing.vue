<template>
    <div class="timing-container skyflow-dialog ">
        <sdxu-dialog
            title="定时运行设置"
            :visible.sync="dialogVisible"
            width="560px"
            :custom-class="customClass"
            :close-on-click-modal="false"
            @close="handleBeforeClose('currentData')"
            @open="handleOpenDialog"
        >
            <div>
                <el-form
                    label-position="right"
                    label-width="140px"
                    @submit.native.prevent
                    :model="currentData"
                    ref="currentData"
                    :rules="rules"
                >
                    <!-- <el-form-item label="定时运行设置开关:">
                        <el-switch v-model="currentData.switch" />
                    </el-form-item> -->
                    <el-form-item
                        label="任务名称:"
                        prop="crontab_name"
                    >
                        <el-input
                            v-model="currentData.crontab_name"
                            placeholder="请输入任务名称"
                            :disabled="!fromSkyflow"
                        />
                    </el-form-item>
                    <el-form-item
                        label="触发频率"
                        prop="crontab"
                    >
                        <el-input
                            v-model="currentData.crontab"
                            placeholder="请输入crontab表达式"
                        />
                        <span class="tip-text">
                            示例: "0 0 * * ?",表示每天0点触发执行。
                        </span>
                    </el-form-item>
                    <!-- <el-form-item label="触发频率:">
                        <el-radio-group v-model="currentData.cron_type">
                            <el-radio :label="0">
                                Cron表达式
                            </el-radio>
                            <el-radio :label="1">
                                时间选择
                            </el-radio>
                        </el-radio-group>
                        <div v-if="currentData.cron_type === 0">
                            <el-input v-model="currentData.crontab" />
                        </div>
                        <div v-else>
                            <div
                                v-for="(item, idx) in currentData.date_list"
                                :key="idx"
                                class="timing-date-select"
                            >
                                <div class="timing-date-select_type">
                                    <el-select
                                        v-model="item.type"
                                        size="small"
                                        @change="handleChangeDateSelect(idx)"
                                    >
                                        <el-option
                                            v-for="(el, i) in getCronDateList(item.type)"
                                            :key="i"
                                            :label="el.label"
                                            :value="el.type"
                                        />
                                    </el-select>
                                </div>
                                <div
                                    v-if="item.type"
                                    class="timing-date-select_value"
                                >
                                    <el-select
                                        v-model="item.start"
                                        size="small"
                                        @change="handleSelectStartChange(idx)"
                                    >
                                        <el-option
                                            v-for="(v, k) in getDateValueList(item.type, null, item.end)"
                                            :key="k"
                                            :label="v"
                                            :value="v"
                                        />
                                    </el-select>
                                    -
                                    <el-select
                                        v-model="item.end"
                                        size="small"
                                        @change="handleSelectEndChange(idx)"
                                    >
                                        <el-option
                                            v-for="(v, k) in getDateValueList(item.type, item.start, null)"
                                            :key="k"
                                            :label="v"
                                            :value="v"
                                        />
                                    </el-select>
                                </div>
                                <el-button
                                    type="info"
                                    plain
                                    icon="el-icon-minus"
                                    @click="handleMinusDateSelect(idx)"
                                    size="small"
                                />
                            </div>
                            <div v-show="currentData.date_list.length < 5">
                                <el-button
                                    type="primary"
                                    plain
                                    icon="el-icon-plus"
                                    @click="handleAddDateSelect"
                                    size="small"
                                />
                            </div>
                        </div>
                    </el-form-item> -->
                    <el-form-item label="周期内未执行完时:">
                        <div>放弃</div>
                        <!-- <el-radio-group v-model="currentData.handle_type">
                            <el-radio :label="1">
                                放弃
                            </el-radio>
                            <el-radio :label="2">
                                等待
                            </el-radio>
                        </el-radio-group> -->
                    </el-form-item>
                    <!-- <el-form-item
                        label="执行超时时间:"
                        prop="timeout"
                        v-show="currentData.handle_type === 2"
                    >
                        <el-input-number
                            :min="1"
                            style="width: 90%"
                            v-model="currentData.timeout"
                            size="small"
                        />
                        <span>分钟</span>
                    </el-form-item> -->
                </el-form>

                <span
                    v-if="currentData.handle_type === 1"
                    class="tip-text"
                >
                    如果在下次触发时，上一轮任务还没有执行完成，则直接Kill掉当前任务，启动新一轮任务。
                </span>
                <!-- <span
                    v-else-if="currentData.handle_type === 2"
                    class="tip-text"
                >
                    选择等待，如果在下次触发时，上一轮任务还没有执行完成，则等待上次任务完成后再启动新一轮任务。
                </span>
                <span
                    v-else
                    class="tip-text"
                >
                    选择并行，如果在下次触发时，上一轮任务还没有执行完成，直接启动新一轮任务。此场景需要注意当前的资源使用情况。
                </span> -->
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    @click="handleInitForm('currentData')"
                    size="small"
                >
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    size="small"
                    @click="handleSaveModel('currentData')"
                >
                    保 存
                </el-button>
            </span>
        </sdxu-dialog>
    </div>
</template>
<script>
import { cronDateList } from '../../js/skyflowConfig';
import { itemNameValidate } from 'utils/validate';
import { checkDuplicateCrontabName } from '@sdx/utils/lib/api/skyflow';

export default {
    name: 'Timing',
    props: {
        detailDialogVisible: {
            type: Boolean,
            default: true
        },
        executeSetting: {
            type: Object,
            required: true
        },
        fromSkyflow: {
            type: Boolean,
            default: true
        },
        skyflowId: {
            type: String,
            default: ''
        },
        executionId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            currentData: {
                crontab_name: this.executeSetting.crontab_name || '',
                handle_type: this.executeSetting.handle_type || 1, // 1: 放弃  2: 等待
                timeout: this.executeSetting.timeout || 1,
                cron_type: this.executeSetting.cron_type || 1, // 1: cron表达式 2: 时间选择
                crontab: this.executeSetting.crontab || '',
                date_list: this.executeSetting.date_list || []
            },
            cronDateList,
            rules: {
                crontab_name: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur',
                        transform(value) {
                            return value && ('' + value).trim();
                        }
                    },
                    {
                        validator: itemNameValidate,
                        trigger: 'blur'
                    },
                    {
                        validator: this.validateDuplicateName,
                        trigger: 'blur'
                    }
                ],
                crontab: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur',
                        transform(value) {
                            return value && ('' + value).trim();
                        }
                    }
                ],
                timeout: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur',
                        transform(value) {
                            return value && ('' + value).trim();
                        }
                    }
                ],
                handle_type: [
                    {
                        required: true
                    }
                ]
            }
        };
    },
    computed: {
        dialogVisible: {
            get() {
                return this.detailDialogVisible;
            },
            set(nval) {
                this.$emit('update:detailDialogVisible', nval);
            }
        },
        customClass() {
            return this.fromSkyflow ? 'selfStyle' : '';
        }
    },
    methods: {
        handleSaveModel(formName) {
            let data = {};
            console.error(this.currentData);
            if (this.currentData.cron_type === 2) {
                data.crontab = this.generateCrontab(this.currentData.date_list);
            } else {
                data.date_list = [];
            }
            let params = Object.assign({}, this.currentData, data);
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$emit('confirm', {
                        event: 'timing',
                        data: params
                    });
                    this.dialogVisible = false;
                } else {
                    return false;
                }
            });
        },
        handleBeforeClose(formName) {
            this.$refs[formName].resetFields();
        },
        handleOpenDialog() {
            this.currentData = {
                crontab_name: this.executeSetting.crontab_name || '',
                handle_type: this.executeSetting.handle_type || 1, // 1: 放弃  2: 等待
                timeout: this.executeSetting.timeout || 1,
                cron_type: this.executeSetting.cron_type || 1, // 1: cron表达式 2: 时间选择
                crontab: this.executeSetting.crontab || '',
                date_list: this.executeSetting.date_list || []
            };
        },
        handleInitForm(formName) {
            this.$refs[formName].resetFields();
            this.dialogVisible = false;
        },
        getCronDateList(type) {
            let selectedTypeList = this.currentData.date_list.map(el => el.type);
            let filterList = [];
            if (['week', 'day'].includes(type)) {
                // 当前日期类型为week、day时，下拉选项中可以包含week和day，所以需要从filterList中剔除
                filterList = selectedTypeList.filter(
                    item => !['week', 'day'].includes(item)
                );
            } else if (
                selectedTypeList.includes('week') ||
        selectedTypeList.includes('day')
            ) {
                // 当前日期类型不为week或day，且已经设置了week或者day时，下拉选项中不能包含week和day
                filterList = selectedTypeList.filter(
                    item => !['week', 'day'].includes(item) && type !== item
                );
                filterList.push('week');
                filterList.push('day');
            } else {
                // 下拉菜单中可以包含本身
                filterList = selectedTypeList.filter(item => type !== item);
            }
            return cronDateList.filter(el => !filterList.includes(el.type));
        },
        getDateValueList(type, start, end) {
            // 日期选择区间限制
            let typeInfo = cronDateList.find(el => el.type === type);
            // return typeInfo.value.filter(el => {
            //     if (start !== null) {
            //         return el >= start;
            //     } else if (end !== null) {
            //         return el <= end;
            //     } else {
            //         return true;
            //     }
            // });
            return typeInfo.value;
        },
        handleAddDateSelect() {
            this.currentData.date_list.push({
                type: '',
                start: 1,
                end: 1
            });
        },
        handleMinusDateSelect(i) {
            this.currentData.date_list.splice(i, 1);
        },
        handleChangeDateSelect(i) {
            let defaultValue = this.cronDateList.find(
                el => el.type === this.currentData.date_list[i].type
            ).default;
            this.currentData.date_list[i].start = defaultValue;
            this.currentData.date_list[i].end = defaultValue;
        },
        generateCrontab(dateList) {
            let expression = '{minute} {hour} {day} {month} {week} {year}';
            dateList.forEach(
                el =>
                    (expression = expression.replace(
                        `{${el.type}}`,
                        el.start === el.end ? `${el.start}` : `${el.start}-${el.end}`
                    ))
            );
            if (dateList.some(el => el.type === 'week')) {
                expression = expression.replace('{day}', '?');
            } else if (dateList.some(el => el.type === 'day')) {
                expression = expression.replace('{week}', '?');
            }
            expression =
        dateList.length === 0
            ? expression.replace('{minute}', '*')
            : expression.replace('{minute}', '0');
            expression =
        dateList.length === 0 ||
        (dateList.length === 1 && dateList.find(el => el.type === 'minute'))
            ? expression.replace('{hour}', '*')
            : expression.replace('{hour}', '0');
            expression = expression.replace('{day}', '*');
            expression = expression.replace('{month}', '*');
            expression = expression.replace('{week}', '?');
            expression = expression.replace(' {year}', '');
            return expression;
        },
        handleSelectStartChange(i) {
            let data = this.currentData.date_list[i];
            if (data.start > data.end) {
                data.end = data.start;
            }
        },
        handleSelectEndChange(i) {
            let data = this.currentData.date_list[i];
            if (data.start > data.end) {
                data.start = data.end;
            }
        },
        validateDuplicateName(rule, value, callback) {
            if (this.fromSkyflow) {
                checkDuplicateCrontabName({
                    crontab_name: this.currentData.crontab_name
                })
                    .then(data => {
                        if (data.exist) {
                            callback(new Error('名称已经存在'));
                        } else {
                            callback();
                        }
                    })
                    .catch(() => {
                        callback(new Error('验证异常'));
                    });
            } else {
                callback();
            }
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.timing-container {
  input {
    height: 32px !important;
  }
  .timing-date-select {
    .el-select {
      width: 64px;
    }
    .timing-date-select_type {
      display: inline-block;
      margin-right: 10px;
      .el-select {
        width: 90px;
      }
    }
    .timing-date-select_value {
      display: inline-block;
      margin-right: 10px;
      .el-select {
        width: 80px;
      }
    }
  }
  .tip-text {
    font-size: 12px;
  }
}
</style>
