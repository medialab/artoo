module.exports = {
  entry: './main.js',
  output: {
    path: __dirname,
    library: 'Terser',
    libraryTarget: 'umd',
    filename: 'terser.min.js'
  }
};
