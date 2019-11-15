export default {
    bind(el, binding) {
        const selectWrap = el.querySelector('.el-table__body-wrapper');
        let boxHeight = 0;
        el.$$lastScrollLeft = 0;
        el.$$lastScrollTop = 0;
        el.$$scrollcb = _.throttle(e => {
            if (!boxHeight) {
                boxHeight = e.target.clientHeight;
            }
            if (e.target.scrollTop !== el.$$lastScrollTop) {
                el.$$lastScrollTop = e.target.scrollTop;
                if (e.target.scrollHeight - boxHeight > 100 && e.target.scrollHeight - e.target.scrollTop - boxHeight <= 100) {
                    // 触发滚动时间
                    binding.value('vertical', e.target.scrollTop, true);
                } else {
                    binding.value('vertical', e.target.scrollTop);
                }
            } else if (e.target.scrollLeft !== el.$$lastScrollLeft) {
                el.$$lastScrollLeft = e.target.scrollLeft;
                binding.value('horizontal', e.target.scrollLeft);
            }
        }, 200);
        selectWrap.addEventListener('scroll', el.$$scrollcb);
    },
    unbind(el) {
        const selectWrap = el.querySelector('.el-table__body-wrapper');
        el.$$lastScrollLeft = 0;
        selectWrap.removeEventListener('scroll', el.$$scrollcb);
    }
};
