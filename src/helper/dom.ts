import {forEach} from '../utils';

// We only handle element & text node.
export const ELEMENT_NODE = 1;
export const TEXT_NODE = 3;

export const cloneNodeTypes = [ELEMENT_NODE, TEXT_NODE];

/**
 * @function To check whether it's a DOM.
 */
export const isDOM = (() => {
    const hasHtmlElement = typeof HTMLElement === 'object';

    if (hasHtmlElement) {
        return (dom: Element) => dom instanceof HTMLElement;
    }

    return (dom: Element) => dom && typeof dom === 'object' && dom.nodeType === ELEMENT_NODE;
})();

/**
 * @function create element.
 * @param {string} component tagName. Default `div`.
 * @param {HTMLElement} container append it. Default `document.body`.
 * @param {Record<string, string | number>} attrs tag's attributes.
 */
// eslint-disable-next-line max-params
export function createContainer(
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
