import styles from "../styles/Layout.module.css";
import {EthereumNetwork} from "../lib/utils";
import {FC, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {useWeb3React} from "@web3-react/core"
import {ConnectorNames, ConnectorsByName, Injected} from "../hooks/useWallet";
import Link from 'next/link'
import Head from "next/head"
import { useRouter } from 'next/router'
import {Card, Dropdown, Menu, Modal} from 'antd';
import Image from "next/image";
import MetamaskLogo from "../../public/assets/images/metamask.svg"
import WalletConnectLogo from "../../public/assets/images/walletconnect.svg"
import Coinbase from "../../public/assets/images/coinbase.svg"
import Netlify from "../../public/assets/images/netlify.svg"
import {
  clearJWTExpiredLocalStorage,
  clearJWTLocalStorage, getJWTExpired, getJWTLocalStorage,
  getWalletConnectorLocalStorage, saveUserProfile, setJWTExpiredLocalStorage,
  setJWTLocalStorage,
  setWalletConnectorLocalStorage
} from "../lib/helper";
import {UserGetProfile, UserLogin} from "../app/backend/user/User";
import {LogoutOutlined, UserOutlined} from "@ant-design/icons";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {actionModal} from "../store/walletModal";
import {RootState} from "../store";
import {actionSign} from "../store/signAction";

type PageProps = {
  title?: string
  active?: "opener"
  children: ReactNode
}

const Page: FC<PageProps> = ({title, active: activePage, children}) => {
  const router = useRouter()
  const dispatch = useAppDispatch();
  const isWalletModalVisible = useAppSelector((state: RootState) => state.walletModal.visible)
  const isSignAction = useAppSelector((state: RootState) => state.signAction.action)
  const {active, activate, deactivate, account, chainId, library} = useWeb3React()

  const setIsWalletModalVisible = useCallback((visible: boolean) => {
    dispatch(actionModal(visible))
  }, [dispatch])

  const connectMetamask = useCallback(async () => {
    setIsWalletModalVisible(true)
  }, [setIsWalletModalVisible])

  const disConnect = useCallback(async () => {
    try {
      setWalletConnectorLocalStorage("")
      await deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }, [deactivate])

  const signatureMsg = useMemo(() => {
    return `Welcome to PeopleLand!

Click to sign in and accept the PeopleLand Terms of Service.

This request will not trigger a blockchain transaction or cost any gas fees.

Your authentication status will reset after 24 hours.

Wallet address:
${account}`
  }, [account])

  const handleSign = useCallback((redirect?: string | undefined) => {
    library?.getSigner().signMessage(signatureMsg).then((signed: any) => {
      UserLogin({
        address: account || "",
        signature: signed,
        origin_message: signatureMsg
      }).then((resp) => {
        setJWTLocalStorage(resp.jwt)
        setJWTExpiredLocalStorage()
        UserGetProfile().then((profile) => {
          saveUserProfile(profile)
        }).finally(() => {
          if (redirect) router.push(`/${redirect}`)
        })
      })
    })
  }, [account, library, router, signatureMsg])

  const handleProfile = useCallback(async () => {
    if (!active || !account) return
    if (!getJWTExpired() && getJWTLocalStorage()) {
      await router.push("/profile")
      return
    }
    handleSign("profile")
  }, [account, active, handleSign, router])

  useEffect(() => {
    if (isSignAction) {
      handleSign()
      dispatch(actionSign(false))
    }
  }, [dispatch, handleSign, isSignAction])

  const connect = useCallback(async (name: ConnectorNames) => {
    try {
      await activate(ConnectorsByName[name])
      setIsWalletModalVisible(false)
      setWalletConnectorLocalStorage(name)
    } catch (ex) {
      console.log(ex)
    }
  }, [activate])

  useEffect(() => {
    if (!active && getWalletConnectorLocalStorage() === ConnectorNames.MetaMask) {
      Injected.isAuthorized().then((isAuth: any) => {
        if (isAuth) {
          connect(ConnectorNames.MetaMask)
        }
      }).catch(() => {})
    }
  }, [active, connect])

  const handleLogout = useCallback(async () => {
    clearJWTLocalStorage()
    clearJWTExpiredLocalStorage()
    disConnect()
  }, [disConnect])

  const loginDropdown = useMemo(() => {
    return <Menu>
      <Menu.Item key="profile" icon={<UserOutlined style={{fontSize: "24px"}} />}>
        <div className={styles.dropDownMenu} onClick={handleProfile}>
          Profile
        </div>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined style={{fontSize: "24px"}} />}>
        <div className={styles.dropDownMenu} onClick={handleLogout}>Log Out</div>
      </Menu.Item>
    </Menu>
  }, [handleLogout, handleProfile])

  const rightHeader = useMemo(() => {
    if (account && chainId) {
      let networkDom
      if (chainId !== 1) networkDom = <div className={styles.testNetwork}>[{EthereumNetwork[chainId]}]&nbsp;</div>
      return <Dropdown overlay={loginDropdown}>
        <div className={styles.connect}>
          <div className={styles.connectText}>
            {!!networkDom && networkDom}
            {account?.substr(0, 6)}...{account?.substr(-4)}
          </div>
        </div>
      </Dropdown>
    }
    return <div className={styles.connect} onClick={connectMetamask}>
      <div className={styles.connectText}>Connect Wallet</div>
    </div>
  }, [account, chainId, connectMetamask, loginDropdown])

  const walletModal = useMemo(() => {
    return <Modal
      visible={isWalletModalVisible}
      onOk={() => setIsWalletModalVisible(false)}
      onCancel={() => setIsWalletModalVisible(false)}
      footer={null}
      closable={false}
    >
      <Card>
        <Card.Grid className={styles.walletModalCard}>
          <div onClick={() => connect(ConnectorNames.MetaMask)}>
            <Image src={MetamaskLogo} alt={"metamask"} width="45" height="45" />
            <div>MetaMask</div>
          </div>
        </Card.Grid>
        <Card.Grid className={styles.walletModalCard}>
          <div onClick={() => connect(ConnectorNames.WalletConnect)}>
            <Image src={WalletConnectLogo} alt={"walletconnect"} width="45" height="45" />
            <div>WalletConnect</div>
          </div>
        </Card.Grid>
        <Card.Grid className={styles.walletModalCard}>
          <div onClick={() => connect(ConnectorNames.WalletLink)}>
            <Image src={Coinbase} alt={"coinbase"} width="45" height="45" />
            <div>Coinbase Wallet</div>
          </div>
        </Card.Grid>
      </Card>
    </Modal>
  }, [connect, isWalletModalVisible, setIsWalletModalVisible])

  const headerTitle = useMemo(() => {
    return `${process.env.SEO_TITLE}${title ? ` - ${title}` : ''}`
  }, [title])

  const wrapperClass = useMemo(() => {
    if (activePage === "opener") return styles.openerPageWrapper
    return styles.pageWrapper
  }, [activePage])

  const pageClass = useMemo(() => {
    if (activePage === "opener") return styles.openerPage
    return styles.page
  }, [activePage])

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

      <div className={wrapperClass}>
        <div className={pageClass}>
          <header>
            <div className={styles.links}>
              <div><Link href="/"><a>Home</a></Link></div>
              <div><Link href="/airdrop"><a>Airdrop</a></Link></div>
              <div><Link href="/opener"><a>Opener</a></Link></div>
              <div><a rel="noreferrer" href="https://opensea.io/collection/people-land"
                      target="_blank">Opensea</a></div>
              <div><a rel="noreferrer" href="https://discord.gg/KNUBFsxxS3" target="_blank">Discord</a>
              </div>
              <div><a rel="noreferrer" href="https://app.icpdao.co" target="_blank">DAO</a></div>
            </div>
            {rightHeader}
          </header>
          {walletModal}
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
            <div style={{textAlign: 'center', paddingBottom: "10px"}}>
              <a href="https://www.netlify.com">
                <Image src={Netlify} alt="Deploys by Netlify" />
              </a>
            </div>
          </footer>
        </div>
      </div>
    </>
  ), [children, headerTitle, pageClass, rightHeader, walletModal, wrapperClass])
}

export default Page
