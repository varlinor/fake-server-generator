module.exports = {
    root:true,
    env: {
        browser: false,
        node: true,
        commonjs: true,
        es6: true
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 6,
        ecmaFeatures: {
            jsx: false
        }
    },
    rules: {
        indent: [2, 4,{ SwitchCase: 1 }], // 强制使用一致的缩进
        eqeqeq: [2, 'always'], // 要求使用 === 和 !==
        semi: [2, 'always'], // 要求或禁止使用分号代替 ASI
        quotes: [2, 'single'],  // 强制使用一致的反勾号、双引号或单引号
        'no-case-declarations': 0,
        'no-unused-vars':['warn']
    },
    extends: 'eslint:recommended'
};
