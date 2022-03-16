pub fun main(publicKey: String): Bool {
    let bytes = publicKey.decodeHex()
    let key = PublicKey(
      publicKey: bytes,
      signatureAlgorithm: SignatureAlgorithm.ECDSA_secp256k1
    )
    let sig = "0a046f0b342ec6db3089d545caa64257a536ff029805015f460daadc2854492f0ea6c97c0ad4ba20ba5376ce59ceb29bcc0b979efb58f812bd16b5afe50bdb88".decodeHex()
    log(sig)
    let data = "4348414e47455f3078646130396337346633323238353965325f646973636f72645f3738393031323338393938353137362a0ac0144802c33441d0fda9f381991837d3c097c060dd30dc8f90f823e28f".decodeHex()
    log(data)
    return key.verify(signature: sig, signedData: data, domainSeparationTag: "FLOW-V0.0-user", hashAlgorithm: HashAlgorithm.SHA3_256)
}