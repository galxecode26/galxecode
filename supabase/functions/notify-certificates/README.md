# Certificate mailer

Deploy this function alongside the existing `notify-registration` and `notify-approval` functions:

```bash
supabase functions deploy notify-certificates
supabase secrets set RESEND_API_KEY=... MAIL_FROM="Team GALXECODE '26 <noreply@galxecode.in>" CERTIFICATE_TEMPLATE_URL="https://your-site.example/certificate-template.svg"
```

`CERTIFICATE_TEMPLATE_URL` must point to the supplied `public/certificate-template.svg` asset after the site is deployed. The function uses the authenticated admin session, so no service-role key is exposed to the browser. It sends one personalized SVG attachment to every unique participant email in the selected team.
