# Production Setup Guide

## Quick Setup Checklist

### 1. Get Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain `doggzy.online`
3. Create API key
4. Copy the API key (starts with `re_`)

### 2. Configure DNS Records
Add these DNS records for `doggzy.online`:
```
# SPF Record (TXT)
"v=spf1 include:_spf.resend.com ~all"

# DKIM Record (TXT) - provided by Resend
# DMARC Record (TXT)
"v=DMARC1; p=quarantine; rua=mailto:dmarc@doggzy.online"
```

### 3. Update Environment Variables
Create/update `.env.local`:
```bash
# Replace with your actual Resend API key
RESEND_API_KEY=re_your_actual_api_key_here

# Production settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://doggzy.online
```

### 4. Set Up Email Addresses
Create these email addresses in your email system:
- `contact@doggzy.online`
- `adoption@doggzy.online`
- `care@doggzy.online`
- `reports@doggzy.online`
- `no-reply@doggzy.online` (for sending)

### 5. Test Email Delivery
Run this test after deployment:
```bash
curl -X POST https://doggzy.online/api/forms/submit \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "contact",
    "name": "Test User",
    "email": "your-email@example.com",
    "subject": "Production Test",
    "message": "Testing email delivery in production"
  }'
```

Check that:
- You receive an email at `contact@doggzy.online`
- From header shows `Doggzy Forms <no-reply@doggzy.online>`
- Reply-To is set to `your-email@example.com`
- Email content includes all form fields and metadata

### 6. Monitor and Adjust
- Monitor email delivery rates
- Check spam folder initially
- Adjust rate limits if needed (currently 10/minute)
- Set up email forwarding rules as needed

## Troubleshooting

**Emails not sending?**
- Check RESEND_API_KEY is set correctly
- Verify domain in Resend dashboard
- Check DNS records are propagated
- Look at server logs for error messages

**Emails going to spam?**
- Ensure SPF/DKIM/DMARC records are correct
- Use Resend's domain verification
- Consider warming up the domain gradually

**Rate limiting too strict?**
- Adjust limits in `/api/forms/submit/route.ts`
- Current: 10 requests per minute per IP
- Consider user-based limits for logged-in users

## Support
- Resend Documentation: https://resend.com/docs
- DNS Checker: https://mxtoolbox.com/
- Email Testing: Send test emails to yourself first
