import styles from "../styles/Home.module.css"
import {MintContract} from "../app/contract/mintContract"
import Guide from "../../public/assets/images/guide.jpeg"
import Land from "../../public/assets/images/land.png"
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import prodWhiteAddress from "../../public/assets/json/prod_address_sign_info.json";
import testWhiteAddress from "../../public/assets/json/test_address_sign_info.json";
import moment from "moment";
import {BeginMintDatetime, MintContractAddress} from "../lib/utils";
import Layout from "../components/layout";
import Button from "../components/button";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {NextPage} from "next";
import Image from 'next/image'
import {useLandsLazyQuery} from "../app/subgraph-v1/generated";
import {parseTokenSvg} from "../lib/helper";

const Home: NextPage = () => {
  const { library, account, chainId } = useWeb3React();

  const [isGived, setIsGived] = useState<boolean>(false);
  const [landCount, setLandCount] = useState<number>(0);
  const [currentMoment, setCurrentMoment] = useState(moment());
  const [inWhiteList, setInWhiteList] = useState(false);

  const [mintX, setMintX] = useState("");
  const [mintY, setMintY] = useState("");
  const [inviteX, setInviteX] = useState("");
  const [inviteY, setInviteY] = useState("");
  const [inviteAddress, setInviteAddress] = useState("");
  const [inviteSlogan, setInviteSlogan] = useState("");

  const [customSlogan, setCustomSlogan] = useState("");
  const [customSelectLand, setCustomSelectLand] = useState(0);

  const [loadingMint, setLoadingMint] = useState<boolean>(false);
  const [loadingInvite, setLoadingInvite] = useState<boolean>(false);
  const [loadingCustomSlogan, setLoadingCustomSlogan] = useState<boolean>(false);

  const handleChangeInput = useCallback((e, setFunc) => {
    const v = e.target.value
    setFunc(v.replace(/[^0-9-]/ig,""))
  }, [])

  const whiteAddress: any = useMemo(() => {
    return process.env.NEXT_PUBLIC_RUN_ENV === "DEV" ? testWhiteAddress : prodWhiteAddress
  }, [])

  useEffect(() => {
    setInterval(() => {
      setCurrentMoment(moment())
    }, 1000)
  }, [])

  const contract = useMemo(() => {
    if (!chainId || !library) return null
    return new MintContract(chainId, library)
  },[chainId, library])

  const [getLandsByAccount, landsResult] = useLandsLazyQuery()

  useEffect(() => {
    if (!account) return
    getLandsByAccount({variables: {owner: account.toLowerCase()}})
  }, [account, getLandsByAccount])

  useEffect(() => {
    if (!contract || !account) return
    console.log({isGived: contract.address})
    contract.getGivedLand(account).then((ret) => {
      setIsGived(ret.isGived)
    })
  }, [account, contract, loadingMint])

  useEffect(() => {
    if (!account) return
    setInWhiteList(!!whiteAddress[account.toLowerCase()])
  }, [account, whiteAddress])

  const canMint = useMemo(() => {
    return !isGived && inWhiteList;
  }, [isGived, inWhiteList])

  useEffect(() => {
    if (!isGived || !account || !contract) return
    contract.getMintLandCount(account).then((v) => {
      setLandCount(v)
    })
  }, [isGived, account, contract, loadingInvite, loadingMint])

  const canInvite = useMemo(() => {
    return isGived && landCount < 2;
  }, [isGived, landCount])

  const canCustomSlogan = useMemo(() => {
    return landsResult.data?.tokenInfos && landsResult.data?.tokenInfos.length > 0
  }, [landsResult.data?.tokenInfos])

  const mintText = useMemo(() => {
    if (BeginMintDatetime.isSameOrBefore(currentMoment)) {
      return <></>
    }
    return <p className={styles.mintRemindTitle}>There is still time before the MINT starts...</p>
  }, [currentMoment])

  const handleMint = useCallback(() => {
    if (!contract || !account) return
    setLoadingMint(true)
    contract.mintToSelf(mintX, mintY, whiteAddress[account.toLowerCase()]).then((tx) => {
      setMintX("")
      setMintY("")
      tx.wait().then().catch().finally(() => setLoadingMint(false))
    }).catch((e) => {
      console.log(e)
      setLoadingMint(false)
    })
  }, [contract, mintX, mintY, account, whiteAddress])

  const handleInvite = useCallback(() => {
    if (!contract) return
    setLoadingInvite(true)
    if (inviteSlogan !== "") {
      contract.mintAndGiveToWithSlogan(inviteX, inviteY, inviteAddress, inviteSlogan).then((tx) => {
        setInviteX("")
        setInviteY("")
        setInviteAddress("")
        setInviteSlogan("")
        tx.wait().then().catch().finally(() => setLoadingInvite(false))
      }).catch((e) => {
        console.log(e)
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
      setLoadingInvite(false)
    })
  }, [contract, inviteY, inviteX, inviteAddress, inviteSlogan])

  const handleCustomSlogan = useCallback(() => {
    if (!contract) return
    setLoadingCustomSlogan(true)
    const tokenInfo = landsResult.data?.tokenInfos[customSelectLand]
    if (tokenInfo) {
      contract.setSlogan(tokenInfo.x, tokenInfo.y, customSlogan).then((tx) => {
        setCustomSlogan(landsResult.data?.tokenInfos[0].slogan || "")
        setCustomSelectLand(0)
        tx.wait().then().catch().finally(() => setLoadingCustomSlogan(false))
      }).catch((e) => {
        console.log(e)
        setLoadingCustomSlogan(false)
      })
    }
  }, [contract, customSelectLand, customSlogan, landsResult.data?.tokenInfos])

  const mintDom = useMemo(() => {
    if (BeginMintDatetime.isSameOrBefore(currentMoment)) {
      return <>
        <p className={styles.mintDesc}>
          Link your Metamask wallet. <br/>
          The system will recognize that you are an original donor.<br/>
          The &quot;free mint&quot; button will be activated, enter the x & y axis that you want to mint, check your gas fee and it&apos;s done!<br/>
          Note: Some coordinates have been minted, see here at <a rel="noreferrer" href="https://opensea.io/collection/people-land" target="_blank" style={{color: "#625FF6"}}>Opensea</a>.
        </p>
        <div className={styles.inputs}>
          <div className={styles.inputContent}>
              <span className={styles.inputWrapper + ` ${!canMint && styles.inputDisabled}`}>
                <span className={styles.inputPrefix + ` ${!canMint && styles.inputDisabled}`}>📜X:</span>
                <input
                  disabled={!canMint}
                  className={styles.input + ` ${!canMint && styles.inputDisabled}`}
                  type="text"
                  value={mintX}
                  onChange={e => handleChangeInput(e, setMintX)}
                />
              </span>
          </div>
          <div className={styles.inputContent}>
              <span className={styles.inputWrapper + ` ${!canMint && styles.inputDisabled}`}>
                <span className={styles.inputPrefix + ` ${!canMint && styles.inputDisabled}`}>📜Y:</span>
                <input disabled={!canMint} className={styles.input + ` ${!canMint && styles.inputDisabled}`}
                       value={mintY}
                       onChange={e => handleChangeInput(e, setMintY)}
                       type="text"/>
              </span>
          </div>
        </div>
        <Button disabled={!canMint} onClick={handleMint} loading={loadingMint}>Free Mint</Button>
      </>
    }
    const diff = moment.duration(BeginMintDatetime.diff(currentMoment, 'seconds'), 'seconds').locale("en")

    return <div className={styles.countDownContent}>
      <div className={styles.countDown}>
        <div className={styles.countDownTitle}>Days</div>
        <div className={styles.countDownText}>{diff.days()}</div>
      </div>
      <div className={styles.countDown}>
        <div className={styles.countDownTitle}>Hours</div>
        <div className={styles.countDownText}>{diff.hours()}</div>
      </div>
      <div className={styles.countDown}>
        <div className={styles.countDownTitle}>Minutes</div>
        <div className={styles.countDownText}>{diff.minutes()}</div>
      </div>
      <div className={styles.countDown}>
        <div className={styles.countDownTitle}>Seconds</div>
        <div className={styles.countDownText}>{diff.seconds()}</div>
      </div>
    </div>
  }, [currentMoment, canMint, handleChangeInput, mintX, mintY, handleMint, loadingMint])

  const inviteDom = useMemo(() => {
    if (BeginMintDatetime.isSameOrBefore(currentMoment)) {
      return <>
        <div className={styles.mintText}>
          <div className={styles.mintLine} />
          <div className={styles.mintTitle}>INVITE</div>
          <div className={styles.mintLine} />
        </div>
        <p className={styles.inviteDesc}>
          You can only invite by owning PeopleLand. <br/>
          Invitation cost is 0.66 ETH to mint. Enter the x & y axis that you want to mint, provide a slogan, ETH address of the neighbor you are inviting, check your gas fee and it&apos;s done!<br/>
          Note: Once you have used both your invitations you will no longer be able to invite another PEOPLE to PeopleLand.
        </p>
        <div className={styles.inputs}>
          <div className={styles.inputContent}>
              <span className={styles.inputWrapper + ` ${!canInvite && styles.inputDisabled}`}>
                <span className={styles.inputPrefix + ` ${!canInvite && styles.inputDisabled}`}>📜X:</span>
                <input disabled={!canInvite} className={styles.input + ` ${!canInvite && styles.inputDisabled}`}
                       value={inviteX}
                       onChange={e => handleChangeInput(e, setInviteX)}
                       type="text"/>
              </span>
          </div>
          <div className={styles.inputContent}>
              <span className={styles.inputWrapper + ` ${!canInvite && styles.inputDisabled}`}>
                <span className={styles.inputPrefix + ` ${!canInvite && styles.inputDisabled}`}>📜Y:</span>
                <input disabled={!canInvite} className={styles.input + ` ${!canInvite && styles.inputDisabled}`}
                       value={inviteY}
                       onChange={e => handleChangeInput(e, setInviteY)}
                       type="text"/>
              </span>
          </div>
        </div>
        <div className={styles.inviteAddressInput}>
          <div className={styles.inviteAddressInputContent}>
              <span className={styles.inviteAddressInputWrapper + ` ${!canInvite && styles.inputDisabled}`}>
                <span className={styles.inputPrefix + ` ${!canInvite && styles.inputDisabled}`}>📜Give to address:</span>
                <input disabled={!canInvite} className={styles.input + ` ${!canInvite && styles.inputDisabled}`}
                       value={inviteAddress}
                       onChange={e => setInviteAddress(e.target.value)}
                       type="text"/>
              </span>
          </div>
        </div>
        <div className={styles.inviteAddressInput}>
          <div className={styles.inviteAddressInputContent}>
              <span className={styles.inviteAddressInputWrapper + ` ${!canInvite && styles.inputDisabled}`}>
                <span className={styles.inputPrefix + ` ${!canInvite && styles.inputDisabled}`}>📜Slogan:</span>
                <input disabled={!canInvite} className={styles.input + ` ${!canInvite && styles.inputDisabled}`}
                       value={inviteSlogan}
                       onChange={e => setInviteSlogan(e.target.value)}
                       type="text"/>
              </span>
          </div>
        </div>
        <Button disabled={!canInvite} loading={loadingInvite} onClick={handleInvite}>Invite 0.66ETH</Button>
      </>
    }
    return <></>
  }, [currentMoment, canInvite, inviteX, inviteY, inviteAddress, inviteSlogan, handleInvite, loadingInvite, handleChangeInput])

  const customSelectLandChange = useCallback((currentIndex: number) => {
    setCustomSelectLand(currentIndex)
    if (landsResult.data?.tokenInfos[currentIndex]) setCustomSlogan(landsResult.data.tokenInfos[currentIndex].slogan || '')
  }, [landsResult?.data?.tokenInfos])

  const landCarousel = useMemo(() => {
    if (!landsResult.data?.tokenInfos) return <></>
    return <div className={styles.sloganCarousel}>
      <Carousel showThumbs={false} showStatus={false} width={"500px"} showIndicators={false} infiniteLoop={true} selectedItem={customSelectLand} onChange={customSelectLandChange}>
        {landsResult.data.tokenInfos.map((land, index) => {
          return <div key={index}>
            <Image className={styles.sloganCarouselImage} src={parseTokenSvg(land.tokenSvg || '')} alt={land.id} width="360" height="360" />
            <div className={styles.sloganCarouselFrame} />
          </div>
        })}
      </Carousel>
    </div>
  }, [customSelectLand, customSelectLandChange, landsResult?.data?.tokenInfos])

  const sloganDom = useMemo(() => {
    if (BeginMintDatetime.isSameOrBefore(currentMoment)) {
      return <>
        <div className={styles.mintText}>
          <div className={styles.mintLine} />
          <div className={styles.mintTitle}>SLOGAN</div>
          <div className={styles.mintLine} />
        </div>
        {landCarousel}
        <p className={styles.sloganDesc}>
          You may change your slogan whenever you like. <br/>
          What description would you like to provide for your slogan?
        </p>
        <div className={styles.inviteAddressInput}>
          <div className={styles.inviteAddressInputContent}>
              <span className={styles.inviteAddressInputWrapper + ` ${!canInvite && styles.inputDisabled}`}>
                <span className={styles.inputPrefix + ` ${!canInvite && styles.inputDisabled}`}>📜Slogan:</span>
                <input disabled={!canInvite} className={styles.input + ` ${!canInvite && styles.inputDisabled}`}
                       value={customSlogan}
                       onChange={e => setCustomSlogan(e.target.value)}
                       type="text"/>
              </span>
          </div>
        </div>
        <Button disabled={!canCustomSlogan} loading={loadingCustomSlogan || landsResult.loading} onClick={handleCustomSlogan}>Submit</Button>
      </>
    }
    return <></>
  }, [canCustomSlogan, canInvite, currentMoment, customSlogan, handleCustomSlogan, landCarousel, landsResult.loading, loadingCustomSlogan])

  return useMemo(() => <Layout>
    <p className={styles.title}>PEOPLELAND</p>
    <p className={styles.scroll}>(📜,📜)</p>
    <p className={styles.desc}>For the PEOPLE of ConstitutionDAO who made history</p>
    <div className={styles.content}>
      <p className={styles.subtitle}>Rules</p>
      <p className={styles.subcontent}>
        Donors are free to mint a piece of land with no fee <br/>
        A person who has obtained &apos;land&apos; is now PEOPLE<br/>
        A PEOPLE is allowed to invite at most two other persons<br/>
        To invite a person you can mint land and provide that to him/her<br/>
        The cost to mint for invitations is {BeginMintDatetime.isSameOrBefore(currentMoment) ? `0.66ETH(average donation amount)` : `？？？`}<br/>
        25 plots of land around the central 0 point, reserved by the builder<br/>
        mint for Invitation can only choose outside the red area
      </p>
      <div><Image className={styles.landImg} src={Land} alt="land" width="132" height="132" /></div>
      <p className={styles.subcontent}>
        Only one person can be the owner of a piece of land<br/>
        Each person can only accept an invitation once
      </p>
      <p className={styles.subtitle}>Neighbors</p>
      <p className={styles.subcontent}>
        PEOPLELAND saves invitations and neighbor&apos;s relationships forever.<br/>
        Getting an invitation is an honor and the value of land is determined by neighoring land, be careful to invite neighbors!
      </p>
      <p className={styles.subtitle}>Explaination</p>
      <p className={styles.subcontent}>
        Land is a space with (x,y) coordinates. The positive x is east and the negative is west, the positive y is north and the negative is south. Each value of x and y can only be a numerical whole number, there is no limit to the maximum possible range and every coordinate position represents an area of 100 x 100 square meters.
      </p>
      <p className={styles.subtitle}>What can we do?</p>
      <p className={styles.subcontent}>Feel free to use PEOPLELAND in any way you want.</p>
      <p className={styles.subtitle}>Update Image</p>
      <p className={styles.subcontent}>Click the refresh button on your PEOPLELAND when on OpenSea to view the changes in your neighborhood!</p>
      <div><Image className={styles.guideImg} src={Guide} alt="guide opensea" height="182" width="384"/></div>
    </div>
    <div className={styles.mintText}>
      <div className={styles.mintLine} />
      <div className={styles.mintTitle}>MINT</div>
      <div className={styles.mintLine} />
    </div>
    {mintText}
    {mintDom}
    {inviteDom}
    {sloganDom}
    <p className={styles.end}>
      Available via contract only. Not audited. Mint at your own risk. <br/>
      For any questions about invitations join the discord server, or <a rel="noreferrer" href={`https://etherscan.io/address/${MintContractAddress}`} target="_blank" style={{color: "#625FF6"}}>view the contract</a>
    </p>
  </Layout>, [currentMoment, inviteDom, mintDom, mintText, sloganDom])
}

export default Home
