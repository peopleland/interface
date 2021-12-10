import moment from "moment";
import testAirdropList from "../../public/assets/json/test_airdrop_list.json"
import prodAirdropList from "../../public/assets/json/prod_airdrop_list.json"
import {genAirdropMerkleTree} from "./helper";

export const EthereumNetwork: any = {
    1: 'homestead',
    3: 'ropsten',
    4: 'rinkeby',
    5: 'goerli',
    42: 'kovan',
};

export const IsDEV = process.env.NEXT_PUBLIC_RUN_ENV === "DEV"

export const AvailableNetwork = process.env.NEXT_PUBLIC_RUN_ENV === "DEV" ? 3 : 1

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const ProdMintContractAddress = "0xD1d30B80C5EFB9145782634fe0F9cbeD5D24ef3b"
const TestMintContractAddress = "0xac6faA8065c6aC2FbF42ac21553F64c00181BD40"
export const MintContractAddress = IsDEV ? TestMintContractAddress : ProdMintContractAddress

export const BeginMintDatetime = moment.unix(1637933358)

export const BeginAirdropDatetime = IsDEV ? moment.unix(0) : moment.unix(1639282332)
export const EndAirdropDatetime = moment.unix(1670818332)
export const AirdropList: any = IsDEV ? testAirdropList : prodAirdropList
export const AirdropMerkleTree = genAirdropMerkleTree(AirdropList)

const ProdAirdropContractAddress = "0x0000000000000000000000000000000000000000"
const TestAirdropContractAddress = "0xD1d30B80C5EFB9145782634fe0F9cbeD5D24ef3b"
export const AirdropContractAddress = IsDEV ? TestAirdropContractAddress : ProdAirdropContractAddress
