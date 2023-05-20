// @ts-check
import 'webpack-dev-server';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

/**
 * @param {{ [k: string]: string | boolean }} env
 * @returns {import('webpack').Configuration}
 */
export default (env) => {
  const isDev = env.mode === 'dev';

  return {
    mode: isDev ? 'development' : 'production',
    entry: {
      index: './src/index',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/i,
          use: ['ts-loader'],
        },
      ],
    },
    devServer: {
      port: 3000,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '...'],
    },
    devtool: isDev ? 'inline-source-map' : false,
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new HtmlWebpackPlugin({ template: './src/index.html' }),
    ],
    output: {
      clean: true,
    },
  };
};
