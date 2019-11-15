<template>
    <div
        class="switch-outer"
        :class="{'on':on,'off':!on}"
        @click="handleChange"
    >
        <span
            class="text"
            v-show="on"
        >
            {{ onText }}
        </span>
        <span
            class="text"
            v-show="!on"
        >
            {{ offText }}
        </span>
        <span class="active-ball" />
    </div>
</template>
<script>
export default {
    props: {
        onText: {
            type: String,
            default: '开启'
        },
        offText: {
            type: String,
            default: '关闭'
        },
        value: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        handleChange() {
            this.on = !this.on;
            this.$emit('change', this.on);
        }
    },
    computed: {
        on: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.switch-outer {
    position: absolute;
    cursor: pointer;
    color: #ffffff;
    .active-ball {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: currentColor;
        position: absolute;
        top: 1px;
        transition: all 0.5s ease;
    }
    transition: all 0.5s ease;
}

.on {
    background: #00a4ee;
    .active-ball {
        left: 53px;
        transition: all 0.5s ease;
    }
    .text {
        margin-left: 14px;
        font-size: 14px;
        transition: all 0.5s ease;
    }
}

.off {
    background: #c0ccda;
    .active-ball {
        left: 2px;
    }
    .text {
        margin-left: 44px;
        font-size: 14px;
        transition: all 0.5s ease;
    }
}
</style>
