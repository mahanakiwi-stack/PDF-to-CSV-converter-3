#!/bin/bash
# Cleanup script for old conversions
# Schedule this with cron: 0 * * * * /path/to/cleanup.sh

SITE_URL="https://www.pdfbankstatementtocsv.co.za"
CLEANUP_TOKEN="your-cleanup-token-here"

curl -X POST "$SITE_URL/api/conversions/cleanup" \
  -H "Authorization: Bearer $CLEANUP_TOKEN" \
  -H "Content-Type: application/json"
