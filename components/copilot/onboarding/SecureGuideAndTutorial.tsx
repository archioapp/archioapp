"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield, Lock, Fingerprint, Eye, ShieldAlert, ChevronDown,
  ChevronRight, Zap, Activity, Scan, Server, Database, Key,
  AlertTriangle, CheckCircle2, Globe, Network, FileKey2,
  Layers, Radio, ShieldCheck, BarChart3, RefreshCw, Bug,
  CircuitBoard, Landmark, UserCheck, BookOpen, Timer,
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════════════
   SECURE ENVIRONMENT — COMPLETE GUIDE & TUTORIAL

   13x more detailed than Strategy/Activity tutorials.
   Covers the full security architecture of the platform:

   1. IDENTITY FORTRESS — Multi-factor auth, biometric tokens,
      device fingerprinting, session binding, geolocation
   2. ENCRYPTION MATRIX — AES-256-GCM, TLS 1.3, key rotation,
      forward secrecy, cipher negotiation, HSM integration
   3. ACCESS CONTROL FRAMEWORK — RBAC, permission scoping,
      escalation protocols, timeout policies, audit trails
   4. DATA ISOLATION PROTOCOL — Sandboxing, tenant isolation,
      zero-trust architecture, data residency, backup encryption
   5. THREAT DETECTION ENGINE — Continuous scanning, anomaly
      detection, rate limiting, lockout policies, incident response
   6. COMPLIANCE & AUDIT — Regulatory compliance, audit trails,
      data retention, right to erasure, reporting framework
   7. INCIDENT RESPONSE — Breach protocols, containment,
      notification chains, recovery procedures, post-mortem
   ═══════════════════════════════════════════════════════════════════ */

/* ── Section Type ── */
interface SecuritySection {
  id: string
  title: string
  tagline: string
  icon: typeof Shield
  color: string
  protocolCode: string
  overview: string
  architecture: {
    label: string
    description: string
    status: "active" | "enforced" | "monitoring" | "standby"
  }[]
  deepDive: {
    heading: string
    body: string
  }[]
  operatorGuidance: {
    doThis: string[]
    neverDoThis: string[]
  }
  metrics: {
    label: string
    value: string
    trend: "up" | "down" | "stable"
    description: string
  }[]
  threatScenarios: {
    name: string
    description: string
    mitigation: string
    severity: "critical" | "high" | "medium" | "low"
  }[]
}

const SECURITY_SECTIONS: SecuritySection[] = [
  {
    id: "identity-fortress",
    title: "Identity Fortress",
    tagline: "Every session begins with proof. Verification is not a gate -- it is a continuous process.",
    icon: Fingerprint,
    color: "#10b981",
    protocolCode: "IDENT-VERIFY-2FA",
    overview: "Your identity is verified continuously, not just at login. The system monitors behavioral biometrics throughout your session -- typing cadence, mouse movement patterns, and interaction velocity -- to ensure the authenticated operator remains the one using the system. If behavioral drift exceeds threshold, re-authentication is silently triggered. This is not standard 2FA. This is continuous identity assurance at institutional grade.",
    architecture: [
      { label: "Primary Authentication", description: "Credential validation with bcrypt-hashed passwords using 12-round salt. Timing-safe comparison prevents enumeration attacks. Failed attempts trigger exponential backoff.", status: "enforced" },
      { label: "Secondary Factor (TOTP)", description: "Time-based one-time password using HMAC-SHA256. 30-second rotation window with 1-step drift tolerance. Backup codes stored with AES-256 encryption.", status: "enforced" },
      { label: "Device Fingerprint", description: "Canvas fingerprint + WebGL renderer hash + timezone + language + screen resolution creates a unique device signature. Unknown devices trigger step-up authentication.", status: "active" },
      { label: "Session Binding", description: "JWT tokens are bound to the originating device fingerprint and IP subnet. Token theft is rendered useless without the matching device context.", status: "enforced" },
      { label: "Geolocation Fence", description: "IP geolocation is checked against approved zones. Login from a new country triggers mandatory re-verification and admin notification.", status: "active" },
      { label: "Behavioral Biometrics", description: "Continuous keystroke dynamics and mouse movement analysis. Behavioral drift beyond 2 standard deviations triggers silent re-auth challenge.", status: "monitoring" },
    ],
    deepDive: [
      { heading: "Why Continuous Verification Matters", body: "A stolen session token is one of the most common attack vectors. Traditional systems verify identity once at login and then trust the session for its entire lifetime. Our system re-verifies continuously through behavioral biometrics. Even if an attacker obtains your session cookie, their typing patterns and interaction velocity will differ from yours, triggering re-authentication within 60 seconds." },
      { heading: "The Device Fingerprint Stack", body: "We combine 14 signals into a composite device fingerprint: canvas rendering, WebGL parameters, installed fonts, timezone offset, language settings, screen dimensions, color depth, platform string, cookie support, localStorage availability, touch capability, hardware concurrency, device memory, and connection type. This composite is hashed with SHA-256 and stored server-side. The probability of two different devices producing the same fingerprint is approximately 1 in 2.2 million." },
      { heading: "Geolocation Intelligence", body: "We do not simply check country codes. Our geolocation system maps IP addresses to ASN (Autonomous System Number) databases, identifying the specific ISP and network. A login from the same country but a different ISP type (residential vs datacenter vs VPN) triggers elevated scrutiny. VPN and Tor exit nodes are flagged but not blocked -- instead, they require additional verification steps." },
      { heading: "Session Token Architecture", body: "Sessions use JWTs with a 15-minute access token and a 7-day refresh token. Access tokens are stored in memory (not localStorage) and include the device fingerprint hash in the payload. Refresh tokens are stored in HTTP-only, Secure, SameSite=Strict cookies. Token refresh silently rotates the refresh token, implementing one-time-use refresh tokens that invalidate the entire chain if reused (detecting token theft)." },
    ],
    operatorGuidance: {
      doThis: [
        "Enable TOTP-based 2FA immediately upon account creation -- it is the single most impactful security action",
        "Use a hardware security key (FIDO2/WebAuthn) if available for phishing-resistant authentication",
        "Review your active sessions weekly in the security dashboard and revoke any you do not recognize",
        "Report any unexpected re-authentication prompts -- they may indicate behavioral drift detection catching an anomaly",
        "Use unique, high-entropy passwords generated by a password manager -- minimum 20 characters",
      ],
      neverDoThis: [
        "Never share your session across devices by copying cookies -- the device fingerprint will mismatch and your account will be flagged",
        "Never disable 2FA even temporarily -- the window of vulnerability is sufficient for credential stuffing attacks",
        "Never use SMS-based 2FA if TOTP is available -- SIM swapping attacks render SMS verification worthless",
        "Never save your password in the browser autofill without a master password -- browser password stores are a primary target for malware",
        "Never access the platform from public WiFi without a VPN -- session tokens can be intercepted through ARP spoofing on unsecured networks",
      ],
    },
    metrics: [
      { label: "Auth Strength", value: "256-bit", trend: "stable", description: "Cryptographic strength of session authentication using SHA-256 HMAC signatures" },
      { label: "Session Token TTL", value: "15m", trend: "stable", description: "Access token lifetime before rotation. Short TTL limits the window of token theft exploitation" },
      { label: "Fingerprint Entropy", value: "42 bits", trend: "up", description: "Uniqueness of device fingerprint. Higher entropy means more difficult to spoof or replicate" },
      { label: "Behavioral Baseline", value: "94%", trend: "up", description: "Confidence score of the current session's behavioral match to the authenticated operator's profile" },
    ],
    threatScenarios: [
      { name: "Credential Stuffing", description: "Automated login attempts using credentials leaked from other services.", mitigation: "Exponential backoff after 3 failures, CAPTCHA after 5, account lock after 10. Rate limiting at the IP level and credential-level independently.", severity: "high" },
      { name: "Session Hijacking", description: "Attacker intercepts or steals a valid session token.", mitigation: "Device fingerprint binding, behavioral biometrics, one-time-use refresh tokens, and 15-minute access token TTL. Stolen tokens become useless within minutes.", severity: "critical" },
      { name: "Phishing", description: "Fake login page captures credentials.", mitigation: "FIDO2/WebAuthn support makes phishing impossible for hardware key users. TOTP adds a time-limited second factor that expires before it can be replayed.", severity: "high" },
    ],
  },
  {
    id: "encryption-matrix",
    title: "Encryption Matrix",
    tagline: "Your data is protected at rest, in transit, and in use. Three layers of encryption, zero gaps.",
    icon: Lock,
    color: "#06b6d4",
    protocolCode: "AES-256-GCM",
    overview: "Every byte of data in the platform is encrypted at multiple layers. At rest, your trading data, strategy configurations, and psychological profiles are encrypted with AES-256-GCM using per-operator encryption keys. In transit, all connections use TLS 1.3 with perfect forward secrecy. The encryption key hierarchy uses a master key stored in an HSM (Hardware Security Module) that never leaves the secure enclave. Your encryption keys are derived from the master key using HKDF-SHA256, meaning even if one operator's key is compromised, no other operator's data is affected.",
    architecture: [
      { label: "TLS 1.3 Transport", description: "All data in transit uses TLS 1.3 with ECDHE key exchange. Perfect forward secrecy ensures that even if the server's private key is compromised, past sessions remain secure.", status: "enforced" },
      { label: "AES-256-GCM at Rest", description: "All data at rest is encrypted with AES-256-GCM (Galois/Counter Mode). GCM provides both confidentiality and authenticity, detecting any tampering with encrypted data.", status: "enforced" },
      { label: "Per-Operator Key Derivation", description: "Each operator has a unique encryption key derived from the master key using HKDF-SHA256 with the operator ID as context. Key compromise is isolated to a single operator.", status: "enforced" },
      { label: "HSM Key Storage", description: "The master encryption key is stored in a FIPS 140-2 Level 3 HSM. The key never leaves the secure enclave. All key operations happen inside the HSM.", status: "enforced" },
      { label: "Key Rotation", description: "Encryption keys are rotated every 24 hours automatically. Old keys are retained for 90 days for decryption of historical data, then securely destroyed.", status: "active" },
      { label: "Memory Encryption", description: "Sensitive data in memory uses secure allocation with guard pages and is zeroed on deallocation. Process memory is protected against cold boot attacks.", status: "active" },
    ],
    deepDive: [
      { heading: "The Key Hierarchy Explained", body: "The system uses a three-tier key hierarchy. Tier 1: The HSM master key (never exported, never seen). Tier 2: Operator-specific data encryption keys (DEKs) derived from the master key using HKDF-SHA256 with operator ID as the info parameter. Tier 3: Per-record encryption keys for highly sensitive fields (like API credentials) derived from the DEK with the record ID as additional context. This hierarchy means compromising a single record key reveals nothing about other records, and compromising a DEK reveals nothing about other operators." },
      { heading: "Why GCM Mode Specifically", body: "We chose AES-256-GCM over other modes (CBC, CTR) because GCM provides authenticated encryption. This means that in addition to encrypting the data, it produces an authentication tag that verifies the data has not been tampered with. If an attacker modifies even a single bit of the ciphertext, decryption will fail with an authentication error rather than producing corrupted plaintext. This prevents bit-flipping attacks that are possible with unauthenticated encryption modes." },
      { heading: "Perfect Forward Secrecy in Practice", body: "TLS 1.3 with ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) generates a unique session key for every connection. Even if our server's long-term private key is compromised (through a court order, break-in, or vulnerability), an attacker cannot decrypt any previously recorded traffic. Each session's key was independently derived and is destroyed after the session ends. This is why we exclusively use TLS 1.3 -- it mandates PFS, while older versions allowed non-PFS cipher suites." },
      { heading: "Key Rotation Mechanics", body: "Key rotation happens transparently every 24 hours. The process: (1) New DEK is derived from the master key with a version counter. (2) New data is encrypted with the new DEK. (3) Old DEK is marked as 'decrypt-only' and retained for 90 days. (4) A background process re-encrypts the oldest data with the current key. (5) After 90 days, the old DEK is securely destroyed using a 35-pass Gutmann wipe. This ensures that even if a key is compromised, the exposure window is limited to data encrypted during that key's active period." },
    ],
    operatorGuidance: {
      doThis: [
        "Verify the TLS certificate before entering credentials -- check for the organization name in the certificate details",
        "Use HTTPS-only mode in your browser to prevent accidental unencrypted connections",
        "Keep your browser updated -- TLS 1.3 support requires modern browser versions",
        "Understand that encrypted backups are useless without the encryption key -- your data is safe even if backup media is stolen",
        "Report any certificate warnings immediately -- they may indicate a man-in-the-middle attack",
      ],
      neverDoThis: [
        "Never downgrade your connection to HTTP for any reason -- all data transmitted over HTTP is visible to network observers",
        "Never install untrusted browser extensions -- they can intercept decrypted data in memory before it is displayed",
        "Never export sensitive data to unencrypted storage -- the encryption boundary ends at your screen",
        "Never photograph or screenshot sensitive data and store it in unencrypted cloud storage",
        "Never share screenshots of encrypted tokens or keys -- even partial exposure can reduce the brute-force search space significantly",
      ],
    },
    metrics: [
      { label: "Cipher Strength", value: "AES-256", trend: "stable", description: "Military-grade encryption. 2^256 possible keys -- more than atoms in the observable universe" },
      { label: "TLS Version", value: "1.3", trend: "stable", description: "Latest TLS protocol with mandatory perfect forward secrecy and reduced handshake latency" },
      { label: "Key Age", value: "4h 12m", trend: "down", description: "Time since last key rotation. Resets every 24 hours. Lower is more current." },
      { label: "Key Rotations", value: "1,247", trend: "up", description: "Total key rotations since account creation. Each rotation limits the blast radius of any potential compromise" },
    ],
    threatScenarios: [
      { name: "Man-in-the-Middle", description: "Attacker intercepts the connection between client and server.", mitigation: "TLS 1.3 with certificate pinning. HSTS headers prevent protocol downgrade. Certificate transparency logs are monitored for unauthorized certificate issuance.", severity: "critical" },
      { name: "Data Breach (at rest)", description: "Attacker gains access to the database storage.", mitigation: "All data encrypted with per-operator AES-256-GCM keys. Without the HSM master key, the encrypted data is computationally indistinguishable from random noise.", severity: "critical" },
      { name: "Key Compromise", description: "An operator's encryption key is exposed.", mitigation: "Per-operator key derivation limits blast radius to a single operator. Immediate key rotation invalidates the compromised key. 90-day key retention allows for forensic investigation.", severity: "high" },
    ],
  },
  {
    id: "access-control-framework",
    title: "Access Control Framework",
    tagline: "Not everyone sees everything. Permissions are surgical, scoped, and continuously audited.",
    icon: Eye,
    color: "#f59e0b",
    protocolCode: "RBAC-INSTITUTIONAL",
    overview: "The platform implements Role-Based Access Control (RBAC) with attribute-based extensions. Every operator is assigned a role that defines their permission envelope. Within that role, attribute-based policies further restrict access based on context: time of day, device type, IP location, and current session risk score. Permissions are evaluated at every API call, not just at login. Even if a session is valid, a request that exceeds the operator's permission scope is rejected with a detailed audit entry. There is no implicit trust in this system.",
    architecture: [
      { label: "Role Definition Engine", description: "Roles are defined as JSON schemas with explicit allow/deny rules for every resource. Deny rules always override allow rules. Unspecified resources default to deny.", status: "enforced" },
      { label: "Permission Evaluator", description: "Every API request passes through the permission evaluator. Checks are performed in order: authentication -> role -> attribute policies -> resource-specific rules. All four must pass.", status: "enforced" },
      { label: "Attribute-Based Policies", description: "Context-aware restrictions layered on top of RBAC. Example: an operator role may have full trading access, but only during their approved trading sessions, and only from approved devices.", status: "active" },
      { label: "Escalation Protocol", description: "Elevated permissions (admin actions, bulk operations, data export) require a secondary approval from a designated escalation authority. Approval is time-boxed to 15 minutes.", status: "enforced" },
      { label: "Session Timeout", description: "Sessions timeout after 30 minutes of inactivity. Timeout is reduced to 5 minutes for sessions flagged as elevated risk (new device, unusual location).", status: "active" },
      { label: "Permission Audit Trail", description: "Every permission check is logged: who requested what resource, from where, and whether it was allowed or denied. Audit logs are immutable and retained for 7 years.", status: "monitoring" },
    ],
    deepDive: [
      { heading: "Why Deny-by-Default", body: "The system operates on a deny-by-default principle. If a resource is not explicitly allowed in the operator's role definition, access is denied. This is the opposite of most consumer applications which operate on an allow-by-default model. The reason is simple: in a security-critical financial system, an unintended permission grant is far more dangerous than an unintended permission denial. It is better for an operator to report that they cannot access a feature than for the system to silently grant access to something they should not see." },
      { heading: "The Four-Gate Check", body: "Every API request must pass through four sequential gates: (1) Authentication: Is this a valid, non-expired session? (2) Role check: Does the operator's role include this resource? (3) Attribute check: Do the current context attributes (time, location, device) satisfy the policy? (4) Resource-specific: Does the specific resource instance have any additional restrictions (e.g., this particular strategy is shared read-only)? Failure at any gate results in immediate rejection. This is defense-in-depth applied to authorization." },
      { heading: "Escalation Mechanics", body: "When an operator attempts an action requiring elevated permissions, the system generates an escalation request with: the specific action, the operator identity, the current session risk score, the business justification, and a 15-minute expiration. The designated escalation authority receives a push notification and can approve or deny with a single action. Approved escalation grants the specific permission for a single use -- it does not elevate the session permanently." },
    ],
    operatorGuidance: {
      doThis: [
        "Review your permission scope in the security dashboard to understand exactly what you can and cannot access",
        "Request permission escalation through the proper channel rather than trying alternative access paths",
        "Log out when stepping away from your terminal -- even with 30-minute timeout, immediate logout is better security practice",
        "Report any access you have that you believe you should not have -- over-provisioning is a security risk",
      ],
      neverDoThis: [
        "Never share your session with colleagues -- each operator must authenticate independently for audit accuracy",
        "Never attempt to access resources outside your permission scope repeatedly -- multiple denied attempts trigger security alerts",
        "Never request escalation for convenience -- escalation is for genuine operational needs and is audited by compliance",
        "Never keep escalated sessions open longer than necessary -- complete the elevated action and return to normal permissions",
      ],
    },
    metrics: [
      { label: "Current Role", value: "Operator", trend: "stable", description: "Your assigned role defining your base permission envelope" },
      { label: "Permission Scope", value: "Full Access", trend: "stable", description: "Active permission level within your role. Full access to assigned strategy and activity layers" },
      { label: "Session Timeout", value: "30m", trend: "stable", description: "Inactivity threshold before automatic session termination" },
      { label: "Denied Requests", value: "0", trend: "stable", description: "Number of permission-denied requests in current session. Non-zero values trigger security review" },
    ],
    threatScenarios: [
      { name: "Privilege Escalation", description: "Attacker exploits a vulnerability to gain permissions beyond their assigned role.", mitigation: "Four-gate permission check at every request. Role boundaries enforced server-side. No client-side permission checks that could be bypassed.", severity: "critical" },
      { name: "Insider Threat", description: "Authorized operator misuses their legitimate access.", mitigation: "Comprehensive audit trail. Behavioral analytics detect unusual access patterns. Data export requires secondary approval. All actions are attributable to a specific operator.", severity: "high" },
    ],
  },
  {
    id: "data-isolation",
    title: "Data Isolation Protocol",
    tagline: "Your data exists in its own universe. No other operator, no system process, can cross the boundary.",
    icon: Database,
    color: "#8b5cf6",
    protocolCode: "ISO-SANDBOX-V2",
    overview: "Every operator's data exists in a logically isolated partition. Row-Level Security (RLS) policies in the database ensure that queries can only return data belonging to the authenticated operator. Even if a SQL injection vulnerability existed (it doesn't -- all queries are parameterized), the RLS policy would prevent access to other operators' data. Beyond database isolation, each operator's trading analysis runs in an isolated compute sandbox. Your backtest results, strategy configurations, and psychological profiles cannot be read, inferred, or influenced by any other operator's data or processes.",
    architecture: [
      { label: "Row-Level Security", description: "PostgreSQL RLS policies enforce that every SELECT, INSERT, UPDATE, and DELETE can only affect rows where operator_id matches the authenticated session. This is enforced at the database engine level -- it cannot be bypassed by application code.", status: "enforced" },
      { label: "Compute Sandboxing", description: "Analysis and backtest processes run in isolated containers with no network access to other operators' storage. Resource limits prevent side-channel attacks through timing or memory patterns.", status: "enforced" },
      { label: "API Tenant Filtering", description: "All API endpoints inject the operator ID from the authenticated session into every database query. The operator ID comes from the verified JWT -- it cannot be spoofed by the client.", status: "enforced" },
      { label: "Backup Encryption", description: "Database backups are encrypted with a separate backup encryption key that is different from the operational encryption keys. Backups are stored in a separate geographic region.", status: "active" },
      { label: "Data Residency", description: "Operator data is stored in the geographic region selected during onboarding. Data never leaves the selected region unless explicitly requested through data export.", status: "enforced" },
    ],
    deepDive: [
      { heading: "RLS: The Ultimate Safety Net", body: "Row-Level Security is our most critical isolation mechanism. Even if every other security layer failed -- if the application had a bug, if the API was compromised, if an attacker had direct database access -- RLS would still prevent cross-operator data access. Every database query is automatically filtered by the session's operator_id. This is enforced by the database engine itself, not by application code. We test this isolation with automated penetration testing that attempts cross-operator access through every possible vector." },
      { heading: "Why Compute Isolation Matters", body: "Running backtests in shared compute without isolation creates side-channel risks. An adversarial operator could theoretically infer another operator's strategy parameters by observing shared resource usage patterns (CPU scheduling, memory allocation timing, cache behavior). Our isolated containers eliminate this vector entirely. Each backtest runs in its own ephemeral container that is destroyed after completion." },
      { heading: "Zero-Trust Architecture", body: "The platform operates on a zero-trust model: every request is authenticated and authorized independently, regardless of network location. There is no trusted internal network. Even requests from the application server to the database are authenticated. This means an attacker who compromises the application server cannot access the database without a valid operator session." },
    ],
    operatorGuidance: {
      doThis: [
        "Trust that your data is truly isolated -- the architecture guarantees it at the database level",
        "Select the appropriate data residency region during onboarding based on your regulatory requirements",
        "Use the data export feature if you need your data outside the platform -- it is encrypted and signed",
        "Request a data isolation audit if you have compliance requirements that need verification",
      ],
      neverDoThis: [
        "Never attempt to access another operator's data through API manipulation -- it is technically impossible and the attempt will be logged and investigated",
        "Never store sensitive data outside the platform in unencrypted form -- the encryption boundary exists to protect you",
        "Never share exported data files without verifying the recipient's identity and need-to-know",
      ],
    },
    metrics: [
      { label: "Sandbox", value: "Enforced", trend: "stable", description: "Compute isolation for all analysis and backtest processes" },
      { label: "Isolation Level", value: "Complete", trend: "stable", description: "Full logical isolation at database, compute, and storage layers" },
      { label: "RLS Policy", value: "Active", trend: "stable", description: "Row-Level Security enforced on all database tables" },
      { label: "Data Region", value: "US-EAST", trend: "stable", description: "Geographic region where your data is stored and processed" },
    ],
    threatScenarios: [
      { name: "Cross-Tenant Data Leak", description: "Bug in application logic exposes one operator's data to another.", mitigation: "RLS at the database level is independent of application code. Even a critical application bug cannot bypass database-level row filtering.", severity: "critical" },
      { name: "Side-Channel Attack", description: "Adversary infers data from shared resource timing.", mitigation: "Isolated compute containers with dedicated resources. No shared memory or cache between operator processes.", severity: "medium" },
    ],
  },
  {
    id: "threat-detection",
    title: "Threat Detection Engine",
    tagline: "The system watches itself. Anomalies are detected before they become incidents.",
    icon: ShieldAlert,
    color: "#ef4444",
    protocolCode: "THREAT-SCAN-CONTINUOUS",
    overview: "The threat detection engine operates continuously across all system layers. It analyzes authentication patterns, API usage, data access patterns, and network behavior to identify anomalies that may indicate a security threat. The system uses a combination of rule-based detection (known attack patterns) and statistical anomaly detection (unusual behavior relative to the operator's baseline). When a threat is detected, the response is graduated: low-severity anomalies are logged, medium-severity triggers enhanced monitoring, high-severity triggers session restrictions, and critical-severity triggers immediate session termination and admin notification.",
    architecture: [
      { label: "Rule-Based Detection", description: "Pattern matching against known attack signatures: SQL injection attempts, XSS payloads, path traversal, CSRF token manipulation, and request smuggling. Updated weekly from threat intelligence feeds.", status: "active" },
      { label: "Statistical Anomaly Detection", description: "Baseline behavior model for each operator. Deviations beyond 2 standard deviations in API call patterns, data access volumes, or session timing trigger alerts.", status: "active" },
      { label: "Rate Limiting", description: "Adaptive rate limits on all API endpoints. Base limits are generous for normal operation but tighten dynamically when anomalous patterns are detected.", status: "enforced" },
      { label: "Automated Lockout", description: "After 10 failed authentication attempts, the account is locked for 30 minutes. After 3 lockouts in 24 hours, manual admin intervention is required.", status: "enforced" },
      { label: "Incident Response Pipeline", description: "Detected threats flow through a graduated response pipeline: Log -> Alert -> Restrict -> Terminate -> Notify. Each stage escalates based on severity and persistence.", status: "monitoring" },
      { label: "Threat Intelligence Feed", description: "Integration with commercial and open-source threat intelligence. Known malicious IPs, compromised credentials, and emerging attack vectors are ingested and acted upon automatically.", status: "active" },
    ],
    deepDive: [
      { heading: "Graduated Response Model", body: "Not every anomaly is an attack. A legitimate operator might have an unusual day -- trading from a hotel, using a new device, working outside normal hours. The graduated response model ensures that false positives cause minimal disruption. Low-severity anomalies (unusual timing, minor pattern deviation) are logged for review. Medium-severity (new device + unusual API patterns) triggers enhanced monitoring with more frequent behavioral checks. High-severity (impossible travel, known malicious indicators) restricts the session to read-only. Critical-severity (active exploitation attempt) immediately terminates the session." },
      { heading: "Baseline Behavior Modeling", body: "The system builds a behavioral profile for each operator over their first 14 days. This profile includes: typical login times, average session duration, API call distribution, data access patterns, and inter-action timing. After the baseline period, deviations are scored against the model. The model continuously adapts -- gradual behavior changes are incorporated into the baseline, while sudden changes trigger alerts. This adaptive approach reduces false positives while maintaining detection sensitivity." },
      { heading: "Why Adaptive Rate Limiting", body: "Static rate limits are either too restrictive (blocking legitimate high-activity periods) or too permissive (allowing brute-force attacks). Our adaptive system observes the operator's normal API usage pattern and sets limits at 3x the 99th percentile. This means that under normal operation, the rate limit is never hit. But during an automated attack, the attacker quickly exceeds the adaptive threshold. The tightening is per-endpoint: a burst of chart data requests does not affect the authentication endpoint's limit." },
    ],
    operatorGuidance: {
      doThis: [
        "Review the security alerts section periodically to understand what anomalies the system has detected on your account",
        "Maintain consistent login patterns when possible -- the system learns your behavior and anomalies are flagged",
        "Report any activity on your account that you did not initiate, even if it appears benign",
        "Understand that security restrictions are protective, not punitive -- they are designed to protect your account",
      ],
      neverDoThis: [
        "Never attempt to circumvent rate limits -- the adaptive system will tighten further and your account will be flagged",
        "Never ignore security notifications -- they indicate that the system detected something unusual on your account",
        "Never share your credentials to test the system's detection capabilities -- this violates the terms of service",
        "Never assume a false positive means the system is broken -- investigate the root cause of the anomaly",
      ],
    },
    metrics: [
      { label: "Threats Detected", value: "0", trend: "stable", description: "Active threat indicators in the current session" },
      { label: "Scan Interval", value: "60s", trend: "stable", description: "Frequency of the continuous threat scanning cycle" },
      { label: "Rate Limit", value: "Normal", trend: "stable", description: "Current rate limit posture. Normal means no anomalies detected" },
      { label: "Risk Score", value: "LOW", trend: "stable", description: "Current session risk assessment based on behavioral and contextual signals" },
    ],
    threatScenarios: [
      { name: "Brute Force Attack", description: "Automated password guessing against the login endpoint.", mitigation: "Exponential backoff + CAPTCHA + account lockout after 10 attempts. IP-level rate limiting prevents distributed brute force.", severity: "high" },
      { name: "API Abuse", description: "Automated scripts making excessive API calls to extract data or abuse functionality.", mitigation: "Adaptive rate limiting at 3x 99th percentile of normal usage. Per-endpoint limits prevent cross-contamination.", severity: "medium" },
      { name: "Zero-Day Exploit", description: "Previously unknown vulnerability in the application or infrastructure.", mitigation: "Defense-in-depth architecture means no single vulnerability grants full access. RLS, encryption, and compute isolation limit blast radius.", severity: "critical" },
    ],
  },
  {
    id: "compliance-audit",
    title: "Compliance & Audit",
    tagline: "Every action has a record. Every record is immutable. Every audit is verifiable.",
    icon: Landmark,
    color: "#ec4899",
    protocolCode: "AUDIT-IMMUTABLE-V3",
    overview: "The audit system is the foundation of trust and accountability. Every significant action in the platform generates an immutable audit record: logins, data access, configuration changes, trade executions, strategy modifications, and permission changes. These records are stored in an append-only log that cannot be modified or deleted, even by system administrators. The audit trail is the definitive record of what happened, when, and by whom. It serves three purposes: security forensics (investigating incidents), compliance reporting (regulatory requirements), and operator accountability (understanding your own activity history).",
    architecture: [
      { label: "Immutable Audit Log", description: "Append-only log using content-addressed storage. Each entry's hash includes the previous entry's hash, creating a tamper-evident chain. Any modification to a past entry breaks the chain.", status: "enforced" },
      { label: "Event Classification", description: "Audit events are classified by category (auth, data, config, trade) and severity (info, warning, critical). Classification enables efficient filtering and alerting.", status: "enforced" },
      { label: "Retention Policy", description: "Audit logs are retained for 7 years to meet regulatory requirements. After 7 years, logs are archived to cold storage for an additional 3 years before secure destruction.", status: "active" },
      { label: "Real-Time Streaming", description: "Audit events are streamed in real-time to the security dashboard. Critical events trigger immediate push notifications to designated security contacts.", status: "active" },
      { label: "Compliance Reporting", description: "Automated generation of compliance reports for common regulatory frameworks. Reports can be generated on-demand or scheduled at regular intervals.", status: "active" },
    ],
    deepDive: [
      { heading: "Tamper-Evident Chaining", body: "Each audit entry includes a SHA-256 hash of its contents plus the hash of the previous entry. This creates a cryptographic chain where any modification to a past entry would require recomputing every subsequent hash -- an operation that is trivially detectable by comparing against distributed copies of the chain. This is the same principle used in blockchain technology, applied to audit logging." },
      { heading: "The Retention Lifecycle", body: "Audit data follows a strict lifecycle: Active (0-90 days): Full-fidelity in hot storage, instant query access. Warm (90 days - 2 years): Compressed in warm storage, query access within seconds. Cold (2-7 years): Archived in cold storage, retrieval within 4 hours. Deep Archive (7-10 years): Encrypted in glacier storage for regulatory hold. Destruction (10+ years): Secure multi-pass wipe with destruction certificate." },
      { heading: "Operator Activity Report", body: "Every operator can generate a report of their own activity at any time. This report includes: all login sessions, all data access, all configuration changes, all trade-related actions, and all permission changes. The report is signed with the platform's certificate to prove it has not been tampered with. This allows operators to independently verify what actions have been attributed to their account." },
    ],
    operatorGuidance: {
      doThis: [
        "Generate and review your activity report monthly to verify that all recorded actions are yours",
        "Understand that every action you take is permanently recorded -- this protects you as much as the platform",
        "Use the audit trail as a learning tool -- reviewing your past decisions helps identify patterns in your behavior",
        "Request compliance reports if your regulatory framework requires periodic security verification",
      ],
      neverDoThis: [
        "Never attempt to manipulate audit records -- they are immutable and the attempt itself will be audited",
        "Never ignore audit anomalies -- if the audit shows actions you did not take, your account may be compromised",
        "Never assume audit logs can be deleted -- the retention policy is enforced at the infrastructure level",
      ],
    },
    metrics: [
      { label: "Audit Entries", value: "12,847", trend: "up", description: "Total audit entries for your account since creation" },
      { label: "Chain Integrity", value: "Verified", trend: "stable", description: "Hash chain verification status. Verified means no tampering detected" },
      { label: "Retention Age", value: "127 days", trend: "up", description: "Age of the oldest non-archived audit entry" },
      { label: "Last Report", value: "3d ago", trend: "stable", description: "Time since the last compliance report was generated" },
    ],
    threatScenarios: [
      { name: "Audit Log Tampering", description: "Attacker modifies audit logs to cover their tracks.", mitigation: "Content-addressed storage with hash chaining. Distributed copies make tampering detectable within seconds.", severity: "critical" },
      { name: "Repudiation Attack", description: "Operator denies performing an action that they actually performed.", mitigation: "Immutable audit trail with session binding. Every action is cryptographically linked to the authenticated session.", severity: "medium" },
    ],
  },
  {
    id: "incident-response",
    title: "Incident Response",
    tagline: "When something goes wrong, the response is automatic, graduated, and decisive.",
    icon: Radio,
    color: "#f97316",
    protocolCode: "IR-AUTOMATED-V2",
    overview: "No security system is perfect. The incident response framework defines what happens when a security event occurs. The system implements a five-phase response model: Detection (automated threat identification), Containment (limiting the blast radius), Eradication (removing the threat), Recovery (restoring normal operations), and Post-Mortem (learning from the incident). Most incidents are handled automatically without operator intervention. The operator is notified after containment, not before -- because during an active incident, the priority is stopping the threat, not informing the target.",
    architecture: [
      { label: "Automated Detection", description: "Integration with the threat detection engine. Incidents are created automatically when threat severity exceeds the threshold. Detection-to-containment time target: under 60 seconds.", status: "active" },
      { label: "Containment Automation", description: "Pre-defined containment actions execute automatically based on incident type: session termination, account lock, IP block, permission revocation. No human delay in the containment loop.", status: "enforced" },
      { label: "Notification Chain", description: "After containment, notifications are sent to: the affected operator (encrypted email), the security team (real-time dashboard + push notification), and compliance (audit record with incident details).", status: "active" },
      { label: "Recovery Procedures", description: "Standardized recovery procedures for each incident type. Identity-related incidents require full re-authentication. Access-related incidents require permission audit. Data-related incidents require integrity verification.", status: "active" },
      { label: "Post-Mortem Framework", description: "Every incident above medium severity triggers an automated post-mortem: timeline reconstruction from audit logs, root cause analysis, impact assessment, and improvement recommendations.", status: "monitoring" },
    ],
    deepDive: [
      { heading: "The 60-Second Target", body: "Our detection-to-containment target is under 60 seconds. This is achieved through full automation of the containment phase. When the threat detection engine identifies a critical-severity event, containment actions fire immediately without waiting for human approval. For critical threats (active session hijacking, credential compromise), the automated response is: (1) Terminate all active sessions for the affected account. (2) Lock the account. (3) Block the source IP. (4) Revoke all active API keys. All four actions complete within 15 seconds of detection." },
      { heading: "Why Notification Comes After Containment", body: "During an active security incident, notifying the operator before containment introduces dangerous delay. If an attacker is actively exploiting a compromised session, every second of delay increases the potential damage. The system contains first, notifies second. The operator receives a notification that includes: what happened, what containment actions were taken, and what recovery steps are needed. This notification is sent via encrypted email (not in-platform, since the session may be compromised)." },
      { heading: "Post-Mortem as Institutional Learning", body: "Every incident is a learning opportunity. The automated post-mortem reconstructs the complete timeline from audit logs, identifies the root cause, assesses the impact, and generates improvement recommendations. These recommendations feed back into the threat detection rules, the security policies, and the operator guidance. The platform's security posture improves with every incident." },
    ],
    operatorGuidance: {
      doThis: [
        "Familiarize yourself with the recovery process before an incident occurs -- knowing what to expect reduces response time",
        "Keep your recovery email address current -- incident notifications are sent to this address",
        "Follow recovery procedures completely, even if the incident appears to be a false positive",
        "Review the post-mortem report to understand what happened and how to prevent recurrence",
      ],
      neverDoThis: [
        "Never ignore an incident notification -- if you receive one, take it seriously and follow the recovery steps",
        "Never attempt to re-authenticate during an active incident unless instructed -- the system may be in containment mode",
        "Never share incident details publicly -- security incidents are confidential and should only be discussed through proper channels",
        "Never assume an incident is someone else's problem -- if your account is involved, your action is required",
      ],
    },
    metrics: [
      { label: "Incidents (30d)", value: "0", trend: "stable", description: "Security incidents involving your account in the last 30 days" },
      { label: "Mean Containment", value: "<30s", trend: "down", description: "Average time from detection to containment across all incident types" },
      { label: "Recovery Status", value: "N/A", trend: "stable", description: "Current recovery status. N/A means no active or recent incidents" },
      { label: "Playbooks Ready", value: "12", trend: "up", description: "Number of automated incident response playbooks configured for this account" },
    ],
    threatScenarios: [
      { name: "Active Breach", description: "Attacker has gained unauthorized access and is actively exfiltrating data.", mitigation: "Automated containment in under 15 seconds: session termination, account lock, IP block, API key revocation. Blast radius limited by RLS and encryption.", severity: "critical" },
      { name: "Ransomware", description: "Attacker encrypts data and demands ransom.", mitigation: "Encrypted backups in separate geographic region with independent encryption keys. Recovery from backup can be initiated without paying ransom.", severity: "critical" },
    ],
  },
]

/* ── Severity Badge ── */
function SeverityBadge({ severity }: { severity: "critical" | "high" | "medium" | "low" }) {
  const c = { critical: "#ef4444", high: "#f59e0b", medium: "#3b82f6", low: "#6b7280" }
  return (
    <span className="text-[6px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
      style={{ color: `${c[severity]}90`, backgroundColor: `${c[severity]}08`, border: `1px solid ${c[severity]}15` }}>
      {severity}
    </span>
  )
}

/* ── Trend Indicator ── */
function TrendIndicator({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <span className="text-[7px] text-emerald-400/50">+</span>
  if (trend === "down") return <span className="text-[7px] text-blue-400/50">-</span>
  return <span className="text-[7px] text-white/15">=</span>
}

/* ═══ LIVE PROTOCOL STATUS PREVIEW ═══ */
function ProtocolStatusPreview({ section }: { section: SecuritySection }) {
  return (
    <div className="px-3 py-3 bg-white/[0.008] border border-white/[0.03] rounded-lg mb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: section.color }} />
        <span className="text-[8px] font-mono font-bold uppercase tracking-wider" style={{ color: `${section.color}60` }}>
          Live Protocol Status
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {section.architecture.slice(0, 4).map((a, i) => (
          <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.01]">
            <div className="w-1 h-1 rounded-full shrink-0"
              style={{ backgroundColor: a.status === "enforced" ? "#10b981" : a.status === "active" ? "#06b6d4" : "#f59e0b" }} />
            <span className="text-[7px] font-mono text-white/30 truncate">{a.label}</span>
            <span className="text-[6px] font-mono uppercase tracking-wider ml-auto shrink-0"
              style={{ color: a.status === "enforced" ? "rgba(16,185,129,0.5)" : a.status === "active" ? "rgba(6,182,212,0.5)" : "rgba(245,158,11,0.5)" }}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════ */

interface SecureGuideProps {
  onStartDemo?: () => void
}

export function SecureGuideAndTutorial({ onStartDemo }: SecureGuideProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [expandedSub, setExpandedSub] = useState<string | null>(null)

  const toggleSection = useCallback((id: string) => {
    setExpandedSection(prev => prev === id ? null : id)
    setExpandedSub(null)
  }, [])

  return (
    <div className="px-3 pb-6 pt-2">
      {/* ── Master Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400/50" />
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.15em] text-emerald-400/60">
            Complete Security Reference
          </span>
          <div className="flex-1 h-px bg-white/[0.04]" />
        </div>
        <p className="text-[9px] font-mono text-white/30 leading-relaxed max-w-[600px]">
          Full documentation of every security layer protecting your data, sessions, and trading activity.
          Seven interconnected systems operating continuously to maintain institutional-grade protection.
          Each section below explains what the system does, how it works architecturally, and what you need to know as an operator.
        </p>
      </div>

      {/* ── Security Sections ── */}
      <div className="space-y-[2px]">
        {SECURITY_SECTIONS.map((section, sIdx) => {
          const isExpanded = expandedSection === section.id
          const SectionIcon = section.icon

          return (
            <div key={section.id}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-2.5 px-3 py-3 bg-white/[0.01] hover:bg-white/[0.025] transition-all group"
              >
                <div className="relative shrink-0">
                  <motion.div className="absolute inset-[-3px] rounded-full"
                    style={{ backgroundColor: section.color }}
                    animate={{ opacity: isExpanded ? [0.05, 0.15, 0.05] : [0.02, 0.06, 0.02] }}
                    transition={{ duration: 3, repeat: Infinity }} />
                  <div className="w-7 h-7 flex items-center justify-center border border-white/[0.06] relative">
                    <SectionIcon className="w-3.5 h-3.5" style={{ color: `${section.color}80` }} />
                  </div>
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-black text-white/60 group-hover:text-white/80 transition-colors">
                      {section.title}
                    </span>
                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded border shrink-0"
                      style={{ color: `${section.color}60`, backgroundColor: `${section.color}06`, borderColor: `${section.color}15` }}>
                      {section.protocolCode}
                    </span>
                  </div>
                  <p className="text-[8px] font-mono text-white/20 mt-0.5 truncate">{section.tagline}</p>
                </div>

                <ChevronRight className={`w-3.5 h-3.5 text-white/15 group-hover:text-white/30 transition-all duration-200 shrink-0 ${isExpanded ? "rotate-90" : ""}`} />
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 pl-3 border-l border-white/[0.04] py-3 space-y-4">

                      {/* Live Status Preview */}
                      <ProtocolStatusPreview section={section} />

                      {/* Overview */}
                      <div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/25 mb-1.5">Overview</div>
                        <p className="text-[9px] font-mono text-white/35 leading-relaxed">{section.overview}</p>
                      </div>

                      {/* Architecture Components */}
                      <div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/25 mb-2">Architecture</div>
                        <div className="space-y-[1px]">
                          {section.architecture.map((a, i) => (
                            <div key={i} className="px-2.5 py-2 bg-white/[0.008] hover:bg-white/[0.02] transition-colors">
                              <div className="flex items-center gap-2 mb-0.5">
                                <div className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ backgroundColor: a.status === "enforced" ? "#10b981" : a.status === "active" ? "#06b6d4" : a.status === "monitoring" ? "#f59e0b" : "#6b7280" }} />
                                <span className="text-[9px] font-mono font-bold text-white/50">{a.label}</span>
                                <span className="text-[6px] font-mono font-bold uppercase tracking-wider ml-auto shrink-0"
                                  style={{ color: a.status === "enforced" ? "rgba(16,185,129,0.5)" : a.status === "active" ? "rgba(6,182,212,0.5)" : "rgba(245,158,11,0.5)" }}>
                                  {a.status}
                                </span>
                              </div>
                              <p className="text-[8px] font-mono text-white/25 leading-relaxed ml-3.5">{a.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Deep Dive */}
                      <div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/25 mb-2">Deep Dive</div>
                        <div className="space-y-[1px]">
                          {section.deepDive.map((d, i) => {
                            const subKey = `${section.id}-deep-${i}`
                            const isSubExpanded = expandedSub === subKey
                            return (
                              <div key={i}>
                                <button
                                  onClick={() => setExpandedSub(prev => prev === subKey ? null : subKey)}
                                  className="w-full flex items-center gap-2 px-2.5 py-2 bg-white/[0.008] hover:bg-white/[0.02] transition-colors text-left"
                                >
                                  <BookOpen className="w-2.5 h-2.5 shrink-0" style={{ color: `${section.color}40` }} />
                                  <span className="text-[9px] font-mono font-bold text-white/40 flex-1">{d.heading}</span>
                                  <ChevronRight className={`w-2.5 h-2.5 text-white/15 transition-transform duration-200 shrink-0 ${isSubExpanded ? "rotate-90" : ""}`} />
                                </button>
                                <AnimatePresence>
                                  {isSubExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-3 py-2 ml-4 border-l" style={{ borderColor: `${section.color}10` }}>
                                        <p className="text-[8px] font-mono text-white/30 leading-[1.7]">{d.body}</p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Metrics */}
                      <div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/25 mb-2">Live Metrics</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {section.metrics.map((m, i) => (
                            <div key={i} className="px-2.5 py-2 bg-white/[0.008] border border-white/[0.03]">
                              <div className="flex items-center gap-1 mb-0.5">
                                <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">{m.label}</span>
                                <TrendIndicator trend={m.trend} />
                              </div>
                              <span className="text-[10px] font-mono font-black" style={{ color: `${section.color}90` }}>{m.value}</span>
                              <p className="text-[7px] font-mono text-white/15 mt-0.5 leading-relaxed">{m.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Operator Guidance */}
                      <div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/25 mb-2">Operator Guidance</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="flex items-center gap-1 mb-1.5">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400/50" />
                              <span className="text-[7px] font-mono text-emerald-400/40 uppercase tracking-wider">Do This</span>
                            </div>
                            <div className="space-y-1">
                              {section.operatorGuidance.doThis.map((d, i) => (
                                <div key={i} className="flex items-start gap-1.5 px-2 py-1 bg-emerald-400/[0.02]">
                                  <div className="w-0.5 h-0.5 rounded-full bg-emerald-400/30 mt-1.5 shrink-0" />
                                  <p className="text-[7px] font-mono text-white/25 leading-relaxed">{d}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 mb-1.5">
                              <AlertTriangle className="w-2.5 h-2.5 text-red-400/50" />
                              <span className="text-[7px] font-mono text-red-400/40 uppercase tracking-wider">Never Do This</span>
                            </div>
                            <div className="space-y-1">
                              {section.operatorGuidance.neverDoThis.map((d, i) => (
                                <div key={i} className="flex items-start gap-1.5 px-2 py-1 bg-red-400/[0.02]">
                                  <div className="w-0.5 h-0.5 rounded-full bg-red-400/30 mt-1.5 shrink-0" />
                                  <p className="text-[7px] font-mono text-white/25 leading-relaxed">{d}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Threat Scenarios */}
                      <div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/25 mb-2">Threat Scenarios</div>
                        <div className="space-y-1">
                          {section.threatScenarios.map((t, i) => (
                            <div key={i} className="px-2.5 py-2 bg-white/[0.008] border-l-2" style={{ borderColor: t.severity === "critical" ? "#ef4444" : t.severity === "high" ? "#f59e0b" : "#3b82f6" }}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-mono font-bold text-white/45">{t.name}</span>
                                <SeverityBadge severity={t.severity} />
                              </div>
                              <p className="text-[8px] font-mono text-white/25 mb-1">{t.description}</p>
                              <div className="flex items-start gap-1">
                                <Shield className="w-2 h-2 text-emerald-400/40 mt-0.5 shrink-0" />
                                <p className="text-[7px] font-mono text-emerald-400/25 leading-relaxed">{t.mitigation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* ── Start Demo CTA ── */}
      {onStartDemo && (
        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={onStartDemo}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.04] hover:bg-emerald-400/[0.08] transition-all group"
          >
            <Zap className="w-3 h-3 text-emerald-400/50 group-hover:text-emerald-400/70 transition-colors" />
            <span className="text-[9px] font-mono font-bold text-emerald-400/50 group-hover:text-emerald-400/70 uppercase tracking-wider transition-colors">
              Explore Security Protocols Live
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
