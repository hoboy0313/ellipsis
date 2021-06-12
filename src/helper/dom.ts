import {forEach, isArray} from '../utils';

// We only handle element & text node.
export enum NODE_TYPE {
    ELEMENT_NODE = 1,
    TEXT_NODE = 3,
}

const {ELEMENT_NODE} = NODE_TYPE;

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
        el.setAttribute(key, value as string);
    });

    container.appendChild(el);
    return el;
}

/**
 * append node or nodes to container.
 * @param {HTMLElement} container
 * @param {Node | Node[]} children
 */
export function appendChildren(container: HTMLElement, children: Node | Node[]) {
    if(!isArray(children)) {
        container.appendChild(children);
        return;
    }

    children.forEach(child => container.appendChild(child));
}

/**
 * Clone all childNodes from the parentNode, and return the new cloneNodes as an array.
 * @param {Node} parentNode
 * @return {Node[]}
 */
export function cloneChildNodes(parentNode: Node): Node[] {
    return Array.prototype.slice.apply(parentNode.cloneNode(true).childNodes);
}

/**
 * Remove all childNodes from the container.
 * @param {HTMLElement} container
 */
export function removeChildren(container: HTMLElement) {
    container.innerHTML = '';
}
