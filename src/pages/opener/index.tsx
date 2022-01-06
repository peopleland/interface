import Image from "next/image"
import styles from "../../styles/Opener.module.css"
import Header from "../../../public/assets/images/opener_header.png"
import Layout from "../../components/layout";
import {useCallback, useEffect, useMemo, useState} from "react";
import moment from "moment";
import {BeginOpenerGameDatetime} from "../../lib/utils";
import {useWeb3React} from "@web3-react/core";
import {useAppDispatch} from "../../store/hooks";
import {actionModal} from "../../store/walletModal";
import {getJWTExpired, getJWTLocalStorage} from "../../lib/helper";
import {actionSign} from "../../store/signAction";
import {useRouter} from "next/router";
import {LoadingOutlined} from "@ant-design/icons";

const Opener = () => {
  const [currentMoment, setCurrentMoment] = useState(moment());
  const [goLinkLoading, setGoLinkLoading] = useState<boolean>(false);
  const { active } = useWeb3React();
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    setInterval(() => {
      setCurrentMoment(moment())
    }, 1000)
  }, [])

  useEffect(() => {
    if (BeginOpenerGameDatetime.isSameOrBefore(currentMoment)) {
      if (router.query.invite_code) {
        router.push("/opener/game?invite_code="+router.query.invite_code)
      } else {
        router.push("/opener/game")
      }
    }
  }, [currentMoment, router])

  const diffDatetime = useMemo(() => {
    if (BeginOpenerGameDatetime.isSameOrBefore(currentMoment)) {
      return moment.duration(0)
    }
    return moment.duration(BeginOpenerGameDatetime.diff(currentMoment, 'seconds'), 'seconds').locale("en")
  }, [currentMoment])

  const countDown = useMemo(() => {
    return <>
      <p className={styles.gameStartTitle}>There is still time before the GAME starts ...</p>
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

  const handlerGoInvitation = useCallback(() => {
    setGoLinkLoading(true)
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

  return <Layout title="Opener" active={"opener"}>
    <div className={styles.opener}>
      <div className={styles.headerImg}><Image src={Header} height={548} width={492} alt={"Opener"}  /></div>
      <div className={styles.rewardTitle}>50,000 $BUILDER + ??? $ETH</div>
      <div className={styles.rewardDesc}>(To be unveiled)</div>
      <div className={styles.bigTitle}>For 24 hours Opener</div>
      <div className={styles.desc}>
        When the clock struck 2022, the gate of PEOPLELAND was revealed and 759 landowners waited at the door to welcome the Opener. The treasure chest at the door emits a dazzling golden light, and the Opener who has been waiting hard for 24 hours at the door, opens the treasure chest of the mysterious continent and takes away all the treasures... <br/><br/>
        Guys, are you ready to be the Opener?
      </div>
      <div className={styles.ruleTitle}>Rules</div>
      <div className={styles.ruleQuestion}>Who can get reward?</div>
      <div className={styles.ruleDesc} style={{maxWidth: '700px'}}>
        If you keep playing as an Opener for more than 24 hours, you will open the treasure chest and get the reward <br/>
        Opener get 60% (30,000 $BUILDER + ??? $ETH) <br/>
        Opener&apos;s inviter get 40% (20,000 $BUILDER + ??? $ETH)
      </div>
      <div className={styles.ruleQuestion}>How can I be an opener?</div>
      <div className={styles.ruleDesc}>The last one to Mint PEOPLELAND</div>
      <div className={styles.ruleQuestion}>How can I be an inviter?</div>
      <div className={styles.ruleDesc} style={{maxWidth: '900px', marginBottom: "40px"}}>
        <span style={{fontWeight: 700}}>First way:</span> The owner of PEOPLELAND NFT gets the invitation link here, then sends the invitation link to a donor of ConstitutionDAO who has not yet minted, and he/she becomes an inviter once the other person has successfully minted <br/>
        <span style={{fontWeight: 700}}>Second way:</span> The owner of PEOPLELAND NFT Invite anyone for 0.66 ETH
      </div>
      <div>
        <a className={styles.detailLink} href="https://peopleland.notion.site/Opener-game-rules-97f84ecf2e9e44428299a6ea1286921e" target={"_blank"} rel="noreferrer">For details, please see {">>>"} </a>
      </div>
      <div>
        <a className={styles.detailLink} onClick={handlerGoInvitation}>Get invitation link {">>>"}</a>
      </div>
      <div style={{marginTop: "20px"}}>
        {goLinkLoading && <LoadingOutlined style={{fontSize: 20}} />}
      </div>
      <div>
        {countDown}
      </div>
    </div>
  </Layout>
}


export default Opener;
