# Stage 1: Build the application
FROM node:18-alpine as build

WORKDIR /web

# Copy package.json and package-lock.json (if available)
COPY package.json . 


# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine


COPY --from=build /web/.next /usr/share/nginx/html

# Expose port 80 for the application
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
