import {BigNumber, ethers} from "ethers";
import keccak256 from "keccak256";
import {MerkleTree} from "merkletreejs"
import moment from "moment";

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
  return localStorage.setItem("jwt_expired", (moment.now() + 24 * 60 * 60 - 5 * 60).toString())
}

export function clearJWTExpiredLocalStorage() {
  return localStorage.setItem("jwt_expired", "0")
}

export function getJWTExpired() {
  const expired = localStorage.getItem("jwt_expired") || '0'
  return parseInt(expired, 10) <= moment.now()
}

export function getWalletConnectorLocalStorage() {
  return localStorage.getItem("connector_name")
}
