<template>
    <div class="setting-group">
        <div class="setting-type">
            <hr class="setting-line">
            <span>参数配置</span>
        </div>
        <div class="setting-options">
            <el-form :model="paramsSync">
                <el-alert
                    title="无需参数"
                    type="warning"
                    :closable="false"
                    v-if="!paramsConf || !paramsConf.length"
                />
                <component
                    v-for="(item, i) in paramsConf"
                    :key="i"
                    :current-schema="currentSchema"
                    :param.sync="item"
                    :val-obj="paramsSync"
                    :required="item.required"
                    v-show="!item.showAttr || item.showVal.indexOf(paramsSync[item.showAttr]) !== -1"
                    v-model="paramsSync[item.name]"
                    :is="item.uiType"
                    :is-editable="isEditable"
                />
            </el-form>
        </div>
    </div>
</template>

<script>
import * as paramsEditors from './paramsEditors';

import mixedParamBean from './paramsEditors/mixedParamBean';
import CommonInputParamBean from './paramsEditors/CommonInputParamBean';
export default {
    name: 'ParamsSetting',
    components: {
        ...paramsEditors,
        mixedParamBean,
        CommonInputParamBean
    },
    props: {
        params: {
            type: Object,
            default: null
        },
        paramsConf: {
            type: Array,
            default: () => []
        },
        currentSchema: {
            type: Array,
            default: () => []
        },
        isEditable: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        paramsSync: {
            get() {
                return this.params;
            },
            set(val) {
                console.log('params update', val);
            }
        }
    },
    watch: {
        paramsSync: {
            deep: true,
            handler() {
                this.$emit('updateParams', this.paramsSync);
            }
        }
    }
};
</script>

<style lang='scss'>
    .setting-group {
        .setting-options {
            .setting-option {
                .tip {
                color: #7a8599;
                font-weight: 700;
                    cursor: pointer;
                    i {
                        color:#f56c6c;
                    }
                }
            }
            .el-form-item__content {
                line-height: 34px;
            }
        }
    }
</style>
