# CVHouse Web

Primary web interface for cvhouse.

**Production**: [https://cvhouse.netlify.app/](https://cvhouse.netlify.app/) (Branch: _master_)

**Development**: [https://mfl-web-dev.netlify.app/](https://mfl-web-dev.netlify.app/) (Branch: _dev_)

## Getting started

- Make sure you have following tools installed:
  - [Node.js](https://nodejs.org/en/download/) (12.16+)
  - [Yarn](https://yarnpkg.com/lang/en/docs/install/)

- Clone the repo:
  ```python
  git clone https://github.com/cvhouse/cvhouse-web.git
  
  # or with ssh
  
  git clone git@github.com:cvhouse/cvhouse-web.git
  ```

- Create a _.env_ off the sample file provided:
  ```
  cp .env.sample .env
  ```

- Install project requirements:
  ```
  yarn install
  ```

- Run the project:
  ```
  yarn start
  ```

Now head over to [http://localhost:3000](http://localhost:3000) in your browser.
