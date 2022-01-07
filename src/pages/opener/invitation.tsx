import {FC, useCallback, useEffect, useMemo, useState} from "react";
import {Button, Col, Input, Row, Space, Spin, Tooltip} from "antd";
import {useRequest} from "ahooks";
import {UserGenVerifyCode} from "../../app/backend/user/User";
import {LayoutProps} from "../../components/layout";
import {CheckOutlined, CopyOutlined, LoadingOutlined} from "@ant-design/icons";
import styles from "../../styles/Opener.module.css";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {getJWTExpired, getJWTLocalStorage} from "../../lib/helper";
import {useRouter} from "next/router";
import {useWeb3React} from "@web3-react/core";

const Invitation: FC<LayoutProps> = ({setPageMeta, connectWalletThen, handleSign}) => {
  const router = useRouter()
  const { active } = useWeb3React();
  const {data, loading, refresh, run} = useRequest(async () => {
    return await UserGenVerifyCode({} as any)
  }, {manual: true})

  useEffect(() => {
    setPageMeta({title: "Opener Invitation"})
    if (!active) {
      connectWalletThen(() => {
        handleSign()
      })
      return
    }
    if (getJWTExpired() || !getJWTLocalStorage()) {
      handleSign()
      return
    }
    run()
  }, [active, connectWalletThen, handleSign, router, run, setPageMeta])

  const [link, setLink] = useState<string>()
  const [copyed, setCopyed] = useState<boolean>(false)

  useEffect(() => {
    if (data) {
      setLink(`${location.protocol}//${location.host}/opener?invite_code=${data.verify_code}`)
    }
  }, [data])

  const handlerGetLink = useCallback(async () => {
    await refresh()
  }, [refresh])

  const handlerCopyLink = useCallback(() => {
    setCopyed(true)
    setTimeout(() => setCopyed(false), 1000)
  }, [])

  return useMemo(() => {
    return <>
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
    </>
  }, [copyed, handlerCopyLink, handlerGetLink, link, loading])
}

export default Invitation
