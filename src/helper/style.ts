import {forEach, pxToNumber} from '../utils';

/**
 * @function To check whether it's supported from current browser.
 * @param {string | string[]} styleName current styleName.
 * @return {boolean}
 */
export const isStyleSupport = (styleName: string | string[]): boolean => {
    if (typeof window !== 'undefined' && window.document && window.document.documentElement) {
        const styleNameList = Array.isArray(styleName) ? styleName : [styleName];
        const {documentElement} = window.document;
        return styleNameList.some(name => name in documentElement.style);
    }
    return false;
};

export const isLineClampSupport = isStyleSupport('webkitLineClamp');

export const isTextOverflowSupport = isStyleSupport('textOverflow');

export const canUseCss = (rows: number) => {
    return rows === 1 ? isTextOverflowSupport : isLineClampSupport;
};

/**
 * @description
 * The reason I don't have to declare it using `CSSStyleDeclaration` is because
 * it reduces performance as a base function by reducing unnecessary conversions.
 *
 * @example
 * `textOverflow` => `text-overflow`
 * `webkitLineClamp` => `-webkit-line-clamp`
 */
const textOverStyle = {
    overflow: 'hidden',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
    'word-break': 'break-all',
};

const lineClampStyle = (rows: number) => ({
    display: '-webkit-box',
    '-webkit-line-clamp': rows,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    'word-break': 'break-all',
});

// To be used at the fake container.
export const fakerContainerStyle = {
    position: 'fixed',
    left: '0',
    top: '10000',
    'z-index': '-1',
    visibility: 'hidden',
    height: 'auto',
    'min-height': 'auto',
    'max-height': 'auto',
    'text-overflow': 'clip',
    'white-space': 'normal',
    'webkit-line-clamp': 'none',
};

export const devStyle = {
    top: '200px',
    'z-index': '10',
    visibility: 'visible',
};

export const styleObjectToStr = (styles: Record<string, string | number>) => {
    let str = '';

    for (const styleName in styles) {
        if(styles.hasOwnProperty(styleName)) {
            str += `${styleName}: ${styles[styleName]};`;
        }
    }

    return str;
};

/**
 * @function get the css style about ellipsis.
 * @param {number} rows
 */
export const getCssStyle = (rows: number) => {
    const styleObject = rows === 1 ? textOverStyle : lineClampStyle(rows);
    return styleObjectToStr(styleObject);
};

export const setStyle = (el: HTMLElement, style: Partial<CSSStyleDeclaration>) => {
    forEach(style, (value, key) => {
        el.style.setProperty(key as string, value);
    });
};

/**
 * @function setAttribute
 * @todo It need to be optimized.
 */
export const setStyleAttributes = (el: HTMLElement, rows: number) => {
    const styleObject = rows === 1 ? textOverStyle : lineClampStyle(rows);
    const styleString = styleObjectToStr(styleObject);
    const selfStyle = el.getAttribute('style');
    el.setAttribute('style', selfStyle + ';'+ styleString);
};

/**
 * @function check `line-height` & `width` whether can be used to computed.
 * @description
 * only `width = px, rem, em`, it's can be computed.
 */
export const checkStyle = (style: CSSStyleDeclaration, styleName: 'width' | 'lineHeight') => {
    return parseInt(style[styleName], 10);
};

/**
 * @function merge style.
 * @param {Partial<CSSStyleDeclaration>[]} styles
 */
export const mergeStyle = (...styles: Array<Partial<CSSStyleDeclaration> | Partial<CSSStyleDeclaration>[]>) => {
    return Object.assign({}, ...(styles.flat(1)));
};

/**
 * @function computed ellipsis Max height.
 * @param {CSSStyleDeclaration} style
 * @param {number} rows
 * @return {number}
 */
export const getMaxHeight = (style: CSSStyleDeclaration, rows: number) => {
    const lineHeight = pxToNumber(style.lineHeight);
    return Math.round(
        lineHeight * (rows + 1)
        + pxToNumber(style.paddingTop)
        + pxToNumber(style.paddingBottom),
    );
};
