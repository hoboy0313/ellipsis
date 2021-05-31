import {cloneNodeTypes, createContainer, TEXT_NODE, ELEMENT_NODE} from './helper/dom';
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
}

export interface IMeasureContainer extends MeasureOptions {
    maxHeight: number;

    ellipsisSymbolEle?: HTMLElement;
}

export class MeasureContainer implements IMeasureContainer{
    container: HTMLElement;

    target: HTMLElement;

    styles: Partial<CSSStyleDeclaration>[] = [fakerContainerStyle];

    maxHeight = 0;

    rows;

    ellipsisSymbol;

    ellipsisSymbolEle;

    constructor(options: MeasureOptions) {
        const {
            target,
            rows = 1,
            ellipsisSymbol = '...',
            patchStyle = {},
        } = options;

        this.target = target;
        this.rows = rows;
        this.ellipsisSymbol = ellipsisSymbol;
        this.container = createContainer();
        this.ellipsisSymbolEle = createContainer('span', this.container, {});
        this.ellipsisSymbolEle.appendChild(document.createTextNode(ellipsisSymbol));
        // debugger;
        this.styles.push(patchStyle);
    }

    init() {
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
            console.log('a', style.lineHeight);
            console.warn(`The element's style property of 'lineHeight' is ${style.lineHeight}, it's could beyond expect to occur.
Please explicit to setProperty of 'lineHeight'.`, this.target);
        }

        setStyle(this.container, style);
        return style;
    }

    private cloneNode() {
        const {target} = this;
        const cloneNodes: Node[] = [];
        forEach(target.childNodes, (node) => {
            if (cloneNodeTypes.includes(node.nodeType)) {
                cloneNodes.push(node.cloneNode(true));
            }
        });
        return cloneNodes;
    }

    private inRange() {
        return this.container.offsetHeight < this.maxHeight;
    }

    private appendChildNode(nodes: Node | Node[]) {
        nodes = Array.isArray(nodes) ? nodes : [nodes];
        forEach(nodes, (node) => {
            this.container.insertBefore(node, this.ellipsisSymbolEle);
        });
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
            this.appendChildNode(textNode);
            return this.measureText(textNode, fullText);
        }
    }

    private measure(nodes: Node[]) {
        this.appendChildNode(nodes);
        if(this.inRange()) {
            return nodes;
        }

        nodes.some((node, index) => {
            const content= this.measureNode(node, index);
            return !!content;
        });
    }

    public render() {
        this.init();
        const nodes = this.cloneNode();
        this.measure(nodes);
    }
}
