# Rate Limiting Research Summary

## What is rate limiting?
Rate limiting is a technique used to control the number of requests a client can make to a server within a specific time window. It acts as a protective barrier against abuse, ensuring fair resource usage and preventing system overload.

## Why is it critical for authentication endpoints?
Rate limiting is essential for authentication endpoints because they are prime targets for automated attacks. Without rate limiting, attackers can perform brute force attacks, credential stuffing, and automated account creation attempts. By limiting the number of login/registration attempts per client, we significantly reduce the risk of unauthorized access and system abuse.

## What is the difference between per-IP and per-identifier limits?
Per-IP rate limiting restricts requests based on the client's IP address, while per-identifier limiting uses specific user identifiers like email addresses. Per-IP limits protect against general abuse from a single source, but can be bypassed with multiple IPs. Per-identifier limits are more targeted, preventing abuse of specific accounts but may not catch distributed attacks. A combination approach (IP + identifier) provides the most comprehensive protection.

## How can reverse proxies/load balancers affect req.ip and rate limiting accuracy?
Reverse proxies and load balancers can mask the real client IP, making `req.ip` return the proxy's IP instead of the actual client. This causes rate limiting to apply to all users behind the proxy rather than individual clients. To fix this, applications must trust proxy headers like `X-Forwarded-For` and configure `app.set('trust proxy', 1)` to extract real client IPs from proxy headers.

## What are safe defaults vs. production-ready settings?
Safe defaults are conservative limits suitable for development (e.g., 5 requests per 15 minutes) that prevent basic abuse while allowing normal usage. Production-ready settings require careful tuning based on user behavior, infrastructure capacity, and threat analysis. Production settings often include different limits for different endpoints, user tiers, and may integrate with external systems for more sophisticated rate limiting strategies.

## Summary
Rate limiting is a critical security mechanism that protects authentication endpoints from automated attacks by controlling request frequency. Implementing both per-IP and per-identifier limits provides comprehensive protection, while proper proxy configuration ensures accurate client identification. Safe defaults prevent basic abuse, but production environments require careful tuning based on actual usage patterns and threat models to balance security with user experience.
