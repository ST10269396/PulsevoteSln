## SSL/TLS — Research and Notes

### Table of Contents
- [Overview](#overview)
- [What is SSL/TLS?](#what-is-ssltls)
- [Why HTTPS instead of HTTP?](#why-https-instead-of-http)
- [Impact if SSL is missing](#impact-if-ssl-is-missing)
- [Real‑world example](#real-world-example)
- [Local dev setup we implemented](#local-dev-setup-we-implemented)
- [Trusting the certificate on Windows](#trusting-the-certificate-on-windows)
- [Reflection](#reflection)

### Overview
SSL/TLS encrypts traffic between browser and server so third parties can’t read or alter it. HTTPS is HTTP over TLS with server authentication via a certificate.

### What is SSL/TLS?
It’s the cryptographic protocol that provides encryption and integrity for web traffic. Certificates (from a CA or self‑signed in dev) help clients verify the server’s identity.

### Why HTTPS instead of HTTP?
HTTPS prevents eavesdropping and tampering. For polling apps, it protects votes, credentials, and session tokens in transit.

### Impact if SSL is missing
Attackers can sniff credentials/tokens, change votes, inject scripts, or impersonate the server (MITM). HSTS helps enforce HTTPS.

### Real‑world example
Sites serving login or APIs over plain HTTP have leaked credentials/session cookies, leading to account takeover. Misconfigured HTTPS (invalid certs, missing HSTS) leaves users vulnerable to downgrade/MITM.

### Local dev setup we implemented
- Self‑signed cert with SAN=localhost via OpenSSL.
- Backend HTTPS with `ssl/key.pem` + `ssl/cert.pem`.
- Frontend (Vite) HTTPS dev server using the same certs.
- `ssl/` is .gitignored in both apps.

### Trusting the certificate on Windows
- Run `certmgr.msc` → Trusted Root Certification Authorities → Certificates → Import → pick `ssl/cert.pem` → finish → restart browser.

### Reflection
Self‑signed TLS shows warnings until trusted, but once imported it mirrors production workflows. TLS touches the app, dev server, and OS trust store. Avoid committing private keys and ensure all endpoints (including websockets) use HTTPS/WSS. In production, terminate TLS at a reverse proxy or platform with a trusted CA; keep cert management out of app code for safer rotation.

