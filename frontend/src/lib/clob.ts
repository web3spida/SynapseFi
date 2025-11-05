import { ClobClient, type ApiKeyCreds } from '@polymarket/clob-client'
import { ethers } from 'ethers'

const DEFAULT_CLOB_HOST = (import.meta.env.VITE_POLYMARKET_CLOB_API as string) || 'https://clob.polymarket.com'
const DATA_API = (import.meta.env.VITE_POLYMARKET_DATA_API as string) || 'https://data-api.polymarket.com'
const POLYGON_CHAIN_ID = 137
const POLYGON_CHAIN_HEX = '0x89'

export type ClobConnection = {
  client: ClobClient
  creds: ApiKeyCreds
  address: string
  funder: string
}

async function getChainIdHex(eth: any): Promise<string> {
  try {
    return await eth.request({ method: 'eth_chainId' })
  } catch {
    return ''
  }
}

async function switchToPolygonMainnet(eth: any) {
  try {
    await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: POLYGON_CHAIN_HEX }] })
  } catch (switchError: any) {
    if (switchError?.code === 4902) {
      await eth.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: POLYGON_CHAIN_HEX,
          chainName: 'Polygon Mainnet',
          nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
          rpcUrls: ['https://polygon-rpc.com', 'https://rpc.ankr.com/polygon'],
          blockExplorerUrls: ['https://polygonscan.com'],
        }],
      })
      await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: POLYGON_CHAIN_HEX }] })
    } else {
      throw switchError
    }
  }
}

export async function resolveProxyWallet(eoa: string): Promise<string> {
  const url = new URL('/activity', DATA_API)
  url.searchParams.set('user', eoa)
  url.searchParams.set('limit', '1')

  try {
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const proxy = data?.[0]?.proxyWallet as string | undefined
    return (proxy && ethers.utils.isAddress(proxy)) ? proxy : eoa
  } catch {
    return eoa
  }
}

export async function connectClobViaBrowser(funderHint?: string, host: string = DEFAULT_CLOB_HOST): Promise<ClobConnection> {
  const eth = (window as any).ethereum
  if (!eth) throw new Error('No injected provider (MetaMask) found')

  const provider = new ethers.providers.Web3Provider(eth)
  const signer = provider.getSigner()
  const address = await signer.getAddress()

  const prevChain = await getChainIdHex(eth)
  const needsSwitch = prevChain?.toLowerCase() !== POLYGON_CHAIN_HEX

  // Temporarily switch to Polygon Mainnet for EIP-712 signing (CLOB requires chainId 137)
  if (needsSwitch) {
    await switchToPolygonMainnet(eth)
  }

  try {
    const funder = funderHint || await resolveProxyWallet(address)

    // 0 => Browser wallet (MetaMask, Coinbase Wallet, etc)
    const creds = await new ClobClient(host, POLYGON_CHAIN_ID, signer).createOrDeriveApiKey()
    const client = new ClobClient(host, POLYGON_CHAIN_ID, signer, creds, 0, funder)

    // Persist minimal info (avoid writing secret). Store key/passphrase only.
    try {
      const payload = { key: creds.key, passphrase: creds.passphrase, address, funder, ts: Date.now() }
      localStorage.setItem('poly_clob_creds', JSON.stringify(payload))
    } catch {}

    return { client, creds, address, funder }
  } finally {
    // Switch back to the previous chain if we changed it (e.g., Amoy testnet)
    if (needsSwitch && prevChain) {
      try {
        await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: prevChain }] })
      } catch {
        // non-fatal if the user declines switching back
      }
    }
  }
}

export function getSavedClobCreds(): { key: string; passphrase: string; address: string; funder: string; ts: number } | null {
  try {
    const raw = localStorage.getItem('poly_clob_creds')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.key || !parsed?.passphrase) return null
    return parsed
  } catch {
    return null
  }
}

export async function reconnectClobWithSavedCreds(host: string = DEFAULT_CLOB_HOST): Promise<ClobConnection | null> {
  const saved = getSavedClobCreds()
  if (!saved) return null

  const eth = (window as any).ethereum
  if (!eth) throw new Error('No injected provider (MetaMask) found')

  // Reuse current chain and signer; no chain switch required for reconnect
  const provider = new ethers.providers.Web3Provider(eth)
  const signer = provider.getSigner()

  const creds: ApiKeyCreds = { key: saved.key, passphrase: saved.passphrase } as ApiKeyCreds
  const client = new ClobClient(host, POLYGON_CHAIN_ID, signer, creds, 0, saved.funder)

  return { client, creds, address: saved.address, funder: saved.funder }
}

export function clearSavedClobCreds() {
  try { localStorage.removeItem('poly_clob_creds') } catch {}
}