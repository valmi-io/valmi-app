# Use the official Node.js v18 image as the base image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Install the Yarn package manager
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# Copy the package.json and yarn.lock files to the container
COPY package.json ./

# Install the application dependencies using Yarn
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Set the command to run the Next.js development server using Yarn
CMD ["yarn", "dev"]
