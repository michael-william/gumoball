#!/bin/bash
# Stop GumboBall Application

echo "Stopping GumboBall..."

# Find process on port 3000 and kill it
PID=$(lsof -ti:3000)

if [ -z "$PID" ]; then
    echo "GumboBall is not running (no process on port 3000)."
else
    kill $PID
    echo "GumboBall stopped (PID: $PID)."
fi
