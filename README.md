# Spanish Weather API

The Spanish Weather API is a Node.js-based API developed with Express and TypeScript that provides complete historical climate data for cities, provinces, and the country as a whole. The API also includes tools for filtering and searching specific information, making it easy to find relevant data.

## Getting Started

To develop and debug the application, follow the steps below.

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository and navigate to the project root directory.

   ```bash
   git clone https://github.com/casantosmu/spain-weather.git
   cd spain-weather
   ```

1. Build the Docker image with the following command:

   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

   This will compile the image and start the application in debug mode.

1. To connect a debugger, open Chrome and type the following into the address bar:

   ```bash
   about:inspect
   ```

   This will open the DevTools that are connected to the running Node.js process inside the Docker container.

## Documentation

API documentation for the Spanish Weather API is written in OpenAPI 3 format and is available at /v1/docs. The documentation is validated using Spectral, a tool for enforcing API design rules and best practices.
