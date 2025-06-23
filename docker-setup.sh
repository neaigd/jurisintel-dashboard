#!/bin/bash

# Define the service name from docker-compose.yml
SERVICE_NAME="jurisintel_app"

# Define the port
APP_PORT="5005"

# Build the Docker image
echo "Building Docker image..."
docker-compose build

if [ $? -ne 0 ]; then
    echo "Docker build failed!"
    exit 1
fi

# Run the Docker container
echo "Starting Docker container on port ${APP_PORT}..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "Docker compose up failed!"
    exit 1
fi

echo "JurisIntel Dashboard is starting up in a Docker container."
echo "It should be available at http://localhost:${APP_PORT} shortly."

# Add a cleanup function
cleanup() {
    echo "Stopping and removing Docker containers, volumes, and images..."
    docker-compose down --volumes --rmi all
    echo "Cleanup complete."
}

# Set trap to call cleanup function on script exit or interruption
trap cleanup EXIT INT TERM

# Keep the script running in the foreground to allow cleanup on Ctrl+C
echo "Press Ctrl+C to stop the application and clean up resources."

# Wait indefinitely for Ctrl+C
while true; do
    sleep 1
done
