# Certificate mailer

Deploy this function alongside the existing `notify-registration` and `notify-approval` functions:

```bash
supabase functions deploy notify-certificates
supabase secrets set CERTIFICATE_TEMPLATE_URL="https://your-site.example/certificate-background.png"
```

The function reads the existing Brevo secrets `brevo_api_key`, `brevo_sender_email`, and `brevo_sender_name`. `CERTIFICATE_TEMPLATE_URL` must point to the deployed `public/certificate-background.png` asset. The background is pre-rendered from the certificate artwork; the Edge Function uses only `pdf-lib` to add each participant name and create a PDF. The function uses the authenticated admin session, so no service-role key is exposed to the browser. It creates and sends one personalized PDF certificate to every unique participant email in the selected team.
