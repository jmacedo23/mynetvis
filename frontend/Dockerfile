# frontend/Dockerfile
# frontend/Dockerfile
FROM node:18-slim

WORKDIR /app

# Copy only the package manifests and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Now copy the rest of the code
COPY . .

# Ensure Vite binary is available in PATH
ENV PATH="/app/node_modules/.bin:$PATH"

EXPOSE 3000
CMD ["npm", "run", "dev"]

