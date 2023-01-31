FROM node:16-alpine

ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ARG BASE_API
ENV BASE_API=$BASE_API

WORKDIR /app

COPY package.json ./
RUN npm install

COPY next.config.js ./next.config.js
COPY pages ./pages
COPY public ./public
COPY styles ./styles
COPY types ./types
COPY components ./components
COPY src ./src
COPY middleware.ts ./middleware.ts
COPY next-env.d.ts ./next-env.d.ts
COPY tsconfig.json ./tsconfig.json
COPY postcss.config.js ./postcss.config.js
COPY tailwind.config.js ./tailwind.config.js
EXPOSE 3000
CMD ["npm", "run", "dev"]

