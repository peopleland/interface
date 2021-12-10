import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3ReactProvider } from '@web3-react/core'
import {ethers} from "ethers";
import { ApolloProvider } from '@apollo/client';
import  ApolloClient from '../lib/apolloClient'

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider)// this will vary according to whether you use e.g. ethers or web3.js
}

function App({ Component, pageProps }: AppProps) {
  return <ApolloProvider client={ApolloClient}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  </ApolloProvider>
}

export default App
