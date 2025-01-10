#!/bin/bash

# ----------------------------
# Script: deploy.sh
# Description: Deploy to Home Assistant via FTP
# Author: Carl Lindman
# Environment Variables: .env
# ----------------------------

set -euo pipefail

# Function to log messages with timestamps to both deploy.log and terminal
log() {
    # Define color codes (optional)
    GREEN='\033[0;32m'
    BLUE='\033[0;34m'
    YELLOW='\033[1;33m'
    RED='\033[0;31m'
    NC='\033[0m' # No Color

    # Determine log level based on message content (optional)
    case "$1" in
        *"Error:"*)
            COLOR=$RED
            ;;
        *"Successfully"*|*"completed"*)
            COLOR=$GREEN
            ;;
        *"Deploying"*|*"Running"*|*"Uploading"*)
            COLOR=$BLUE
            ;;
        *)
            COLOR=$NC
            ;;
    esac

    # Log message with timestamp and color
    echo -e "$(date '+%Y-%m-%d %H:%M:%S') : ${COLOR}$1${NC}" | tee -a logs/deploy.log
}

# Load environment variables from .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    log ".env file not found. Exiting."
    exit 1
fi

# Check required variables
required_vars=("FTP_HOST" "FTP_USER" "FTP_PASS" "BUILD_PATH" "REMOTE_DIR")

for var in "${required_vars[@]}"; do
    if [ -z "${!var:-}" ]; then
        log "Error: $var is not set. Exiting."
        exit 1
    fi
done

FULL_BUILD_PATH="$PWD/$BUILD_PATH_DIR"

display_header() {
    log "=============================================="
    log "          Deploying to Home Assistant         "
    log "                  via FTP                     "
    log "=============================================="
    log ""
    log "Environment Variables:"
    log "  FTP_HOST: $FTP_HOST"
    log "  FTP_USER: $FTP_USER"
    log "  FTP_PASS: ***"  
    log "  BUILD_PATH: $BUILD_PATH"
    log "  FULL_BUILD_PATH: $FULL_BUILD_PATH"
    log "  REMOTE_DIR: $REMOTE_DIR"
    log "=============================================="
    log ""
}

display_header

log "Running the build script..."
pnpm run --silent build 
log ""

# Get the file name from the path
BUILT_FILE_PATH=$(find "$FULL_BUILD_PATH" -type f -name "$PATTERN" -print -quit)
BUILT_FILE_NAME=$(basename "$BUILT_FILE_PATH")
RESOURCE_URL="/local/vasttrafik-lovelace-card/$BUILT_FILE_NAME"

log "Uploading $BUILT_FILE_PATH to $REMOTE_DIR on $FTP_HOST..."

lftp -u "$FTP_USER","$FTP_PASS" ftp://$FTP_HOST <<EOF
    set cmd:fail-exit no       
    mkdir -p -f "$REMOTE_DIR"
    set cmd:fail-exit yes      
    cd "$REMOTE_DIR"
    put "$BUILT_FILE_PATH"
    bye
EOF

log "File upload completed successfully."

echo "$RESOURCE_URL" | pbcopy
log "Copied resource url to clipboard: $RESOURCE_URL"



