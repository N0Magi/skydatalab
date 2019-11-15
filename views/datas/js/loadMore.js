export default {
    update(el, binding) {
        const selectWrap = el.querySelector('.el-checkbox-group');
        if (selectWrap === null) { return; }
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
            }
            if (localStorage.getItem('scrollTop') === 'true') {
                e.target.scrollTop = 0;
                localStorage.setItem('scrollTop', false);
            }
        }, 10);

        selectWrap.addEventListener('scroll', el.$$scrollcb);
    },
    unbind(el) {
        const selectWrap = el.querySelector('.el-checkbox-group');
        el.$$lastScrollLeft = 0;
        if (selectWrap === null) { return; }
        selectWrap.removeEventListener('scroll', el.$$scrollcb);
    }
};
