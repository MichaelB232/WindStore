# Start your image with a node base image
FROM node:18

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

RUN npm install

# Install node packages, install serve, build the app, and remove dependencies at the end
COPY . .


EXPOSE 5000

# Start the app using serve command
CMD [ "npm", "run", "dev" ]