pub fun main() {
  let key = getAccount(0xf8d6e0586b0a20c7).keys.get(keyIndex: 0)!
  let thing = String.encodeHex(key.publicKey.publicKey)
  log(thing)
}