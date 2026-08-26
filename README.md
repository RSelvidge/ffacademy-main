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

What gets created (pay-per-request, effectively $0 at hobby traffic):

- **DynamoDB**: `ffa-users`, `ffa-connections`
- **Cognito user pool**: email/password accounts (verification code by email)
- **API Gateway HTTP API** (JWT-authorized): `/profile`, `/connections[/{id}]`, `/validate-league`
- **Lambda**: profile + connections CRUD, and league validation via **Amazon Bedrock**
  (Claude). If Bedrock isn't enabled in your account, the endpoint falls back to
  realistic simulated data, so the feature keeps working.

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
