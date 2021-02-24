
A barebones Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://sankinir@bitbucket.org/sankinir/cloud.git # or clone your own fork
$ cd <project name>
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku main
$ heroku open
```
