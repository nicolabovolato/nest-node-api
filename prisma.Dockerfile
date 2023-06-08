FROM node:18-alpine
WORKDIR /app

COPY ./prisma ./prisma
RUN npm i -g prisma

RUN wget https://raw.githubusercontent.com/eficode/wait-for/v2.2.4/wait-for
RUN chmod +x ./wait-for