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
- `SUBDOMAIN` (optional): The subdomain to request from LocalTunnel
- `LT_HOST` (optional): The LocalTunnel server URL (defaults to https://localtunnel.me)

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your configuration:
   ```bash
   LOCAL_PORT=3000
   SUBDOMAIN=myapp  # optional
   LT_HOST=https://localtunnel.me  # optional
   ```

3. Start the application:
   ```bash
   npm start
   ```

## Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t localtunnel-exposer .
   ```

2. Run the container:
   ```bash
   docker run -e LOCAL_PORT=3000 -e SUBDOMAIN=myapp localtunnel-exposer
   ```

## Example Usage

To expose a local web server running on port 3000:

```bash
LOCAL_PORT=3000 npm start
```

The application will output the public URL where your service is accessible. 