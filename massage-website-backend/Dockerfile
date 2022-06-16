# The base go-image
FROM golang:1.17.11-alpine3.16
 
# Create a directory for the app
RUN mkdir /app
 
# Copy all files from the current directory to the app directory
COPY . /app
 
# Set working directory
WORKDIR /app
 
# Run command as described:
RUN go install
RUN go build ./src/github.com/yuxli066/massage/Main.go
 
# Run the server executable
EXPOSE 3000
CMD [ "/app/Main" ]