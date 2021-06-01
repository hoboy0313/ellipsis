import {createContainer, DEAL_NODE_TYPE} from './helper/dom';
import {devStyle, fakerContainerStyle, setStyle, checkStyle, mergeStyle, getMaxHeight} from './helper/style';

import {forEach} from './utils';

const {TEXT_NODE, ELEMENT_NODE} = DEAL_NODE_TYPE;

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

interface MeasureStatus {
    finished: boolean,
}

export class MeasureContainer{
    target: HTMLElement;
    // The container will be used to computed those contents that need be ellipsis.
    container: HTMLElement;

    ellipsisContainer: HTMLSpanElement;

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
        createContainer('span', this.container).innerHTML = contentNodeStr;
        // ellipsis container.
        this.ellipsisContainer = createContainer('span', this.container);
        this.ellipsisContainer.appendChild(document.createTextNode(ellipsisSymbol));
        // suffix container.
        createContainer('span', this.container).innerHTML = suffixNodeStr;

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

    private appendChild(node: Node) {
        this.container.insertBefore(node, this.ellipsisContainer);
    }

    private removeChild(node: Node) {
        this.container.removeChild(node);
    }

    private clearContainer() {
        this.container.removeChild(this.container.childNodes[0]);
    }

    private cloneNode(parentNode: Node) {
        const childNodes: Node[] = [];
        forEach(parentNode.childNodes, (childNode) => {
            // the nodeType is included `DEAL_NODE_TYPE`
            if(DEAL_NODE_TYPE[childNode.nodeType]) {
                childNodes.push(childNode);
            }
        });
        return childNodes;
    }

    private inRange() {
        return this.container.offsetHeight < this.maxHeight;
    }

    /**
     * Dealing the result about every node.
     * @param {MeasureStatus} status
     * @param {DEAL_NODE_TYPE} type
     * @param {T extends MeasureStatus}
     */
    public formatEveryNodeResult(status: MeasureStatus, nodeType?: DEAL_NODE_TYPE): MeasureStatus;
    public formatEveryNodeResult(status: MeasureStatus) {
        return status;
    }

    // eslint-disable-next-line max-params
    private measureText(
        textNode: Text,
        fullText: string,
        startLoc = 0,
        endLoc = fullText.length,
        lastSuccessLoc = 0,
    ): MeasureStatus {
        // middle location index.
        const midLoc = Math.floor((startLoc + endLoc) / 2);
        // Cuting off the first half insert into textNode.
        textNode.textContent = fullText.slice(0, midLoc);
        // It's dichotomy ending position.
        if (startLoc >= endLoc - 1) {
            const currentStepText = fullText.slice(0, endLoc);
            textNode.textContent = currentStepText;
            if (this.inRange() || !currentStepText) {
                return endLoc === fullText.length
                    ? this.formatEveryNodeResult({ finished: false }, DEAL_NODE_TYPE.TEXT_NODE)
                    : this.formatEveryNodeResult({ finished: true }, DEAL_NODE_TYPE.TEXT_NODE);
            }
        }
        if (this.inRange()) {
            return this.measureText(textNode, fullText, midLoc, endLoc, midLoc);
        }
        return this.measureText(textNode, fullText, startLoc, midLoc, lastSuccessLoc);
    }

    private measureNode(node: HTMLElement, index: number) {
        const {nodeType} = node;

        if (nodeType === ELEMENT_NODE) {
            // We don't split element, it will keep if whole element can be displayed.
            this.appendChild(node);
            if (this.inRange()) {
                return this.formatEveryNodeResult({ finished: false }, ELEMENT_NODE);
            }

            // Clean up if can not pull in.
            this.removeChild(node);

            return this.formatEveryNodeResult({ finished: true }, ELEMENT_NODE);
        }

        if(nodeType === TEXT_NODE) {
            const fullText = node.textContent || '';
            const textNode = document.createTextNode(fullText);
            this.appendChild(textNode);
            return this.measureText(textNode, fullText);
        }

        // the other types will be ignored.
        return this.formatEveryNodeResult({ finished: false });
    }

    public measure() {
        const ellipsisNodes: Array<string> = [];
        if(this.inRange()) {
            const a = this.container.childNodes[0];
        }
        // It's all nodes that need to be omited.
        const contentNodes = this.cloneNode(this.container.childNodes[0]) as HTMLElement[];

        this.clearContainer();

        contentNodes.some((contentNode, index) => {
            const {finished} = this.measureNode(contentNode, index);
            return finished;
        });

        return {
            isEllipsis: true,
            content: this.container.innerHTML,
        };
    }
}
