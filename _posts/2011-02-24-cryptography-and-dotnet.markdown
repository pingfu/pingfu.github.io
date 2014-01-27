---
layout: post
title: "Cryptography and .Net"
date: 2011-02-24
categories: Security
---

There is a wealth of online content discussing cryptography, it’s use and implementation. Unfortunately a significant volume of this information demonstrates implementations that either deviate from best practise, provide bad illustrations of how to implement cryptography or just get it plain wrong.

So, we all know that encryption is used to obfuscate a message so that it can be transmitted via public channels to an intended recipient(s) with a significantly reduced risk of interception. In the first instance then we have an assortment of symmetric algorithms, that is algorithms that work on the basis of a common secret, known to both the sender and the recipient of the message. Subsequent to this we have asymmetric algorithms, these are slower algorithms that rely on the mathematical problem of integer factorization for large numbers, a problem currently considered to be difficult. There is no known method to carry it out quickly, and the complexity of factorisation is the basis of the assumed security of some asymmetric algorithms public key cryptography algorithms, used to help two or more parties agree upon a common secret whilst communicating over insecure channels.

Simply put, if two parties need to agree upon a common secret asymmetric algorithms (such as RSA or Diffie-Hellman) are used. When the communicating parties have established a common secret symmetric algorithms (such as DES, AES, Blowfish) are used to perform the encryption of the data to be exchanged.

Anybody with any experience of cryptography should recognised AES, the algorithm chosen by NIST to succeed DES and Tripple DES. AES, the Advanced Encryption Standard (also known as Rijndael) is a symmetric algorithm and if you work in the IT industry this is the only symmetric algorithm you should even consider using.

So, how does one correctly go about building an implement of AES (Rijndael) to secure data within their application?

Implementations of the AES algorithm are available for every established programming language, but they still require an understanding of the inputs and outputs.

This post will attempt to succinctly describe the correct way to implement the Rijndael cipher using .NET and the System.Security.Cryptography manage code namespace. Let’s start with a clear definition of our inputs for the encryption process...

Password: The password is the pre-shared key, the secret value for encryption and usually comprised of screen printable ASCII characters (a subset of UTF-8) and of an arbitrary length, known to both the encrypting and decrypting parties.

Salt: The salt is a mechanism designed to hinder the success of time-memory trade-off based attacks such as rainbow tables. The salt should be at least 64 bits (8 bytes) in length, chosen randomly and changed with each and every encrypted message. The salt does not need to be kept secret and may be transmitted in plaintext along with the ciphertext. The salt ensures that two identical plaintexts do not encrypt to the same ciphertext, assuming the salt is different for each message. Using a different salt for every message means that an attacker has to pre-compute all of the keys (also known as salt values) for a single corresponding plaintext, thus an attacker is limited to searching for passwords after a password operation has been performed and the salt is known. The salt is sometimes incorrectly confused with an initialisation vector, they serve very different purposes and should not be confused.

Initialisation vector: Rijndael is a block mode cipher, which, put simply that means it operates on blocks of information at a time, 128 bits to be precise. Once a block has been processed, the output of this block feeds back as input to the processing of the next block in the message and modifies it based on the selected block mode. The initialisation vector is a meaningless value that simply seeds the cipher at the first block. The IV should not be a fixed value, instead it should be derived from the password and salt values in such a way that the statistical relationship between the values is minimised. The correct way to choose a initialisation vector is to derive it following the procedure outlined in Rfc2898.

Key: The key is the sequence of bits that the cipher uses as the secret value to produce the cipher text. The key is and is often confused with the password. The key should be a sequence of cryptographically strong bytes, at least 256 bits in length. There is no argument for a shorter key length other than to maintain backwards compatibility. The key should be derived from the password and salt values in such a way that the statistical relationship between the values is minimised. The correct way to choose a cryptographically secure key is to derive it following the procedure outlined in Rfc2898.

RFC 2898: This RFC document is version 2 of a widely accepted standard, PKCS #5 PBCS2 – it is a method for deriving cryptographically strong values for the initialisation vector and key from the password and salt values. This method of generating cryptographically secure values involves the use of one-way hashes and is designed to be run more than once. By repeating the hashing process multiple times, the statistical relationship between the input and output of the function is significantly reduced. At least 1000 rounds (iterations) are recommended.

Block Mode: There are various block modes, ECB, CBC, CFB, OFB and so on. The block modes influence how the cipher chains the output from one block to the input of the next. Without delving into the detail of each mode, CBC is not only the most commonly used but provides the best security compared to the other modes. Use CBC unless you have a specific reason not to do so and understand the trade-offs. CBC (Cipher block chining) mode isn’t perfect, and does have some potential security problems. Each block affects the next in a simple way; as such, it is possible for additional blocks to be added to the end of a ciphertext message by an adversary without being detected when using the Rijndael cipher. Whilst it will most likely decrypt to nonsensical data, in some circumstances this may be undesirable – so it is advisable to include an end of message delimiter in your plaintext and check for this sort of tampering.

Padding Mode: Block mode ciphers operate on fixed size sequences of data. The block size for Rijndael is always 128 bits, as most messages don’t usually divide neatly into 128-bit sized blocks some padding is usually necessary on the final block. This could be zeros, ones or pseudorandom data, it really can be anything, but in keeping with good cryptographic processes, it is advisable to use ISO 10126 padding mode which appends pseudorandom data to the final data block.

There are several classes that implement AES cryptography in the .net framework, but the AesCryptoServiceProvider is usually the best class to use because of it’s compliance with various other non-Microsoft implementations of the Rijndael cipher.

The following example source code accepts ASCII plaintext, password and salt values as input. When either the Encrypt() or Decrypt() methods are called, the password and salt values supplied should be identical. This example demonstrates the correct usage of the AesCryptoServiceProvider class and the Rfc2898DeriveBytes class with CBC block mode and ISO10126 padding. The resulting cipher text is Base64 encoded, but this is only necessary if your ciphertext needs to be rendered neatly as screen printable characters, in an email for example.

If you are working with files, binary data or otherwise, Base64 encoding the cipher text is not necessary.

{% highlight csharp %}
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

public class Rijndael
{
    public String Encrypt(byte[] plainText, string password, byte[] salt)
    {
        var derivedBytes = new Rfc2898DeriveBytes(password, salt, 1000);
        var derivedKey = derivedBytes.GetBytes(32); // 256 bits
        var derivedInitVector = derivedBytes.GetBytes(16); // 128 bits

        using (var aesProvider = new AesCryptoServiceProvider())
        {
            aesProvider.KeySize = 256;
            aesProvider.Padding = PaddingMode.ISO10126;
            aesProvider.Mode = CipherMode.CBC;

            using (var encryptor = aesProvider.CreateEncryptor(derivedKey, derivedInitVector))
            {
                using (var memStream = new MemoryStream())
                {
                    using (var cryptoStream = new CryptoStream(memStream, encryptor, CryptoStreamMode.Write))
                    {
                        cryptoStream.Write(plainText, 0, plainText.Length);
                        cryptoStream.FlushFinalBlock();
                        return Convert.ToBase64String(memStream.ToArray());
                    }
                }
            }
        }
    }

    public String Decrypt(byte[] cipherText, string password, byte[] salt)
    {
        var derivedBytes = new Rfc2898DeriveBytes(password, salt, 1000);
        var derivedKey = derivedBytes.GetBytes(32); // 256 bits
        var derivedInitVector = derivedBytes.GetBytes(16); // 128 bits

        using (var aesProvider = new AesCryptoServiceProvider())
        {
            aesProvider.KeySize = 256;
            aesProvider.Padding = PaddingMode.ISO10126;
            aesProvider.Mode = CipherMode.CBC;

            using (var decryptor = aesProvider.CreateDecryptor(derivedKey, derivedInitVector))
            {
                using (var memStream = new MemoryStream(cipherText))
                {
                    using (var cryptoStream = new CryptoStream(memStream, decryptor, CryptoStreamMode.Read))
                    {
                        var plainTextBytes = new Byte[cipherText.Length];
                        var byteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
                        return Encoding.UTF8.GetString(plainTextBytes, 0, byteCount);
                    }
                }
            }
        }
    }
}
{% endhighlight %}