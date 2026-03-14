// Mantle Network
export const MANTLE_RPC = 'https://rpc.mantle.xyz'
export const MANTLE_CHAIN_ID = 5000
export const MANTLESCAN_API = 'https://api.mantlescan.xyz/api'

// Token Addresses on Mantle L2 (lowercase for mapping)
export const TOKEN_ADDRESSES: Record<string, string> = {
  '0xcda86a272531e8640cd7f1a92c01839911b90bb0': 'mETH',
  '0xe6829d9a7ee3040e1276fa75293bde931859e8fa': 'cmETH',
  '0x201eba5cc46d216ce6dc03f6a759e8e766e956ae': 'USDT',
  '0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9': 'USDC',
  '0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111': 'WETH',
}

// Protocol Contracts (for history analysis)
export const PROTOCOL_CONTRACTS: Record<string, string> = {
  '0xcda86a272531e8640cd7f1a92c01839911b90bb0': 'mETH',
  '0xe6829d9a7ee3040e1276fa75293bde931859e8fa': 'cmETH',
  // More protocols can be added as needed
}

// Aave V3 Addresses (from environment)
export const AAVE_POOL_ADDRESSES_PROVIDER = process.env.AAVE_POOL_ADDRESSES_PROVIDER
export const AAVE_UI_POOL_DATA_PROVIDER = process.env.AAVE_UI_POOL_DATA_PROVIDER
