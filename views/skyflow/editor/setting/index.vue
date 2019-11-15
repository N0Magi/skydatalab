<template>
    <div class="component-setting">
        <custom-setting
            v-if="node && (node.inputParams.length || node.outputParams)"
            :input-params="node.inputParams"
            :output-params="node.outputParams"
        />
        <params-setting
            v-if="node && node.params"
            :params="node.params"
            :params-conf="node.paramsConf"
            :current-schema="node.columnSchema"
            :is-editable="isEditable"
            @updateParams="handleParamsUpdate"
        />
        <environment-setting
            v-if="node && node.dockerImage"
            :docker-image="node.dockerImage"
        />
        <resource-setting
            v-if="node && node.resource"
            :resource="node.resource"
            :is-editable="isEditable"
            @updateResource="handleResourceUpdate"
            :taskKind="node.taskKind"
        />
    </div>
</template>

<script>
import resourceSetting from './resource/';
import paramsSetting from './params/';
import customSetting from './custom/';
import environmentSetting from './environment';
export default {
    name: 'ComponentSetting',
    props: {
        isEditable: {
            type: Boolean,
            default: true
        },
        nodeId: {
            type: String,
            required: true
        },
        node: {
            type: Object,
            required: true
        },
        isChangeSetting: {
            type: Boolean,
            default: false
        }
    },
    components: {
        resourceSetting,
        paramsSetting,
        customSetting,
        environmentSetting
    },
    computed: {
        settingChange: {
            get() {
                return this.isChangeSetting;
            },
            set(val) {
                this.$emit('update:isChangeSetting', val);
            }
        }
    },
    methods: {
        handleParamsUpdate(params) {
            console.log('！！！setting params', params);
            this.settingChange = true;
        },
        handleResourceUpdate(params) {
            console.log('！！！resource params', params);
            this.settingChange = true;
        }
    }
};
</script>

<style>
/* 修改element-ui默认样式 */
.component-setting input {
    border-radius: 0;
    width: 210px;
}
.component-setting .el-input-number__decrease {
    border-radius: 0;
    background-color: #ced6de;
}
.component-setting .el-input-number__increase {
    border-radius: 0;
    background-color: #ced6de;
}
.input-number-custom {
    width: 210px;
}
/* 修改element-ui默认样式 */
.component-setting {
    width: 100%;
    height: 100%;
    background: rgba(253, 253, 253, 1);
    float: right;
    overflow-x: hidden;
    /* outline: none; */
}

.setting:focus-within {
    outline: none;
}

/* 自定义滚动条样式 */
.setting::-webkit-scrollbar {
    width: 7px;
}
.setting::-webkit-scrollbar-track {
    background-color: rgba(240, 244, 247, 1);
    border-radius: 2px;
}
/* .setting::-webkit-scrollbar-track-piece {
          width: 7px;
          background-color: red;
        } */
.setting::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: rgba(209, 221, 230, 1);
}

.component-setting .setting-type {
    width: 250px;
    height: 40px;
    background: rgba(232, 237, 242, 0.91);
    display: flex;
}

.component-setting .setting-type span {
    font-size: 14px;
    font-family: siyuan-bd;
    font-weight: bold !important;
    color: rgba(81, 107, 134, 1);
    align-self: center;
}

.component-setting hr.setting-line {
    width: 3px;
    height: 12px;
    border-width: 0;
    background-color: rgba(81, 107, 134, 1);
    margin-left: 20px;
    margin-right: 10px;
    float: left;
    align-self: center;
}

.component-setting .setting-options {
    margin:10px 12px 14px 20px;
    width: 210px;
}
/* .setting-option > label {
  font-size: 12px;
  font-family: siyuan-rg;
  color: rgba(81, 107, 134, 1);
  line-height: 26px;
  display: inline;
} */

.component-setting .setting-slider > label {
    /* 清除滑块label的浮动 */
    float: none;
}
</style>
