import {forEach} from '../utils';

// We only handle element & text node.
enum DEAL_NODE_TYPE {
    ELEMENT_NODE = 1,
    TEXT_NODE = 3,
}

/**
 * @function To check whether it's a DOM.
 */
const isDOM = (() => {
    const hasHtmlElement = typeof HTMLElement === 'object';

    if (hasHtmlElement) {
        return (dom: Element) => dom instanceof HTMLElement;
    }

    return (dom: Element) => dom && typeof dom === 'object' && dom.nodeType === DEAL_NODE_TYPE.ELEMENT_NODE;
})();

/**
 * @function create element.
 * @param {string} component tagName. Default `div`.
 * @param {HTMLElement} container append it. Default `document.body`.
 * @param {Record<string, string | number>} attrs tag's attributes.
 */
// eslint-disable-next-line max-params
function createContainer(
    component = 'div',
    container = document.body,
    attrs: Record<string, string | number> = {},
) {
    const el = document.createElement(component);
    el.setAttribute('aria-hidden', 'true');

    forEach(attrs, (value, key) => {
        el.setAttribute(key, value);
    });

    container.appendChild(el);
    return el;
}

export {
    DEAL_NODE_TYPE,

    isDOM,

    createContainer,
};