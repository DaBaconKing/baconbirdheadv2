# Use a lightweight nginx image
FROM nginx:alpine

# Copy everything from your repo into nginx's web root
COPY . /usr/share/nginx/html

# Expose port 80 so Render can serve it
EXPOSE 80

# nginx runs automatically with the base image’s default command
