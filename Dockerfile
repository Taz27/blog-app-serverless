FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Run the command inside your image filesystem.
RUN npm install

# Bundle app source
COPY . .

# Inform Docker that the container is listening on the specified port at runtime
EXPOSE 3000

# Run the specified command within the container.
CMD [ "npm", "start" ]