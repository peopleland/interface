import "../styles/globals.css"
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import { Web3ReactProvider } from '@web3-react/core'
import {ethers} from "ethers";
import { ApolloProvider } from '@apollo/client';
import  ApolloClient from '../lib/apolloClient'
import {ConfigProvider, message} from 'antd';
import {store} from "../store";
import Layout from "../components/layout";

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider)// this will vary according to whether you use e.g. ethers or web3.js
}

function App({ Component, pageProps }: AppProps) {
  message.config({
    top: 80,
    maxCount: 1,
  });
  return <Provider store={store}>
    <ConfigProvider>
      <ApolloProvider client={ApolloClient}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Layout Component={Component} pageProps={pageProps} />
        </Web3ReactProvider>
      </ApolloProvider>
    </ConfigProvider>
  </Provider>
}

export default App
