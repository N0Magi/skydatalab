<template>
    <div class="input-preview">
        <div class="item">
            <div class="item-title">
                输入数据基本信息
            </div>
            <div class="item-main">
                <el-table
                    :data="tableData"
                    style="width: 100%"
                    border
                    size="small"
                >
                    <el-table-column
                        prop="name"
                        label="名称"
                        width="180"
                    />
                    <el-table-column
                        prop="size"
                        label="数据大小"
                        width="180"
                    />
                    <el-table-column
                        prop="num"
                        label="分片数"
                    />
                </el-table>
            </div>
        </div>

        <div class="item">
            <div class="item-title">
                输入数据基本信息
            </div>
            <div class="item-main">
                <el-table
                    :data="tableData"
                    style="width: 100%"
                    border
                    size="small"
                >
                    <el-table-column
                        prop="name"
                        label="名称"
                        width="180"
                    />
                    <el-table-column
                        prop="size"
                        label="数据大小"
                        width="180"
                    />
                    <el-table-column
                        prop="num"
                        label="分片数"
                    />
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InputPreview',
    data() {
        return {
            tableData: [
                {
                    name: '处理前',
                    size: '100',
                    num: '1'
                },
                {
                    name: '处理前',
                    size: '100',
                    num: '1'
                }
            ]
        };
    }
};
</script>

<style lang="scss" scoped>
.input-preview {
    font-size: 14px;
    color: #3f5973;
    .item {
        margin: 20px;
        background: rgba(248, 249, 250, 1);
        .item-title {
            border-bottom: 1px solid rgba(209, 221, 230, 1);
            padding: 20px;
        }
        .item-main {
            padding: 20px;
        }
    }
}
</style>

<style lang="scss">
    .input-preview {
        .el-table th, .el-table tr {
        background: rgba(248, 249, 250, 1);
        }
    }

</style>

