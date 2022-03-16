pub fun main(publicKey: String): Bool {
    let bytes = publicKey.decodeHex()
    let key = PublicKey(
      publicKey: bytes,
      signatureAlgorithm: SignatureAlgorithm.ECDSA_secp256k1
    )
    let sig = "7cce6a4920f1480cc8b00737a56b88211862897a2f16b94db00d5d59cecd09cf156f1b7bcdc21abfee2b5615f192e85d6c466f7e20beff7d6348fd4a67986806".decodeHex()
    log(sig)
    let data = "123456".decodeHex()
    log(data)
    return key.verify(signature: sig, signedData: data, domainSeparationTag: "FLOW-V0.0-user", hashAlgorithm: HashAlgorithm.SHA3_256)
}