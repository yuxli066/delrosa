FROM alpine:latest as build-stage
WORKDIR /app

# Explicitly copy over package.json files
COPY package.json package.json
COPY ./massage-website-frontend/package.json ./massage-website-frontend/package.json

# Copy over UI content
COPY ./massage-website-frontend ./massage-website-frontend

# Install prod dependencies
RUN apk add yarn
RUN yarn install --production
RUN yarn build

# The base go-image
FROM golang:1.17.11-alpine3.16
WORKDIR /app

# Explicitly copy over go.mod file for go packages
COPY ./massage-website-backend/go.mod ./massage-website-backend/go.mod 

# Copy over backend src files
COPY ./massage-website-backend ./massage-website-backend

# Build go server
WORKDIR /app/massage-website-backend

# Copy over static content from frontend build stage
COPY --from=build-stage /app/massage-website-frontend/public ./massage-website-frontend/public
RUN go build ./src/github.com/yuxli066/massage/Main.go

# Run the server executable
EXPOSE 3000 
EXPOSE 3001
CMD [ "/app/massage-website-backend/Main" ]