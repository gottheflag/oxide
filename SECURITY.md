# Security Policy

Security is a core concern of Oxide.

## Supported Versions

Security fixes are provided for the latest published version of Oxide.

Pre-release versions may change before a stable release.

## Reporting a Vulnerability

Please do not publicly disclose a suspected security vulnerability before it has been reviewed.

Report security issues privately to:

**dev@gottheflag.sa**

Include as much relevant information as possible, such as:

- affected version
- affected algorithm or API
- reproduction steps
- expected and observed behavior
- proof of concept, if applicable
- potential security impact

Please avoid including real secrets, credentials, or other sensitive user data in reports.

## Cryptographic Correctness

Oxide implements standardized cryptographic hashing and HMAC primitives.

The implementation is tested against published test vectors and independent implementations, but cryptographic software should still be treated carefully and reviewed when used in security-sensitive systems.

## SHA-1

SHA-1 is supported for compatibility with existing protocols and formats.

SHA-1 is not collision-resistant and should not be selected for new designs where a modern alternative is available.

## Custom Rounds

Oxide allows custom hash round counts for experimentation, education, and testing.

Non-standard round counts do not produce standardized SHA algorithms and must not be treated as cryptographic replacements for the standard configurations.