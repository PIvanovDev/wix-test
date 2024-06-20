# Interview
Thank you for dedicating your time to complete our developer test interview!

At backend and frontend folders you can find the task

The recommended order to do it's backend and after that frontend

# SETUP
```
  cp .env.example .env
```
FIll environment variables
```
  export $(grep -v '^#' .env | xargs)
  docker-compose up
```

### Setup Frontend
```
  cd wix-frontend
  cp .env.example .env
```

Fill environment varialbles
```
  npm run dev
```

### Setup Backend
```
  cd wix-backend
  cp .env.example .env
```

Fill environment varialbles
```
  npm run dev
```


Open browser on port 80
Enjoy the traffic path
