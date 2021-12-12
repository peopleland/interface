import styles from "../styles/Layout.module.css";
import {EthereumNetwork} from "../lib/utils";
import {FC, ReactNode, useCallback, useMemo} from "react";
import {useWeb3React} from "@web3-react/core"
import {Injected} from "../hooks/useWallet";
import Link from 'next/link'
import Head from "next/head";

type PageProps = {
  title?: string
  children: ReactNode
}

const Page: FC<PageProps> = ({title, children}) => {

  const {active, activate, deactivate, account, chainId} = useWeb3React()

  const connectMetamask = useCallback(async () => {
    try {
      if (!active) await activate(Injected)
      else await deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }, [activate, active, deactivate])

  const rightHeader = useMemo(() => {
    if (account && chainId) {
      let networkDom
      if (chainId !== 1) networkDom = <div className={styles.testNetwork}>[{EthereumNetwork[chainId]}]&nbsp;</div>
      return <div className={styles.connect} onClick={connectMetamask}>
        <div className={styles.connectText}>
          {!!networkDom && networkDom}
          {account?.substr(0, 6)}...{account?.substr(-4)}
        </div>
      </div>
    }
    return <div className={styles.connect} onClick={connectMetamask}>
      <div className={styles.connectText}>Connect Wallet</div>
    </div>
  }, [account, chainId, connectMetamask])

  const headerTitle = useMemo(() => {
    return `${process.env.SEO_TITLE}${title ? ` - ${title}` : ''}`
  }, [title])

  return useMemo(() => (
    <>
      <Head>
        <title>{headerTitle}</title>
        <meta name="description" content={process.env.SEO_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={headerTitle} />
        <meta property="og:description" content={process.env.SEO_DESCRIPTION} />
        <meta property="og:site_name" content={process.env.SEO_TITLE} />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:creator" content={process.env.SEO_TWITTER} />
        <meta property="twitter:title" content={headerTitle} />
        <meta property="twitter:description" content={process.env.SEO_DESCRIPTION} />
        <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no" />
      </Head>

      <div className={styles.pageWrapper}>
        <div className={styles.page}>
          <header>
            <div className={styles.links}>
              <div><Link href="/"><a>Home</a></Link></div>
              <div><Link href="/airdrop"><a>Airdrop</a></Link></div>
              <div><a rel="noreferrer" href="https://opensea.io/collection/people-land"
                      target="_blank">Opensea</a></div>
              <div><a rel="noreferrer" href="https://discord.gg/KNUBFsxxS3" target="_blank">Discord</a>
              </div>
              <div><a rel="noreferrer" href="https://app.icpdao.co" target="_blank">DAO</a></div>
            </div>
            {rightHeader}
          </header>

          <main>
            {children}
          </main>
          <footer>
            <p className={styles.tips}>
              This page is open source in <a rel="noreferrer"
                                             href="https://github.com/peopleland/interface"
                                             target="_blank" style={{color: "#625FF6"}}>GitHub</a>. You
              can modify and deploy it at will.
            </p>
            <div style={{textAlign: 'center'}}>
              <a href="https://www.netlify.com">
                <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" />
              </a>
            </div>
          </footer>
        </div>
      </div>
    </>
  ), [children, headerTitle, rightHeader])
}

export default Page
