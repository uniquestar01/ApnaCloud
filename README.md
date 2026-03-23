# 🚀 ApnaCloud NAS: The Ultra-Premium Private Cloud Node

ApnaCloud is a high-performance, self-hosted NAS (Network Attached Storage) system specifically engineered for Raspberry Pi. It transforms your local hardware into a secure, cinematic, and decentralized personal cloud node with a state-of-the-art management console.

![ApnaCloud Dashboard](https://images.unsplash.com/photo-1600585154340-be6199f79499?auto=format&fit=crop&q=80&w=1200)

## ✨ Features

- **💎 Ultra-Premium UI**: Cinematic glassmorphism design with fluid 60FPS animations (powered by Framer Motion).
- **🖥️ Hardware Matrix**: Real-time monitoring of CPU load, RAM utilization, and Thermal status.
- **📁 Data Streaming**: Seamless file transmission with decentralized storage allocation.
- **🔒 Security Node**: End-to-end encrypted sessions and robust JWT authentication.
- **📱 Responsive Core**: Fully optimized for mobile, tablet, and desktop viewing.
- **⚡ Zero-Latency**: Optimized for light-speed performance on Pi 4/5 hardware.

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion |
| **Engine** | Node.js, Express, better-sqlite3 |
| **Telemetry** | systeminformation, check-disk-space |
| **Deployment** | PM2 Process Manager |

## 🚀 One-Click Deployment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/uniquestar01/ApnaCloud.git
   cd ApnaCloud
   ```

2. **Initialize Node:**
   ```bash
   chmod +x start-apnacloud.sh
   ./start-apnacloud.sh
   ```

## 🌐 Local Network Access

Once active, access your private node from any device on your Wi-Fi:
- **Terminal UI**: `http://<YOUR_PI_IP>:5173`
- **Backend Node**: `http://<YOUR_PI_IP>:5000`

---

## 🤝 Collaboration & Contribution

This project is built for the community. For technical deep-dives, see our [Technical Overview](https://github.com/uniquestar01/ApnaCloud/blob/main/technical_overview.md).

Developed with ❤️ for the future of decentralized storage.
