FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=root
ENV POSTGRES_DB=knexDB
ENV POSTGRES_HOST=localhost

EXPOSE 5432

CMD ["npm", "run", "dev"]
