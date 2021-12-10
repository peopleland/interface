import {ethers} from "ethers"
import {ADDRESS_ZERO, MintContractAddress} from "../../lib/utils"
import MintABI from '../abis/mint.json'
import {BaseContract} from "./index";

export class MintContract extends BaseContract{

  constructor(chainId: number, metamaskProvider: any) {
    super(chainId, metamaskProvider)
    this.address = MintContractAddress
    this.contract = new ethers.Contract(this.address, MintABI, this.metamaskProvider);
    this.readContract = new ethers.Contract(this.address, MintABI, this.provider);
  }

  async check() {
    const add = await this.readContract.SIGN_MESSAGE_ADDRESS
    if (!!add && add !== ADDRESS_ZERO) return
    throw new DOMException("Contract Error")
  }

  async getGivedLand(address: string) {
    console.log({givedLand: address})
    return await this.readContract.givedLand(address);
  }

  async getMintLandCount(address: string) {
    return await this.readContract.mintLandCount(address);
  }

  async getPrice() {
    return await this.readContract.PRICE()
  }

  async mintToSelf(x: string, y: string, signInfo: any) {
    await this.check()
    const signer = this.metamaskProvider.getSigner();
    const contractWithSigner = this.contract.connect(signer);
    return await contractWithSigner.mintToSelf(x, y, signInfo.hash, signInfo.v, signInfo.r, signInfo.s)
  }

  async mintAndGiveTo(x: string, y: string, givedAddress: string) {
    await this.check()
    const signer = this.metamaskProvider.getSigner();
    const contractWithSigner = this.contract.connect(signer);
    return await contractWithSigner.mintAndGiveTo(x, y, givedAddress, {value: this.getPrice()})
  }

  async mintAndGiveToWithSlogan(x: string, y: string, givedAddress: string, slogan: string) {
    await this.check()
    const signer = this.metamaskProvider.getSigner();
    const contractWithSigner = this.contract.connect(signer);
    return await contractWithSigner.mintAndGiveToWithSlogan(x, y, givedAddress, slogan, {value: this.getPrice()})
  }

  async setSlogan(x: string, y: string, slogan: string) {
    await this.check()
    const signer = this.metamaskProvider.getSigner();
    const contractWithSigner = this.contract.connect(signer);
    return await contractWithSigner.setSlogan(x, y, slogan)
  }
}
