#official Node runtime as parent image
FROM node:18 

#working directory of container set to /app
WORKDIR /app

#install dependency ffmpeg in container
RUN apt-get update && apt-get install -y ffmpeg

#Copy package.json & package-lock.jason into working dir
COPY package*.json ./

#install needed packages in package.json
RUN npm install

#copy app source inside docker image
COPY . .

#make port 3000 available outside container
EXPOSE 3000

#define command to run app using cmd [only one CMD allowed]
CMD ["npm", "start"]