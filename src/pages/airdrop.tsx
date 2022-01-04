import styles from "../styles/Airdrop.module.css"
import Layout from "../components/layout";
import moment from "moment";
import {
  AirdropContractAddress,
  AirdropList,
  AvailableNetwork,
  BeginAirdropDatetime,
  EndAirdropDatetime
} from "../lib/utils";
import SwitchNetwork from "../../public/assets/images/switch_network.png"
import Button from "../components/button";
import {useWeb3React} from "@web3-react/core";
import {ConnectorNames, Injected} from "../hooks/useWallet";
import {AirdropContract} from "../app/contract/airdropContract";
import numeral from "numeral";
import {useCallback, useEffect, useMemo, useState} from "react";
import Image from 'next/image'
import {
  useUniswapV3Builder24HourOpenLazyQuery,
  useUniswapV3DaibuilderPoolLazyQuery,
} from "../app/uniswap-v3/generated";
import {getWalletConnectorLocalStorage} from "../lib/helper";
import {actionModal} from "../store/walletModal";
import {useAppDispatch} from "../store/hooks";

const uniswapSwapURL = "https://app.uniswap.org/#/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x6fbc77cbfc59d201dc03e004203734e0fae10d3e"

const Airdrop = () => {
  const { library, account, chainId, active, activate } = useWeb3React();
  const dispatch = useAppDispatch();
  const [currentMoment, setCurrentMoment] = useState(moment());
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  // const [getBuilderUniswapData, builderUniswapData] = useUniswapV3BuilderLazyQuery({fetchPolicy: 'no-cache'})
  const [getBuilderUniswapData, builderUniswapData] = useUniswapV3DaibuilderPoolLazyQuery({fetchPolicy: 'no-cache'})
  const [getBuilder24HourData, builder24HourData] = useUniswapV3Builder24HourOpenLazyQuery({fetchPolicy: 'no-cache'})

  // const builderPrice: number = useMemo(() => {
  //   if (!builderUniswapData?.data?.token) return 0
  //   return builderUniswapData.data.token.volumeUSD / builderUniswapData.data.token.volume
  // }, [builderUniswapData?.data])

  const builderPrice: number = useMemo(() => {
    if (!builderUniswapData?.data?.pool?.token0Price) return 0
    return parseFloat(builderUniswapData.data?.pool?.token0Price)
  }, [builderUniswapData?.data])

  const builder24HourPrice: number = useMemo(() => {
    if (!builder24HourData?.data?.tokenHourDatas || builder24HourData.data?.tokenHourDatas.length === 0) return 0
    return parseFloat(builder24HourData.data?.tokenHourDatas[0].open)
  }, [builder24HourData?.data?.tokenHourDatas])

  const builderFluctuation = useMemo(() => {
    if (builder24HourPrice === 0) return 0
    return ((builderPrice - builder24HourPrice) * 100) / builder24HourPrice
  }, [builder24HourPrice, builderPrice])

  const builderFluctuationDom = useMemo(() => {
    if (builderFluctuation >= 0) {
      return <span style={{color: "rgb(39, 174, 96)"}}>{builderFluctuation.toFixed(2)}%</span>
    }
    return <span style={{color: "rgb(253, 64, 64)"}}>{builderFluctuation.toFixed(2)}%</span>
  }, [builderFluctuation])

  const handlerTimeoutRequest = useCallback(() => {
    getBuilderUniswapData().then(() => {
      getBuilder24HourData({variables: {startTime: Math.floor(Date.now() / 1000) - 24 * 60 * 60}}).then(() => {
        setTimeout(() => {handlerTimeoutRequest()}, 1000 * 60)
      })
    })
  }, [getBuilder24HourData, getBuilderUniswapData])

  useEffect(() => {
    handlerTimeoutRequest()
  }, [handlerTimeoutRequest])

  useEffect(() => {
    setInterval(() => {
      setCurrentMoment(moment())
    }, 1000)
  }, [])

  useEffect(() => {
    if (active && chainId !== AvailableNetwork && library && getWalletConnectorLocalStorage() === ConnectorNames.MetaMask) {
      Injected.getProvider().then((provider: any) => {
        if (provider.isMetaMask) {
          provider.send({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${AvailableNetwork.toString(16)}` }],
          }, () => {setButtonLoading(false)})
        }
      })
    }
  }, [active, chainId, library])

  const airdropData = useMemo(() => {
    if (!active || !account) return
    return AirdropList[account.toLowerCase()]
  }, [account, active])

  const contract: any = useMemo(() => {
    if (!chainId || !library) return null
    return new AirdropContract(contract, library)
  }, [chainId, library])

  useEffect(() => {
    if (!active || !contract || !airdropData) return
    setButtonLoading(true)
    contract.getIsClaimed(airdropData.tol, account).then((v: any) => {
      setIsClaimed(v)
      setButtonLoading(false)
    }).finally(() => setButtonLoading(false))
  }, [account, active, airdropData, contract])

  const claimDisabled = useMemo(() => {
    if (!active || !contract || !airdropData) return true
    if (isClaimed) return true
    if (!!airdropData.tol && airdropData.tol > 0 && !buttonLoading) return false
    return true
  }, [active, airdropData, buttonLoading, contract, isClaimed])

  const diffDatetime = useMemo(() => {
    return moment.duration(BeginAirdropDatetime.diff(currentMoment, 'seconds'), 'seconds').locale("en")
  }, [currentMoment])

  const switchNetworkTips = useMemo(() => {
    return <div className={styles.tips}>
      <div className={styles.switchNetworkTips}>
        <div className={styles.switchTitle}>Please change your network to Ethereum Mainnet</div>
        <Image src={SwitchNetwork} alt="switch network" />
      </div>
    </div>
  }, [])

  const handlerClaim = useCallback(async () => {
    if (!airdropData || chainId !== AvailableNetwork || !contract) return
    setButtonLoading(true)
    contract.claimTokens(airdropData.tol, account).then((tx: any) => {
      tx.wait().then(() => setIsClaimed(true)).catch().finally(() => setButtonLoading(false))
    }).catch(() => setButtonLoading(false))
  }, [account, airdropData, chainId, contract])

  const countDown = useMemo(() => {
    return <>
      <p className={styles.title}>There is still time before the AIRDROP starts...</p>
      <div className={styles.countDownContent}>
        <div className={styles.countDown}>
          <div className={styles.countDownTitle}>Days</div>
          <div className={styles.countDownText}>{diffDatetime.days()}</div>
        </div>
        <div className={styles.countDown}>
          <div className={styles.countDownTitle}>Hours</div>
          <div className={styles.countDownText}>{diffDatetime.hours()}</div>
        </div>
        <div className={styles.countDown}>
          <div className={styles.countDownTitle}>Minutes</div>
          <div className={styles.countDownText}>{diffDatetime.minutes()}</div>
        </div>
        <div className={styles.countDown}>
          <div className={styles.countDownTitle}>Seconds</div>
          <div className={styles.countDownText}>{diffDatetime.seconds()}</div>
        </div>
      </div>
    </>
  }, [diffDatetime])

  const claimButton = useMemo(() => {
    if (!active || chainId !== AvailableNetwork) {
      return <Button block={true} size={'large'} disabled={false} loading={buttonLoading} onClick={async () => {
        try {
          dispatch(actionModal(true))
        } catch (e) {
          console.log(e)
        }
      }}><span style={{color: "#fff"}}>
      Connect Wallet</span>
      </Button>
    }
    if (isClaimed) {
      return <Button block={true} size={'large'} disabled={true} loading={buttonLoading} onClick={() => {}}>
        <span style={{color: "#fff"}}>Tokens Claimed Successfully</span>
      </Button>
    }
    return <Button block={true} size={'large'} disabled={claimDisabled} loading={buttonLoading} onClick={handlerClaim}>
      <span style={{color: "#fff"}}>One-Click Claim</span>
    </Button>
  }, [active, buttonLoading, chainId, claimDisabled, dispatch, handlerClaim, isClaimed])

  const claimTitle = useMemo(() => {
    if (!active || chainId !== AvailableNetwork) return ["Claim your tokens", "Please make sure to connect your wallet using Metamask and switch to the Ethereum Mainnet."]
    if (!airdropData) return ["Unfortunately, no token to claim", "This Ethereum account is not eligible for the airdrop. please make sure you are connected with the right account."]
    if (!isClaimed) return ["Congratulation, you can claim it", "You are eligible for the airdrop! View your tokens below, and one-click claim it."]
    if (isClaimed) return ["Your tokens are claimed!", "You were eligible for the retroactive airdrop, and you successfully claimed your tokens."]
    return ["", ""]
  }, [active, airdropData, chainId, isClaimed])

  const airdropValueList = useMemo(() => {
    if (!airdropData) return
    return [
      airdropData.init > 0 ? numeral(airdropData.init).format('0,0') : 0,
      airdropData.hC > 0 ? <span>{numeral(airdropData.hA).format('0,0')} &times; {airdropData.hC}</span> : 0,
      airdropData.inviC > 0 ? <span>{numeral(airdropData.inviA).format('0,0')} &times; {airdropData.inviC}</span> : 0,
      airdropData.neiC > 0 ? <span>{numeral(airdropData.neiA).format('0,0')} &times; {airdropData.neiC}</span> : 0,
    ]
  }, [airdropData])

  const airdropShow = useMemo(() => {
    return <div>
      <div className={styles.content}>
        <div className={styles.rewardsList}>
          <div className={styles.rewardsValue}>
            <div>Rewards</div>
            <div style={{fontWeight: 700}}>
              <div>Initial Team</div>
              <div>{!!airdropValueList && airdropValueList[0]}</div>
            </div>
            <div style={{fontWeight: 700}}>
              <div>Hold</div>
              <div>{!!airdropValueList && airdropValueList[1]}</div>
            </div>
            <div style={{fontWeight: 700}}>
              <div>Invite</div>
              <div>{!!airdropValueList && airdropValueList[2]}</div>
            </div>
            <div style={{fontWeight: 700}}>
              <div>Neighbors</div>
              <div>{!!airdropValueList && airdropValueList[3]}</div>
            </div>
          </div>
          <div className={styles.rewardsTime}>
            <div>End time</div>
            <div>{EndAirdropDatetime.locale('en').format("LL")}</div>
          </div>
        </div>
        <div className={styles.rewardsAction}>
          <div className={styles.claimCard}>
            <div className={styles.claim}>
              <div className={styles.claimTitle}>{claimTitle[0]}</div>
              <div className={styles.claimDesc}>{claimTitle[1]}</div>
              <div className={styles.claimFrame}>
                <div className={styles.claimValue}>{!isClaimed ? "You will receive..." : "You received..."}</div>
                {!!airdropData && <div className={styles.claimNum}>{numeral(airdropData.tol).format('0,0')} BUILDER</div>}
              </div>
              {claimButton}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.price}>
        <div className={styles.priceContent}>
          <div className={styles.priceUniswapIcon}><a href={uniswapSwapURL} target="_blank" rel="noreferrer"><i className={styles.iconfont} style={{color: "#E9357C", fontSize: "2rem"}}>&#xe6d6;</i></a></div>
          <div>(24h: {builderFluctuationDom})</div>
          <div className={styles.priceUniswapText}>{`$${builderPrice.toFixed(2)}`} DAI /BUILDER</div>
          <div><a href={uniswapSwapURL} target="_blank" rel="noreferrer"><i className={styles.iconfont}>&#xe605;</i></a></div>
        </div>
      </div>
    </div>
  }, [airdropData, airdropValueList, builderFluctuationDom, builderPrice, claimButton, claimTitle, isClaimed])

  const main = useMemo(() => {
    if (BeginAirdropDatetime.isSameOrBefore(currentMoment)) {
      return airdropShow
    }
    return countDown
  }, [airdropShow, countDown, currentMoment])

  return useMemo(() => <Layout title={"Airdrop"}>
    {active && chainId !== AvailableNetwork && switchNetworkTips}
    <div className={styles.airdrop}>
      {main}
      <p className={styles.end}>
        Available via contract only. Not audited. Mint at your own risk. <br/>
        For rules on airdrops, please learn through <a href="https://github.com/peopleland/discussion/discussions/16" target="_blank" rel="noreferrer" style={{color: "#625FF6"}}>proposal</a> or view the <a rel="noreferrer" href={`https://etherscan.io/address/${AirdropContractAddress}`} target="_blank" style={{color: "#625FF6"}}>contract</a>.
      </p>
    </div>
  </Layout>, [active, chainId, main, switchNetworkTips])
}

export default Airdrop;
