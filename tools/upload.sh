#!/bin/bash
url="http://localhost:3000"
# Generated at /settings
TOKEN=""

set -e # Exit on error

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

# Set the API endpoint URL
# {"id":"clel2nl7b0003p0scejnggjar","title":"test","visibility":"unlisted","password":"","createdAt":"2023-02-26T07:30:48.215Z","updatedAt":"2023-02-26T07:30:48.215Z","deletedAt":null,"expiresAt":null,"parentId":null,"description":"","authorId":"clc4babr80000p0gasef3i5ij"}⏎
# Set the bearer token

header="Authorization: Bearer $TOKEN"

# Set the JSON payload
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

# Send the POST request to the API endpoint
response=$(curl -s -X POST -H "$header" -H "Content-Type: application/json" -d "$json" "$url/api/post")

# Extract the ID from the response using jq
id=$(echo "$response" | jq -r '.id')

# Construct the URL with the ID
url_with_id="$url/post/$id"

# Print the URL
echo "$url_with_id"
