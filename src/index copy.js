const localtunnel = require('localtunnel');
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

class TunnelManager {
    constructor() {
        this.tunnel = null;
        this.app = express();
        this.config = {
            port: process.env.LOCAL_PORT || 3000,
            apiPort: process.env.API_PORT || 5190,
            subdomain: process.env.SUBDOMAIN,
            host: process.env.LT_HOST || 'https://localtunnel.me'
        };

        // Configure CORS for the frontend
        this.app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Proxy API requests to the local API
        this.app.use('/api', createProxyMiddleware({
            target: `http://localhost:${this.config.apiPort}`,
            changeOrigin: true,
            pathRewrite: {
                '^/api': '' // Remove /api prefix when forwarding to the API
            }
        }));

        // Serve static files for the frontend
        this.app.use(express.static('public'));
    }

    async start() {
        // Start the Express server
        this.app.listen(this.config.port, () => {
            console.log(`Frontend server running on port ${this.config.port}`);
            console.log(`API proxy configured for port ${this.config.apiPort}`);
        });

        try {
            this.tunnel = await localtunnel({
                port: this.config.port,
                subdomain: this.config.subdomain,
                host: this.config.host
            });

            console.log(`Tunnel established at: ${this.tunnel.url}`);
            
            this.tunnel.on('close', () => {
                console.log('Tunnel closed. Attempting to reconnect...');
                this.reconnect();
            });

            this.tunnel.on('error', (err) => {
                console.error('Tunnel error:', err);
                this.reconnect();
            });

        } catch (err) {
            console.error('Failed to establish tunnel:', err);
            this.reconnect();
        }
    }

    async reconnect() {
        if (this.tunnel) {
            this.tunnel.close();
        }
        
        // Wait 5 seconds before attempting to reconnect
        setTimeout(() => this.start(), 5000);
    }

    async close() {
        if (this.tunnel) {
            await this.tunnel.close();
            console.log('Tunnel closed gracefully');
        }
    }
}

// Handle graceful shutdown
const tunnelManager = new TunnelManager();
process.on('SIGINT', async () => {
    console.log('Received SIGINT. Closing tunnel...');
    await tunnelManager.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Closing tunnel...');
    await tunnelManager.close();
    process.exit(0);
});

// Start the tunnel
tunnelManager.start(); 