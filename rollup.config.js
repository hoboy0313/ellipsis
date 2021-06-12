import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';

export default [
    {
        input: 'src/index.ts',

        output: {
            file: 'lib/index.js',
            format: 'cjs',
        },

        plugins: [
            typescript(),
        ],
    },
    {
        input: 'src/index.ts',

        output: {
            file: 'lib/index.umd.js',
            name: 'ellipsis',
            format: 'umd',
        },

        plugins: [
            typescript(),
            replace({
                preventAssignment: true,
                '__DEV__': process.env.NODE_ENV === 'development',
            }),
        ],
    },
];
