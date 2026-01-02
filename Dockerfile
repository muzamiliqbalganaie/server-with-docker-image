FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY . .

# Create data directory for SQLite
RUN mkdir -p /app/data

# Expose ports
EXPOSE 3000 9527 9010

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {let rawData = ''; r.on('data', (chunk) => { rawData += chunk; }); r.on('end', () => {try {const parsedData = JSON.parse(rawData); process.exit(parsedData.status === 'healthy' ? 0 : 1);} catch(e) {process.exit(1);}})}).on('error', () => process.exit(1));"

# Run the application
CMD ["npm", "start"]
