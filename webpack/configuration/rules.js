// Dependencies
import ExtractTextPlugin from 'extract-text-webpack-plugin';

// Environment
const isDevelopment = process.env.NODE_ENV !== 'production';

// Package.json
import pkg from '../../package.json';

export default type => {
  const rules = [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        query: {
          plugins: [
            'lodash',
            'transform-class-properties'
          ],
          presets: [
            'es2015',
            'react',
            'stage-0',
            'stage-2',
            [
              'env',
              {
                modules: false,
                browsers: pkg.browserslist
              }
            ]
          ]
        }
      }
    },
    {// JSON
      test: /\.json$/,
      use: 'json-loader'
    },
    {//-- GZIP
      test: /\.gzip?$/,
      enforce: 'pre',
      use: [
        {//-- GZIP-LOADER
          loader: 'gzip-loader'
        }
      ]
    },
    {//-- (PNG || JPG)
      test: /\.(png|jpg|gif)?$/,
      use: [
        {//-- FILE-LOADER
          loader: 'file-loader',
          options: {//-- Configuracion del LOADER
            name: '[name].[ext]',//-- Nombre del Archivo Generado
            context: 'this.options.context',//-- Contexto de Archivo Personalizado
            //publicPath: path.resolve(__dirname, '/'),//--Ruta pública personalizada
            //outputPath: path.resolve(__dirname, '/'),//-- Ruta de salida personalizada
            useRelativePath: false,//-- Generar una URL relativa al contexto para cada archivo
            emitFile: true//-- Emitir un archivo para paquetes del lado del servidor
          }
        }
      ]
    },
    {//-- SVG
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {//-- URL-LOADER
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
            fallback: 'responsive-loader'
          }
        }
      ]
    }
  ];

  if (!isDevelopment || type === 'server') {
    rules.push(
      {//  LESS
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
            options: {sourceMap: isDevelopment}
          },
          use: [
            {// CSS
              loader: 'css-loader',
              options: {
                import: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]',
                minimize: true,
                modules: true,
                root: '.',
                sourceMap: isDevelopment,
                url: true
              }
            },
            {// POST CSS
              loader: 'postcss-loader',
              options: {
                sourceMap: isDevelopment,
                plugins: () => [
                  require('postcss-import')(),
                  require('postcss-cssnext')(),
                  require('cssnano')()
                ]
              }
            }
          ]
        })
      },
      {//  SASS
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
            options: {sourceMap: isDevelopment}
          },
          use: [
            {// CSS
              loader: 'css-loader',
              options: {
                import: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]',
                minimize: true,
                modules: true,
                root: '.',
                sourceMap: isDevelopment,
                url: true
              }
            },
            {// POST CSS
              loader: 'postcss-loader',
              options: {
                sourceMap: isDevelopment,
                plugins: () => [
                  require('postcss-import')(),
                  require('postcss-cssnext')(),
                  require('cssnano')()
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {sourceMap: isDevelopment}
            }
          ]
        })
      },
      {//  LESS
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
            options: {sourceMap: isDevelopment}
          },
          use: [
            {// CSS
              loader: 'css-loader',
              options: {
                import: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]',
                minimize: true,
                modules: true,
                root: '.',
                sourceMap: isDevelopment,
                url: true
              }
            },
            {// POST CSS
              loader: 'postcss-loader',
              options: {
                sourceMap: isDevelopment,
                plugins: () => [
                  require('postcss-import')(),
                  require('postcss-cssnext')(),
                  require('cssnano')()
                ]
              }
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: isDevelopment,
                strictMath: true,
                noIeCompat: true
              }
            }
          ]
        })
      }
    );
  } else {
    rules.push(
      {// CSS
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {sourceMap: isDevelopment}
          },
          {// CSS
            loader: 'css-loader',
            options: {
              import: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]',
              minimize: true,
              modules: true,
              root: '.',
              sourceMap: isDevelopment,
              url: true
            }
          },
          {// POST CSS
            loader: 'postcss-loader',
            options: {
              sourceMap: isDevelopment,
              plugins: () => [
                require('postcss-import')(),
                require('postcss-cssnext')(),
                require('cssnano')()
              ]
            }
          }
        ]
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: 'style-loader',
            options: {sourceMap: isDevelopment}
          },
          {// CSS
            loader: 'css-loader',
            options: {
              import: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]',
              minimize: true,
              modules: true,
              root: '.',
              sourceMap: isDevelopment,
              url: true
            }
          },
          {// POST CSS
            loader: 'postcss-loader',
            options: {
              sourceMap: isDevelopment,
              plugins: () => [
                require('postcss-import')(),
                require('postcss-cssnext')(),
                require('cssnano')()
              ]
            }
          },
          {// SASS
            loader: 'sass-loader',
            options: {sourceMap: isDevelopment}
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
            options: {sourceMap: isDevelopment}
          },
          {// CSS
            loader: 'css-loader',
            options: {
              import: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]',
              minimize: true,
              modules: true,
              root: '.',
              sourceMap: isDevelopment,
              url: true
            }
          },
          {// POST CSS
            loader: 'postcss-loader',
            options: {
              sourceMap: isDevelopment,
              plugins: () => [
                require('postcss-import')(),
                require('postcss-cssnext')(),
                require('cssnano')()
              ]
            }
          },
          {// LESS
            loader: 'less-loader',
            options: {
              sourceMap: isDevelopment,
              strictMath: true,
              noIeCompat: true
            }
          }
        ]
      }
    );
  }

  return rules;
};
