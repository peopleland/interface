import Image from "next/image"
import styles from "../styles/Opener.module.css"
import Header from "../../public/assets/images/opener_header.png"
import Layout from "../components/layout";

const Opener = () => {
  return <Layout title="Opener" active={"opener"}>
    <div className={styles.opener}>
      <div className={styles.headerImg}><Image src={Header} height={548} width={492} alt={"Opener"}  /></div>
      <div className={styles.rewardTitle}>50,000 $BUILDER + ??? $ETH</div>
      <div className={styles.rewardDesc}>(To be unveiled)</div>
      <div className={styles.bigTitle}>For 24 hours Opener</div>
      <div className={styles.desc}>
        When the clock strikes 2022, the gate to the world of PEOPLELAND will appear in a shimmering light, and 759 landowner will be waiting at the gate to welcome the door opener. The new land lord with the invitation in his hand is the only magic weapon to open the gate; the moment the gate opens, the lucky treasure chest falls from the sky, emitting a dazzling golden light, the last door opener who has been waiting at the gate for 24 hours, he reads &quot;Open Sesame&quot; and opens the treasure chest of the mysterious continent, taking all the treasures... <br/><br/>
        Honey, are you ready to be the door opener?
      </div>
      <div className={styles.ruleTitle}>Rules</div>
      <div className={styles.ruleQuestion}>Who can get reward?</div>
      <div className={styles.ruleDesc} style={{maxWidth: '680px'}}>
        If you keep playing as an Opener for more than 24 hours, you will open the treasure chest and get the reward <br/>
        Opener get 60% (30,000 $BUILDER + ??? $ETH) <br/>
        Opener&apos;s inviter get 40% (20,000 $BUILDER + ??? $ETH)
      </div>
      <div className={styles.ruleQuestion}>How can I be an opener?</div>
      <div className={styles.ruleDesc}>The last one to Mint PEOPLELAND</div>
      <div className={styles.ruleQuestion}>How can I be an inviter?</div>
      <div className={styles.ruleDesc} style={{maxWidth: '900px', marginBottom: "80px"}}>
        The first way: The owner of PEOPLELAND clicks here to get the invitation link and then sends the invitation link to the donor of ConstitutionDAO who has not yet minted the land, once the other party successfully minted the land, he/she becomes the invitee <br/>
        The second way: The owner of PEOPLELAND invites anyone using the 0.66 <span style={{fontWeight: "700"}}>$ETH</span> method
      </div>
    </div>
  </Layout>
}


export default Opener;
