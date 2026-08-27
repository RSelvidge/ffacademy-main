# FFAcademy

Fantasy football training app. Originally built on Base44; now a self-contained static site
(hosted on **GitHub Pages**) with an **AWS serverless backend** for accounts, profiles,
league connections, and AI league validation.

- `ffacademy-main/` — the React (Vite) frontend, built to static files and published to GitHub Pages
- `aws/` — SAM template + Lambda source for the backend (DynamoDB, Cognito, API Gateway, Bedrock)

## Frontend: local development

```bash
cd ffacademy-main
npm install
cp .env.example .env   # fill in values after deploying the backend (below)
npm run dev
```

The app uses hash-based routing (`#/Dashboard`), so it works on GitHub Pages without any server config.

## Deploying the AWS backend (one time)

Requirements: [AWS CLI](https://docs.aws.amazon.com/cli/) configured, [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/).

```bash
cd aws
sam build
sam deploy --guided
```

When prompted, set the stack name (e.g. `ff-academy`), region, and confirm capabilities
(`CAPABILITY_IAM`). After the deploy finishes, the stack **Outputs** give you:

| Output | Where it goes |
|---|---|
| `ApiUrl` | `VITE_API_URL` |
| `UserPoolId` | `VITE_COGNITO_USER_POOL_ID` |
| `UserPoolClientId` | `VITE_COGNITO_CLIENT_ID` |
| `UserPoolRegion` | `VITE_COGNITO_REGION` |
| `CognitoDomain` | `VITE_COGNITO_DOMAIN` (only needed for social sign-in) |

What gets created (pay-per-request, effectively $0 at hobby traffic):

- **DynamoDB**: `ffa-users`, `ffa-connections`
- **Cognito user pool**: email/password accounts (verification code by email), plus
  optional social sign-in (see below)
- **API Gateway HTTP API** (JWT-authorized): `/profile`, `/connections[/{id}]`, `/validate-league`
- **Lambda**: profile + connections CRUD, and league validation via **Amazon Bedrock**
  (Claude). If Bedrock isn't enabled in your account, the endpoint falls back to
  realistic simulated data, so the feature keeps working.

## Social sign-in (Google / Microsoft / Yahoo)

The Auth page shows "Sign in with Google / Microsoft / Yahoo" buttons once
`VITE_COGNITO_DOMAIN` is set. The flow uses the Cognito hosted-UI OAuth endpoints
(authorization code + PKCE), so no client secret ships in the frontend.

For each provider you want to enable:

1. Create an OAuth app with the provider and register the redirect URI
   `https://<CognitoDomainPrefix>.auth.<region>.amazoncognito.com/oauth2/idpresponse`:
   - **Google**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth client ID (Web application)
   - **Microsoft**: [Entra admin center](https://entra.microsoft.com/) → App registrations (Web platform).
     The default `MicrosoftTenantId` targets personal Microsoft accounts; pass your own tenant GUID for org accounts.
   - **Yahoo**: [Yahoo developer portal](https://developer.yahoo.com/apps/) → Create app with OpenID Connect permissions
2. Re-deploy the stack passing the credentials as parameters, e.g.:

   ```bash
   sam deploy --parameter-overrides \
     GoogleClientId=xxx GoogleClientSecret=yyy \
     MicrosoftClientId=xxx MicrosoftClientSecret=yyy \
     YahooClientId=xxx YahooClientSecret=yyy
   ```

   Providers whose ClientId is left blank are skipped, and their buttons can be
   hidden via `VITE_OAUTH_PROVIDERS` (e.g. `Google,Microsoft`).
3. Set the `VITE_COGNITO_DOMAIN` (from the `CognitoDomain` stack output) and
   `VITE_OAUTH_PROVIDERS` repository secrets so the Pages build picks them up.

If your site URL ever changes, update the `OAuthCallbackURLs` stack parameter —
Cognito only redirects back to exact-match URLs.

## Deploying the site to GitHub Pages

1. In the repo on GitHub: **Settings → Pages → Source: GitHub Actions**.
2. Add the four values from the SAM outputs as repository **secrets**
   (`VITE_API_URL`, `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_REGION`).
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and publishes.

Site URL: `https://fantasyfootball.academy`

## Notes

- Training content, the season simulator, and the scoreboard are fully client-side.
- Until the backend secrets are set, the site shows a "Backend not configured" screen by design.
- CORS on the API allows the Pages origin and `http://localhost:5173`.
