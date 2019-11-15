<template>
    <div class="raintransit">
        <div @click="gowind()">
            <el-row>
                <el-col :span="12">
                    <img
                        src="../../assets/images/dashboard/wind.png"
                    >
                </el-col>
                <el-col :span="12">
                    <div>
                        {{ $t('dashboard.wind_power_template') }}
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RainTransit',
    data() {
        return {

        };
    },
    computed: {},
    methods: {
        gowind() {
            this.$router.push('/sdxv-skyflow/skyflow-list?templateType=wind');
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.raintransit {
    background-image: url('../../assets/images/dashboard/windBG.png');
    background-size: auto;
    background-position: center;
    background-repeat: no-repeat;
    height: 155px;
    .el-row {
        cursor: pointer;
        .el-col:first-child {
            text-align: center;
            img {
                width: 196px;
                padding-top: 20px;
            }
        }
        .el-col:last-child {
            height: 155px;
            padding: 52px 0;
            text-align: center;
            color: rgba(255,255,255,1);
            & div:first-child {
                font-weight: bold;
                line-height: 30px;
                font-size: 20px;
            }
        }
    }
}
</style>
