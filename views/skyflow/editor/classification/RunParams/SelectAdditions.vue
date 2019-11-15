<template>
    <div class="select-additions">
        <el-form-item
            label="可选值内容:"
            prop="possibleValues"
        >
            <el-row
                v-for="(item, index) in params.possibleValues"
                :key="index"
                class="possible-val-row"
            >
                <el-col :span="8">
                    <el-input
                        placeholder="Label"
                        v-model="item.label"
                    />
                </el-col>
                <el-col
                    :span="2"
                    style="text-align: center"
                >
                    ---
                </el-col>
                <el-col :span="8">
                    <el-input
                        placeholder="Value"
                        v-model="item.value"
                    />
                </el-col>
                <el-col
                    :span="4"
                    style="text-align: center;line-height: 36px;"
                    v-if="index > 0"
                >
                    <i
                        class="sf-icon sf-shanchu delete-option-icon"
                        @click.prevent.stop="deleteOption(index)"
                    />
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item>
            <el-button
                class="button-add"
                size="mini"
                @click="addOptions"
            >
                <i class="sf-icon sf-jiahao" /> 添加
            </el-button>
        </el-form-item>
        <el-form-item label="支持多选:">
            <el-switch v-model="params.multi" />
        </el-form-item>
        <el-form-item label="参数默认值:">
            <el-select
                :multiple="params.multi"
                v-model="params.defaultVal"
                placeholder="请选择参数默认值"
                style="width:100%;"
            >
                <el-option
                    v-for="(item, index) in defaultValOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
        </el-form-item>
    </div>
</template>

<script>
export default {
    name: 'SelectAdditions',
    props: {
        paramOptions: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    computed: {
        params: {
            get() {
                return this.paramOptions;
            },
            set(val) {
                this.$emit('update:paramOptions', val);
            }
        },
        defaultValOptions() {
            return this.params.possibleValues.filter(item => item.label !== '' && item.value !== '');
        }
    },
    methods: {
        deleteOption(index) {
            this.params.possibleValues.splice(index, 1);
        },
        addOptions() {
            this.params.possibleValues.push({
                label: '',
                value: ''
            });
        }
    },
    watch: {
        'params.multi': {
            handler(val) {
                if (val) {
                    this.params.defaultVal = [];
                } else {
                    this.params.defaultVal = '';
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>
    .select-additions {
        .delete-option-icon {
            font-size: 24px;
            cursor: pointer;
            color: #DEE4EC;
        }
        .button-add {
            border: 1px dashed rgba(222, 228, 236, 1);
            color: rgba(169, 187, 210, 1);
            font-size: 14px;
        }
        .possible-val-row {
            & + .possible-val-row {
                margin-top: 10px;
            }
        }
    }
</style>
