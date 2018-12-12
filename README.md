# VouchDB

[![CircleCI][12]][13]

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

#### The `apt` Way

 1. Add the vendor's code signing key, granting that vendor the ability to sign all software installed by `apt`.
 2. Add the vendor's package repository, granting that vendor the ability to _distribute_ all software installed by `apt`.

#### The OSS Way

 1. Download the software package from the vendor. (e.g: **kitchen-0.1.2.tar.gz**)
 2. Download the software package's cryptographic hash from the vendor. (e.g: **SHA256SUMS**)
 3. Download the signature of the cryptographic hash. (e.g: **SHA256SUMS.asc**)
 4. Verify the authenticity of the signature by locating and evaluating the signing key. (e.g: `gpg --verify SHA256SUMS.asc`, then `gpg --receive-keys <KeyId>` for the signing key, and manual research to determine whether that key is legitimately authorized to sign this package)
 5. Verify the integrity of the software package by comparing its hash against the signed hash. (e.g: typically a manual comparison of `openssl dgst -sha256 kitchen-0.1.2.tar.gz` and `grep kitchen-0.1.2.tar.gz SHA256SUMS`)

Some OSS projects publish their code signing key on their website, making step 4
much more convenient.

#### The Enterprise Way

Defer authenticity and integrity verification to a centralized authority and/or
proprietary software for receiving software packages.

 * Android apps on the Google Play Store are signed with the developer's code
   signing key, which must have continuity throughout the lifetime of the app
   and be used to sign all its release versions.

 * iOS apps on the Apple App Store are signed with the developer's code signing
   key, which must be associated with a certificate issued by a certificate
   authority trusted by Apple (i.e: the Apple Developer program).

#### Limitations of existing solutions

PGP key servers provide a theoretical trust graph by allowing keys to publish
signed trust statements about each other. In practice, however, this is easily
exploited and is rarely used.

PGP key servers have notoriously poor availability, performance, and usability.
Symantec's official [PGP Global Directory][14] requires a CAPTCHA in order to
perform a simple search. [MIT's key server][15] regularly times out on even the
most basic requests, such as rendering the form to perform a search. The search
form on PGP key servers is far from the simple text box most people are used to.

Enterprise code signing certificates place universal trust in a centralized
authority for all software packages. While convenient, this authority becomes
a bottleneck for all software the organization's users may want to use. While
this is desirable in some environments such as large organizations with
dedicated I/T teams to manage software installations for all devices within the
organization, it is harmful in environments where the authority is controlled
by a third-party such as a government, vendor, or business.

OSS projects diverge in how their software packages are signed and verified,
if signatures and hashes are even provided at all. [OpenSSL][16] and
[Hashicorp][17] provide both hashes and signatures, but [Elastic.co][18] and
[Redis][19] only provide hashes, whereas [PostgreSQL][20] and [MongoDB][21]
provide neither hashes nor signatures.

Language-specific package repositories, such as [RubyGems][22] and [npm][23],
tend to provide hashes but rely on trust in the repository itself (via TLS alone)
for authenticity. RubyGems does support code signing, but this is
[not widely used][24].

Official Linux package repositories (e.g: Debian's `apt` repositories) tend to
lag and contain only a subset of software packages needed or used on workstations,
servers, and personal devices. The rest either have to be downloaded directly,
or the developers themselves need to provide a compatible package repository
for each supported Linux distribution.

In short, there is no standard or widely adopted practice for code signing
right now. Some projects **are** solving for this, but it's being done in an
ad-hoc way that requires manual integration and verification, and/or has other
significant usability woes that hinder adoption.

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
[12]: https://circleci.com/gh/methadox/vouchdb.svg?style=svg
[13]: https://circleci.com/gh/methadox/vouchdb
[14]: https://keyserver.pgp.com/
[15]: https://pgp.mit.edu/
[16]: https://www.openssl.org/source/
[17]: https://www.vaultproject.io/downloads.html
[18]: https://www.elastic.co/downloads/elasticsearch
[19]: https://redis.io/download
[20]: https://www.enterprisedb.com/download-postgresql-binaries
[21]: https://www.mongodb.com/download-center/community
[22]: https://rubygems.org/
[23]: https://www.npmjs.com/
[24]: https://guides.rubygems.org/security/#general
