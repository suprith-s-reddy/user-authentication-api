# User Authentication API

A simple user auth API from scratch which can be used for both desktop and mobile app logins using JWT.

## Project setup

Clone the repository and go to the root directory and run the following commands

```
npm install
```

```
mkdir logs
```

You need to fill in the following variables with your respective keys in the package.json

For the MAILER_SVC mailing microservice. You can find the working repository example here: https://github.com/suprith-s-reddy/mailer

```
MAILER_SVC='http://localhost:3000/send-mail'
API_SECRET='api123'
PORT=3005
AUTH_DB_URL='mongodb+srv://admin:pwd@general.kskii.mongodb.net/auth?retryWrites=true&w=majority'

```

## To run the api locally

```
npm run dev
```
