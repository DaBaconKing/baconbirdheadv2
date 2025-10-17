# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install

# Expose port for Render
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
