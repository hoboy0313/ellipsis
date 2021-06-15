import {createContainer, appendChildren, cloneChildNodes, removeChildren, NODE_TYPE} from './helper/dom';
import {devStyle, fakerContainerStyle, getMaxHeight, mergeStyle} from './helper/style';

import {forEach} from './utils';

export interface MeasureOptions {
    container: HTMLElement;

    target: HTMLElement;

    rows: number;

    ellipsisSymbol: string;
    /**
     * patch style to help deal with non-control scene.
     * @example `display: none;`
     */
    patchStyle?: Partial<CSSStyleDeclaration>;

    content: string;

    suffix?: string;
}

interface Result {
    text: string;
    isEllipsis: boolean;
}

const {TEXT_NODE, ELEMENT_NODE} = NODE_TYPE;

const initContainer = (options: MeasureOptions) => {
    const {content, ellipsisSymbol, suffix} = options;
    const container = createContainer();

    // content container.
    const contentContainer = createContainer('span', container);
    contentContainer.innerHTML = content;

    // suffix container.
    const suffixContainer = createContainer('span', container);

    if (suffix) {
        suffixContainer.innerHTML = suffix;
    }

    if(ellipsisSymbol) {
        const firstNode = suffixContainer.childNodes[0];
        const ellipsisNode = document.createTextNode(ellipsisSymbol);
        if (firstNode) {
            suffixContainer.insertBefore(ellipsisNode, firstNode);
        } else {
            suffixContainer.appendChild(ellipsisNode);
        }
    }

    return container;
};

const defaultOptions = {
    ellipsisSymbol: '...',
};

const initStyle = (target: HTMLElement, container: HTMLElement, patchStyle: Partial<CSSStyleDeclaration>) => {
    const styleList = [
        window.getComputedStyle(target),
        fakerContainerStyle,
        patchStyle,
    ];

    if(__DEV__) {
        styleList.push(devStyle);
    }

    const style = mergeStyle(styleList);

    forEach(style, (v, k) => {
        container.style.setProperty(k as string, v as string);
    });

    return style;
};

const measure = (options: MeasureOptions) => {
    const {target, rows, patchStyle = {}} = options;

    const container = initContainer(options);

    const style = initStyle(target, container, patchStyle);

    const maxHeight = getMaxHeight(style, rows);

    const inRange = () => container.offsetHeight < maxHeight;

    const exit = (result: Result) => {
        document.body.removeChild(container);
        return result;
    };

    console.log(maxHeight, container.offsetHeight);
    // 1. if it's in range, it's not need to be computed.
    if(inRange()) {
        return exit({
            isEllipsis: false,
            text: container.innerHTML,
        });
    }

    const contentNodes = cloneChildNodes(container.childNodes[0]);
    const suffixNodes = cloneChildNodes(container.childNodes[1]);
    const ellipsisNode = suffixNodes[0];
    const insertBefore = (node: Node) => container.insertBefore(node, ellipsisNode);
    // clear container
    removeChildren(container);

    // 2. append all suffix nodes
    appendChildren(container, suffixNodes);

    const appendChild = (node: Node) => container.insertBefore(node, ellipsisNode);

    const measureText = (
        textNode: Text,
        fullText: string,
        startLoc = 0,
        endLoc = fullText.length,
        lastSuccessLoc = 0,
    // eslint-disable-next-line max-params
    ): {finished: boolean} => {
        const midLoc = Math.floor((startLoc + endLoc) / 2);
        textNode.textContent = fullText.slice(0, midLoc);
        if (startLoc >= endLoc - 1) {
            const currentStepText = fullText.slice(0, endLoc);
            textNode.textContent = currentStepText;
            if (inRange() || !currentStepText) {
                return endLoc === fullText.length
                    ? {
                        finished: false,
                    }
                    : {
                        finished: true,
                    };
            }
        }
        if (inRange()) {
            return measureText(textNode, fullText, midLoc, endLoc, midLoc);
        }
        return measureText(textNode, fullText, startLoc, midLoc, lastSuccessLoc);
    };

    const measureNode = (node: Node, index: number) => {
        const {nodeType} = node;

        if (nodeType === ELEMENT_NODE) {
            appendChild(node);
            if (inRange()) {
                return {finished: false};
            }
            container.removeChild(node);
            return {finished: true};
        }

        if(nodeType === TEXT_NODE) {
            const fullText = node.textContent || '';
            const textNode = document.createTextNode(fullText);
            insertBefore(textNode);
            return measureText(textNode, fullText);
        }

        return {
            finished: false,
        };
    };

    console.log(contentNodes);
    contentNodes.some((node, index) => {
        const {finished} = measureNode(node, index);
        return finished;
    });

    return exit({
        isEllipsis: true,
        text: container.innerHTML,
    });
};

export {
    measure,
};
