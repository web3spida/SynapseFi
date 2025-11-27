import { ethers } from 'ethers';

export function getProvider(): ethers.BrowserProvider {
  if (!('ethereum' in window)) throw new Error('No injected wallet found');
  return new ethers.BrowserProvider((window as any).ethereum);
}

export async function getSigner(): Promise<ethers.Signer> {
  const provider = getProvider();
  await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
  return await provider.getSigner();
}

export async function getContract<T = ethers.Contract>(address: string, abi: any): Promise<T> {
  const signer = await getSigner();
  return new ethers.Contract(address, abi, signer) as unknown as T;
}

