FROM node:latest

WORKDIR /usr/src/app

# Копируем файлы зависимостей и устанавливаем их
COPY package*.json ./
RUN npm install

# Копируем все файлы проекта
COPY . .

EXPOSE 3000

CMD ["npm", "start"]