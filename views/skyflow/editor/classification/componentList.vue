<template>
    <ul
        v-if="componentList.length"
        :class="['level' + level, 'clearfix']"
    >
        <template v-for="(item, i) in componentList">
            <li
                v-if="item.is_folder && item.children && item.children.length > 0"
                :key="i"
                :id="item.name"
                class="groups"
            >
                <div
                    class="group-types"
                    @click="toggleList(item.name)"
                >
                    <span>{{ item.label }}</span>
                    <i
                        class="sf-icon"
                        :class="displayStatus[item.name] ? iconsMap.arrowDown : iconsMap.arrowRight"
                    />
                </div>
                <div
                    class="group-children"
                    v-show="displayStatus[item.name]"
                >
                    <component-list
                        :component-list="item.children"
                        :level="level+1"
                        :type="item.name"
                        :is-editable="isEditable"
                        @edit-comp="editComp"
                        :root-type="rootType"
                        :display="displayStatus"
                    />
                </div>
            </li>
            <li
                v-else-if="!item.is_folder"
                :key="i"
                class="component-cards"
                @contextmenu="handleEditorContextMenu(item,$event)"
                @mouseover="hoverComponentName = (item.name + i)"
                @mouseleave="hoverComponentName = ''"
            >
                <div
                    class="component-card"
                    :class="{'drag-prohibition': !isEditable}"
                    v-draggable="getComponentInfo(item)"
                    :draggable="isEditable"
                >
                    <i
                        class="sf-icon component-card-icon"
                        :class="getIconByName(item.name)"
                    />
                    <span>{{ item.label }}</span>
                    <i
                        v-show="item.isShare"
                        class="sf-icon sf-fenxiang3 is-share-icon"
                    />
                    <el-tooltip
                        placement="bottom"
                        :popper-class="item.description && item.description.length > 55 ? 'component-tips tips-width-custom' : 'component-tips'"
                    >
                        <div
                            slot="content"
                            class="component-tips-content"
                        >
                            <table>
                                <tr>
                                    <td>组件名称:</td>
                                    <td>{{ item.label }}</td>
                                </tr>
                                <tr v-if="item.description">
                                    <td>组件说明:</td>
                                    <td>{{ item.description }}</td>
                                </tr>
                                <tr v-if="item.creator">
                                    <td>创建人:</td>
                                    <td>{{ item.creator }}</td>
                                </tr>
                                <tr v-if="item.createTime">
                                    <td>创建时间:</td>
                                    <td>{{ item.createTime }}</td>
                                </tr>
                            </table>
                        </div>
                        <i
                            v-show="(item.name + i) === hoverComponentName"
                            class="sf-icon sf-information component-tips-icon"
                        />
                    </el-tooltip>
                </div>
                <hr
                    class="component-vertical-line"
                    :id="i"
                    v-if="(i+1)%3"
                >
                <hr
                    class="componet-horizontal-line"
                    v-if="!(i%3)"
                >
            </li>
        </template>
        <share
            :visible.sync="contextDialogVisible"
            v-if="contextDialogVisible"
            :defaultUsers="users"
            :defaultGroups="groups"
            :defaultShareType="shareType"
            @confirm="handleComponentShare"
        />
    </ul>
    <div
        v-else-if="type === 'search'"
        class="no-result not-find"
    >
        <div />
        <span>Oops ! 无搜索结果哦 !</span>
    </div>
    <div
        v-else
        class="no-result no-custom"
    >
        <div />
        <span>还没有{{ getClassifyLabel(type) }}哦 ! </span>
    </div>
</template>

<script>
import { iconsMap, componentsIcon, componentNav } from '../js/skyflowConfig';
import contextMenuManage from '../util/contextMenuManage';
import * as contextDialog from '../contextMenu/dialog/';
import {
    shareComponent,
    removeCustomComp,
    removeFavorite
} from '@sdx/utils/lib/api/skyflow';
export default {
    name: 'ComponentList',
    props: {
        componentList: {
            type: Array,
            default: () => []
        },
        type: { // 上级类型
            type: String,
            default: 'dataset'
        },
        rootType: { // 根类型
            type: String,
            default: 'favorite'
        },
        level: {
            type: Number,
            default: 1
        },
        isEditable: {
            type: Boolean,
            default: true
        },
        display: {
            type: Object,
            default: null
        }
    },
    components: {
        ...contextDialog
    },
    data() {
        return {
            iconsMap,
            displayStatus: (() => {
                if (this.display) {
                    return Object.assign(this.display, this.displayStatus || {});
                }
                return {};
            })(),
            contextDialogVisible: false,
            users: [],
            groups: [],
            shareType: '',
            currentNode: null,
            menuList: [
                {
                    label: '编辑',
                    name: 'edit',
                    icon: 'sf-ico_edite',
                    group: 2,
                    disabled: false,
                    cb: this.editComp.bind(this)
                },
                {
                    label: '删除',
                    name: 'del',
                    icon: 'sf-delete1',
                    group: 2,
                    disabled: false,
                    cb: this.delComp.bind(this)
                },
                {
                    label: '分享设置',
                    name: 'share',
                    icon: 'sf-fenxiang1',
                    group: 1,
                    disabled: false,
                    cb: this.showShareDialog.bind(this)
                },
                {
                    label: '移除收藏',
                    name: 'cancelstar',
                    group: 2,
                    icon: 'sf-yichushoucang1',
                    disabled: false,
                    cb: this.cancelStar.bind(this)
                }
            ],
            hoverComponentName: ''
        };
    },
    computed: {
        // tab在自定义组件或收藏
        showContextMenu() {
            return ['custom', 'favorite'].indexOf(this.rootType) !== -1;
        }
    },
    methods: {
        toggleList(name) {
            this.$set(this.displayStatus, name, !this.displayStatus[name]);
        },
        getIconByName(name) {
            let component = componentsIcon.find(el => el.name === name);
            return component && component.icon
                ? component.icon
                : iconsMap.defaultCompIcon;
        },
        getComponentInfo(item) {
            return {
                data: item,
                draggable: this.isEditable
            };
        },
        getClassifyLabel(name) {
            return componentNav.find(el => el.name === name).label;
        },
        handleEditorContextMenu(item, event) {
            event.preventDefault();
            event.stopPropagation();
            if (!this.showContextMenu) {
                return;
            }
            // console.log('isShare', item.isShare);
            let menuList = this.filterMenuList(item);
            contextMenuManage.create(menuList, event.pageX, event.pageY, item);
        },
        filterMenuList(item) {
            let menuList = _.cloneDeep(this.menuList);
            if (this.rootType === 'favorite') {
                menuList.forEach(menuitem => {
                    menuitem.name !== 'cancelstar'
                        ? (menuitem.disabled = true)
                        : '';
                });
            }
            if (this.rootType === 'custom') {
                menuList.forEach(menuitem => {
                    menuitem.name === 'cancelstar'
                        ? (menuitem.disabled = true)
                        : '';
                });
                if (!this.$auth('SKYFLOW-MANAGER:FLOW_CUSTOMIZED_COMPONENT:STAR:', 'BUTTON')) {
                    menuList.forEach(menuitem => {
                        menuitem.name === 'cancelstar'
                            ? (menuitem.disabled = true)
                            : '';
                        menuitem.name === 'star'
                            ? (menuitem.disabled = true)
                            : '';
                    });
                }
                if (!this.$auth('SKYFLOW-MANAGER:FLOW_CUSTOMIZED_COMPONENT:SHARE:', 'BUTTON')) {
                    menuList.forEach(menuitem => {
                        menuitem.name === 'share'
                            ? (menuitem.disabled = true)
                            : '';
                    });
                }
            }
            if (item.isShare) {
                menuList.forEach(menuitem => {
                    menuitem.name === 'edit' || menuitem.name === 'del'
                        ? (menuitem.disabled = true)
                        : '';
                });
            }
            return menuList;
        },
        // 展示分享弹窗
        showShareDialog(item) {
            this.currentNode = item;
            this.contextDialogVisible = true;
            this.users = item.users || [];
            this.groups = item.groups || [];
            this.shareType = item.shareType || '';
        },
        // 自定义组件分享
        handleComponentShare(params) {
            const node = _.cloneDeep(this.currentNode);
            shareComponent({
                ...params.data,
                component_id: node._id
            }).then(data => {
                if (data) {
                    this.$notify({
                        title: '成功',
                        message: '分享设置成功',
                        type: 'success'
                    });
                    let currentComponent = this.componentList.find(
                        item => item._id === node._id
                    );
                    if (currentComponent) {
                        currentComponent.users = data.users || [];
                        currentComponent.groups = data.groups || [];
                        currentComponent.shareType = data.share_type || '';
                        currentComponent.isShare = !!data.is_share;
                    }
                    console.error(currentComponent);
                }
            });
        },
        // 自定义组件编辑
        editComp(item) {
            this.$emit('edit-comp', item);
        },
        // 自定义组件删除
        delComp(item) {
            this.$confirm('确认删除该组件么？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    removeCustomComp(item._id)
                        .then(() => {
                            this.$notify.success({
                                title: '删除组件成功',
                                duration: 3000
                            });
                            let index = this.componentList.findIndex(i => i._id === item._id);
                            this.componentList.splice(index, 1);
                        });
                })
                .catch(() => ({}));
        },
        // 自定义组件移除收藏
        cancelStar(item) {
            console.log('移除收藏', item);
            this.$confirm('确认移除收藏的组件么？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    removeFavorite(item._id)
                        .then(() => {
                            this.$notify.success({
                                title: '移除组件收藏成功',
                                duration: 3000
                            });
                            let index = this.componentList.findIndex(i => i._id === item._id);
                            this.componentList.splice(index, 1);
                        });
                })
                .catch(() => ({}));
        },
        recursionSetDisplayStatus(list) { // 递归修改各个子类型的display
            if (!Array.isArray(list)) return;
            list.forEach(el => {
                if (el.is_folder) {
                    this.$set(this.displayStatus, el.name, this.rootType === 'search');
                    if (Array.isArray(el.children)) {
                        this.recursionSetDisplayStatus(el.children);
                    }
                }
            });
        }
    },
    watch: {
        componentList() {
            // note: 递归组件引用，watch不能监听到引用组件的对象变化
            this.recursionSetDisplayStatus(this.componentList);
            // const statusMap = {};
            // this.componentList.forEach(item => {
            //     if (item.is_folder) {
            //         statusMap[item.name] = false;
            //     }
            //     // statusMap[item.name] = this.rootType === 'search';
            // });
            // this.displayStatus = statusMap;
        }
    }
};
</script>

<style lang='scss'>
/* tips 修改element tooltips默认样式*/
.el-tooltip__popper[x-placement^='bottom'] {
    .popper__arrow {
        border-bottom-color: rgb(63, 89, 115);
        opacity: 0.8;
        &:after {
            border-bottom-color: rgb(63, 89, 115);
            opacity: 0.8;
        }
    }
}

.el-tooltip__popper[x-placement^='top'] {
    .popper__arrow {
        border-top-color: rgb(63, 89, 115);
        opacity: 0.8;
        &:after {
            border-top-color: rgb(63, 89, 115);
            opacity: 0.8;
        }
    }
}

.el-tooltip__popper.component-tips {
    width: 17em;
    background-color: rgba(63, 89, 115, 0.8);
    .component-tips-content {
        padding: 0 5px;
        color: rgba(232, 239, 239, 1);
        table {
            /* 合并表格边框为单线模式 */
            border-collapse: collapse;
            width: 100%;
            tr {
                border: solid rgba(232, 239, 239, 1);
                border-width: 1px 0;
                /* 设置表格文字对齐方式 */
                vertical-align: top;
                margin: 5px 0;
                &:first-child {
                    border-top-width: 0;
                }
                &:last-child {
                    border-bottom-width: 0;
                }
                & > td {
                    padding: 5px 0;
                    line-height: 1.4;
                    &:first-child {
                        width: 5em;
                    }
                }
            }
        }
    }
}
.el-tooltip__popper.tips-width-custom {
    width: 24em;
}
</style>

<style lang='scss' scoped>
.clearfix::after {
    content: ".";
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
.level1 {
    * {
        margin: 0;
        padding: 0;
        // 文字不可选中
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    li {
        list-style: none;
    }
    & > .groups {
        margin: 10px 0px;
        &:first-child {
            margin-top: 0;
        }
        & > .group-types {
            width: 250px;
            padding: 0 20px;
            background-color: rgba(232, 237, 242, 0.91);
        }
        .group-types {
            height: 40px;
            box-sizing: border-box;
            cursor: pointer;
            & > span {
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                font-family: siyuan-rg;
                font-weight: bold !important;
                color: rgba(63, 89, 115, 1);
                float: left;
                /* 名称超过12个字显示... */
                width: 12em;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
            & > i {
                height: 40px;
                line-height: 40px;
                font-weight: bold !important;
                font-size: 14px;
                color: rgba(50, 87, 121, 1);
                float: right;
            }
        }
        & > .group-children {
            width: 250px;
            .level2 {
                & > .groups {
                    margin: 0;
                    & > .group-children {
                        padding: 0;
                    }
                    & > .group-types {
                        padding: 0 22px 0 20px;
                        border-bottom: 1px solid rgba(206, 214, 222, 1);
                        & > span {
                            font-weight: normal !important;
                        }
                        & > i {
                            font-size: 12px;
                            opacity: 0.6035;
                        }
                    }
                    &:nth-child(even) {
                        background-color: rgba(232, 237, 242, 0.3);
                    }
                }
            }
        }
    }
    .component-cards {
        position: relative;
        // margin: 1px 0;
        width: 83px;
        height: 90px;
        float: left;
        &:hover {
            background: #f6f7f8;
        }
        .component-card {
            padding: 18px 10px 0;
            text-align: center;
            float: left;
            width: 82px;
            cursor: move;
            & > i {
                font-size: 30px;
                color: rgba(63, 89, 115, 0.7);
            }
            & > span {
                // display: block;
                // width: 4em;
                font-size: 12px;
                font-family: siyuan-rg;
                line-height: 1.2;
                color: rgba(63, 89, 115, 1);
                margin-top: 5px;
                /* 名称超过两行显示... */
                overflow: hidden;
                word-break: break-all; // 允许在单词中换行
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            & > .corner-mark {
                font-size: 12px;
                color: #e38138;
                position: absolute;
                top: 0px;
                right: 0px;
            }
            .component-tips-icon {
                font-size: 12px;
                color: #76899b;
                position: absolute;
                top: 6px;
                right: 6px;
                cursor: default;
            }
            .is-share-icon {
                position: absolute;
                top: 38px;
                left: 52px;
                font-size: 12px;
                color: #499edf;
            }
        }
        .drag-prohibition {
            cursor: not-allowed;
        }
        hr {
            border-width: 0px;
            background-color: rgba(206, 214, 222, 1);
        }
        .component-vertical-line {
            position: absolute;
            z-index: 2;
            left: 83px;
            height: 90px;
            width: 1px;
            overflow: hidden;
        }
        .componet-horizontal-line {
            position: absolute;
            z-index: 2;
            top: 90px;
            height: 1px;
            width: 251px;
            overflow: hidden;
        }
    }
    i {
        &:hover {
            color: rgba(69, 156, 223, 1);
        }
    }
}

.no-result {
    text-align: center;
    & > span {
        font-size: 12px;
        font-family: siyuan-rg;
        color: rgba(104, 124, 145, 1);
        line-height: 16px;
    }
    & > div {
        width: 84px;
        height: 84px;
        margin: 25px calc(50% - 84px / 2) 10px;
    }
}
.not-find {
    & > div {
        margin-top: 40px;
        background: url('../../../../assets/images/not_find.png') no-repeat
            center / 100%;
    }
}
.no-custom {
    & > div {
        background: url('../../../../assets/images/no_custom_component.png')
            no-repeat center / 100%;
    }
}
</style>
