
# Project Title

## Description

Frontend Med application - One clinic 

## Key Libraries

- **Next.js**
- **React**
- **Ant Design (antd)**
- **Axios**
- **Chart.js and react-chartjs-2**
- **TypeScript**

## Project Structure

### General Structure

- **`.storybook`**: Configurations for Storybook.
- **`public`**: Static files (images, favicons).
- **`src`**: Application source code.
- **`Dockerfile`**: Instructions for creating a Docker container.
- **`next.config.js`**: Next.js configuration.
- **`package.json`**: Project dependencies and scripts.
- **`tsconfig.json`**: TypeScript configuration.
- **Configuration files** (ESLint, PostCSS, Tailwind CSS, etc.).

### Contents of `src`

1. **`entities`**: Business logic and data.
2. **`features`**: Code for individual application features.
3. **`middleware.ts`**: Middleware for Next.js.
4. **`pages`**: React/Next.js page components.
5. **`shared`**: Shared code (utilities, components, hooks).
6. **`stories`**: Files for Storybook.
7. **`styles`**: Application styles (CSS, Sass).
8. **`widgets`**: Small components (widgets).

## Installation

1. **Install dependencies:**
   ```bash
   yarn install
   ```
2. **Start the project:**
   ```bash
   yarn dev
   ```

## Running

Start the application:
```bash
yarn dev
```
Accessible at `http://localhost:3000`.


### Adding New Code

- Follow the naming conventions for branches and commits.
- Use Pull Requests to integrate changes.

