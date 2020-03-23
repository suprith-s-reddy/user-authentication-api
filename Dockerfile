# use node alpine
FROM node:alpine
# set the working directory in the container
WORKDIR /usr/app
# COPY the package json and package json lock files
COPY package*.json ./
# perform npm install
RUN npm install
# copy all files to the work directory
COPY . .
RUN mkdir logs
# run the command
CMD ["npm", "run", "start-prod"]



