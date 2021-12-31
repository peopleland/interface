import Layout from "../components/layout";
import styles from "../styles/Profile.module.css"
import Image from "next/image"
import TwitterLogo from "../../public/assets/images/twitter.svg"
import DiscordLogo from "../../public/assets/images/discord.svg"
import TelegramLogo from "../../public/assets/images/telegram.svg"
import {Button, Card, Col, Form, Input, message, Modal, Row, Space, Spin} from "antd";
import {CheckCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import {useRequest} from "ahooks";
import {UserGetProfile, UserPutProfile} from "../app/backend/user/User";
import {useCallback, useMemo, useState} from "react";

const Social = () => {
  const [twitterModalVisible, setTwitterModalVisible] = useState<boolean>(false);
  const [discordModalVisible, setDiscordModalVisible] = useState<boolean>(false);
  const [telegramModalVisible, setTelegramModalVisible] = useState<boolean>(false);
  const {data, error, loading, refresh} = useRequest(UserGetProfile)

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
              <div className={styles.socialButton}><Button block>Disconnect</Button></div>
            </> : <div className={styles.socialButton}><Button type={"primary"} block>Verify</Button></div>}
          </div>
        </Card>
      </div>
      <div>
        <Card className={styles.socialCard}>
          <div className={styles.socialTitle}>Discord</div>
          <div className={styles.socialIcon}><Image src={DiscordLogo} alt={"discord"} width={50} height={38} /></div>
          <div className={styles.socialDesc}>Get verified by connecting your Discord account.</div>
          <div className={styles.socialFooter}>
            {data?.discord ? <>
              <div className={styles.socialVerified}><CheckCircleOutlined />&nbsp;Verified</div>
              <div className={styles.socialButton}><Button block>Disconnect</Button></div>
            </> : <div className={styles.socialButton}><Button type={"primary"} block>Verify</Button></div>}
          </div>
        </Card>
      </div>
      <div>
        <Card className={styles.socialCard}>
          <div className={styles.socialTitle}>Telegram</div>
          <div className={styles.socialIcon}><Image src={TelegramLogo} alt={"telegram"} width={45} height={45} /></div>
          <div className={styles.socialDesc}>Get verified by connecting your Telegram account.</div>
          <div className={styles.socialFooter}>
            {data?.telegram ? <>
              <div className={styles.socialVerified}><CheckCircleOutlined />&nbsp;Verified</div>
              <div className={styles.socialButton}><Button block>Disconnect</Button></div>
            </> : <div className={styles.socialButton}><Button type={"primary"} block>Verify</Button></div>}
          </div>
        </Card>
      </div>
    </>
  }, [data?.discord, data?.telegram, data?.twitter])

  const twitterModalStep1 = useMemo(() => {
    return <>
      <div>We want to verify your Twitter account. To do so, you must first send a standardized Tweet from your account, then we’ll vaildate it’s there.</div>
      <div>The Tweet should say:</div>
      <div>I am verifying my identity as {data?.name || ''} on peopleland</div>
    </>
  }, [])

  const twitterModal = useMemo(() => {
    return <Modal title="Verify with Twitter"
                  visible={twitterModalVisible}
                  onOk={() => {}} onCancel={() => setTwitterModalVisible(false)}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  }, [])

  return <Layout title="Profile" >
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} spinning={!!error || loading}>
      <Row justify={"center"}>
        <Col>
          <div className={styles.profile}>
            <div className={styles.title}>Profile Settings</div>
            <div>
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
