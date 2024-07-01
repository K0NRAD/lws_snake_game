FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Restliche Dateien kopieren und Anwendung bauen
COPY . .
RUN npm run build

# Stufe 2: Produktions-Image
FROM nginx:alpine

# Bau-Artefakte aus dem Build-Image kopieren
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx-Konfigurationsdatei kopieren
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port 80 freigeben
EXPOSE 80

# Nginx starten
CMD ["nginx", "-g", "daemon off;"]
