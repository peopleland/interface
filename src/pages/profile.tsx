import Layout from "../components/layout";
import styles from "../styles/Profile.module.css"
import Image from "next/image"
import TwitterLogo from "../../public/assets/images/twitter.svg"
import DiscordLogo from "../../public/assets/images/discord.svg"
import TelegramLogo from "../../public/assets/images/telegram.svg"
import {Button, Card, Col, Form, Input, Row, Space} from "antd";
import {CheckCircleOutlined} from "@ant-design/icons";

const Profile = () => {
  return <Layout title="Profile" >
    <Row justify={"center"}>
      <Col>
        <div className={styles.profile}>
          <div className={styles.title}>Profile Settings</div>
          <Form layout={"vertical"} className={styles.form}>
            <Form.Item label="Username" name="username" rules={[
              {required: true}
            ]}>
              <Input size={'large'} placeholder="Enter username" style={{width: "320px"}} />
            </Form.Item>
            <Form.Item label="Social Account">
              <Space style={{marginTop: "20px"}} size={16}>
                <div>
                  <Card className={styles.socialCard}>
                    <div className={styles.socialTitle}>Twitter</div>
                    <div className={styles.socialIcon}><Image src={TwitterLogo} alt={"twitter"} width={41} height={33} /></div>
                    <div className={styles.socialDesc}>Get verified by connecting your Twitter account.</div>
                    <div className={styles.socialFooter}>
                      <div className={styles.socialVerified}><CheckCircleOutlined />&nbsp;Verified</div>
                      <div className={styles.socialButton}><Button block>Disconnect</Button></div>
                    </div>
                  </Card>
                </div>
                <div>
                  <Card className={styles.socialCard}>
                    <div className={styles.socialTitle}>Discord</div>
                    <div className={styles.socialIcon}><Image src={DiscordLogo} alt={"discord"} width={50} height={38} /></div>
                    <div className={styles.socialDesc}>Get verified by connecting your Discord account.</div>
                    <div className={styles.socialFooter}>
                      <div className={styles.socialVerified}>Verified</div>
                      <div className={styles.socialButton}><Button type={"primary"} block>Verify</Button></div>
                    </div>
                  </Card>
                </div>
                <div>
                  <Card className={styles.socialCard}>
                    <div className={styles.socialTitle}>Telegram</div>
                    <div className={styles.socialIcon}><Image src={TelegramLogo} alt={"telegram"} width={45} height={45} /></div>
                    <div className={styles.socialDesc}>Get verified by connecting your Telegram account.</div>
                    <div className={styles.socialFooter}>
                      <div className={styles.socialVerified}>Verified</div>
                      <div className={styles.socialButton}><Button type={"primary"} block>Verify</Button></div>
                    </div>
                  </Card>
                </div>
              </Space>
            </Form.Item>
            <Form.Item style={{marginTop: "60px"}}>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  </Layout>
}

export default Profile
