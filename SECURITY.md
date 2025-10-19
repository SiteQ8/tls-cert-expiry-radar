# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The TLS Cert Expiry Radar team takes security seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please send a detailed report to:

**📧 Email:** Site@hotmail.com

**Subject:** [SECURITY] TLS Cert Expiry Radar - Brief Description

### What to Include

Please include the following information:
- Type of vulnerability
- Full paths of affected source files
- Location of the affected code (tag/branch/commit or URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact assessment (what an attacker could achieve)
- Suggested fixes (if any)

### Response Timeline

- **Within 24 hours:** Initial acknowledgment of your report
- **Within 72 hours:** Preliminary assessment and severity classification
- **Within 7 days:** Detailed response with remediation timeline
- **Within 30 days:** Release of security patch (if applicable)

### Security Update Process

1. We will confirm the vulnerability and determine its severity
2. We will develop and test a fix
3. We will prepare a security advisory
4. We will release a patched version
5. We will publicly disclose the vulnerability

### Recognition

We believe in recognizing security researchers who help keep our project safe:

- **Hall of Fame:** Listed in SECURITY.md (with permission)
- **Credits:** Mentioned in release notes
- **Swag:** TLS Cert Expiry Radar t-shirt for critical findings

### Safe Harbor

We support safe harbor for security researchers who:
- Make a good faith effort to avoid privacy violations and data destruction
- Contact us before publicly disclosing the vulnerability
- Give us reasonable time to fix the issue before disclosure

We will not pursue legal action against researchers who follow these guidelines.

## Security Best Practices

### For Users

**API Keys & Secrets**
- Never commit API keys or secrets to the repository
- Use environment variables for sensitive data
- Rotate credentials regularly
- Use least-privilege access principles

**Self-Hosted Deployments**
```bash
# Use strong passwords
# Enable HTTPS only
# Keep dependencies updated
npm audit
npm update
```

**GitHub Actions**
- Store secrets in GitHub Secrets
- Use read-only tokens when possible
- Enable branch protection rules
- Review workflow permissions

### For Contributors

**Code Security**
- Validate all user inputs
- Sanitize outputs to prevent XSS
- Use parameterized queries (prevent injection)
- Implement rate limiting
- Add CSRF protection

**Dependencies**
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check for outdated packages
npm outdated
```

**Secret Scanning**
```bash
# Install git-secrets
brew install git-secrets

# Scan repository
git secrets --scan
```

## Known Security Considerations

### Certificate Private Keys
- **We NEVER store or transmit certificate private keys**
- Only public certificate data is collected
- All scanning is read-only

### API Keys
- All API keys are encrypted at rest using AES-256
- Keys are transmitted only over HTTPS
- Session tokens expire after 24 hours

### Data Storage
- Self-hosted: You control all data
- Cloud: Data encrypted in transit and at rest
- No PII collected without explicit consent

### Network Security
- All external communications use TLS 1.2+
- Certificate pinning for critical endpoints
- DNS-over-HTTPS support

## Vulnerability Disclosure Examples

### Example: XSS Vulnerability
```
Title: Stored XSS in Certificate Domain Display

Severity: High

Description:
User-supplied domain names are rendered without proper sanitization 
in the timeline view, allowing execution of arbitrary JavaScript.

Reproduction:
1. Add domain: <script>alert('XSS')</script>
2. View timeline page
3. Alert executes

Impact:
Attackers could steal session tokens or perform actions as the victim.

Suggested Fix:
Implement DOMPurify or similar sanitization library before rendering.
```

### Example: API Rate Limiting
```
Title: Missing Rate Limiting on Certificate Scan Endpoint

Severity: Medium

Description:
The /api/scan endpoint lacks rate limiting, allowing unlimited 
scan requests that could overwhelm target servers.

Reproduction:
1. Send 1000+ scan requests in rapid succession
2. Target servers receive excessive traffic

Impact:
Could be used for DoS attacks against third-party certificate servers.

Suggested Fix:
Implement rate limiting (e.g., 10 requests per minute per IP).
```

## Security Tools We Use

- **Dependabot:** Automated dependency updates
- **CodeQL:** Static code analysis
- **npm audit:** Vulnerability scanning
- **HTTPS Everywhere:** Enforce encrypted connections
- **Snyk:** Continuous security monitoring

## Compliance

TLS Cert Expiry Radar aims to help organizations maintain compliance with:

- **PCI DSS:** Requirement 6.5 (secure development)
- **SOC 2:** Security controls
- **ISO 27001:** Information security management
- **GDPR:** Data protection (when applicable)

## Contact

- **Security Issues:** Site@hotmail.com
- **General Questions:** [GitHub Discussions](https://github.com/SiteQ8/tls-cert-expiry-radar/discussions)
- **LinkedIn:** [Ali AlEnezi](https://www.linkedin.com/in/alenizi/)

---

**Thank you for helping keep TLS Cert Expiry Radar and our community safe! 🔒**

Last Updated: October 19, 2025
