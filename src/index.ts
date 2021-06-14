import {isSupportCss, getStyle, setStyle} from './helper/style';

import {measure, MeasureOptions} from './measure';

interface MeasureResult {
    isStyle: boolean;
    style?: string | Partial<CSSStyleDeclaration>;
}


const defaultOptions: Partial<MeasureOptions> = {
    rows: 2,
    ellipsisSymbol: '...',
};

function ellipsis (options: MeasureOptions): MeasureResult{
    const {target, rows, ellipsisSymbol} = {...defaultOptions, ...options};

    if(isSupportCss(rows) && ellipsisSymbol === '...') {
        console.log(2);
        setStyle(target, getStyle(rows));

        return {
            isStyle: true,
        };
    }

    console.log(1);

    return {
        isStyle: false,
    };
};

export {
    measure,
    ellipsis,
};

