# File Storage Service

File storage service is a Microservice build to securely store your files to the Google Cloud bucket.

## Installation

File Storage Service is written in TypeScript and NodeJS, using MySQL as its primary database, make sure you have the necessary command lines tools installed for NestJS.

[Please refer to NestJS CLI for more details](https://docs.nestjs.com/cli/overview)

Follow the step to install the necessary modules for the project.

### Step 1: Install Node Modules

```cmd
npm install
```

### Step 2: Create a build

```cmd
npm run build
```

### Step 3: Configure the environment file

Please refer to the .env.sample for sample file and create .env file with the necessary configuration.

## Database Migration

File storage service uses MySQL database.

Run the following command to run migrations.

```cmd
npm run migration:run
```

Run the following command to create new migrations.

```cmd
npm run migration:generate MigrationName
```

## Usage

Run the following command to start the server.

```cmd
npm run start
```
