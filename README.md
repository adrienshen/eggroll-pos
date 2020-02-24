# facebook-bizchat-hackathon
For Facebook Messaging Hackathon: https://fbmessaging1.devpost.com

Deadline to submit is: Deadline: 5:00pm EDT Mar 16, 2020

## Getting started

Project is based on:

- Express: http://expressjs.com/
- Postgres using Knex: http://knexjs.org/
- React: https://reactjs.org/

Requirements:

- `postgresql` running on local machine
- `node 10.xx` and `npm`
- `knex-cli`

1. Change database settings in `knexfile.js`
2. `cd` into `/db` and run migrations with `knex migrate:latest` or `knex migrate:up $filename`
3. Run application with `npm run dev`
4. Develop server-side code in `/src/server` and client code in `/src/client`
5. Messenger chat templates in `/src/messenger/templates`
