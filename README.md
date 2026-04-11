# Praxis ⚡️

A powerful CLI tool for scaffolding modern web development projects with pre-configured templates for frontend, backend, and fullstack applications.

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)

## Features

- 🚀 **Interactive CLI** - Beautiful prompts with time-based greetings and animations
- 🎯 **Multiple Project Types** - Frontend, Backend, and Fullstack templates
- 💻 **Language Support** - Both TypeScript and JavaScript variants
- 🗄️ **Database Integration** - MongoDB and PostgreSQL configurations
- ⚡ **Framework Support** - ViteJS and NextJS templates
- 🛠️ **Pre-configured Templates** - Ready-to-use project structures
- 🎨 **Animated Interface** - Colorful terminal experience with figlet art
- ✅ **Dependency Checks** - Automatic Git and Node.js validation

## Prerequisites

- **Node.js** (v14 or higher)
- **Git** (for cloning templates)
- **npm** or **yarn** package manager

## Installation

### Global Installation (Recommended)

```bash
npm install -g praxiflow
```

### Usage via npx

```bash
npx praxiflow
```

## Usage

### Quick Start

1. Run the CLI tool:
   ```bash
   praxiflow
   ```

2. Follow the interactive prompts:
   - Enter your project name
   - Choose project type (Frontend/Backend/Fullstack)
   - Select your preferred language (JavaScript/TypeScript)
   - Pick a framework (ViteJS/NextJS for frontend)
   - Choose a database (MongoDB/PostgreSQL for backend)

3. Navigate to your project and install dependencies:
   ```bash
   cd your-project-name
   npm install
   ```

### Project Type Options

#### Frontend Projects
- **ViteJS Templates**: Raw Vite setup or pre-configured templates
- **NextJS Templates**: Raw Next.js setup or pre-configured templates
- **Language Options**: JavaScript or TypeScript

#### Backend Projects
- **MongoDB**: Pre-configured with Mongoose ODM
- **PostgreSQL**: Pre-configured with database connection
- **Language Options**: JavaScript or TypeScript

#### Fullstack Projects
- **ViteJS + Backend**: Complete fullstack with Vite frontend
- **NextJS + Backend**: Complete fullstack with Next.js frontend
- **Database Options**: MongoDB or PostgreSQL
- **Language Options**: JavaScript or TypeScript

### Example Usage Flow

```bash
$ praxiflow

# Welcome animation plays
# Good morning, john! Let's set up your project. 🏄

? Name of your project › my-awesome-app
? Pick a project type. › Fullstack
? Pick a language for your Fullstack Framework. › Typescript
? Choose your frontend framework. › NextJS
? Choose a Database. › MongoDB

# Installation process begins...
# 📁 Folder created: /current/path/my-awesome-app
# Installing TypeScript NextJS MongoDB framework...
# Installation successful.

# Next steps:
#   1. cd my-awesome-app/
#   2. npm install
#   3. Checkout README.md for manual
#
#   HAPPY CODING ✨✨
```

## Development

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd praxis

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the project
npm run build

# Run the built version
npm run prod
```

### Scripts

- `npm run dev` - Run with ts-node for development
- `npm run build` - Compile TypeScript to JavaScript
- `npm run prod` - Run the compiled version

## Project Structure

```
Praxis/
├── src/
│   ├── controllers/          # Core functionality controllers
│   │   ├── cancelOperation.ts    # Handle user cancellation
│   │   ├── cloneRepo.ts         # Git repository cloning
│   │   ├── ending.ts            # Final messages and branding
│   │   ├── errorHandling.ts     # Error management
│   │   ├── nextSteps.ts         # Post-installation instructions
│   │   ├── refining.ts          # Template cleanup and setup
│   │   ├── runCommand.ts        # Shell command execution
│   │   └── user_touch.ts        # User interaction utilities
│   ├── prompts/             # Interactive CLI prompts
│   │   ├── backend/             # Backend-specific prompts
│   │   ├── frontend/            # Frontend-specific prompts
│   │   ├── fullstack/           # Fullstack-specific prompts
│   │   └── projectType.ts       # Main project type selection
│   ├── utils/               # Framework installers
│   │   ├── BaseFrameworkInstaller.ts      # Base installer class
│   │   ├── BackendFrameworkInstaller.ts   # Backend templates
│   │   ├── FrontedFrameworkInstaller.ts   # Frontend templates
│   │   └── FullstackFrameworkInstaller.ts # Fullstack templates
│   └── index.ts             # Main CLI entry point
├── package.json
└── tsconfig.json
```

### Key Components

- **Controllers**: Handle core operations like repository cloning, error handling, and user interactions
- **Prompts**: Interactive CLI prompts organized by project type
- **Utils**: Framework installer classes using inheritance for different project types
- **Main Entry**: `index.ts` handles initialization, prerequisites checking, and project setup

## Template Repository Structure

The tool clones templates from branches in the format:
- `js-{framework}` - JavaScript templates
- `ts-{framework}` - TypeScript templates  
- `js-{framework}-{database}` - JavaScript fullstack templates
- `ts-{framework}-{database}` - TypeScript fullstack templates

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT

---

Built with ❤️ for the developer community
