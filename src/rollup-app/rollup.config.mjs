import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'index.tsx',
  output: {
    file: 'dist/index.min.js',
    format: 'iife',
    name: 'RollupApp',
    sourcemap: true,
  },
  onwarn(warning, defaultHandler) {
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
      return;
    }

    defaultHandler(warning);
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    }),
    resolve({
      browser: true,
      extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
    }),
    commonjs(),
    typescript({
      compilerOptions: {
        ignoreDeprecations: '6.0',
        moduleResolution: 'bundler',
      },
      jsx: 'react-jsx',
      module: 'esnext',
      target: 'es2020',
      tsconfig: false,
    }),
    terser(),
  ],
};
