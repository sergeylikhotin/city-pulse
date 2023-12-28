###############################
# BUILD FOR LOCAL DEVELOPMENT #
###############################
FROM node:20.10-alpine AS development

USER node

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node prisma ./prisma
COPY --chown=node:node . .

RUN npm run prisma:generate

########################
# BUILD FOR PRODUCTION #
########################
FROM node:20.10-alpine AS build

USER node

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build
RUN npm ci --only=production && npm cache clean --force

##############
# PRODUCTION #
##############
FROM node:20.10-alpine As production

USER node

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

ENV NODE_ENV production

CMD ["npm", "run", "start:prod:container"]