# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in OpenClaw Skills, please report it responsibly.

### How to Report

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Email security concerns directly to: **ian@allowayllc.com**
3. For core OpenClaw issues, report to: **security@openclaw.ai**
4. Include the following in your report:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Response Time**: You will receive an acknowledgment within 48 hours
- **Updates**: We will provide status updates every 5 business days
- **Resolution**: Critical vulnerabilities will be addressed within 7 days
- **Credit**: Security researchers will be credited in release notes (unless anonymity is requested)

## Security Considerations for AI Skills

### Skill Security

AI skills can execute code and access external services. Security considerations include:

- **Input Validation**: Skills should validate all user inputs
- **API Key Protection**: Never hardcode API keys in skill code
- **Data Exfiltration**: Skills should not send user data to unauthorized endpoints
- **Prompt Injection**: Guard against prompt injection attacks
- **Rate Limiting**: Implement rate limits to prevent abuse

### Secure Skill Development Checklist

- [ ] Validate and sanitize all user inputs
- [ ] Use environment variables for sensitive configuration
- [ ] Implement proper error handling (don't leak sensitive info)
- [ ] Log security-relevant events
- [ ] Follow principle of least privilege for API access
- [ ] Review third-party dependencies for vulnerabilities
- [ ] Test for common injection attacks

### Known Security Considerations

1. **External API Calls**: Skills that call external APIs should use HTTPS and validate responses.

2. **File System Access**: Skills with file system access should be sandboxed appropriately.

3. **User Data**: Any user data processed by skills should be handled according to privacy best practices.

4. **Dependency Security**: Run `npm audit` regularly and keep dependencies updated.

## Responsible Disclosure

We follow responsible disclosure practices:

1. Reporter notifies us of vulnerability
2. We acknowledge and begin investigation
3. We develop and test a fix
4. We release the fix and notify users
5. After 90 days (or upon fix release), details may be published

## Contact

- Security Email: ian@allowayllc.com
- OpenClaw Security: security@openclaw.ai
- General Contact: [@ianallowayxyz](https://x.com/ianallowayxyz)
