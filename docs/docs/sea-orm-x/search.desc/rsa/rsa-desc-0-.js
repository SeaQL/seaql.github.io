searchState.loadedDescShard("rsa", 0, "RustCrypto: RSA\nA big unsigned integer type.\nContains the precomputed Chinese remainder theorem values.\nMaximum value of the public exponent <code>e</code>.\nMaximum size of the modulus <code>n</code> in bits.\nMinimum value of the public exponent <code>e</code>.\nRepresents a whole RSA key, public and private parts.\nRepresents the public part of an RSA key.\nAssign a value to a <code>BigUint</code>.\nReturns the ceil value of the average of <code>self</code> and <code>other</code>.\nReturns the floor value of the average of <code>self</code> and <code>other</code>.\nDetermines the fewest bits necessary to express the <code>BigUint</code>…\nReturns the truncated principal cube root of <code>self</code> – see …\nClears precomputed values by setting to None\nCompute CRT coefficient: <code>(1/q) mod p</code>.\nDecrypt the given message.\nDecrypt the given message.\nDeprecated, use <code>is_multiple_of</code> instead.\nEncrypt the given message.\nError types.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nCreates and initializes a <code>BigUint</code>.\nCreates and initializes a <code>BigUint</code>.\nConstructs an RSA key pair from individual components:\nConstructs an RSA key pair from its two primes p and q.\nConstructs an RSA key pair from its primes.\nCreates and initializes a <code>BigUint</code>. Each u8 of the input …\nCreates and initializes a <code>BigUint</code>. Each u8 of the input …\nCreates and initializes a <code>BigUint</code>.\nCreates and initializes a <code>BigUint</code>.\nCreates and initializes a <code>BigUint</code>.\nCalculates the Greatest Common Divisor (GCD) of the number …\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nReturns <code>true</code> if the number is divisible by <code>2</code>.\nReturns <code>true</code> if the number is a multiple of <code>other</code>.\nReturns <code>true</code> if the number is not divisible by <code>2</code>.\nCalculates the Lowest Common Multiple (LCM) of the number …\nReturns <code>(self ^ exponent) % modulus</code>.\nCreate a new public key from its components.\nGenerate a new Rsa key pair of the given bit size using …\nCreates and initializes a <code>BigUint</code>.\nCreates and initializes a <code>BigUint</code>.\nCreate a new public key, bypassing checks around the …\nGenerate a new RSA key pair of the given bit size and the …\nCreate a new public key from its components.\nReturns the truncated principal <code>n</code>th root of <code>self</code> – see …\nEncryption and Decryption using OAEP padding.\nCreates and initializes a <code>BigUint</code>. The input slice must …\nPKCS#1 v1.5 support as described in RFC8017 § 8.2.\nPerforms some calculations to speed up private key …\nSupport for the Probabilistic Signature Scheme (PSS) …\nSets the value to the provided digit, reusing internal …\nSign the given digest.\nSign the given digest using the provided <code>rng</code>, which is …\nReturns the truncated principal square root of <code>self</code> – …\nReturns the byte representation of the <code>BigUint</code> in …\nReturns the byte representation of the <code>BigUint</code> in …\nGet the public key from the private key, cloning <code>n</code> and <code>e</code>.\nReturns the integer in the requested base in big-endian …\nReturns the integer in the requested base in little-endian …\nReturns the integer formatted as a string in the given …\nRSA-related trait definitions.\nPerforms basic sanity checks on the key. Returns <code>Ok(())</code> if …\nVerify a signed message.\nDecryption error.\nContains the error value\nError types\nInput must be hashed.\nInternal error.\nInvalid arguments.\nInvalid coefficient.\nInvalid exponent.\nInvalid modulus.\nInvalid padding length.\nInvalid padding scheme.\nInvalid prime value.\nLabel too long.\nMessage too long.\nModulus too large.\nNumber of primes must be 2 or greater.\nContains the success value\nPKCS#1 error.\nPKCS#8 error.\nPublic exponent too large.\nPublic exponent too small.\nAlias for <code>core::result::Result</code> with the <code>rsa</code> crate’s <code>Error</code>…\nToo few primes of a given length to generate an RSA key.\nVerification error.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nDecryption key for PKCS#1 v1.5 decryption as described in …\nEncryption key for PKCS#1 v1.5 encryption as described in …\nEncryption and Decryption using OAEP padding.\nDigest type to use.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nOptional label.\nDigest to use for Mask Generation Function (MGF).\nCreate a new OAEP <code>PaddingScheme</code>, using <code>T</code> as the hash …\nCreate a new verifying key from an RSA public key.\nCreate a new verifying key from an RSA public key.\nCreate a new OAEP <code>PaddingScheme</code> with an associated <code>label</code>, …\nCreate a new verifying key from an RSA public key using …\nCreate a new verifying key from an RSA public key using …\nCreate a new OAEP <code>PaddingScheme</code>, using <code>T</code> as the hash …\nCreate a new OAEP <code>PaddingScheme</code> with an associated <code>label</code>, …\nDecryption key for PKCS#1 v1.5 decryption as described in …\nEncryption key for PKCS#1 v1.5 encryption as described in …\nThe OID associated with this type.\nEncryption using PKCS#1 v1.5 padding.\n<code>RSASSA-PKCS1-v1_5</code>: digital signatures using PKCS#1 v1.5 …\nA trait which associates an RSA-specific OID with a type.\n<code>RSASSA-PKCS1-v1_5</code> signatures as described in RFC8017 § 8.2…\nSigning key for <code>RSASSA-PKCS1-v1_5</code> signatures as described …\nVerifying key for <code>RSASSA-PKCS1-v1_5</code> signatures as …\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nLength of hash to use.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCreate a new verifying key from an RSA public key.\nCreate a new verifying key from an RSA public key.\nCreate a new signing key with a prefix for the digest <code>D</code>.\nCreate a new verifying key with a prefix for the digest <code>D</code>.\nCreate new PKCS#1 v1.5 padding for the given digest.\nCreate new PKCS#1 v1.5 padding for computing an unprefixed …\nCreate a new signing key from the give RSA private key …\nCreate a new verifying key from an RSA public key with an …\nCreate new PKCS#1 v1.5 padding for computing an unprefixed …\nCreate a new signing key with a prefix for the digest <code>D</code>.\nCreate a new verifying key with a prefix for the digest <code>D</code>.\nPrefix.\nGenerate a new signing key with a prefix for the digest <code>D</code>.\nGenerate a new signing key with an empty prefix.\nGenerate a new signing key with a prefix for the digest <code>D</code>.\nSigning key for producing “blinded” RSASSA-PSS …\nDigital signatures using PSS padding.\nRSASSA-PSS signatures as described in RFC8017 § 8.1.\nSigning key for producing RSASSA-PSS signatures as …\nVerifying key for checking the validity of RSASSA-PSS …\nCreate blinded signatures.\nDigest type to use.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the argument unchanged.\nReturns the <code>AlgorithmIdentifierOwned</code> associated with PSS …\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nCalls <code>U::from(self)</code>.\nNew PSS padding for the given digest. Digest output size …\nCreate a new RSASSA-PSS signing key which produces “…\nCreate a new RSASSA-PSS signing key. Digest output size is …\nCreate a new RSASSA-PSS verifying key. Digest output size …\nNew PSS padding for blinded signatures (RSA-BSSA) for the …\nNew PSS padding for blinded signatures (RSA-BSSA) for the …\nNew PSS padding for the given digest with a salt value of …\nCreate a new RSASSA-PSS signing key which produces “…\nCreate a new RSASSA-PSS signing key with a salt of the …\nCreate a new RSASSA-PSS verifying key.\nCreate a new random RSASSA-PSS signing key which produces …\nGenerate a new random RSASSA-PSS signing key. Digest …\nCreate a new random RSASSA-PSS signing key which produces …\nGenerate a new random RSASSA-PSS signing key with a salt …\nReturn specified salt length for this key\nReturn specified salt length for this key\nSalt length.\nDecrypt the given message\nEncrypting key type for this keypair.\nEncryption keypair with an associated encryption key.\nPadding scheme used for encryption.\nComponents of an RSA private key.\nComponents of an RSA public key.\nDecrypt the given message using provided random source\nEncrypt the message using provided random source\nDigital signature scheme.\nReturns an iterator over the CRT Values\nReturns the private exponent of the key.\nDecrypt the given message.\nDecrypt the given message using the given private key.\nDecrypt the given message.\nReturns the precomputed dp value, D mod (P-1)\nReturns the precomputed dq value, D mod (Q-1)\nReturns the public exponent of the key.\nEncrypt the given message using the given public key.\nEncrypt the given message.\nGet the encrypting key which can encrypt messages to be …\nReturns the modulus of the key.\nReturns the prime factors.\nReturns the precomputed qinv value, Q^-1 mod P\nSign the given digest.\nReturns the modulus size in bytes. Raw signatures and …\nReturns the modulus size in bytes. Raw signatures and …\nVerify a signed message.")