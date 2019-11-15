<template>
    <base-card
        class="skyflow-service"
        :task="task"
        @btnClick="handleOperation"
    />
</template>

<script>
import baseCardMixin from './baseCardMixin';
export default {
    name: 'SKYFLOWDATASERVICE',
    mixins: [baseCardMixin],
    methods: {
        handleOperation(btn) {
            this.$emit('taskOperation', btn, this.task);
        }
    }
};
</script>

<style lang="scss">
.task-card {
    &.skyflow-service {
        .color-bar {
            background: linear-gradient(to right, #246dd4, #7faef7);
        }
        .title-icon {
            background: url('../../../assets/images/ico_data_service.png')
                no-repeat center center;
            background-size: 80%;
        }
    }
}
</style>
