# Use the official Nginx image
FROM nginx:latest

# Copy your frontend files to the Nginx HTML directory
COPY . /usr/share/nginx/html

# Expose port 80 (default for Nginx)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]