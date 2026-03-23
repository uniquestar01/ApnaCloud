# ApnaCloud NAS Hosting Guide

Follow these steps to host your ApnaCloud NAS on your Raspberry Pi and access it from any device.

## 1. Get your Raspberry Pi's IP Address
To access the website from other devices (phone, laptop), you need the local IP of your Pi.
- Open the terminal on your Raspberry Pi.
- Type: `hostname -I`
- You will see an IP like `192.168.1.XX`. **Note this down.**

## 2. Start Services Permanently (PM2)
We use **PM2** to keep the website running even if you close the terminal or restart the Pi.
- In the project folder (`ApnaCloud`), run:
  ```bash
  pm2 start ecosystem.config.js
  pm2 save
  pm2 startup
  ```
- This ensures ApnaCloud starts automatically when the Pi boots up.

## 3. Local Network Access
Now, on any device connected to the same Wi-Fi:
- **For Website**: Open browser and type `http://<YOUR_PI_IP>:5173`
- **For Backend**: `http://<YOUR_PI_IP>:5000`

## 4. Hosting Outside Home (Internet Access)
If you want to access your files from anywhere in the world, use a "Tunnel".

### [Option A] Cloudflare Tunnel (Recommended)
Free and very secure (no port forwarding needed).
1. Install `cloudflared` on your Pi.
2. Run `cloudflared tunnel login`.
3. Create a tunnel to `http://localhost:5173`.
4. Point your domain (e.g., `cloud.yourname.com`) to the tunnel.

### [Option B] Tailscale (Easiest Private Network)
1. Install Tailscale on your Pi and your Phone/Laptop.
2. Use the Tailscale IP of your Pi to access the website securely from anywhere.

## 5. Summary of Ports
- **Frontend**: `5173` (The UI you see)
- **Backend API**: `5000` (The engine)
- **Storage Path**: `/home/sakshi/apnacloud-storage` (Default)

> [!IMPORTANT]
> Make sure your Pi and your accessing device are on the **Same Network** for local access.
