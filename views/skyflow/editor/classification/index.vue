<template>
    <div class="component">
        <ul
            id="component-nav"
        >
            <li
                v-for="(item, i) in componentNav"
                :key="i"
                @click="changeNav(item.name)"
                :class="{active: item.name === currentLabel}"
            >
                <i
                    class="sf-icon"
                    :class="item.icon"
                    :title="item.label"
                />
            </li>
        </ul>
        <div class="component-display">
            <!-- 搜索 添加搜索框 -->
            <div
                class="component-search"
                v-if="currentLabel === &quot;search&quot;"
            >
                <input
                    id="componentSearch"
                    type="text"
                    v-model="componentSearch"
                    @keydown="enterSearch($event)"
                    placeholder="请输入组件关键字"
                >
                <i
                    class="sf-icon sf-chazhao"
                    @click="search"
                />
            </div>
            <!-- 自定义组件 添加按钮 -->
            <div v-if="currentLabel === &quot;custom&quot;">
                <div
                    class="add-custom"
                    @click="createCustom"
                    v-auth.skyflow.button="'FLOW_CUSTOMIZED_COMPONENT:CREATE'"
                >
                    <i class="sf-icon sf-jiahao" />
                </div>
                <CustomizeComp
                    v-if="dialogVisible && !editComp._id"
                    :dialog-visible.sync="dialogVisible"
                    :meta="editComp"
                    @submitSuccess="fetchDataList('custom')"
                />
                <custom-options
                    v-if="dialogVisible && editComp._id"
                    :dialog-visible.sync="dialogVisible"
                    :meta="editComp"
                    @submitSuccess="fetchDataList('custom')"
                />
            </div>
            <div
                class="component-list"
                v-loading="loading"
            >
                <component-list
                    :component-list="dataList"
                    @edit-comp="onEditComp"
                    :type="currentLabel"
                    :root-type="currentLabel"
                    :is-editable="isEditable"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { componentNav } from '../js/skyflowConfig';
import { getDatasetList, getPlatformComponentList, getFavoriteComponentList, getPublicComponentList, getCustomComponentList, searchComponents } from '@sdx/utils/lib/api/skyflow';
import componentList from './componentList';
import customOptions from './customOptions';
import CustomizeComp from './CustomizeComp';

import auth from '@sdx/widget/lib/auth';

const componentApi = {
    dataset: getDatasetList,
    platform: getPlatformComponentList,
    favorite: getFavoriteComponentList,
    common: getPublicComponentList,
    custom: getCustomComponentList,
    search: searchComponents
};

export default {
    name: 'Classification',
    components: {
        componentList,
        customOptions,
        CustomizeComp
    },
    directives: [auth],
    props: {
        isEditable: {
            type: Boolean,
            default: true
        },
        processType: {
            type: String,
            default: 'PATCH' // STREAM
        }
    },
    data() {
        return {
            componentNav,
            currentLabel: 'dataset',
            dataList: [],
            componentSearch: '',
            loading: false,
            dialogVisible: false,
            editComp: {}
        };
    },
    methods: {
        fetchDataList(name, search) {
            this.dataList = [];
            this.loading = true;
            const getList = search ? componentApi[name](this.processType, search) : componentApi[name](this.processType);
            getList.then(data => {
                // 请求异步数据时，切换tab，如果获取的数据不是对应当前的tab，则抛弃
                if (name === this.currentLabel) {
                    this.dataList = this.filterComponentData(data);
                    this.loading = false;
                }
            }).catch(e => {
                console.error(e);
                if (name === this.currentLabel) {
                    this.dataList = [];
                    this.loading = false;
                }
            });
        },
        filterComponentData(data) { //  筛选过滤没有组件的类别
            if (!Array.isArray(data)) return [];
            const list = [];
            data.forEach(item => {
                if (!item.is_folder || item.is_folder && this.testHasChildComp(item.children)) {
                    list.push(item);
                }
            });
            return list;
        },
        testHasChildComp(data) { // 递归判断是否有子组件
            if (!Array.isArray(data)) return false;
            let hasChildComp = false;
            for (let i = 0, len = data.length; i < len; i++) {
                const item = data[i];
                if (item.is_folder) {
                    if (Array.isArray(item.children) && item.children.length && this.testHasChildComp(item.children)) {
                        hasChildComp = true;
                        break;
                    }
                } else {
                    hasChildComp = true;
                    break;
                }
            }
            return hasChildComp;
        },
        changeNav(name) {
            this.currentLabel = name;
            // 获取对应type的数据
            if (name !== 'search') {
                this.componentSearch = '';
                this.fetchDataList(name);
            } else {
                this.dataList = [];
            }
        },
        search() {
            this.fetchDataList('search', this.componentSearch.trim());
        },
        enterSearch(e) {
            if (e.keyCode === 13) {
                this.search();
            }
        },
        createCustom() {
            this.editComp = {};
            this.dialogVisible = true;
        },
        onEditComp(item) {
            this.editComp = item;
            this.dialogVisible = true;
        },
        // 收藏组建成功后，刷新左侧组件库
        fetchFavorite() {
            this.fetchDataList('favorite');
        }
    },
    watch: {
        processType: {
            immediate: true,
            handler(nval) {
                if (nval) {
                    this.fetchDataList(this.currentLabel);
                }
            }
        }
    }
};
</script>

<style lang='scss' scoped>
.clearfix::after {
    content: ".";
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
.component {
    * {
        margin: 0;
        padding: 0;
        // 文字不可选中
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    input {
        &::placeholder {
            color: rgba(120, 140, 161, 1);
        }
    }
    // relative 为了让阴影效果不被遮挡
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba(253, 253, 253, 1);
    float: left;
    #component-nav {
        margin-bottom: 15px;
        display: flex;

        & > li {
            flex: auto;
            height: 40px;
            color: #3f5973;
            background: rgba(232, 237, 242, 0.91);
            list-style: none;
            line-height: 40px;
            text-align: center;
            cursor: pointer;
            & > i {
                font-size: 18px;
            }
        }
        li.active {
            color: #459cdf;
            background: rgba(248, 251, 253, 1);
        }
    }
    .component-display {
        height: calc(100% - 55px);
        .component-search {
            position: relative;
            width: 220px;
            height: 32px;
            line-height: 32px;
            margin: 15px 15px 15px;
            box-sizing: border-box;
            border: 1px solid rgba(206, 214, 222, 1);
            font-size: 14px;
            & > input {
                width: 100%;
                height: 30px;
                border-width: 0;
                padding: 0 30px 0 10px;
                float: left;
            }
            & > i {
                position: absolute;
                right: 8px;
                color: rgba(206, 214, 222, 1);
                &:hover {
                    color: rgba(69, 156, 223, 1);
                }
                cursor: pointer;
            }
        }
        .add-custom {
            width: 210px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            border: 1px dashed rgba(206, 214, 222, 1);
            color: rgba(206, 214, 222, 1);
            margin: 15px 20px;
            cursor: pointer;
            & > i {
                font-size: 36px;
            }
            &:hover {
                border-color: rgba(69, 156, 223, 1);
                color: rgba(69, 156, 223, 1);
            }
        }
        .component-list {
            height: 100%;
            overflow-x: hidden;
            /* 自定义滚动条样式 */
            &::-webkit-scrollbar {
                width: 7px;
            }
            &::-webkit-scrollbar-track {
                background-color: rgba(240, 244, 247, 1);
                border-radius: 2px;
            }
            &::-webkit-scrollbar-thumb {
                border-radius: 2px;
                background-color: rgba(209, 221, 230, 1);
            }
        }
    }
}
</style>
