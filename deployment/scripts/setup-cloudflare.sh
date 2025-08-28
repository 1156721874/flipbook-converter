#!/bin/bash

echo "Cloudflare R2 and Workers Setup Guide"
echo "====================================="

echo ""
echo "1. Cloudflare R2 Storage Setup:"
echo "   - Login to Cloudflare Dashboard"
echo "   - Navigate to R2 Object Storage"
echo "   - Create a new bucket named: flipbook-storage"
echo "   - Generate R2 API token with read/write permissions"
echo "   - Set custom domain for public access (CDN)"

echo ""
echo "2. Required Environment Variables:"
echo "   export R2_ACCESS_KEY_ID='your-access-key'"
echo "   export R2_SECRET_ACCESS_KEY='your-secret-key'"
echo "   export R2_BUCKET_NAME='flipbook-storage'"
echo "   export R2_ENDPOINT_URL='https://your-account-id.r2.cloudflarestorage.com'"
echo "   export R2_PUBLIC_URL='https://your-cdn.example.com'"

echo ""
echo "3. Cloudflare Workers (Optional - for edge processing):"
echo "   - Create a new Worker"
echo "   - Deploy the worker script for file processing"
echo "   - Configure worker routes and triggers"

echo ""
echo "4. Cloudflare D1 Database (Alternative to SQLite):"
echo "   - Create D1 database: flipbook-db"
echo "   - Run migration scripts"
echo "   - Update DATABASE_URL in environment"

echo ""
echo "5. CDN Configuration:"
echo "   - Set up custom domain for R2 bucket"
echo "   - Configure caching rules"
echo "   - Enable compression and optimization"