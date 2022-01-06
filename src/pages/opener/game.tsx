import {useCallback, useEffect, useMemo, useState} from "react";
import Layout from "../../components/layout";
import {Button, Col, Empty, Input, message, Modal, Progress, Row, Space, Spin, Tabs, Tooltip} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import styles from "../../styles/Opener.module.css";
import {
  useUniswapCurrentPriceLazyQuery,
  useUniswapV3DaibuilderPoolLazyQuery
} from "../../app/uniswap-v3/generated";
import {useRequest} from "ahooks";
import {
  UserGetOpenerGameRoundInfo,
  UserOpenerGameMintRecord,
  UserOpenerGameOpenerRecordList
} from "../../app/backend/user/User";
import moment from "moment";
import {actionModal} from "../../store/walletModal";
import {getJWTExpired, getJWTLocalStorage, parseWalletError} from "../../lib/helper";
import {actionSign} from "../../store/signAction";
import {useWeb3React} from "@web3-react/core";
import {useAppDispatch} from "../../store/hooks";
import {useRouter} from "next/router";
import {MintContractAddress} from "../../lib/utils";
import {MintContract} from "../../app/contract/mintContract";
import testWhiteAddress from "../../../public/assets/json/test_address_sign_info.json";
import prodWhiteAddress from "../../../public/assets/json/prod_address_sign_info.json";

const parseName = (opener_record: API.v1OpenerRecord) => {
  let on, inn
  if (opener_record?.mint_user_name) on = opener_record.mint_user_name
  else if (opener_record?.mint_address) on = <Tooltip title={opener_record.mint_address}>
      <span>
        {opener_record.mint_address.substr(0, 6)}...{opener_record.mint_address.substr(-4)}
      </span>
  </Tooltip>
  else on = "?"

  if (opener_record?.invited_user_name) inn = opener_record.invited_user_name
  else if (opener_record?.invited_address) inn = <Tooltip title={opener_record.invited_address}>
      <span>
        {opener_record.invited_address.substr(0, 6)}...{opener_record.invited_address.substr(-4)}
      </span>
  </Tooltip>
  else if (on !== "?") inn = "PeopleLand"
  else inn = "?"

  return [on, inn]
}

const Game = () => {
  const [currentMoment, setCurrentMoment] = useState(moment());
  const [tutorialModal, setTutorialModal] = useState<boolean>(false)
  const [openedBoxModal, setOpenedBoxModal] = useState<boolean>(false)
  const [mintedAlertModal, setMintedAlertModal] = useState<boolean>(false)
  const [goLinkLoading, setGoLinkLoading] = useState<boolean>(false);
  const [openerAllList, setOpenerAllList] = useState<API.v1OpenerRecord[]>([]);
  const { active, chainId, library, account } = useWeb3React();
  const dispatch = useAppDispatch();
  const router = useRouter()
  const invitedCode = useMemo(() => {
    return router.query.invite_code as (string | undefined)
  }, [router.query.invite_code])
  const [getCurrentETHPrice, currentETHPrice] = useUniswapCurrentPriceLazyQuery({fetchPolicy: 'no-cache'})
  const [getBuilderUniswapData, builderUniswapData] = useUniswapV3DaibuilderPoolLazyQuery({fetchPolicy: 'no-cache'})

  useEffect(() => {
    setInterval(() => {
      setCurrentMoment(moment())
    }, 1000)
  }, [])

  const {run, data, loading} = useRequest(UserGetOpenerGameRoundInfo, {
    pollingInterval: 3000, pollingWhenHidden: true, debounceWait: 3000,
  })
  const {data: openerListData, loading: openerListLoading, run: getOpenerList} = useRequest(UserOpenerGameOpenerRecordList, {
    defaultParams: [{pageSize: 10}]
  })

  useEffect(() => {
    getBuilderUniswapData()
    getCurrentETHPrice()
  }, [getBuilderUniswapData, getCurrentETHPrice])

  const builderFluctuation = useMemo(() => {
    if (!builderUniswapData?.data?.pool?.token0Price) return 0
    return parseFloat(builderUniswapData.data?.pool?.token0Price)
  }, [builderUniswapData.data?.pool?.token0Price])

  const ethFluctuation = useMemo(() => {
    if (!currentETHPrice.data?.bundles || currentETHPrice.data.bundles.length === 0) return 0
    return currentETHPrice.data?.bundles[0].ethPriceUSD
  }, [currentETHPrice.data?.bundles])

  const builderAmount = useMemo(() => {
    return data?.info?.builder_token_amount || '???'
  }, [data?.info?.builder_token_amount])

  const ethAmount = useMemo(() => {
    return data?.info?.eth_amount || '???'
  }, [data?.info?.eth_amount])

  const [openerBuilderAmount, invitedBuilderAmount, openerETHAmount, invitedETHAmount] = useMemo(() => {
    let oba, iba, oea, iea
    if (builderAmount === "???") {
      oba = "???"
      iba = "???"
    } else {
      oba = (parseInt(builderAmount, 10) * 0.6).toFixed(2)
      iba = (parseInt(builderAmount, 10) * 0.4).toFixed(2)
    }
    if (ethAmount === "???") {
      oea = "???"
      iea = "???"
    } else {
      oea = (parseInt(ethAmount, 10) * 0.6).toFixed(2)
      iea = (parseInt(ethAmount, 10) * 0.4).toFixed(2)
    }
    return [oba, iba, oea, iea]
  }, [builderAmount, ethAmount])

  useEffect(() => {
    if (data?.info?.has_winner) setOpenedBoxModal(true)
  }, [data?.info?.has_winner])

  const [remainingTime, remainingProgress] = useMemo(() => {
    if (!data?.opener_record || !data?.info) return ["24:00:00", 0]
    if (data?.info?.has_winner) return ["00:00:00", 100]
    if (!data?.opener_record?.block_timestamp) return ["24:00:00", 0]
    const mayBeEndTime = (data.opener_record.block_timestamp + 24 * 60 * 60) * 1000
    if (moment(mayBeEndTime).isSameOrBefore(currentMoment)) {
      return ["00:00:00", 100]
    }
    const mayBeEndDuration = moment.duration(moment(mayBeEndTime).diff(currentMoment))
    return [
      `${mayBeEndDuration.hours()}:${mayBeEndDuration.minutes()}:${mayBeEndDuration.seconds()}`,
      parseInt((mayBeEndDuration.asSeconds()/(24 * 60 * 60)).toString(10), 10)
    ]
  }, [currentMoment, data?.info, data?.opener_record])

  const [openerName, inviterName] = useMemo(() => {
    if (!data?.opener_record) return ["?", "?"]
    return parseName(data.opener_record)
  }, [data?.opener_record])

  const [rewardPrice, openerRewardPrice, inviteRewardPrice] = useMemo(() => {
    if (builderAmount === "???") return ["???", "???", "???"]
    if (builderFluctuation === 0 || ethFluctuation === 0) return ["???", "???", "???"]
    const builderNumber = parseFloat(builderAmount)

    if (ethAmount === "???") {
      const all = builderNumber * builderFluctuation
      return [all.toFixed(2) + "+???", (all * 0.6).toFixed(2) + "+???" + (all * 0.4).toFixed(2) + "+???"]
    }

    const ethNumber = parseFloat(ethAmount)
    const all = builderNumber * builderFluctuation + ethNumber * ethFluctuation
    return [all.toFixed(2), (all * 0.6).toFixed(2), (all * 0.4).toFixed(2)]
  }, [builderAmount, builderFluctuation, ethAmount, ethFluctuation])

  const handleGoInvite = useCallback(() => {
    if (!active) {
      dispatch(actionModal({visible: true, thenSign: true, callback: "/opener/invitation"}))
      return
    }
    if (getJWTExpired() || !getJWTLocalStorage()) {
      dispatch(actionSign({action: true, callback: "/opener/invitation"}))
      return
    }
    router.push("/opener/invitation")
  }, [active, dispatch, router])

  useEffect(() => {
    if (!openerListData?.opener_records || openerListData.opener_records.length === 0) return
    setOpenerAllList((old) => (old.concat(openerListData.opener_records || [])))
  }, [openerListData?.opener_records])

  const openerList = useMemo(() => {
    if (openerAllList.length === 0) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
    return openerAllList.map((opener, index) => {
      const [on, inn] = parseName(opener)
      const nextTime = opener.next_token_block_timestamp || currentMoment.unix()
      const beginTime = opener.block_timestamp || 0
      const guardDuration = moment.duration((nextTime - beginTime) * 1000)
      return <Row justify={"space-between"} className={styles.gameInfoListLine} key={index}>
        <Col style={{width: "120px"}}>
          {!opener.next_token_block_timestamp ? <Space>
            <div className={styles.gameInfoListKey} />
            <div className={styles.gameInfoListText}>{on}</div>
          </Space> : <div className={styles.gameInfoListText}>{on}</div>}
        </Col>
        <Col style={{width: "220px"}} className={styles.gameInfoListText}>Guard {`${guardDuration.hours()}:${guardDuration.minutes()}:${guardDuration.seconds()}`}</Col>
        <Col style={{width: "220px"}} className={styles.gameInfoListText}>Invited by {inn}</Col>
      </Row>
    })
  }, [currentMoment, openerAllList])

  const handleLoadMoreOpener = useCallback(() => {
    getOpenerList({
      pageSize: 10,
      afterTokenId: openerListData?.after_token_id
    })
  }, [getOpenerList, openerListData?.after_token_id])

  const [mintX, setMintX] = useState<string>("")
  const [mintY, setMintY] = useState<string>("")
  const [mintLoading, setMintLoading] = useState<boolean>(false)

  const contract = useMemo(() => {
    if (!chainId || !library) return null
    return new MintContract(chainId, library)
  },[chainId, library])

  const whiteAddress: any = useMemo(() => {
    return process.env.NEXT_PUBLIC_RUN_ENV === "DEV" ? testWhiteAddress : prodWhiteAddress
  }, [])

  const handleMint = useCallback(() => {
    if (!active || !contract || !account) {
      dispatch(actionModal({visible: true}))
      return
    }
    if (!whiteAddress[account.toLowerCase()]) {
      message.error("Sorry, only ConstitutionDAO donors can mint for free. You can also go to Opensea to buy a piece of land!")
      return
    }
    setMintLoading(true)
    UserOpenerGameMintRecord({
      mintAddress: account,
      x: mintX,
      y: mintY,
      verify_code: invitedCode
    }).then(() => {
      contract.mintToSelf(mintX, mintY, whiteAddress[account.toLowerCase()]).then((tx) => {
        setMintX("")
        setMintY("")
        setMintedAlertModal(true)
        setMintLoading(false)
        tx.wait().then().catch().finally(() => {})
      }).catch((e) => {
        console.log(e)
        parseWalletError(e)
        setMintLoading(false)
      }).finally(() => setMintLoading(true))
    })
  }, [account, active, contract, dispatch, invitedCode, mintX, mintY, whiteAddress])

  const actionButtons = useMemo(() => {
    if (invitedCode) return <>
      <Row justify={"center"} gutter={16} style={{marginTop: 24}}>
        <Col span={8}><Input style={{width: "100%"}} value={mintX} onChange={(e) => setMintX(e.target.value)} prefix={<span>📜&nbsp;&nbsp;&nbsp;X:</span>} /></Col>
        <Col span={8}><Input style={{width: "100%"}} value={mintY} onChange={(e) => setMintY(e.target.value)} prefix={<span>📜&nbsp;&nbsp;&nbsp;Y:</span>} /></Col>
      </Row>
      <Row justify={"center"} style={{marginTop: 24}}>
        <Col span={8}>
          <Button type={"primary"} size={"large"} block loading={mintLoading} onClick={handleMint}>{active ? 'Free Mint' : 'Connect Wallet'}</Button>
        </Col>
      </Row>
      <div className={styles.gameMintDesc}>
        Available via contract only. Not audited. Mint at your own risk. <br/>
        For rules on mint, please learn through <a onClick={() => setTutorialModal(true)}>Tutorial</a> or <a rel="noreferrer" href={`https://etherscan.io/address/${MintContractAddress}`} target="_blank" style={{color: "#625FF6"}}>view the contract</a>
      </div>
    </>
    return <>
      <Row justify={"center"} gutter={16} style={{marginTop: 24}}>
        <Col span={8}><Button type={"primary"} size={"large"} block onClick={handleGoInvite} loading={goLinkLoading}>Go Invite</Button></Col>
        <Col span={8}><Button type={"primary"} size={"large"} block onClick={() => open("/mint/invite", "_blank")}>0.66 ETH Invite</Button></Col>
      </Row>
    </>
  }, [active, goLinkLoading, handleGoInvite, handleMint, invitedCode, mintLoading, mintX, mintY])

  return useMemo(() => {
    return <Layout title="Opener Game" >
      <Modal
        key={'tutorialModal'}
        visible={tutorialModal}
        title={<div style={{textAlign: "center", fontSize: "1.5rem", fontWeight: "700"}}>How to play the door opener</div>}
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
      <Modal
        key={'openedBoxModal'}
        visible={openedBoxModal}
        width={"620px"}
        title={<div style={{textAlign: "center", fontSize: "1.5rem", fontWeight: "700"}}>The treasure box was opened!</div>}
        footer={<div><Button type={"primary"} onClick={() => setOpenedBoxModal(false)}>Got it</Button></div>}
        onCancel={() => setOpenedBoxModal(false)}
      >
        <p>
          Congratulations to {openerName} and {inviterName}, who successfully opened the treasure box. <br/> <br/>
          {openerName} will get <span style={{fontSize: "1.5rem", fontWeight: "700"}}>{openerBuilderAmount}BUILDER+{openerETHAmount}ETH</span> reward！<br/>
          {inviterName} will get <span style={{fontSize: "1.5rem", fontWeight: "700"}}>{invitedBuilderAmount}BUILDER+{invitedETHAmount}ETH</span> reward！<br/><br/>
          All rewards will be issued within 24 hours！<br/>
        </p>
      </Modal>
      <Modal
        key={'mintedAlertModal'}
        visible={mintedAlertModal}
        title={<div style={{textAlign: "center", fontSize: "1.5rem", fontWeight: "700"}}>Update Alert</div>}
        footer={<div><Button type={"primary"} onClick={() => setMintedAlertModal(false)}>OK</Button></div>}
        onCancel={() => setMintedAlertModal(false)}
      >
        <p>Opener will be updated in about 2 minutes, please refresh later!</p>
      </Modal>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} spinning={currentETHPrice.loading || builderUniswapData.loading}>
        <Row justify={"center"}>
          <Col span={12} style={{textAlign: "center", fontFamily: "Helvetica"}}>
            <p className={styles.gameTitle}>The Door Opener</p>
            <div>
              <Space>
                <div className={styles.gameBox} />
                <div className={styles.gameRewardD}>${rewardPrice}</div>
              </Space>
            </div>
            <div className={styles.gameCountDown}>{remainingTime}</div>
            <div className={styles.gameDesc}>
              <Space>
                <div className={styles.gameKey} />
                <div className={styles.gameDescText}>The only way to open the treasure chest is to be the last opener to stand by for 24 hours.</div>
              </Space>
            </div>
            <Row justify={"start"} style={{marginTop: '1.875rem'}} gutter={17}>
              <Col className={styles.gameTutorialButton}><Button size={"large"} type={"primary"} block style={{backgroundColor: "#E9357C", borderColor: "#E9357C"}} onClick={() => setTutorialModal(true)}>Tutorial</Button></Col>
              {!!invitedCode && <Col className={styles.gameTutorialButton}><Button size={"large"} block onClick={() => open("https://opensea.io/collection/people-land", "_blank")}>Opensea</Button></Col>}
            </Row>
            <div className={styles.gameStage}>
              <div className={styles.gameStageContent}>
                <div className={styles.gameStageRound}>Round #{data?.info?.round_number || 1}</div>
                <div className={styles.gameStageDesc}>Contract will train in</div>
                <div className={styles.gameStageCountDown}>{remainingTime}</div>
                <div className={styles.gameProgress}><Progress percent={remainingProgress} strokeColor={"#625FF6"} trailColor={"#F5F5F5"}/></div>
                <div className={styles.gameStageInfo}>
                  <Row className={styles.gameStageInfoLine} justify={"space-between"}>
                    <Col className={styles.gameStageInfoLeft}>Opener</Col>
                    <Col className={styles.gameStageInfoRight}>
                      <Space size={12}>
                        <div className={styles.gameStageInfoName}>{openerName}</div>
                        <div className={styles.gameKey}/>
                      </Space>
                      <div>Gain ${openerRewardPrice}</div>
                    </Col>
                  </Row>
                  <Row className={styles.gameStageInfoLine} justify={"space-between"}>
                    <Col className={styles.gameStageInfoLeft}>Inviter</Col>
                    <Col className={styles.gameStageInfoRight}>
                      <Space size={12}>
                        <div className={styles.gameStageInfoName}>{inviterName}</div>
                        <div className={styles.gameKey}/>
                      </Space>
                      <div>Gain ${inviteRewardPrice}</div>
                    </Col>
                  </Row>
                  <Row className={styles.gameStageInfoLine} justify={"space-between"}>
                    <Col className={styles.gameStageInfoLeft}>Reward</Col>
                    <Col className={styles.gameStageInfoRight}>
                      <Space size={12}>
                        <div className={styles.gameStageInfoReward}>${rewardPrice}</div>
                        <div className={styles.gameStageInfoBox}/>
                      </Space>
                      <div>{builderAmount}BUILDER+{ethAmount}ETH</div>
                    </Col>
                  </Row>
                </div>
                {actionButtons}
              </div>
            </div>
            <div className={styles.gameInfoList}>
              <Tabs type="card">
                <Tabs.TabPane tab={`Opener (${openerListData?.total_count || 0})`} key="1">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} spinning={openerListLoading}>
                    <div className={styles.gameInfoListContent}>
                      {openerList}
                      {!!openerListData?.total_count && openerListData?.total_count > openerAllList.length && <div className={styles.gameInfoListLoad}>
                        <Button ghost block size={"large"} onClick={handleLoadMoreOpener} loading={loading}>Load More</Button>
                      </div>}
                    </div>
                  </Spin>
                </Tabs.TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Spin>
    </Layout>
  }, [actionButtons, builderAmount, builderUniswapData.loading, currentETHPrice.loading, data?.info?.round_number, ethAmount, handleLoadMoreOpener, inviteRewardPrice, invitedBuilderAmount, invitedCode, invitedETHAmount, inviterName, loading, mintedAlertModal, openedBoxModal, openerAllList.length, openerBuilderAmount, openerETHAmount, openerList, openerListData?.total_count, openerListLoading, openerName, openerRewardPrice, remainingProgress, remainingTime, rewardPrice, tutorialModal])
}

export default Game;
