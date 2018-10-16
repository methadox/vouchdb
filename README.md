# VouchDB

A distributed trust database, using heuristics and verifiable cryptography to publish and discover assertions.

> 💡 **Note:** This project is currently in the _research_ phase.

## Use Cases

### Federated Identity & SSO

> I want to be an identity provider, allowing others to verify tokens I have issued.

> I want to enable my users to sign in using any number of identity providers.

Existing solutions in this space include:

 * [SAML][2]: Hefty XML-based protocol for security assertions between an *identity provider* and a *content provider* -- synonymous with SSO in most enterprise SaaS products.
 * [JWKS][1]: Format for publishing JWT signing keys for discoverability.
 * [JWT][3]: Format for signed *claims* used for authentication.
 * [OAuth 2.0][4]: Authorization protocol between a *resource owner*, a *resource server*, a *client*, and an *authorization server*.

### Code Signing

> I am installing a software package, and I want to know whether I can trust the code signing key.

> I trust a particular code signing key for one package, but do not trust it to sign other packages.

Existing solutions in this space include:

 * [OpenPGP][6]/[GnuPG][5]: Protocol and format for *public-key infrastructure* (PKI) -- publishing, signing, and verifying cryptographic keys.

### Transport Layer Security (TLS)

> I am visiting a website, and I want to know whether the content I am seeing is genuine.

Existing solutions in this space include:

 * [X.509][7]: *Public-key infrastructure* (PKI) anchored with universally trusted root certificates.
 * [TLS][8]: Protocol for establishing a secure network connection between a client and server.

### Secure Messaging

> I want to send an encrypted message to a key's owner.

> I want to be able to receive encrypted messages.

Existing solutions in this space include:

 * [Signal][9]: An end-to-end secure messaging service using phone numbers as identifiers.
 * [Keybase][10]: An end-to-end secure messaging service using federated cryptographic proofs.
 * [OTR][11]: An end-to-end secure messaging protocol agnostic of transport or addressing.

### Heuristic Trust

> I have made an effort to verify a key and want others to benefit from the work I have done.

Existing solutions in this space include:

 * [OpenPGP][6]/[GnuPG][5]: Protocol and format for *public-key infrastructure* (PKI) -- publishing, signing, and verifying cryptographic keys.

[1]: https://tools.ietf.org/html/rfc7517
[2]: https://www.oasis-open.org/standards#samlv2.0
[3]: https://jwt.io/
[4]: https://oauth.net/2/
[5]: https://gnupg.org/
[6]: https://www.ietf.org/rfc/rfc4880.txt
[7]: https://tools.ietf.org/html/rfc5280
[8]: https://tools.ietf.org/html/rfc5246
[9]: https://www.signal.org/docs/
[10]: https://keybase.io/docs
[11]: https://otr.cypherpunks.ca/
