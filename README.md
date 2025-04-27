# LocalTunnel Exposer

A Node.js application that exposes local services to the internet using LocalTunnel.

## Features

- Exposes local ports to the internet via LocalTunnel
- Automatic reconnection on tunnel closure or errors
- Configurable via environment variables
- Graceful shutdown handling
- Docker support

## Environment Variables

- `LOCAL_PORT` (required): The local port to expose
- `LOCAL_HOST` (required): The local host address to expose (e.g., 'localhost' or '127.0.0.1')
- `SUBDOMAIN` (optional): The subdomain to request from LocalTunnel
- `LT_HOST` (optional): The LocalTunnel server URL (defaults to https://localtunnel.me)

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your configuration (see example .env.example):
   ```bash
   LOCAL_PORT=3000
   LOCAL_HOST=localhost
   SUBDOMAIN=myapp  # optional
   LT_HOST=https://localtunnel.me  # optional
   ```

3. Start the application:
   ```bash
   npm start
   ```

## Running with Docker

### Through docker-compose
1. Update the enviroment variables in docker-compose.yaml.
2. Run the container:
   ```bash
   docker-compose up
   ```

### Build the image and then run the image
1. Build the Docker image:
   ```bash
   docker build -t localtunnel-exposer .
   ```

2. Run the container:
   ```bash
   docker run -e LOCAL_PORT=3000 -e LOCAL_HOST=localhost -e SUBDOMAIN=myapp localtunnel-exposer
   ```
