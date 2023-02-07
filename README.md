# Twitter Clone
Cloning twitter and change the flavour a bit :D

## Features
1. Tweets
- [x] Create chaining tweet
- [x] Update individual tweet
- [x] Delete tweet
- [x] Get tweet (infinite scroll)
2. Users
- [x] Sign up / in
- [x] Log out
- [x] Get their profile
3. Like
- [x] Like tweet
- [ ] Dislike tweet
4. Following system
- [ ] Follow user
- [ ] Unfollow user

## How to spin this app
> you can use your own MySQL and Redis install like usuall, but im using docker to run them.
> And make sure to have Node JS v16 or above, and postman installed (for testing purpose)
1. clone this repo `git clone http://github.com/zulfikarrosadi/twitter-clone.git`
1. change the current dir `cd twitter-clone`
1. change the database connection string in env file
1. run `npm i`
1. create MySQL database called `twitter_clone`
1. migrate the db `npx prisma migrate dev --name "init"`
1. turn on MySQL and Redis using docker or run it in your way `docker-compose up -d`
1. run `npm run dev`
1. import the `Twitter Clone.postman_collection.json` to Postman
1. and test the available endpoint