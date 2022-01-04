import Layout from "../components/layout";
import styles from "../styles/Social.module.css"
import Image from "next/image"
import TwitterLogo from "../../public/assets/images/twitter.svg"
import DiscordLogo from "../../public/assets/images/discord.svg"
import TelegramLogo from "../../public/assets/images/telegram.svg"
import {Button, Card, Col, Input, message, Modal, Row, Space, Spin} from "antd";
import {CheckCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import {useRequest} from "ahooks";
import {
  UserGetProfile,
  UserConnectTwitter,
  UserConnectDiscord,
  UserConnectTelegram,
  UserDisconnectSocial
} from "../app/backend/user/User";
import {useCallback, useEffect, useMemo, useState} from "react";
import {getJWTExpired, getJWTLocalStorage, getLocalUserProfile} from "../lib/helper";
import {useRouter} from "next/router";
import {actionSign} from "../store/signAction";
import {useAppDispatch} from "../store/hooks";
import {useWeb3React} from "@web3-react/core";

const Social = () => {
  const router = useRouter()
  const dispatch = useAppDispatch();
  const {active} = useWeb3React()
  const [twitterModalVisible, setTwitterModalVisible] = useState<boolean>(false);
  const [twitterStep2ModalVisible, setTwitterStep2ModalVisible] = useState<boolean>(false);
  const [discordModalVisible, setDiscordModalVisible] = useState<boolean>(false);
  const [discordConnectModalVisible, setDiscordConnectModalVisible] = useState<boolean>(false);
  const [telegramModalVisible, setTelegramModalVisible] = useState<boolean>(false);
  const [discordVerifyURL, setDiscordVerifyURL] = useState<string>("");
  const [telegramVerifyCode, setTelegramVerifyCode] = useState<string>("");

  const [twitterAccount, setTwitterAccount] = useState<string>("")
  const [verifyTwitterLoading, setVerifyTwitterLoading] = useState<boolean>(false)
  const [telegramBotURL, setTelegramBotURL] = useState<string>("")

  const [disconnectLoading, setDisconnectLoading] = useState<Record<number, boolean>>({
    0: false, 1: false, 2: false
  })

  useEffect(() => {
    if (location.host.includes("peopleland.space")) {
      setTelegramBotURL("https://t.me/peopleland_bot")
    } else {
      setTelegramBotURL("https://t.me/peopleland_test_bot")
    }
  }, [])

  useEffect(() => {
    if (!active) {
      message.info("Please Connect Wallet")
      router.push("/")
      return
    }
    if (getJWTExpired() || !getJWTLocalStorage()) {
      dispatch(actionSign(true))
      return
    }
    if (!getLocalUserProfile().name) {
      router.push("/profile")
      message.info("First click 'Profile' to save your username!")
      return
    }
  }, [active, dispatch, router])

  useEffect(() => {
    setDiscordVerifyURL(
      `https://discord.com/api/oauth2/authorize?client_id=922854564993044480&redirect_uri=${encodeURIComponent(location.protocol + "//" + location.host + location.pathname)}&response_type=code&scope=identify`
    )
  }, [])

  const {data, error, loading, refresh} = useRequest(UserGetProfile)

  useEffect(() => {
    const query = router.query
    if (query.code) {
      setDiscordConnectModalVisible(true)
      UserConnectDiscord({
        code: query.code as string,
        redirect_uri: location.protocol + "//" + location.host + location.pathname
      }).then(() => {
        message.success("Connect Discord Success!")
        router.push("/social")
      }).catch(() => {
        message.error("Connect Discord Failed!")
      }).finally(() => setDiscordConnectModalVisible(false))
    }
  }, [router, router.query])

  const handlerDiscordVerify = useCallback(() => {
    setDiscordModalVisible(true)
    open(discordVerifyURL, "_blank")
  }, [discordVerifyURL])

  // const handlerCheckTelegramVerify = useCallback(async () => {
  //   await refresh()
  //   if (data?.telegram?.id) {
  //     setTelegramModalVisible(false)
  //     message.success("Connect Telegram Success!")
  //     return
  //   }
  //   setTimeout(async () => {await handlerCheckTelegramVerify()}, 5000)
  // }, [data?.telegram?.id, refresh])

  const handlerTelegramVerify = useCallback(() => {
    UserConnectTelegram({} as any).then((data) => {
      setTelegramVerifyCode(data?.code || "")
      setTelegramModalVisible(true)
      // handlerCheckTelegramVerify()
    }).catch(() => {
      message.error("Get Telegram Verify Code Error!")
    })
  }, [])

  const handlerDisconnect = useCallback((socialType: number) => {
    setDisconnectLoading((old) => ({
      ...old,
      [socialType]: true
    }))
    UserDisconnectSocial({social: socialType} as any).then(() => {
      message.success("Disconnect Success!")
      refresh()
    }).catch(() => {
      message.error("Disconnect Failed!")
    }).finally(() => setDisconnectLoading((old) => ({
      ...old,
      [socialType]: false
    })))
  }, [refresh])

  const socialCard = useMemo(() => {
    return <>
      <div>
        <Card className={styles.socialCard}>
          <div className={styles.socialTitle}>Twitter</div>
          <div className={styles.socialIcon}><Image src={TwitterLogo} alt={"twitter"} width={41} height={33} /></div>
          <div className={styles.socialDesc}>Get verified by connecting your Twitter account.</div>
          <div className={styles.socialFooter}>
            {data?.twitter ? <>
              <div className={styles.socialVerified}><CheckCircleOutlined />&nbsp;Verified</div>
              <div className={styles.socialButton}><Button block loading={disconnectLoading[0]} onClick={() => handlerDisconnect(0)}>Disconnect</Button></div>
            </> : <div className={styles.socialButton}><Button type={"primary"} block onClick={() => setTwitterModalVisible(true)}>Verify</Button></div>}
          </div>
        </Card>
      </div>
      <div>
        <Card className={styles.socialCard}>
          <div className={styles.socialTitle}>Discord</div>
          <div className={styles.socialIcon}><Image src={DiscordLogo} alt={"discord"} width={50} height={38} /></div>
          <div className={styles.socialDesc}>Get verified by connecting your Discord account.</div>
          <div className={styles.socialFooter}>
            {data?.discord?.id ? <>
              <div className={styles.socialVerified}><CheckCircleOutlined />&nbsp;Verified</div>
              <div className={styles.socialButton}><Button block loading={disconnectLoading[1]} onClick={() => handlerDisconnect(1)}>Disconnect</Button></div>
            </> : <div className={styles.socialButton}><Button type={"primary"} block onClick={handlerDiscordVerify}>Verify</Button></div>}
          </div>
        </Card>
      </div>
      <div>
        <Card className={styles.socialCard}>
          <div className={styles.telegramTitle}>Telegram</div>
          <div className={styles.socialIcon}><Image src={TelegramLogo} alt={"telegram"} width={45} height={45} /></div>
          <div className={styles.socialDesc}>Get verified by connecting your Telegram account.</div>
          <div className={styles.socialFooter}>
            {data?.telegram?.id ? <>
              <div className={styles.socialVerified}><CheckCircleOutlined />&nbsp;Verified</div>
              <div className={styles.socialButton}><Button block loading={disconnectLoading[2]} onClick={() => handlerDisconnect(2)}>Disconnect</Button></div>
            </> : <div className={styles.socialButton}><Button type={"primary"} block onClick={handlerTelegramVerify}>Verify</Button></div>}
          </div>
        </Card>
      </div>
    </>
  }, [data?.discord?.id, data?.telegram?.id, data?.twitter, disconnectLoading, handlerDisconnect, handlerDiscordVerify, handlerTelegramVerify])

  const twitterModal = useMemo(() => {
    return <Modal title="Verify with Twitter"
                  visible={twitterModalVisible}
                  okText={"Send Tweet"}
                  onOk={() => {
                    setTwitterModalVisible(false)
                    setTwitterStep2ModalVisible(true)
                    open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I am verifying my identity as ${data?.name || ""} on peopleland`)}`, "_blank")
                  }} onCancel={() => setTwitterModalVisible(false)}>
      <p>We want to verify your Twitter account. To do so, you must first send a standardized Tweet from your account, then we’ll vaildate it’s there.</p>
      <p>The Tweet should say:</p>
      <p>{`I am verifying my identity as ${data?.name || ""} on peopleland`}</p>
    </Modal>
  }, [data?.name, twitterModalVisible])

  const discordModal = useMemo(() => {
    return <Modal title="Verify with Discord"
                  visible={discordModalVisible}
                  okText={"Already Connected"}
                  onOk={() => {
                    refresh()
                    setDiscordModalVisible(false)
                  }} onCancel={() => setDiscordModalVisible(false)}>
      <p>Click OK to connect to your Discord account on the newly opened page.</p>
    </Modal>
  }, [discordModalVisible, refresh])

  const discordConnectModal = useMemo(() => {
    return <Modal title="Verify with Discord"
                  visible={discordConnectModalVisible}
                  footer={null}>
      <p style={{marginLeft: "calc(50% - 12px)"}}><Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /></p>
    </Modal>
  }, [discordConnectModalVisible])

  const twitterStep2Modal = useMemo(() => {
    return <Modal title="Verify with Twitter"
                  visible={twitterStep2ModalVisible}
                  okText={"Verify Tweet"}
                  okButtonProps={{disabled: twitterAccount === "", loading: verifyTwitterLoading}}
                  onOk={async () => {
                    setVerifyTwitterLoading(true)
                    UserConnectTwitter({twitter: twitterAccount}).then(() => {
                      message.success("Connect Twitter Account Success!")
                      refresh()
                    }).catch(() => {
                      message.error("Connect Twitter Account Error!")
                    }).finally(() => {
                      setTwitterStep2ModalVisible(false)
                      setTwitterAccount("")
                      setVerifyTwitterLoading(false)
                    })
                  }} onCancel={() => setTwitterStep2ModalVisible(false)}>
      <p>Now we’ll validate that you’ve the tweet. Enter your Twitter handle and press &quot;Verify Tweet&quot;</p>
      <p>
        <Input prefix="@" value={twitterAccount} onChange={(e) => setTwitterAccount(e.target.value)}/>
      </p>
    </Modal>
  }, [refresh, twitterAccount, twitterStep2ModalVisible, verifyTwitterLoading])

  const telegramConnectModal = useMemo(() => {
    return <Modal title="Verify with Telegram"
                  visible={telegramModalVisible}
                  okText={"Open Telegram"}
                  onOk={() => {
                    open(telegramBotURL, "_blank")
                  }}
                  onCancel={() => {
                    setTelegramModalVisible(false)
                    setTelegramVerifyCode("")
                  }}>
      <p>Send the Telegram bot <a href={telegramBotURL} target="_blank" rel="noreferrer">@peopleland_bot</a> with a copy of the following binding code</p>
      <p className={styles.telegramVerifyCode}>
        {telegramVerifyCode}
      </p>
    </Modal>
  }, [telegramBotURL, telegramModalVisible, telegramVerifyCode])

  return <Layout title="Social Account" >
    {twitterModal}
    {twitterStep2Modal}
    {discordModal}
    {discordConnectModal}
    {telegramConnectModal}
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} spinning={!!error || loading}>
      <Row justify={"center"}>
        <Col>
          <div className={styles.social}>
            <div className={styles.title}>Social Account</div>
            <div className={styles.socialContent}>
              <Space style={{marginTop: "20px"}} size={16}>
                {socialCard}
              </Space>
            </div>
          </div>
        </Col>
      </Row>
    </Spin>
  </Layout>
}

export default Social
