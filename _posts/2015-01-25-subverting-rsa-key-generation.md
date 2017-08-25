---
layout: post
title: "Subverting RSA key generation"
date: 2015-01-25
categories: Security Cryptography RSA Backdoor
tags: rsa backdoor
redirect_from:
  - security/cryptography/rsa/backdoor/2015/01/25/back-door-in-an-rsa-public-key.html
---

**Sources:** A github [gist][gist] from [ryan-c][ryan-c] which inspired a technical [write-up][write-up] of the problem, and a c# proof of concept tool, [kleptography.net][kleptography.net].

There seems to be a problem with RSA. In short, a specially crafted RSA key pair can expose your private key, through information embedded in the public key. This means that even if you lock, bury or incinerate your private key, it can still be recoverable from the public key component of the pair.

The problem centers around the modulus component (the product of the two prime numbers, `p*q`) of an RSA public key. The modulus can be manipulated to hold a pre-defined value without compromising its function in the algorithm. To that end, it is possible to embed pre-defined value covertly into an RSA public key without the key pair owner's knowledge.

Building on this trait, by using a `Curve25519` public key (more commonly used for key exchange between two parties) as a PRNG seed when generating a new RSA key pair, a small (relative to the size of the modulus) artefact can be knitted into the modulus of the resulting RSA public key. This embedded value allows an attacker to, at a later date, derive the RSA private key from the value embeded into the public key. That is without the RSA private key ever becoming directly compromised or exposed to an attacker.

Assuming you trust that the open-source, audited PRNG producing the random bits for your private keys is using trustworthy sources, then this isn't a problem (i.e. `/dev/urandom` ([urandom][urandom]) on Mac and Linux, and the `Crypto API` on Windows).

But it does raise questions around the efficacy of closed-source crypto products responsible for generating and storing RSA private keys, particularly hardware security modules.

Any software or tool which generates an RSA private key is _capable_ of exploiting this qwirk to produce a situation where the RSA private key stays completely isolated and secure, but the public key has embedded within the modulus a back door containing the information an attacker needs to obtain the private key.

<!--excerpt-->

In summary

* Step back from RSA, and where possible use elliptic curve cryptography with a [safe curve][safecurves] instead.
* Use open-source, auditable software wherever possible for cryptography.
* Be weary of anything claiming security that is light on implementation detail, has a complex API, or contains out-dated or missing documention.
* Be weary of all closed source cryptography.

---

Incase you missed it, the last suspected RSA backdoor was [confirmed][schneier] [back][reddit] in 2013 as reports leaked that the NSA had [paid RSA $10 million][nsa_paid_rsa] to elect that the agency-backed Dual Elliptic Curve Deterministic Random Bit Generator ([Dual_EC_DRBG][Dual_EC_DRBG]) should become the preferred random number generating algorithm in the RSA specification.

[gist]: https://gist.github.com/ryancdotorg/9bd3873e488740f86ebb
[ryan-c]: https://github.com/ryancdotorg
[kleptography.net]: https://github.com/scratch-net/Kleptography.net
[write-up]: http://kukuruku.co/hub/infosec/backdoor-in-a-public-rsa-key
[schneier]: https://www.schneier.com/blog/archives/2013/09/the_nsa_is_brea.html
[reddit]: http://www.reddit.com/r/netsec/comments/1lu6o2/the_nsa_is_breaking_most_encryption_on_the/
[nsa_paid_rsa]: http://www.theregister.co.uk/2013/12/21/nsa_paid_rsa_10_million/
[Dual_EC_DRBG]: http://en.wikipedia.org/wiki/Dual_EC_DRBG
[safecurves]: http://safecurves.cr.yp.to
[urandom]: http://sockpuppet.org/blog/2014/02/25/safely-generate-random-numbers/