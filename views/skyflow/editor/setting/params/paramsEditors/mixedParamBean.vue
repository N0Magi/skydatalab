<template>
    <div class="mixed-param-bean">
        <span class="title">
            {{ param.label }}
        </span>
        <div
            class="param-group"
            v-for="(out,indexOf) in value"
            :key="indexOf"
        >
            <el-button
                class="button-subtract-env"
                @click="handleDeleteGroup(indexOf)"
                :disabled="!isEditable || !param.trainEditable"
                circle
            >
                <i class="sf-icon sf-jianhao" />
            </el-button>
            <component
                v-for="(item,index) in param.paramsConf"
                :current-schema="currentSchema"
                v-show="!item.showAttr || item.showVal.indexOf(out[item.showAttr]) !== -1"
                :required="item.required"
                :key="index"
                :index="indexOf"
                :param="item"
                :val-obj="out"
                v-model="out[item.name]"
                :is="item.uiType"
                @topBtn="topBtn"
                @bottomBtn="bottomBtn"
                :is-editable="isEditable"
            />
        </div>
        <el-button
            class="button-add-env"
            :disabled="!isEditable || !param.trainEditable"
            @click="handleAddGroup"
        >
            <i class="sf-icon sf-jiahao" />
        </el-button>
    </div>
</template>
<script>
import baseMixins from './editorBaseMixins';
import * as paramsEditors from './index';
import CommonInputParamBean from './CommonInputParamBean';
export default {
    mixins: [baseMixins],
    components: {
        ...paramsEditors,
        CommonInputParamBean
    },
    methods: {
        handleAddGroup() {
            this.value.push(this.genParamsObject(this.param.paramsConf));
        },
        /** 生成参数对象 */
        genParamsObject(paramsConf) {
            let ret = {};
            if (!!paramsConf && !!paramsConf.length) {
                paramsConf.forEach(item => {
                    ret[item.name] = item.defaultValue === undefined ? this.makeDefaultValByPtype(item.ptype) : item.defaultValue;
                });
            }
            return ret;
        },
        makeDefaultValByPtype(type) {
            const defaultMap = {
                string: '',
                integer: 0,
                double: 0,
                float: 0,
                number: 0,
                boolean: true,
                timestamp: 0
            };
            return type && defaultMap[type.toLowerCase()] || '';
        },
        handleDeleteGroup(index) {
            this.value.splice(index, 1);
        },
        // 上移下移
        move(code, dir) {
            // 上移，下移
            let moveComm = (curIndex, nextIndex) => {
                let arr = this.value;
                arr[curIndex] = arr.splice(nextIndex, 1, arr[curIndex])[0];
                return arr;
            };
            this.value.some((val, index) => {
                if (index === code) {
                    if (dir === 1 && index === 0) {
                        this.$message.warning('已在顶部！');
                    } else if (dir === 0 && index === this.value.length - 1) {
                        this.$message.warning('已在底部！');
                    } else {
                        let nextIndex = dir === 1 ? index - 1 : index + 1;
                        this.value = moveComm(index, nextIndex);
                    }
                    return true;
                }
                return false;
            });
        },
        // 排序
        topBtn(code) {
            this.move(code, 1);
        },
        bottomBtn(code) {
            this.move(code, 0);
        }
    }
};
</script>
<style lang="scss">
.mixed-param-bean {
    .title {
        color: rgb(122, 133, 153);
        font-size: 14px;
        font-weight: 700;
        line-height: 36px;
    }
    .param-group {
        width: 210px;
        border:1px solid #CED6DE;
        position: relative;
        padding: 10px 0 6px 0;
        margin-bottom: 10px;
        .el-form-item__label {
            text-align: left;
            width: 100%;
            padding-left: 9px;
        }
        input {
            width: 192px;
        }
        .el-input {
            padding-left: 8px;
        }
        textarea {
            width: 192px;
        }
        .el-textarea {
            padding-left: 8px;
        }
        .button-subtract-env {
            position: absolute;
            right: 8px;
            top: 8px;
            width: 20px;
            height: 20px;
            line-height: 14px;
            background: rgba(222,228,236,1);
            border-radius: 50%;
            color: #fff;
            text-align: center;
            z-index: 999;
            i {
                position: relative;
                right: 7px;
                bottom: 7px;
            }
        }
        .setting-option{
            .tip {
                padding-left: 5px;
            }
        }
    }
    .button-add-env {
        width: 210px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border: 1px dashed rgba(222, 228, 236, 1);
        color: rgba(206, 214, 222, 1);
        margin-top: 20px;
        padding: 0;
        .icon-jiahao {
            color: #D2DEEA;
            font-size: 36px;
            position: relative;
            bottom: 12px;
        }
    }

    .el-select .el-tag {
        margin: 2px 0 2px 14px;
    }
}
</style>
