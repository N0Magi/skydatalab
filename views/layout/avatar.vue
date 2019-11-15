<template>
    <div class="sdx-avatar">
        <SdxuButton
            type="default"
            :plain="true"
            icon="iconfont iconshouce"
            @click="handleJumpToUserManual"
        >
            {{ $t('UserManual') }}
        </SdxuButton>
        <div
            class="split-line"
        />
        <SdxuButton
            type="default"
            :plain="true"
            trigger="click"
            style="margin-right: 14px;min-width: 0;"
            dropdown-width="90px"
        >
            {{ langTextMap[currentLang] }}
            <template slot="dropdown">
                <SdxuButton
                    type="text"
                    :block="true"
                    @click="toggleLang('zh-CN')"
                >
                    {{ langTextMap['zh-CN'] }}
                </SdxuButton>
                <SdxuButton
                    type="text"
                    :block="true"
                    @click="toggleLang('en')"
                >
                    {{ langTextMap['en'] }}
                </SdxuButton>
            </template>
        </SdxuButton>
        <div class="user-name">
            {{ userMeta.fullName }}
        </div>
        <el-dropdown
            class="avatar-container"
            trigger="click"
            @command="onCommand"
        >
            <div class="avatar-wrapper">
                <div
                    class="avatar-box"
                >
                    <svg
                        class="user-icon"
                        aria-hidden="true"
                    >
                        <use xlink:href="#iconicon-UserInfo" />
                    </svg>
                    <i class="el-icon-caret-bottom" />
                </div>
            </div>
            <el-dropdown-menu
                class="user-dropdown"
                slot="dropdown"
            >
                <el-dropdown-item
                    divided
                    command="modifyPassword"
                >
                    {{ $t('changePassword') }}
                </el-dropdown-item>
                <el-dropdown-item
                    divided
                    command="versioninfo"
                >
                    {{ $t('versionInformation') }}
                </el-dropdown-item>
                <el-dropdown-item
                    divided
                    command="logout"
                >
                    <span>
                        {{ $t('logout') }}
                    </span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <SdxwUserInfoDialog
            :visible.sync="userInfoVisible"
            :user-info-data="userMeta"
            theme="dashboard"
            @confirmUser="confirmUser"
        />
        <SdxwChangePassword
            :visible.sync="modifyPwdVisible"
            :user-info-data="userMeta"
            v-if="modifyPwdVisible"
        />
        <sdxu-dialog
            :visible.sync="versionVisible"
            no-footer
            :title="$t('versionInformation')"
            size="small"
        >
            <div class="dashboard-version-content">
                <div>SkyDiscovery</div>
                <div> {{ $t('version') }} X</div>
                <div>{{ $t('corporateName') }}</div>
            </div>
        </sdxu-dialog>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { version } from '../../../package';
import permission from '../../config/permissions';
import UserinfoDialog from '@sdx/widget/lib/userinfo-dialog';
import ChangePassword from '@sdx/widget/lib/change-password';
export default {
    data() {
        return {
            dialogVisible: false,
            version,
            currentLang: localStorage.getItem('lang') || 'zh-CN',
            langTextMap: {
                'zh-CN': '中文',
                en: 'English'
            },
            userInfoVisible: false,
            modifyPwdVisible: false,
            versionVisible: false,
            permission,
            hasPlatformPermission: false,
            hasUserMenuPermission: false,
            hasPermMenuPermission: false,
            hasResrcMenuPermission: false,
            hasSysMenuPermission: false
        };
    },
    components: {
        [UserinfoDialog.name]: UserinfoDialog,
        [ChangePassword.name]: ChangePassword
    },
    computed: {
        ...mapState({
            userMeta: state => state.user && state.user.token && state.user.token.user || {}
        })
    },
    methods: {
        ...mapActions(['toggleGuide']),
        logout() {
            this.$store.dispatch('logout').then(() => {
                this.$store.commit('removeAll');
                this.$router.push({ path: '/login' });
            });
        },
        showUserInfo() {
            this.userInfoVisible = true;
        },
        modifyPassword() {
            this.modifyPwdVisible = true;
        },
        versioninfo() {
            this.versionVisible = true;
        },
        goManage(type) {
            // todo 跳转管理页面
            const typeRouterMap = {
                source: '/#/sdxv-resource-manage',
                user: '/#/sdxv-user-manage',
                rights: '/#/sdxv-authorize-manage',
                monitor: '/#/sdxv-resource-statistics'
            };
            window.open(typeRouterMap[type]);
        },
        onCommand(command) {
            const commandMap = {
                logout: this.logout,
                userInfo: this.showUserInfo,
                modifyPassword: this.modifyPassword,
                versioninfo: this.versioninfo
            };
            commandMap[command]();
        },
        // 组件传过来的值更新vuex里面的用户信息
        confirmUser(data) {
            this.$store.commit('SET_USER', data);
        },
        toggleLang(val) {
            // 因为配置文件中的一些资源无法刷新，这里直接刷新页面
            localStorage.setItem('lang', val);
            location.reload();
        },
        handleJumpToUserManual() {
            window.open('/help/');
        }
    },
    mounted() {
        this.hasPlatformPermission = this.$auth(permission.MANAGE_PLATFORM_ACCESS, 'MENU');
        this.hasUserMenuPermission = this.$auth(permission.USER_MENU_ACCESS, 'MENU');
        this.hasPermMenuPermission = this.$auth(permission.PERMISSION_MENU_ACCESS, 'MENU');
        this.hasResrcMenuPermission = this.$auth(permission.RESOURCE_MENU_ACCESS, 'MENU');
        this.hasSysMenuPermission = this.$auth(permission.SYSTEM_MENU_ACCESS, 'MENU');
    }
};
</script>
<style rel="stylesheet/scss" lang="scss">
@import "../../assets/styles/base/mixin";
@import "../../assets/styles/base/colors";
@import "../../assets/styles/base/constants";

.sdx-avatar {
    position: relative;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .split-line {
        display: inline-block;;
        width: 1px;
        height: 20px;
        background: #BBC4CF;;
        vertical-align: middle;
        margin-left: 14px;
        margin-right: 14px;
    }
    .user-name {
        font-size: 14px;
        margin-right: 20px;
    }
}

.avatar-container {
    .user-icon {
        width: 30px;
        height: 30px;
        fill: currentColor;
        overflow: hidden;
    }
    .avatar-wrapper {
        cursor: pointer;
        position: relative;
        .avatar-box {
            position: relative;
            display: flex;
            width: 45px;
            height: 30px;
            align-items: center;
            .user-avatar {
                width: 30px;
                height: 30px;
                border-radius: 30px;
                display: block;
            }

            .el-icon-caret-bottom {
                position: absolute;
                right: 0;
                top: 12px;
                font-size: 12px;
                color: #dedede;
            }
            .user-indicator-icon {
                position: absolute;
                right: 0px;
                bottom: 9px;
            }
        }
    }
}
.account-container {
    pointer-events: auto;
    background: $sdx-color-primary;
    padding-left: 20px;
    display: inline-block;
    border: none;
    &:hover, &:active {
        background-color: $sdx-color-primary !important;
        color: #fff !important;
    }
    .account-dropdown-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 60px;
        line-height: 1.5;
        .dropdown-avatar-box {
            width: 30px;
            height: 30px;
            position: relative;
            .user-indicator-icon {
                position: absolute;
                bottom: 0;
                right: 0;
            }
            .user-icon {
                width: 30px;
                height: 30px;
                fill: currentColor;
                overflow: hidden;
            }
        }

        .account-info {
            margin-left: 10px;

            .user-role {
                font-size: 12px;
                color: #fff;
                opacity: 0.8;
                font-family: siyuan-lt;
                margin-top: 3px;
            }
        }
    }
}
.user-dropdown {
    border: none !important;
    top: 60px !important;
    margin-top: 0 !important;
    border-radius: 0 !important;

    .popper__arrow {
        display: none !important;
    }

    &.el-dropdown-menu {
        margin: 0;
        padding: 0;
    }

    .el-dropdown-menu__item {
        line-height: 36px;
        min-width: 180px;
    }

    .el-dropdown-menu__item--divided {
        margin-top: 0;
    }

    .el-dropdown-menu__item--divided:before {
        height: 0;
    }
}

.dashboard-version-content {
    text-align: left;
    padding: 20px 0 20px 106px;
    div {
        padding-bottom: 20px;
    }
    div:first-child {
        font-family:SourceHanSansCN-Medium;
        font-weight:500;
        color:rgba(48,49,51,1);
    }
    div:nth-child(n+2) {
        font-family:SourceHanSansCN-Normal;
        font-weight:400;
        color:rgba(48,49,51,1);
    }
}

</style>
