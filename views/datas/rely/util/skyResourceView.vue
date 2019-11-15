<template>
    <div class="sky-res">
        <div class="res-title">
            {{ title }}
        </div>
        <radial-progress-bar
            class="res-cicle"
            inner-stroke-color="#D8D8D8"
            :diameter="100"
            :start-color="borderColor"
            :stop-color="borderColor"
            :completed-steps="usageRate"
            :total-steps="100"
        >
            <p :style="{color:borderColor}">
                {{ `${usageRate}%` }}
            </p>
        </radial-progress-bar>
        <div class="res-info">
            <div>
                已分配
                <span :style="{'color':borderColor}">
                    &nbsp;{{ assigned }}&nbsp;
                </span>{{ unit }}
            </div>
            <div>
                总&nbsp;&nbsp;&nbsp; 共
                <span :style="{'color':borderColor}">
                    &nbsp;{{ total }}&nbsp;
                </span>{{ unit }}
            </div>
        </div>
    </div>
</template>
<script>
import RadialProgressBar from 'vue-radial-progress';
export default {
    components: { RadialProgressBar },
    props: {
        title: {
            type: String,
            default: '图表'
        },
        total: {
            type: Number,
            default: 0
        },
        assigned: {
            type: Number,
            default: 0
        },
        unit: {
            type: String,
            default: '单位'
        },
        borderColor: {
            type: String,
            default: '#03A3EE'
        }
    },
    computed: {
        usageRate() {
            if (this.assigned) {
                return Math.floor(this.assigned / this.total * 100);
            } else {
                return 0;
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.sky-res {
    position: relative;
    & > div {
        display: inline-block;
    }
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0.2rem;

    .res-title {
        font-size: 22px;
        color: #666666;
        /*margin: 42px 0 44px 32px;*/
        /*width: 30%;*/
    }

    .res-cicle {
        /*position: absolute;*/
        /*left: 30%;*/
        /*top: 8px;*/
    }
    .res-info {
        /*position: absolute;*/
        /*left: 60%;*/
        /*width: 40%;*/
        // text-align: center;
        line-height: 27px;
        top: 30px;
        font-size: 14px;
        color: #666666;
    }
}
</style>
