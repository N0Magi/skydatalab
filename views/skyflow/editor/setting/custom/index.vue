<template>
    <div class="other-setting">
        <div
            class="setting-type"
            v-if="(inputParams || []).length"
        >
            <hr class="setting-line">
            <span>
                组件输入<span class="iconTitle">
                    (从左到右)
                </span>
                <i
                    :class="[collapse ? 'el-icon-arrow-up':'el-icon-arrow-down', 'arrow']"
                    @click="collapse=!collapse"
                />
            </span>
        </div>
        <div :class="[collapse ? 'inNone' : 'inBlock']">
            <div
                v-for="(item, i) in inputParams"
                :key="`in${i}`"
            >
                <div v-if="item.ptype">
                    <span>
                        类别
                    </span>
                    <span>
                        {{ item.ptype }}
                    </span>
                </div>
                <div v-if="(Array.isArray(item.stype) && item.stype.length) || (typeof(item.stype) === 'string' && item.stype)">
                    <span>
                        子类别
                    </span>
                    <span>
                        {{ Array.isArray(item.stype) ? item.stype.join(' , ') : item.stype }}
                    </span>
                </div>
                <div v-if="(Array.isArray(item.desc) && item.desc.length) || (typeof(item.desc) === 'string' && item.desc)">
                    <span>
                        描述
                    </span>
                    <span>
                        {{ Array.isArray(item.desc) ? item.desc.join(' , ') : item.desc }}
                    </span>
                </div>
            </div>
        </div>
        <div
            class="setting-type"
            v-if="(outputParams || []).length"
        >
            <hr class="setting-line">
            <span>
                组件输出<span class="iconTitle">
                    (从左到右)
                </span>
                <i
                    :class="[outCollapse ? 'el-icon-arrow-up':'el-icon-arrow-down', 'arrow']"
                    @click="outCollapse=!outCollapse"
                />
            </span>
        </div>
        <div :class="[outCollapse ? 'outNone' : 'outBlock']">
            <div
                v-for="(item, i) in outputParams"
                :key="`out${i}`"
            >
                <div v-if="item.ptype">
                    <span>
                        类别
                    </span>
                    <span>
                        {{ item.ptype }}
                    </span>
                </div>
                <div v-if="(Array.isArray(item.stype) && item.stype.length) || (typeof(item.stype) === 'string' && item.stype)">
                    <span>
                        子类别
                    </span>
                    <span>
                        {{ Array.isArray(item.stype) ? item.stype.join(' , ') : item.stype }}
                    </span>
                </div>
                <div v-if="(Array.isArray(item.desc) && item.desc.length) || (typeof(item.desc) === 'string' && item.desc)">
                    <span>
                        描述
                    </span>
                    <span>
                        {{ Array.isArray(item.desc) ? item.desc.join(' , ') : item.desc }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CustomSetting',
    props: {
        inputParams: {
            type: Array,
            default: () => []
        },
        outputParams: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            collapse: false,
            outCollapse: false
        };
    }
};
</script>

<style lang="scss" scoped>
    .other-setting {
        .setting-type {
            position: relative;
        }
        .iconTitle {
            font-size: 12px;
        }
        & > div:nth-child(n+2) > div {
            display: flex;
            flex-direction:column;
            margin: 12px 20px;
            div {
                display: flex;
            }
            span {
                font-size: 14px;
                font-weight: 400;
                color:rgba(63,89,115,1);
                line-height: 22px;
            }
            span:first-child {
                min-width: 48px;
            }
            span:nth-child(n+2){
                font-size: 12px;
                color: #6f8396;
                word-break: break-all;
            }
        }
        & > div > div:last-child{
            border-bottom: none;
        }
        .title {
            font-size: 14px;
            font-weight: 700;
            padding-left: 20px;
            color:rgba(63,89,115,1);
            line-height: 30px;
            display: block;
        }
        .arrow {
            position: absolute;
            right: 16px;
            top: 14px;
            cursor: pointer;
        }
        .inBlock {
            height: 100%;
            opacity: 1;
            transition: all ease-in 0.38s;
        }
        .inNone {
            height: 0;
            opacity: 0;
        }
        .outBlock {
            @extend .inBlock ;
        }
        .outNone {
            @extend .inNone ;
        }
    }
</style>
