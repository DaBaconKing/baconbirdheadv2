# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install

# Expose port for Render
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
