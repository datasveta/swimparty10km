#!/bin/bash
# Uploads public/images/gallery-thumbs/ and public/images/gallery/2026-gotit/
# to the swimparty10km-gallery R2 bucket (same relative paths as keys).
#
# Requires: `npx wrangler login` once per machine (opens a browser to
# authenticate with the Cloudflare account that owns the bucket).
set -e

BUCKET="swimparty10km-gallery"
LOGDIR="$(mktemp -d)"

upload_one() {
  f="$1"
  key="${f#public/images/}"
  npx wrangler r2 object put "$BUCKET/$key" --file "$f" --remote \
    --content-type "image/jpeg" > "$LOGDIR/$(echo "$key" | tr '/' '_').log" 2>&1
}
export -f upload_one
export BUCKET LOGDIR

{ find public/images/gallery/2026-gotit -type f 2>/dev/null; \
  find public/images/gallery-thumbs -type f 2>/dev/null; } \
  | xargs -P 12 -I{} bash -c 'upload_one "$@"' _ {}

failed=$(grep -L "Upload complete" "$LOGDIR"/*.log 2>/dev/null | wc -l | tr -d ' ')
echo "Done. $failed failed uploads (logs in $LOGDIR)."
