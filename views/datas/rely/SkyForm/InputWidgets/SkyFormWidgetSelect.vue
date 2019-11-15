/* @flow
<template>
    <div class="sky-form-widget-select">
        <el-select
            v-if="!isGroup"
            v-model="inputModel"
            :placeholder="placeholder"
            style="width:100%;"
        >
            <el-option
                v-for="item in renderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
            />
        </el-select>
        <el-select
            v-else
            v-model="inputModel"
            :placeholder="placeholder"
        >
            <template
                v-for="(group, index) in reOrganizedRenderOptions"
            >
                <template v-if="group && group.options && group.options.length > 0">
                    <el-option-group
                        :label="group && group.label"
                        :disabled="group && group.disabled || false"
                        :key="index"
                    >
                        <el-option
                            v-for="item in group.options"
                            :key="item && item.value"
                            :label="item && item.label"
                            :value="item && item.value"
                            :disabled="group.disabled === 'undefined' ? (item && item.disabled || false) : (group.disabled || false)"
                        />
                    </el-option-group>
                </template>
                <template v-else>
                    <el-option
                        :key="index"
                        :label="group && group.label"
                        :value="group && group.value"
                        :disabled="group && group.disabled"
                    />
                </template>
            </template>
        </el-select>
    </div>
</template>
*/
// <!--eslint-disable-next-line-->
// <script>
// import fetch from '../../fetch';
import httpService from '../../../../../helper/httpService';
import SkyFormWidgetMixin from './SkyFormWidgetMixin';

type OptionsType = string | Array<{label: string, value?: any, options?: OptionsType }>;
export default {
    name: 'SkyFormWidgetSelect',
    mixins: [SkyFormWidgetMixin],
    data() {
        return {
            renderOptions: []
        };
    },
    props: {
        options: {
            type: [String, Array, Promise],
            default: () => []
        },
        isGroup: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        reOrganizedRenderOptions() {
            if (this.isGroup) {
                let tempOpt = [];
                this.renderOptions.forEach(group => {
                    let temp = {
                        label: group.label,
                        value: group.value,
                        options: group.options,
                        disabled: group.disabled
                    };
                    const groupValue = group.value;
                    if (group.value && group.options && Array.isArray(group.options)) {
                        temp.options = group.options.map(item => ({
                            label: item.label,
                            value: [groupValue, groupValue ? '@' : '', item.value].join(''),
                            disabled: item.disabled
                        }));
                    } else {
                        temp.options = group.options;
                    }
                    tempOpt.push(temp);
                });
                return tempOpt;
            }
            return this.renderOptions;
        }
    },
    watch: {
        options: {
            immediate: true,
            deep: true,
            handler(val: OptionsType) {
                if (this.isGroup) {
                    // 如果是选项组
                    if (typeof val === 'string') {
                        httpService.get(val).then(res => {
                            this.renderOptions = res.data.data.options;
                        });
                    } else if (Array.isArray(val)) {
                        const renderOptions = [];
                        val.forEach((item, index) => {
                            if (typeof item.options === 'string') {
                                httpService.get(item.options).then(res => {
                                    let subOptions = { options: res.data.data.options };
                                    // renderOptions[index] = { ...item, ...subOptions }
                                    this.$set(renderOptions, index, { ...item, ...subOptions });
                                });
                            } else if (Array.isArray(item.options)) {
                                renderOptions[index] = item;
                            } else {
                                renderOptions[index] = item;
                            }
                        });
                        this.renderOptions = renderOptions;
                    } else if (val instanceof Promise) {
                        val.then(res => {
                            this.renderOptions = res;
                        }, () => {
                            this.renderOptions = [];
                        });
                    }
                } else {
                    if (typeof val === 'string') {
                        httpService.get(val).then(res => {
                            this.renderOptions = res.data.data.options;
                        });
                    } else if (Array.isArray(val)) {
                        this.renderOptions = val;
                    } else if (val instanceof Promise) {
                        val.then(res => {
                            this.renderOptions = res;
                        }, () => {
                            this.renderOptions = [];
                        });
                    } else {
                        this.renderOptions = [];
                    }
                }
            }
        }
    }
};
// </script>

/*
<style lang="scss" scoped>
    .sky-form-widget-select {
        & /deep/ .el-select {
            width: 100%;
        }
    }
</style>
*/
