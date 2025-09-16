SSL/TLS Research and Reflection

Summary (what SSL/TLS is and why it matters)
SSL/TLS encrypts traffic between browser and server so third parties can’t read or alter it. HTTPS is HTTP over TLS, authenticated by a certificate so clients know they’re talking to the right server. For polling apps, TLS protects votes, credentials, and session tokens from interception or tampering. Without it, attackers can eavesdrop, change results, inject scripts, or steal identities.

Real-world note: Sites that served login/API over plain HTTP have leaked credentials/session cookies, enabling account takeover. Misconfigured HTTPS (invalid certs, no HSTS) can expose users to downgrade or MITM attacks.

Local Dev Setup (implemented here)
- Self-signed cert with SAN=localhost via OpenSSL.
- Backend HTTPS with `ssl/key.pem` + `ssl/cert.pem`.
- Frontend (Vite) HTTPS dev server using same certs.
- `ssl/` is .gitignored in both apps.

Trusting the certificate on Windows (summary)
- Run `certmgr.msc` → Trusted Root Certification Authorities → Certificates → Import → pick `ssl/cert.pem` → finish → restart browser.

Reflection (experience)
Self-signed TLS shows warnings until trusted, but once imported it mirrors production workflows. It reminded me that TLS touches the app, dev server, and OS trust store. Avoid committing private keys and ensure all endpoints (including websockets) use HTTPS/WSS. In production, terminate TLS at a reverse proxy or platform with a trusted CA; keep cert management out of app code for safer rotation.

