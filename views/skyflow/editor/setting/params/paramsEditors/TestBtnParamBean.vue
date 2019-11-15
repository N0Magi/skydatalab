<template>
    <el-form-item class="setting-option">
        <el-button
            size="small"
            type="primary"
            @click="testConnection(param.id)"
            :loading="isTesting"
        >
            &emsp;测试&emsp;
        </el-button>
        <span
            class="connection-tip success"
            v-if="connectStatus === 'success'"
        >
            <i class="el-icon-success" />连接成功
        </span>
        <span
            class="connection-tip fail"
            v-if="connectStatus === 'fail'"
        >
            <i class="el-icon-error" />连接失败
        </span>
    </el-form-item>
</template>
<script>
import baseMixins from './editorBaseMixins';
import { testDataSourceConnection } from '../../../../../datas/rely/dataSourceApi';
export default {
    mixins: [baseMixins],
    data() {
        return {
            isTesting: false,
            connectStatus: ''
        };
    },
    methods: {
        testConnection(id) {
            if (id) {
                return new Promise((resolve, reject) => {
                    this.isTesting = true;
                    testDataSourceConnection({
                        datasource: id
                    }).then(() => {
                        this.connectStatus = 'success';
                        this.isTesting = false;
                        resolve('success');
                    }).catch(() => {
                        this.connectStatus = 'fail';
                        this.isTesting = false;
                        reject('fail');
                    });
                });
            } else {
                return new Promise((resolve, reject) => {
                    if (this.onAccess && typeof this.onAccess === 'function') {
                        this.isTesting = true;
                        this.onAccess().then(() => {
                            this.connectStatus = 'success';
                            this.isTesting = false;
                            resolve('success');
                        }, notAccessError => {
                            if (notAccessError === 'VALIDATE_ERROR') {
                                this.isTesting = false;
                            } else {
                                this.connectStatus = 'fail';
                                this.isTesting = false;
                                reject('fail');
                            }
                        });
                    } else {
                        reject('fail');
                    }
                });
            }
        }
    }
};
</script>
<style lang='scss' scoped>
.connection-tip {
    margin-left: 10px;
    font-size: 12px;

    i {
        margin-right: 5px;
    }

    &.success {
        color: #13ce66;
    }

    &.fail {
        color: #ff4d51;
    }
}
</style>
