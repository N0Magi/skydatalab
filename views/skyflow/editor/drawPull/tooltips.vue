<template>
    <div
        class="svg-tooltips"
        :style="position"
    >
        <div
            v-for="(item, i) in filterTipMessage"
            :key="i"
            class="tip-item"
        >
            <span v-html="&quot;▪️ &quot; + item.message" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ToolTips',
    props: {
        tipPosition: {
            type: Object,
            required: true
        },
        tipMessage: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        position() {
            return {
                top: this.tipPosition.y - 17 + 'px',
                left: this.tipPosition.x + 10 + 'px'
            };
        },
        filterTipMessage() {
            return this.tipMessage.filter(tip => !tip.result);
        }
    }
};
</script>

<style lang='scss' scoped>
.svg-tooltips {
  position: absolute;
  color: rgba(232, 239, 239, 1);
  background-color: rgba(63, 89, 115, 0.8);
  padding: 15px;
  font-size: 12px;
  border-radius: 5px;
  z-index: 12;
  .tip-item {
    margin-top: 10px;
  }
  .tip-item:first-child {
    margin-top: 0;
  }
  &:after {
    content: "";
    position: absolute;
    // bottom: 50%;
    top: 0;
    left: 0;
    margin-left: -6px;
    margin-top: 10px;
    width: 0;
    height: 0;
    border-right: 6px solid rgba(63, 89, 115, 0.8);
    border-bottom: 6px solid transparent;
    border-top: 6px solid transparent;
  }
}
</style>
