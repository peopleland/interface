/** @type {import('next').NextConfig} */

const withAntdLess = require('next-plugin-antd-less')
const withPlugins = require('next-compose-plugins')

const pluginAntdLess = withAntdLess({
  // modifyVars: {
  //   '@THEME--DARK': 'theme-dark',
  // },
  lessVarsFilePath: './src/styles/variables.less',
  lessVarsFilePathAppendToEndOfContent: false,
  // cssLoaderOptions: {
  // esModule: false,
  // sourceMap: false,
  // modules: {
  // mode: 'local',
  // localIdentName: '[hash:2]',
  // },
  // },
});

module.exports = withPlugins([[pluginAntdLess]], {
  reactStrictMode: false,
  env: {
    PEOPLELAND_INFURA_KEY: 'dbffd247db694ccdb6506ddc175c48c6',
    PEOPLELAND_ALCHEMY_KEY: '64gGTjEbQ13TNWug6z3SJWLKQTOHRVJ9',
    PEOPLELAND_ETHERSCAN_KEY: '7J1KDENKGC567QX8GUHGS6WN1JMVBK8CSK',
    SEO_TITLE: 'Peopleland',
    SEO_DESCRIPTION: 'For the PEOPLE of ConstitutionDAO who made history.',
    SEO_TWITTER: '@peopleland_',
  },
  webpack(config) {
    return config;
  },
})
