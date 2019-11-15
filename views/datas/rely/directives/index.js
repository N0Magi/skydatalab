import {
    addClass,
    removeClass
} from '@/utils/dom';
const effectAllowedList = [
    'null',
    'copy',
    'link',
    'move',
    'copyLink',
    'copyMove',
    'linkMove',
    'all'
];
const dropEffectList = ['null', 'copy', 'link', 'move'];
const defaultOptions = {
    effectAllowed: 'all',
    dropEffect: false,
    draggableClassPrefix: 'sjs-draggable',
    droppableClassPreFix: 'sjs-droppable',
    handler: () => false,
    data: {},
    acceptToken: 'sjs-draggable-item', // 带到drop的data中,可以用来检查元素来源
    draggable: true, // 扩展
    dropable: true
};

const draggable = {
    inserted(el, binding) {
        let option = Object.assign({}, defaultOptions, binding.value);
        el.draggable = option.draggable;
        addClass(el, option.draggableClassPrefix);

        el.addEventListener(
            'dragstart',
            ev => {
                ev.stopPropagation();
                // carry data

                option.data._offsetX = ev.offsetX || ev.layerX;
                option.data._offsetY = ev.offsetY || ev.layerY;
                option.data.acceptToken = option.acceptToken;
                option.data.acceptToken = ev.dataTransfer.setData(
                    'text/plain',
                    JSON.stringify(option.data)
                );
                // set effect
                if (effectAllowedList.indexOf(option.effectAllowed) !== -1) {
                    ev.dataTransfer.effectAllowed = option.effectAllowed;
                }
                // add class
                addClass(el, option.draggableClassPrefix + '-dragstart');
            },
            false
        );
        el.addEventListener(
            'drag',
            ev => {
                ev.preventDefault();
                ev.stopPropagation();
            },
            false
        );
        el.addEventListener(
            'dragend',
            ev => {
                ev.preventDefault();
                ev.stopPropagation();
                removeClass(el, option.draggableClassPrefix + '-dragstart');
                removeClass(el, option.draggableClassPrefix + '-dragover');
                removeClass(el, option.droppableClassPreFix + '-dragenter');
            },
            false
        );
    }
};
const droppable = {
    inserted(el, binding) {
        let option = Object.assign({}, defaultOptions, binding.value);
        if (option.dropable) {
            addClass(el, option.droppableClassPreFix);
            el.addEventListener(
                'drop',
                ev => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    if (
                        option.dropEffect &&
                        dropEffectList.indexOf(option.dropEffect) !== -1
                    ) {
                        ev.dataTransfer.dropEffect = option.dropEffect;
                    }
                    let data = null;
                    try {
                        // take data
                        data = JSON.parse(ev.dataTransfer.getData('text/plain'));
                    } catch (e) {
                        console.log(e);
                    }
                    // do classes
                    removeClass(el, option.droppableClassPreFix + '-dragover');
                    removeClass(el, option.droppableClassPreFix + '-dragenter');
                    // set effect
                    if (option.handler && option.handler.call) {
                        option.handler(el, data, ev);
                    }
                },
                false
            );
            // 在 dragover 或者 dragend 事件中调用 preventDefault
            el.addEventListener(
                'dragover',
                ev => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    addClass(el, option.droppableClassPreFix + '-dragover');
                    removeClass(el, option.droppableClassPreFix + '-dragenter');
                },
                false
            );
            el.addEventListener(
                'dragenter',
                ev => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    removeClass(el, option.droppableClassPreFix + '-dragover');
                    addClass(el, option.droppableClassPreFix + '-dragenter');
                },
                false
            );
            el.addEventListener(
                'dragleave',
                ev => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    removeClass(el, option.droppableClassPreFix + '-dragover');
                    removeClass(el, option.droppableClassPreFix + '-dragenter');
                },
                false
            );
        }
    }
};

const focus = {
    update(el) {
        el.focus();
    }
};

export default {
    install(Vue) {
        Vue.directive('draggable', draggable);
        Vue.directive('droppable', droppable);
        Vue.directive('focus', focus);
    },
    draggable,
    droppable,
    focus
};
