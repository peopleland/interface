import {FC, useCallback, useEffect, useMemo, useState} from "react";
import {LayoutProps} from "../../components/layout";
import {Button, Col, Input, message, Modal, Row, Space} from "antd";
import styles from "../../styles/Mint.module.css";
import {MintContractAddress} from "../../lib/utils";
import {MintContract} from "../../app/contract/mintContract";
import {useWeb3React} from "@web3-react/core";
import {parseWalletError} from "../../lib/helper";

const Invite: FC<LayoutProps> = ({setPageMeta, connectWalletThen}) => {
  const { library, chainId, active } = useWeb3React();
  const [tutorialModal, setTutorialModal] = useState<boolean>(false)
  const [inviteX, setInviteX] = useState("");
  const [inviteY, setInviteY] = useState("");
  const [inviteAddress, setInviteAddress] = useState("");
  const [inviteSlogan, setInviteSlogan] = useState("");
  const [loadingInvite, setLoadingInvite] = useState<boolean>(false);

  useEffect(() => {
    setPageMeta({title: "Mint Invited", activePage: undefined})
  }, [setPageMeta])

  const contract = useMemo(() => {
    if (!chainId || !library) return null
    return new MintContract(chainId, library)
  },[chainId, library])

  const handleInvite = useCallback(() => {
    if (!contract || !active) {
      connectWalletThen()
      return
    }
    setLoadingInvite(true)
    if (inviteSlogan !== "") {
      contract.mintAndGiveToWithSlogan(inviteX, inviteY, inviteAddress, inviteSlogan).then((tx) => {
        setInviteX("")
        setInviteY("")
        setInviteAddress("")
        setInviteSlogan("")
        tx.wait().then().catch(() => {}).finally(() => {
          message.success("Invitation successfully!")
          setLoadingInvite(false)
        })
      }).catch((e) => {
        console.log(e)
        console.log(e.code)
        parseWalletError(e)
        setLoadingInvite(false)
      })
      return
    }
    contract.mintAndGiveTo(inviteX, inviteY, inviteAddress).then((tx) => {
      setInviteX("")
      setInviteY("")
      setInviteAddress("")
      tx.wait().then().catch().finally(() => setLoadingInvite(false))
    }).catch((e) => {
      console.log(e)
      parseWalletError(e)
      setLoadingInvite(false)
    })
  }, [contract, active, inviteSlogan, inviteX, inviteY, inviteAddress, connectWalletThen])

  return useMemo(() => {
    return <>
      <Modal
        key={'tutorialModal'}
        visible={tutorialModal}
        title={<div style={{textAlign: "center", fontStyle: "1.5rem", fontWeight: "700"}}>How to play the door opener</div>}
        footer={<div><Button type={"primary"} onClick={() => setTutorialModal(false)}>OK</Button></div>}
        onCancel={() => setTutorialModal(false)}
      >
        <p>
          Buy a key by choosing the amount of keys you want, choosing the team and then clicking on the SEND BNB button. <br/><br/>
          Congratulations, you are now holding the key to the pot! You will win the pot as long as nobody else buys another key. <br/><br/>
          Want to spread your joy and earn 10% affiliate fees? <br/>
          Just register a name for 0.01 BNB in the Vanity & Referrals tab. <br/>
          Once your name is registered, a Vanity Referral link will be made for you. For example fomo3d.net/inventor. <br/><br/>

          Whenever someone purchases keys through your link, 10% of their purchase will go directly to you! <br/>
          Btw, if you have a name registered and you are the most recent key buyer, then your name will show up at the top! For example, satoshi is EXIT SCAMMING.
        </p>
      </Modal>
      <Row justify={"center"} className={styles.invite}>
        <Col className={styles.inviteContent}>
          <Space direction={"vertical"} size={12}>
            <Space size={16}>
              <div className={styles.inviteInput}>
                <Input size={'large'} value={inviteX} onChange={(e) => setInviteX(e.target.value)} prefix={<span>📜&nbsp;&nbsp;&nbsp;X:</span>} />
              </div>
              <div className={styles.inviteInput}>
                <Input size={'large'} value={inviteY} onChange={(e) => setInviteY(e.target.value)} prefix={<span>📜&nbsp;&nbsp;&nbsp;Y:</span>} />
              </div>
            </Space>
            <div className={styles.inviteInput}>
              <Input size={'large'} value={inviteAddress} onChange={(e) => setInviteAddress(e.target.value)} prefix={<span>📜&nbsp;&nbsp;&nbsp;Give to address:</span>} />
            </div>
            <div className={styles.inviteInput}>
              <Input size={'large'} value={inviteSlogan} onChange={(e) => setInviteSlogan(e.target.value)} prefix={<span>📜&nbsp;&nbsp;&nbsp;Slogan(Optional) :</span>} />
            </div>
            <div className={styles.inviteButton}>
              <Button size={'large'} type={"primary"} style={{width: "184px"}} onClick={handleInvite} loading={loadingInvite}>{active ? '0.66ETH Invite' : 'Connect Wallet'}</Button>
            </div>
          </Space>
          <div className={styles.inviteDesc}>
            Available via contract only. Not audited. Mint at your own risk. <br/>
            For rules on mint, please learn through <a onClick={() => setTutorialModal(true)}>Tutorial</a> or <a rel="noreferrer" href={`https://etherscan.io/address/${MintContractAddress}`} target="_blank" style={{color: "#625FF6"}}>view the contract</a>
          </div>
        </Col>
      </Row>
    </>
  }, [active, handleInvite, inviteAddress, inviteSlogan, inviteX, inviteY, loadingInvite, tutorialModal])
}

export default Invite;
