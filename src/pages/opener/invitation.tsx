import {useCallback, useEffect, useMemo, useState} from "react";
import {Button, Col, Input, message, Row, Space, Spin, Tooltip} from "antd";
import {useRequest} from "ahooks";
import {UserGenVerifyCode} from "../../app/backend/user/User";
import Layout from "../../components/layout";
import {CheckOutlined, CopyOutlined, LoadingOutlined} from "@ant-design/icons";
import styles from "../../styles/Opener.module.css";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {actionModal} from "../../store/walletModal";
import {getJWTExpired, getJWTLocalStorage} from "../../lib/helper";
import {actionSign} from "../../store/signAction";
import {useRouter} from "next/router";
import {useWeb3React} from "@web3-react/core";
import {useAppDispatch} from "../../store/hooks";

const Invitation = () => {
  const router = useRouter()
  const { active } = useWeb3React();
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   const profile = getLocalUserProfile()
  //   if (!(profile.discord?.id && profile.twitter)) {
  //     message.info("Please Connect Social Account!")
  //     router.push("/social")
  //   }
  // }, [router])
  const {data, loading, refresh, run} = useRequest(async () => {
    return await UserGenVerifyCode({} as any)
  }, {manual: true})

  useEffect(() => {
    if (!active) {
      dispatch(actionModal({visible: true, thenSign: true, callback: "/opener/invitation"}))
      return
    }
    if (getJWTExpired() || !getJWTLocalStorage()) {
      dispatch(actionSign({action: true, callback: "/opener/invitation"}))
      return
    }
    run()
  }, [active, dispatch, router, run])

  const [link, setLink] = useState<string>()
  const [copyed, setCopyed] = useState<boolean>(false)

  useEffect(() => {
    if (data) {
      setLink(`${location.protocol}//${location.host}/opener?invite_code=${data.verify_code}`)
    }
  }, [data])

  const handlerGetLink = useCallback(async (values) => {
    await refresh()
  }, [refresh])

  const handlerCopyLink = useCallback(() => {
    setCopyed(true)
    setTimeout(() => setCopyed(false), 1000)
  }, [])

  return useMemo(() => {
    return <Layout title="Opener Invitation" >
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} spinning={loading}>
        <Row justify={"center"}>
          <Col span={12}>
            <div className={styles.invitation}>
              <div className={styles.invitationTitle}>Invitation Link</div>
              <div className={styles.invitationInput}>
                <Input.Group compact>
                  <Input
                    size={'large'}
                    value={link}
                    style={{ width: 'calc(100% - 150px)' }}
                    disabled
                    placeholder='Press "Get Invitation Link" to get the Invitation Link'
                  />
                  <Tooltip title="copy invitation link" placement={"right"}>
                    <CopyToClipboard text={link || ""} onCopy={handlerCopyLink}>
                      <Button size={"large"} icon={copyed ? <CheckOutlined style={{color: "#3cbc1c"}} /> : <CopyOutlined />} />
                    </CopyToClipboard>
                  </Tooltip>
                </Input.Group>
              </div>
              <div className={styles.invitationButtons}>
                <Space size={16}>
                  <Button size={"large"} type={"primary"} onClick={handlerGetLink} loading={loading}>Get Invitation Link</Button>
                  <Button size={"large"} onClick={() => open("https://opensea.io/collection/people-land", "_blank")}>Opensea</Button>
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </Spin>
    </Layout>
  }, [copyed, handlerCopyLink, handlerGetLink, link, loading])
}

export default Invitation
