import {createContainer, cloneNodeTypes, TEXT_NODE, ELEMENT_NODE} from './helper/dom';
import {devStyle, fakerContainerStyle, setStyle, checkStyle, mergeStyle, getMaxHeight} from './helper/style';

import {forEach} from './utils';

export interface MeasureOptions {
    container: HTMLElement;

    target: HTMLElement;

    rows?: number;

    ellipsisSymbol?: string;
    /**
     * patch style to help deal with non-control scene.
     * @example `display: none;`
     */
    patchStyle?: Partial<CSSStyleDeclaration>;

    contentNodeStr: string;

    suffixNodeStr: string;
}

export class MeasureContainer{
    target: HTMLElement;
    // The container will be used to computed those contents that need be ellipsis.
    container: HTMLElement;

    styles: Partial<CSSStyleDeclaration>[] = [fakerContainerStyle];

    rows;

    ellipsisSymbol;

    maxHeight = 0;

    constructor(options: MeasureOptions) {
        const {
            target,
            rows = 1,
            ellipsisSymbol = '...',
            patchStyle = {},
            contentNodeStr = '',
            suffixNodeStr = '',
        } = options;

        this.target = target;
        this.rows = rows;
        this.ellipsisSymbol = ellipsisSymbol;

        this.container = createContainer();
        // content container.
        createContainer('span', this.container)
            .innerHTML = contentNodeStr;
        // ellipsis container.
        createContainer('span', this.container)
            .appendChild(document.createTextNode(ellipsisSymbol));
        // suffix container.
        createContainer('span', this.container)
            .innerHTML = suffixNodeStr;

        this.styles.push(patchStyle);

        const style = this.initStyle();
        // init maxHeight
        this.maxHeight = getMaxHeight(style, this.rows);
    }

    initStyle() {
        const computedStyle = window.getComputedStyle(this.target);
        // 1.computedStyle 2. patch 3. devStyle
        const style = mergeStyle(computedStyle, this.styles, __DEV__ ? devStyle : {});
        if(!checkStyle(style, 'width')) {
            // To revision the width's property.
            style.width = this.target.getBoundingClientRect().width;
        }

        if(!checkStyle(style, 'lineHeight')) {
            console.warn(`The element's style property of 'lineHeight' is ${style.lineHeight}, it's could beyond expect to occur.
Please explicit to setProperty of 'lineHeight'.`, this.target);
        }

        setStyle(this.container, style);
        return style;
    }

    private inRange() {
        return this.container.offsetHeight < this.maxHeight;
    }

    // eslint-disable-next-line max-params
    private measureText(
        textNode: Text,
        fullText: string,
        startLoc = 0,
        endLoc = fullText.length,
        lastSuccessLoc = 0,
    ): string {
        const midLoc = Math.floor((startLoc + endLoc) / 2);
        textNode.textContent = fullText.slice(0, midLoc);
        if (startLoc >= endLoc - 1) {
            const currentStepText = fullText.slice(0, endLoc);
            textNode.textContent = currentStepText;
            if (this.inRange() || !currentStepText) {
                return endLoc === fullText.length
                    ? fullText
                    : currentStepText;
            }
        }
        if (this.inRange()) {
            return this.measureText(textNode, fullText, midLoc, endLoc, midLoc);
        }
        return this.measureText(textNode, fullText, startLoc, midLoc, lastSuccessLoc);
    }

    private measureNode(node: Node, index: number) {
        const {nodeType} = node;

        if(nodeType === TEXT_NODE) {
            const fullText = node.textContent || '';
            const textNode = document.createTextNode(fullText);
            return this.measureText(textNode, fullText);
        }
    }

    private cloneNode(parentNode: Node) {
        const childNodes: Node[] = [];
        forEach(parentNode.childNodes, (childNode) => {
            if(cloneNodeTypes.includes(childNode.nodeType)) {
                childNodes.push(childNode);
            }
        });
        return childNodes;
    }


    public measure() {
        const contentNodes = this.cloneNode(this.container.childNodes[0]);
        contentNodes.some((node, index) => {
            const content= this.measureNode(node, index);
            return !!content;
        });
    }

    public render() {
        this.measure();
    }
}
