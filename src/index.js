const localtunnel = require('localtunnel');
require('dotenv').config();

class TunnelManager {
    constructor() {
        this.tunnel = null;
        this.isShuttingDown = false;
        this.config = {
            port: process.env.LOCAL_PORT,
            subdomain: process.env.SUBDOMAIN,
            host: process.env.LT_HOST || 'https://localtunnel.me',
            local_host: process.env.LOCAL_HOST
        };
    }

    async start() {
        if (!this.config.port) {
            console.error('Error: LOCAL_PORT environment variable is required');
            process.exit(1);
        } else if (!this.config.local_host) {
            console.error('Error: LOCAL_HOST environment variable is required');
            process.exit(1);
        }

        try {
            this.tunnel = await localtunnel({
                port: this.config.port,
                subdomain: this.config.subdomain,
                host: this.config.host,
                local_host: this.config.local_host
            });

            console.log(`Tunnel established at: ${this.tunnel.url}`);
            
            this.tunnel.on('close', () => {
                if (!this.isShuttingDown) {
                    console.log('Tunnel closed. Attempting to reconnect...');
                    this.reconnect();
                }
            });

            this.tunnel.on('error', (err) => {
                if (!this.isShuttingDown) {
                    console.error('Tunnel error:', err);
                    this.reconnect();
                }
            });

        } catch (err) {
            console.error('Failed to establish tunnel:', err);
            if (!this.isShuttingDown) {
                this.reconnect();
            }
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
        this.isShuttingDown = true;
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