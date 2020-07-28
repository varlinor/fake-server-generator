// rollup.config.js
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/main.js',
    output: {
        file: 'bin/fs-gen',
        format: 'cjs',
        banner: '#!/usr/bin/env node'
    },
    plugins: [
        json(),
        commonjs(),
        nodeResolve()
    ],
    external:[
        'fs','path','events','child_process','util','os','process',
        'commander','shelljs',
        'colors'
    ],

};