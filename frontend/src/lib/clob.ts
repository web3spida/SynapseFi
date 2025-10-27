import { ClobClient, type ApiKeyCreds } from '@polymarket/clob-client'
import { ethers } from 'ethers'

const DEFAULT_CLOB_HOST = (import.meta.env.VITE_POLYMARKET_CLOB_API as string) || 'https://clob.polymarket.com'
const DATA_API = (import.meta.env.VITE_POLYMARKET_DATA_API as string) || 'https://data-api.polymarket.com'
const POLYGON_CHAIN_ID = 137

export type ClobConnection = {
  client: ClobClient
  creds: ApiKeyCreds
  address: string
  funder: string
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

  const funder = funderHint || await resolveProxyWallet(address)

  // In TS client: 0 => Browser wallet, 1 => Magic/email login
  const creds = await new ClobClient(host, POLYGON_CHAIN_ID, signer).createOrDeriveApiKey()
  const client = new ClobClient(host, POLYGON_CHAIN_ID, signer, creds, 0, funder)

  // Persist minimal info (avoid writing secret). Store key/passphrase only.
  try {
    const payload = { key: creds.key, passphrase: creds.passphrase, address, funder, ts: Date.now() }
    localStorage.setItem('poly_clob_creds', JSON.stringify(payload))
  } catch {}

  return { client, creds, address, funder }
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