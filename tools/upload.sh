#!/bin/bash

# usage
# ./upload.sh -t "title" -v "visibility" -p "password" file1 file2 file3

url="https://drift.lol"

# Generate one at /settings (don't worry, this ones been revoked)
TOKEN=""

# Exit on error
set -e

visibility="unlisted"
title="Untitled"
password=""
description=""

# Parse command line arguments
while getopts ":t:d:v:p:" opt; do
    case ${opt} in
    t)
        title="$OPTARG"
        ;;
    d)
        DEBUG=1
        ;;
    v)
        visibility="$OPTARG"
        ;;
    p)
        password="$OPTARG"
        ;;
        # debug option with -D
    \?)
        echo "Invalid option -$OPTARG" 1>&2
        exit 1
        ;;
    :)
        echo "Option -$OPTARG requires an argument" 1>&2
        exit 1
        ;;
    esac
done
shift $((OPTIND - 1))

header="Authorization: Bearer $TOKEN"

json=$(
    cat <<EOF
{
  "title": "$title",
  "description": "$description",
  "visibility": "$visibility",
  "password": "$password",
  "files": [
EOF
)

# Loop through each file argument and add it to the JSON payload
for file in "$@"; do
    title=$(basename "$file")
    content=$(cat "$file")
    json=$(
        cat <<EOF
$json
    {
      "title": "$title",
       "content": $(jq -Rs . <<<"$content")
    },
EOF
    )
done

# Close the JSON payload: remove just the trailing comma and add the closing bracket
json=$(echo "$json" | sed '$s/,$//')"]}"

response=$(curl -s -X POST -H "$header" -H "Content-Type: application/json" -d "$json" "$url/api/post")

# Extract the ID from the response using jq
id=$(echo "$response" | jq -r '.id')

# Extract an error message
error=$(echo "$response" | jq -r '.error')

# If there was an error, print it and exit
if [ "$error" != "null" ]; then
    echo "Error: $error"
    exit 1
fi

# Construct the URL with the ID
url_with_id="$url/post/$id"

# Print the URL
file_or_files="files"
have_or_has="have"
if [ "$#" -eq 1 ]; then
    file_or_files="file"
    have_or_has="has"
fi

echo "Your $file_or_files $have_or_has been uploaded to $url_with_id."
