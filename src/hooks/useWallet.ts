import {InjectedConnector} from "@web3-react/injected-connector";
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

const POLLING_INTERVAL = 12000
const RPC_URLS: { [chainId: number]: string } = {
  1: `https://mainnet.infura.io/v3/${process.env.PEOPLELAND_INFURA_KEY}`,
  4: `https://rinkeby.infura.io/v3/${process.env.PEOPLELAND_INFURA_KEY}`
}

export enum ConnectorNames {
  MetaMask = "MetaMask",
  WalletConnect = 'WalletConnect',
  WalletLink = 'WalletLink',
}

export const Injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
})

export const WalletConnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  qrcode: true
})

export const WalletLink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: 'PeopleLand APP',
  supportedChainIds: [1, 3, 4, 5, 42, 10, 137, 69, 420, 80001]
})

export const ConnectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.MetaMask]: Injected,
  [ConnectorNames.WalletConnect]: WalletConnect,
  [ConnectorNames.WalletLink]: WalletLink
}
