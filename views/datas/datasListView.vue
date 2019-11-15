<template>
    <div
        class="data-list-view"
        v-loading="loading"
    >
        <div
            v-for="(v, k) in list"
            :key="k"
        >
            <div
                @click="viewData(v.fullpath,v.is_dir, v.path, v.mimeType, v.ownerId)"
                :class="[viewDisabled(v) ?'disabledClick':'', 'card']"
            >
                <div class="icon">
                    <svg
                        class="alSvgIcon"
                        aria-hidden="true"
                        v-if="v.mimeType && v.mimeType.indexOf('image/')"
                    >
                        <use :xlink:href="getExt(v.name,v.is_dir)" />
                    </svg>
                    <data-image
                        v-else
                        :image-url="getUrl(v.ownerId, v.path)"
                        :is-icon="true"
                        image-width="46px"
                    />
                </div>
                <div class="content">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="v.name"
                        placement="top"
                    >
                        <div class="name">
                            {{ v.name }}
                        </div>
                    </el-tooltip>
                    <div class="size">
                        文件大小 {{ v.size | bytesToSize }}
                    </div>
                </div>
            </div>
        </div>
        <div
            class="holder"
            v-for="item in 10"
            :key="`holder${item}`"
        >
            &nbsp;
        </div>
    </div>
</template>
<script>
import { hdfsLs } from './rely/dataApi';
import { getFilesList } from '@sdx/utils/lib/api/file';
import dataImage from './dataImage';
export default {
    name: 'DatasListView',
    data() {
        return {
            list: [],
            fullpath: '',
            loading: false
        };
    },
    components: { dataImage },
    props: {
        dataListPath: {
            type: String,
            default: ''
        },
        storeType: {
            type: String,
            default: ''
        },
        datasource: {
            type: String,
            default: ''
        },
        ownerId: {
            type: String,
            default: ''
        }

    },
    filters: {
        bytesToSize(bytes) {
            if (typeof bytes === 'undefined') return '';
            // 字节单位转换
            if (bytes === 0) return '0 B';

            let k = 1024;
            let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            let i = Math.floor(Math.log(bytes) / Math.log(k));

            return Math.floor(bytes / Math.pow(k, i)) + ' ' + sizes[i];
        }
    },

    methods: {
        // icon
        getExt(name, is_dir, type) {
            let [arr, ext] = [[], ''];
            if (name) {
                arr = name.split('.');
                ext = arr[arr.length - 1];
            }

            if (ext === 'csv') {
                ext = '#iconCSV';
            } else if (ext === 'txt') {
                ext = '#iconTXT';
            } else if (ext === 'orc') {
                ext = '#iconORC';
            } else if (ext === 'parquet') {
                ext = '#iconParquet';
            } else if (is_dir) {
                ext = '#iconwenjianjia';
            } else if (ext !== 'csv' && ext !== 'txt' && ext !== 'orc' && ext !== 'parquet' && !is_dir) {
                ext = '#iconwuyulan';
            }
            return ext;
        },
        // 文件列表
        getFlieList(path, ownerId) {
            getFilesList({ path, ownerId })
                .then(data => {
                    if (data.children) {
                        for (let i = 0; i < data.children.length; i++) {
                            data.children[i].is_dir = !data.children[i].isFile;
                            data.children[i].fullpath = data.children[i].path;
                            data.children[i].ext = data.children[i].fileExtension;
                        }
                    }
                    data.paths = data.children;
                    this.list = data.paths;
                }).finally(() => {
                    this.loading = false;
                });
        },
        // HDFS 列表
        getHdfsList(datasource, path, only_dir) {
            hdfsLs(datasource, path, only_dir)
                .then(data => {
                    this.list = data.paths;
                }).finally(() => {
                    this.loading = false;
                });
        },
        // hdfs 或者文件 列表
        getHdfsOrFile(path, ownerId) {
            this.loading = true;
            if (this.storeType === 'HDFS') {
                this.getHdfsList(this.datasource, path, false);
            } else if (this.storeType === 'FILESYSTEM') {
                this.getFlieList(path, ownerId);
            }
        },
        // 查看数据
        viewData(fullpath, is_dir, path, type, ownerId) {
            let [arr, ext] = [[], ''];
            arr = fullpath.split('.');
            ext = arr[arr.length - 1];
            //  文件夹
            if (is_dir) {
                this.getHdfsOrFile(fullpath, ownerId);

                this.$emit('expandNode', fullpath, path);
            } else if (ext === 'csv' || ext === 'txt' || ext === 'orc' || ext === 'parquet') {
                this.$emit('viewData', fullpath, path);
            } else if (type.indexOf('image/') === 0) {
                this.$emit('viewData', fullpath, path, 'image', ownerId);
            }
        },
        viewDisabled(v) {
            let res = true;
            if (v.name.includes('.csv') || v.name.includes('.txt') || v.name.includes('.orc') || v.name.includes('.parquet') || v.is_dir) {
                res = false;
            }
            return res;
        },
        getUrl(ownerId, path) {
            return `${location.origin}/file-manager/api/v1/files/download?ownerId=${ownerId}&path=${path}&filesystem=cephfs`;
        }
    },
    created() {
        this.getHdfsOrFile(this.dataListPath, this.ownerId);
    },
    watch: {
        dataListPath() {
            this.getHdfsOrFile(this.dataListPath, this.ownerId);
        }

    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

.data-list-view {
    padding: 0 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    font-size: 0;
    position: relative;

    .card {
        flex-grow: 0;
        box-sizing: border-box;
        display: block;
        height: 116px;
        width: 268px;
        border: 1px solid #e6eaf2;
        margin-top: 20px;
        padding-top: 6px;
        padding-bottom: 37px;
        position: relative;
        overflow: hidden;
        display: flex;
        cursor: pointer;
        .icon {
            width: 70px;
            text-align: center;
            line-height: 116px;
            font-size: 46px;
            .alSvgIcon {
                width: 1em;
                height: 1em;
                fill: currentColor;
                overflow: hidden;
            }
        }
        .content {
            font-size: 14px;
            height: 116px;
            line-height: 30px;
            padding: 23px 0;
            .name {
                color:rgba(64,69,73,1);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 188px;
            }
            .size {
                color:rgba(107,113,122,1);
            }
        }
    }
    .holder {
        flex-grow: 0;
        width: 268px;
        line-height: 0;
        display: inline-block;
    }
}

</style>
