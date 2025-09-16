## JWT Authentication — Research and Notes

### Table of Contents
- [Overview](#overview)
- [What is JWT?](#what-is-jwt)
- [Why is JWT necessary?](#why-is-jwt-necessary)
- [How does JWT work?](#how-does-jwt-work)
- [What if an app does not use SSL?](#what-if-an-app-does-not-use-ssl)
- [Real‑world incident](#real-world-incident)
- [Secret generation command](#secret-generation-command)
- [Summary (4–6 sentences)](#summary-46-sentences)

### Overview
JWTs (JSON Web Tokens) are a compact way to prove identity to an API. They’re three base64 parts (header, payload, signature). Because the server signs them, they can be verified quickly without server‑side session storage.

### What is JWT?
A signed token containing claims (like user id/roles). It’s URL‑safe and typically sent in the `Authorization` header.

### Why is JWT necessary?
Classic cookie sessions don’t fit well across mobile apps, SPAs, and microservices. JWTs enable stateless auth, scale horizontally, and travel cleanly between services and domains.

### How does JWT work?
User logs in → server signs a token with a secret → client stores it → client sends `Authorization: Bearer <token>` on requests → server verifies signature and reads claims. Expiry limits token lifetime.

### What if an app does not use SSL?
Tokens and credentials can be intercepted or modified in transit (MITM). Attackers can hijack sessions, impersonate users, or alter requests. Always use HTTPS.

### Real‑world incident
Some apps accepted `alg: none` or failed to verify signatures correctly, allowing forged admin tokens and account takeover. Proper verification (pin algorithms, verify signature) fixes this.

### Secret generation command
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Summary (4–6 sentences)
JWTs give APIs a stateless way to know who a user is using signed tokens instead of server‑side sessions. They’re easy to pass around (usually in the `Authorization` header) and scale well across services. They only work safely over HTTPS; otherwise the token can be stolen in transit. Misconfigurations—like not verifying the signature or accepting `alg: none`—let attackers forge tokens. The right approach is strong secrets, short expirations, pinned algorithms, and avoiding sensitive data in the token payload.

Secret generation command used
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
