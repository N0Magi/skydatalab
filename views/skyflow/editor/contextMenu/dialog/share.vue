<template>
    <sdxu-dialog
        title="共享设置"
        :visible.sync="dialogVisible"
        @close="dialogClose"
        :confirm-handler="confirmEdit"
    >
        <el-form
            label-width="110px"
            label-position="left"
            :model="shareForm"
            ref="shareSettingForm"
        >
            <el-form-item
                label="共享至全局："
                v-auth.button="'APPLICATION:GLOBAL_SKYFLOW_BUTTON:ACCESS:'"
            >
                <el-radio
                    v-model="shareForm.shareType"
                    label="PUBLIC"
                >
                    是
                </el-radio>
                <el-radio
                    v-model="shareForm.shareType"
                    label="PRIVATE"
                >
                    否
                </el-radio>
            </el-form-item>
            <el-form-item
                label="用户/用户组："
                v-show="shareForm.shareType !== 'PUBLIC'"
            >
                <sdxw-select-group-user
                    :users.sync="shareForm.selectedUsers"
                    :groups.sync="shareForm.selectedGroups"
                />
            </el-form-item>
        </el-form>
    </sdxu-dialog>
</template>

<script>
import Dialog from '@sdx/ui/lib/dialog';
import SelectGroupUser from '@sdx/widget/lib/select-group-user';
import ElForm from 'element-ui/lib/form';
import ElFormItem from 'element-ui/lib/form-item';
import ElRadio from 'element-ui/lib/radio';
import auth from '@sdx/widget/lib/auth';
export default {
    name: 'Share',
    data() {
        return {
            dialogVisible: this.visible,
            shareForm: {
                selectedUsers: [...this.defaultUsers],
                selectedGroups: [...this.defaultGroups],
                shareType: this.defaultShareType || 'PRIVATE'
            },
            authMap: {
                image: 'APPLICATION:GLOBAL_IMAGE_BUTTON:ACCESS',
                skyflow: 'APPLICATION:GLOBAL_SKYFLOW_BUTTON:ACCESS',
                model: 'APPLICATION:GLOBAL_MODEL_BUTTON:ACCESS',
                dataset: 'APPLICATION:GLOBAL_DATASET_BUTTON:ACCESS',
                file: 'APPLICATION:GLOBAL_FILE_BUTTON:ACCESS'
            }
        };
    },
    directives: {
        auth
    },
    watch: {
        visible(nVal) {
            this.dialogVisible = nVal;
        }
    },
    components: {
        [SelectGroupUser.name]: SelectGroupUser,
        [Dialog.name]: Dialog,
        ElForm,
        ElFormItem,
        ElRadio
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        defaultUsers: {
            type: Array,
            default: () => []
        },
        defaultGroups: {
            type: Array,
            default: () => []
        },
        defaultShareType: {
            type: String,
            default: 'PRIVATE'
        },
        sourceKind: {
            type: String,
            default: ''
        }
    },
    methods: {
        dialogClose() {
            this.shareForm = {
                selectedUsers: [],
                selectedGroups: [],
                shareType: 'PRIVATE'
            };
            this.$emit('update:visible', false);
        },
        confirmEdit() {
            this.$emit('confirm', {
                event: 'share',
                data: {
                    users: this.shareForm.selectedUsers,
                    groups: this.shareForm.selectedGroups,
                    shareType: this.shareForm.shareType
                }
            });
            this.$emit('update:visible', false);
        }
    }
};
</script>
