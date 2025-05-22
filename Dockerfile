# filepath: /home/mmpotulo/Documents/My Projects/only-friends-ticket/Dockerfile
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clear npm cache
RUN npm cache clean --force

# Delete node_modules folder if it exists
RUN rm -rf node_modules

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]