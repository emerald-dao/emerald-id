export function transformWalletNameToUrl(wallet) {
  return wallet.toLowerCase().replaceAll(' ', '-');
}