import { POSClient, use, setProofApi } from '@maticnetwork/maticjs'
import { EthersPlugin } from '@maticnetwork/maticjs-ethers'
import { ethers } from 'ethers'

use(EthersPlugin)

export type PolygonNetwork = 'mainnet' | 'testnet'
export type PolygonVersion = 'v1' | 'v2' | 'mumbai' | 'amoy'

export interface PolygonConfigOptions {
  network?: PolygonNetwork
  version?: PolygonVersion
  from?: string
}

let posClient: POSClient | null = null

export const initPOSClient = async (opts: PolygonConfigOptions = {}) => {
  const network: PolygonNetwork = (import.meta.env.VITE_POLYGON_NETWORK as PolygonNetwork) || opts.network || 'testnet'
  const version: PolygonVersion = (import.meta.env.VITE_POLYGON_VERSION as PolygonVersion) || opts.version || 'mumbai'

  const ethereumProvider = (window as any).ethereum
  if (!ethereumProvider) {
    throw new Error('No injected provider found. Please install MetaMask.')
  }

  const web3Provider = new ethers.providers.Web3Provider(ethereumProvider)
  const signer = web3Provider.getSigner()
  const address = (opts.from || (await signer.getAddress()))

  const client = new POSClient()
  await client.init({
    network,
    version,
    parent: {
      provider: web3Provider,
      defaultConfig: { from: address },
    },
    child: {
      provider: web3Provider,
      defaultConfig: { from: address },
    },
  })

  // Optional: configure proof API for faster withdrawals if needed
  if (import.meta.env.VITE_POLYGON_PROOF_API) {
    setProofApi(import.meta.env.VITE_POLYGON_PROOF_API as string)
  }

  posClient = client
  return client
}

export const getPOSClient = () => {
  if (!posClient) throw new Error('POSClient not initialized. Call initPOSClient() first.')
  return posClient
}

// Example helpers for ERC20 operations on PoS bridge
export const depositERC20ForUser = async (tokenAddress: string, amountWei: string, userAddress: string) => {
  const client = getPOSClient()
  const erc20 = client.erc20(tokenAddress, false) // false => parent chain token
  const tx = await erc20.depositFor(userAddress, amountWei)
  return tx.getReceipt()
}

export const withdrawERC20 = async (tokenAddress: string, amountWei: string) => {
  const client = getPOSClient()
  const erc20 = client.erc20(tokenAddress, true) // true => child chain token
  const tx = await erc20.withdraw(amountWei)
  return tx.getReceipt()
}

export const balanceOfChildERC20 = async (tokenAddress: string, userAddress: string) => {
  const client = getPOSClient()
  const erc20 = client.erc20(tokenAddress, true)
  return erc20.balanceOf(userAddress)
}