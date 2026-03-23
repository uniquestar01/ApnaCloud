#!/bin/bash
# ApnaCloud One-Click Startup Script

echo "🚀 Initializing ApnaCloud SaaS Node..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null
then
    echo "⚠️ PM2 not found. Installing global process manager..."
    npm install -g pm2
fi

# Start processes
echo "📦 Starting Cloud Services..."
pm2 start ecosystem.config.js

# Save state for auto-reboot
pm2 save

echo "------------------------------------------------"
echo "✅ ApnaCloud is now LIVE!"
echo "🏠 Local Access: http://10.150.250.115:5173"
echo "🛠️ Backend Node: http://10.150.250.115:5000"
echo "------------------------------------------------"
echo "📝 Use 'pm2 logs' to see real-time activity."
echo "📝 Use 'pm2 status' to check health."
