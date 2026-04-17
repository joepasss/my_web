FROM node:20-slim

ARG PORT
ARG UPLOAD_PATH
ENV PORT=${PORT}
ENV UPLOAD_PATH=${UPLOAD_PATH}
RUN mkdir -p "${UPLOAD_PATH}/photos"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE ${PORT}

CMD ["npm", "start"] 
