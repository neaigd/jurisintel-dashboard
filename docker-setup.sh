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

# Run the Docker container in the foreground
echo "Starting Docker container on port ${APP_PORT}..."

echo "JurisIntel Dashboard is starting up in a Docker container."
echo "It should be available at http://localhost:${APP_PORT} shortly."
# Wait a bit for services to come up before opening the browser
sleep 5
# Open the application URL in the default browser
xdg-open http://localhost:${APP_PORT}

docker-compose up

if [ $? -ne 0 ]; then
    echo "Docker compose up failed!"
    exit 1
fi

# Add a cleanup function
cleanup() {
    echo "Stopping and removing Docker containers, volumes, and images..."
    docker-compose down --volumes --rmi all
    echo "Cleanup complete."
}

# Set trap to call cleanup function on script exit or interruption
trap cleanup EXIT INT TERM

echo "Press Ctrl+C to stop the application and clean up resources."
# docker-compose up runs in the foreground, so no need for an infinite loop here.
# The trap will handle cleanup if the script is interrupted.
