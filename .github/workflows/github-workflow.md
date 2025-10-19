name: TLS Certificate Scanner

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  workflow_dispatch:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  scan-certificates:
    runs-on: ubuntu-latest
    name: Scan TLS Certificates
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Scan Certificates
        id: scan
        run: |
          node scripts/scan-local.js --domains "${{ secrets.MONITORED_DOMAINS }}" --output json > scan-results.json
          echo "scan_complete=true" >> $GITHUB_OUTPUT
        continue-on-error: true
        
      - name: Check Critical Certificates
        id: check
        run: |
          CRITICAL=$(jq '.statistics.critical' scan-results.json)
          WARNING=$(jq '.statistics.warning' scan-results.json)
          echo "critical=$CRITICAL" >> $GITHUB_OUTPUT
          echo "warning=$WARNING" >> $GITHUB_OUTPUT
          
          if [ "$CRITICAL" -gt 0 ]; then
            echo "⚠️ Found $CRITICAL certificate(s) expiring in less than 30 days!"
            exit 1
          fi
          
      - name: Generate Report
        if: always()
        run: |
          echo "# TLS Certificate Scan Report" > report.md
          echo "" >> report.md
          echo "**Scan Date:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")" >> report.md
          echo "" >> report.md
          echo "## Summary" >> report.md
          echo "" >> report.md
          echo "- Total Certificates: $(jq '.statistics.total' scan-results.json)" >> report.md
          echo "- 🟢 Safe (>60 days): $(jq '.statistics.safe' scan-results.json)" >> report.md
          echo "- 🟡 Warning (30-60 days): $(jq '.statistics.warning' scan-results.json)" >> report.md
          echo "- 🔴 Critical (<30 days): $(jq '.statistics.critical' scan-results.json)" >> report.md
          echo "" >> report.md
          echo "## Certificates Requiring Attention" >> report.md
          echo "" >> report.md
          jq -r '.certificates[] | select(.status != "safe") | "- **\(.domain)** expires in \(.daysUntilExpiry) days (Status: \(.status))"' scan-results.json >> report.md
          
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('report.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report
            });
            
      - name: Send Slack Notification
        if: steps.check.outputs.critical > 0
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "🚨 TLS Certificate Alert",
              "blocks": [
                {
                  "type": "header",
                  "text": {
                    "type": "plain_text",
                    "text": "⚠️ TLS Certificate Expiry Warning"
                  }
                },
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Critical:* ${{ steps.check.outputs.critical }} certificate(s) expiring soon\n*Warning:* ${{ steps.check.outputs.warning }} certificate(s) need attention"
                  }
                },
                {
                  "type": "actions",
                  "elements": [
                    {
                      "type": "button",
                      "text": {
                        "type": "plain_text",
                        "text": "View Dashboard"
                      },
                      "url": "https://siteq8.github.io/tls-cert-expiry-radar"
                    }
                  ]
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
          
      - name: Upload Scan Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: scan-results
          path: |
            scan-results.json
            report.md
          retention-days: 30
          
      - name: Update Badge
        if: github.ref == 'refs/heads/main'
        run: |
          STATUS="passing"
          COLOR="brightgreen"
          
          if [ "${{ steps.check.outputs.critical }}" -gt 0 ]; then
            STATUS="critical"
            COLOR="red"
          elif [ "${{ steps.check.outputs.warning }}" -gt 0 ]; then
            STATUS="warning"
            COLOR="yellow"
          fi
          
          echo "Badge: $STATUS ($COLOR)"
