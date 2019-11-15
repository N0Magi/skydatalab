<template>
    <div class="raintransit">
        <div @click="gotraffic()">
            <el-row>
                <el-col :span="12">
                    <img
                        src="../../assets/images/dashboard/raintransit.png"
                    >
                </el-col>
                <el-col :span="12">
                    <div>
                        {{ $t('dashboard.rail_transit_template') }}
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
        gotraffic() {
            this.$router.push('/sdxv-skyflow/skyflow-list?templateType=traffic');
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.raintransit {
    background-image: url('../../assets/images/dashboard/raintransitBG.png');
    background-size: auto;
    background-position: center;
    background-repeat: no-repeat;
    height: 155px;
    .el-row {
        cursor: pointer;
        .el-col:first-child {
            text-align: center;
            img {
                width: 236px;
                padding-top: 16px;
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
