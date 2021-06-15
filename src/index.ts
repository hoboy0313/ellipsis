import {isSupportCss, getStyle, setStyle} from './helper/style';

import {measure, MeasureOptions} from './measure';

interface EllipsisOptions extends Omit<MeasureOptions, 'target'> {
    target: string | HTMLElement;
}

const defaultOptions: Partial<MeasureOptions> = {
    rows: 2,
    ellipsisSymbol: '...',
};

function ellipsis (ops: EllipsisOptions) {
    const options = {...defaultOptions, ...ops};

    if(!options.target) {
        console.error(`[ellipsis] the options.target cannot '${options.target}'.`);
        return;
    }

    if (typeof options.target === 'string') {
        const ele = document.querySelector(options.target);
        if(!ele) {
            console.error('[ellipsis] the options.target must be an Element');
            return;
        }

        options.target = ele as HTMLElement;
    }

    if(!options.content) {
        options.content = options.target.innerHTML;
    }

    const {target, rows, ellipsisSymbol, suffix} = options;

    if(isSupportCss(rows) && ellipsisSymbol === '...' && !suffix) {
        setStyle(target, getStyle(rows));
        return;
    }

    const {isEllipsis, text} = measure(options as MeasureOptions);

    if (
        isEllipsis ||
        (!isEllipsis && !target.innerHTML)
    ) {
        target.innerHTML = text;
    }
}

export {
    measure,
    ellipsis,
};

