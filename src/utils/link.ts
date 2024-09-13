import { Chain } from '../types'
import { environment } from './environments'

export function toBrowser(txid: string, chain?: Chain) {
  if (chain === 'mvc') {
    window.open(
      `https://${environment.network === 'testnet' && 'test.'}mvcscan.com/tx/${txid}`,
      '_blank',
    )

    return
  }

  window.open(
    `https://mempool.space/${environment.network === 'mainnet' ? '' : 'testnet/'}tx/${txid}`,
    '_blank',
  )

  return
}
