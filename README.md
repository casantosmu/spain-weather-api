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

1. Copy the example environment file to a new file named .env with the following command:

   ```bash
   cp .env.example .env
   ```

1. Run the application in watch and debug mode with the following command:

   ```bash
   docker compose up --build -d
   ```

1. To connect a debugger, open Chrome and type the following into the address bar:

   `about:inspect`

   This will open the DevTools that are connected to the running Node.js process inside the Docker container.

## Running Tests

To run the tests follow these steps:

```bash
docker compose up --build -d mongo
cp .env.test.example .env.test
docker compose run --rm api npm run test
```

## Documentation

API documentation for the Spanish Weather API is written in OpenAPI 3 format and is available at /api/v1/docs. The documentation is validated using Spectral, a tool for enforcing API design rules and best practices.

## Usage

The API can be accessed at: [spain-weather.casantosmu.com](https://spain-weather.casantosmu.com/api/v1)
