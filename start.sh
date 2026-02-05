#!/bin/bash
# Start GumboBall Application

echo "Starting GumboBall..."

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the server
npm start
