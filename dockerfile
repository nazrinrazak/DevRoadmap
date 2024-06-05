# Use the latest Node.js image
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy the package and lock files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application with --host flag
CMD ["npm", "run", "dev", "--", "--host"]