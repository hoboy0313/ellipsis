// export * from './MeasureContainer';

export * from './measure';

// import {isDOM} from './helper/dom';
//
// interface EllipsisOptions {
//     target: string | HTMLElement;
//
//     rows?: number;
//
//     /**
//      * provide a entry to adapter other scene.
//      * @default {boolean} true
//      */
//     useCss?: boolean;
//
//     /**
//      * The `ellipsis`
//      * @default `...`
//      */
//     ellipsisSymbol?: string;
//
//     /**
//      * @default undefined
//      */
//     suffix?: number | string;
// }
//
// interface EllipsisContent {
//     isEllipsis: boolean;
//     content: string;
// }
//
// const defaultOptions: Required<Pick<EllipsisOptions, 'rows' | 'useCss' | 'ellipsisSymbol'>> = {
//     rows: 1,
//     useCss: true,
//     ellipsisSymbol: '...',
// };
//
// export function createEllipsis(options: EllipsisOptions): EllipsisContent {
//     let target = options.target || null;
//
//     if (typeof target === 'string') {
//         target = document.querySelector<HTMLElement>(target);
//     }
//
//     if (!target || !isDOM(target)) {
//         throw new TypeError('The `options.el` cannot be find, please provide a exist DOM.');
//     }
//
//     const {useCss, rows, ellipsisSymbol} = {...defaultOptions, ...options};
//
//     return {
//         isEllipsis: true,
//         content: '1',
//     };
// }
