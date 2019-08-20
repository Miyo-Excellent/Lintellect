//  Dependencies
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import {isDevelopment} from '../../src/shared/utils/environment';

export default () => ({
  minimizer: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: isDevelopment()
    })
  ]
});
