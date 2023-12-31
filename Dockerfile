# Build stage
FROM node:18-alpine3.16 AS build

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock to the container
COPY package.json package-lock.json ./

# Install development dependencies
RUN apk add --no-cache --virtual .build-deps \
     gcc \
     g++ \
     python3 \
     && npm install \
     && apk del .build-deps \
     && npm cache clean --force

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build

# Run stage
FROM node:18-alpine3.16 AS run

# Set the working directory to /app
WORKDIR /app

# Copy package.json package-lock.json to the container
COPY package.json package-lock.json ./

# Install dumb-init
RUN apk add --no-cache dumb-init

# Add a non-root user to run the application
RUN addgroup -g 1001 -S nodejs \
     && adduser -S nodejs -u 1001 \
     && chown -R nodejs:nodejs /app

# Switch to the non-root user
USER nodejs

# Install production dependencies
RUN npm install --production

# Copy the built application code from the build stage
COPY --chown=nodejs:nodejs --from=build /app/dist ./dist

# Copy the prisma directory from the build stage
COPY --chown=nodejs:nodejs --from=build /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3000

# Generate prisma client
RUN npx prisma generate

# Expose port for the application to listen on
EXPOSE 4040

# Start the application with dumb-init
CMD ["dumb-init", "npm", "start"]
