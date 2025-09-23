# Form Testing Guide

## Prerequisites
1. Set up Resend account and verify domain `doggzy.online`
2. Add `RESEND_API_KEY` to your `.env.local` file
3. Start the development server: `npm run dev`

## Test Each Form

### 1. Contact Form (/contact)
- Fill out: name, email, subject, message
- Submit and verify:
  - Success message appears
  - Email sent to `contact@doggzy.online`
  - Reply-to header set to user's email

### 2. Adoption Form (/adopt/apply)
- Fill out: name, email, phone (optional), location (optional), experience, message (optional)
- Submit and verify:
  - Success page appears
  - Email sent to `adoption@doggzy.online`

### 3. Foster Form (/foster/apply)
- Same fields as adoption
- Email sent to `adoption@doggzy.online`

### 4. Careers Form (/careers/apply)
- Fill out: name, email, portfolio (optional), location (optional), position, message (optional)
- Submit and verify:
  - Success page appears
  - Email sent to `care@doggzy.online`

### 5. Report Form (/report)
- Step 1: Description (required)
- Step 2: Location (required), date (required), time (optional), animals (optional), ongoing checkbox
- Step 3: Anonymous toggle, contact details if not anonymous
- Submit and verify:
  - Success page appears
  - Email sent to `reports@doggzy.online`

## Email Content Verification
Each email should contain:
- Proper subject line with form type and sender name
- All submitted form fields in a table
- Metadata section with submission ID, timestamp, IP, user agent, referrer
- Reply-to header set to user's email (when provided)

## Error Testing
- Test honeypot protection (fill 'website' field)
- Test validation errors (empty required fields)
- Test rate limiting (submit 10+ times rapidly)
- Test with RESEND_API_KEY missing (should return 500 error)

## Recipients Mapping
- contact → contact@doggzy.online
- adopt → adoption@doggzy.online
- foster → adoption@doggzy.online
- careers → care@doggzy.online
- report → reports@doggzy.online
- fallback → care@doggzy.online
