FROM node:22-alpine

# Marca el entorno como productivo: Express desactiva vistas de error
# detalladas y npm omite las dependencias de desarrollo.
ENV NODE_ENV=production

WORKDIR /app

# La imagen node:alpine ya trae el usuario sin privilegios `node`; se le
# cede el workspace para no ejecutar la aplicacion como root.
RUN chown node:node /app

USER node

COPY --chown=node:node package*.json ./

# --omit=dev deja fuera Jest, Supertest y ESLint de la imagen final.
RUN npm ci --omit=dev

COPY --chown=node:node . .

EXPOSE 3000

# Se usa el propio Node en lugar de curl/wget para no depender de binarios
# adicionales en la imagen alpine.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:3000/test', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["npm", "start"]
