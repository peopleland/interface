import {BigNumber, ethers} from "ethers";
import keccak256 from "keccak256";
import {MerkleTree} from "merkletreejs"
import moment from "moment";
import {ConnectorNames} from "../hooks/useWallet";
import {message} from "antd";

export function genAirdropMerkleTree(listData: any) {
    const elements = [];
    for (const address in listData) {
        const amount = listData[address].tol;
        const amountWei = BigNumber.from(10).pow(18).mul(amount);
        const value = ethers.utils.solidityPack(
            ["address", "uint256"],
            [address, amountWei]
        );
        elements.push(value);
    }

    return new MerkleTree(elements, keccak256, {
        hashLeaves: true,
        sort: true,
    });
}

export function parseTokenSvg(tokenSvg: string) {
  const json = Buffer.from(tokenSvg.substring(29), "base64").toString()
  const result = JSON.parse(json)
  return result.image
}

export function getDeltaTimestamps() {
  const utcCurrentTime = moment()
  const t1 = utcCurrentTime.subtract(1, 'day').startOf('minute').unix()
  const t2 = utcCurrentTime.subtract(2, 'day').startOf('minute').unix()
  const tWeek = utcCurrentTime.subtract(1, 'week').startOf('minute').unix()
  return [t1, t2, tWeek]
}

export function parseWalletError(e: any) {
  if (e.code === "INVALID_ARGUMENT") message.info("Argument error, please check if the address format is correct!")
  if (e.code === "CALL_EXCEPTION") message.info(`Contract error, error method=${e.method}`)
  if (e.code === "INSUFFICIENT_FUNDS") {
    if (e.method === "estimateGas") message.info(`Insufficient current address balance`)
    else message.info(`Argument error, please see console`)
  }
  if (e.code === 4001) {
    message.info("Invitation failed")
  }
  if (e.error.message) {
    if (e.error.message === "execution reverted: caller is no gived") {
      message.error("Sorry, your invitation quota has been used up")
    }
    if (e.error.message === "execution reverted: givedAddress have gived land") {
      message.error("Sorry, this address has been invited, try other address?")
    }
    if (e.error.message === "execution reverted: land is minted") {
      message.error("Sorry, this land has been minted, try other coordinates?")
    }
    if (e.error.message === "execution reverted: not in whitelist") {
      message.error("Sorry, only ConstitutionDAO donors can mint for free. You can also go to Opensea to buy a piece of land!")
    }
    if (e.error.message === "execution reverted: caller is minted or have gived") {
      message.error("Sorry, each ConstitutionDAO donors can only mint one piece of land for free. You can also go to opensea to buy a piece of land!")
    }
  }
}

export function getBlocksFromTimestamps() {

}

export function setWalletConnectorLocalStorage(name: any) {
  return localStorage.setItem("connector_name", name)
}

export function setJWTLocalStorage(jwt: any) {
  return localStorage.setItem("jwt", jwt)
}

export function getJWTLocalStorage() {
  return localStorage.getItem("jwt")
}

export function clearJWTLocalStorage() {
  return localStorage.setItem("jwt", "")
}

export function setJWTExpiredLocalStorage() {
  return localStorage.setItem("jwt_expired", (moment.now() / 1000 + 24 * 60 * 60 - 5 * 60).toString(10))
}

export function clearJWTExpiredLocalStorage() {
  return localStorage.setItem("jwt_expired", "0")
}

export function getJWTExpired() {
  const expired = localStorage.getItem("jwt_expired") || '0'
  return parseInt(expired, 10) < moment.now() / 1000
}

export function getWalletConnectorLocalStorage() {
  return localStorage.getItem("connector_name") as ConnectorNames
}

export function saveUserProfile(profile: any) {
  return localStorage.setItem("profile", JSON.stringify(profile))
}

export function getLocalUserProfile() {
  return JSON.parse(localStorage.getItem("profile") || "{}")
}

export function clearLocalUserProfile() {
  return saveUserProfile({})
}
