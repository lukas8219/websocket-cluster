FROM --platform=arm64 node:18.12.1

COPY . .

RUN rm -rf package-lock.json
RUN rm -rf node_modules
RUN npm i

EXPOSE 3000
EXPOSE 80

CMD ["node", "."]