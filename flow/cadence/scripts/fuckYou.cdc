pub fun main(publicKey: String): Bool {
    let bytes = publicKey.decodeHex()
    let key = PublicKey(
      publicKey: bytes,
      signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
    )
    let sig = "7e6c5f7137a2746e61318b8a54b1b3b1245de0ea05f1bf255ecef6b34adb72a1b58d11fab76e49f4b36a0d562770e150c3c219d98a6ebb1a0409daa0015b158e".decodeHex()
    log(sig)
    let data = "4348414e47455f3078366330643533633637363235366538635f646973636f72645f31323334353338393130393233e37003c88eb412bcc09790603060d826c4094290170e262a578a862d422dae76".decodeHex()
    log(data)
    return key.verify(signature: sig, signedData: data, domainSeparationTag: "FLOW-V0.0-user", hashAlgorithm: HashAlgorithm.SHA3_256)
}