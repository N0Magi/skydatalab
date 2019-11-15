<template>
    <div class="about-container">
        <div class="main-content-wrap">
            <div class="main-content">
                <div class="detail">
                    about SDX
                </div>
            </div>
            <div class="footer">
                Copyright © 2018 南京天数智芯科技有限公司.版权所有 备案号：苏ICP备16013291号
            </div>
        </div>
    </div>
</template>
<script>
import { version } from '../../../package';

export default {
    name: 'About',
    data() {
        return {
            version
        };
    }
};
</script>
<style lang="scss" scoped>
.about-container {
    padding: 20px;
    .main-content-wrap {
        background: #fff;
        border: 1px solid #e6eaf2;
        .main-content {
            padding-top: 20px;
            // width: 600px;
            margin:40px;
            // margin: 64px auto;
            // border: 1px solid rgba(227, 230, 240, 1);
            font-size: 14px;
            font-family: siyuan-rg;
            color: rgba(117, 119, 122, 1);
            line-height: 22px;

            .detail {
                padding: 0px 35px 35px 35px;
                section {
                    h2 {
                        font-weight: 600 !important;
                    }
                }
                hr{
                    border:none;
                    border-top:1px solid rgba(227, 230, 240, 1);
                }
            }
        }
        .footer {
            font-size: 12px;
            font-family: siyuan-rg;
            color: rgba(75, 77, 82, 1);
            line-height: 16px;
            text-align: center;
            padding-bottom: 20px;
        }
    }
}
</style>

