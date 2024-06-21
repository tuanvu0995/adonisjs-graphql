# adonisjs-graphql (WIP)

[![codecov](https://codecov.io/github/tuanvu0995/adonisjs-graphql/graph/badge.svg?token=MS5XM1U2I1)](https://codecov.io/github/tuanvu0995/adonisjs-graphql)
[![npm version](https://badge.fury.io/js/adonisjs-graphql.svg)](https://badge.fury.io/js/adonisjs-graphql)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

<p align="center">
<img src="https://raw.githubusercontent.com/tuanvu0995/adonisjs-graphql/main/docs/img/adonis-graphql.png" width="280px" alt="Adonis Graphql">
</p>

## Introduction

As a lightweight and straightforward package specifically designed for the AdonisJS web framework, this package focuses on the code-first approach, enabling developers to easily build GraphQL servers directly within their AdonisJS applications.

With an emphasis on simplicity, ease of use, and seamless integration with AdonisJS, it eliminates the need for additional layers such as ExpressJS or Apollo Server. By running directly on the AdonisJS server and tightly integrating with the framework and Lucid ORM, this package can provide a smooth experience for developers looking to implement GraphQL functionality in their projects.

## Features

- **Code-First Approach**: Define your schema using TypeScript classes and decorators.
- **Type Safety**: Leverage TypeScript's static typing to ensure type safety across your schema.
- **Decorators**: Use decorators to define your schema, resolvers, and middleware.
- **Lucid ORM Integration**: Seamlessly integrate with AdonisJS' Lucid ORM to query your database.
- **Middleware**: Define middleware to run before or after your resolvers.
- **Subscriptions**: Use GraphQL subscriptions to push real-time updates to your clients.

## Prerequisites

- This package requires AdonisJS v6

## Installation

Install the package and peer dependencies:

```bash
# Using npm
npm install adonisjs-graphql graphql

# Using yarn
yarn add adonisjs-graphql graphql
```

Configure the package by running the following command:

```bash
node ace configure adonisjs-graphql
```

This will create a new `playground.html` file in the `public` directory, and a new `graphql.ts` file in the `config` directory.

## Usage

Soon

Note: You can look at to `app` directory to see the example.

## Development

To get started with development, clone the repository and install the dependencies:

```bash
git clone https://github.com/tuanvu0995/adonisjs-graphql.git
cd adonisjs-graphql
npm install
cp .env.example .env
```

You can run the tests using the following command:

```bash
# Run all tests
npm run test

# Run unit tests
npm run test unit

# Run e2e tests
npm run test e2e
```

To start the development server, run the following command:

```bash
npm run dev
```

This will start the AdonisJS server with the GraphQL playground enabled.

Go to [http://localhost:3333/graphql](http://localhost:3333/graphql) to access the playground and start running queries.

## Contributing

Any contributions from the community are welcome.

Find a bug, a typo, or something that’s not documented well? We’d love for you to open an issue telling us what we can improve! Follow the [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

We love your pull requests! Check out our Good First Issue and Help Wanted tags for good issues to tackle. Check out our contributors guide for more information.

If you like what you see, star us on GitHub.

## Progress

| Status | Milestone              | Goals |   ETA    |
| :----: | :--------------------- | :---: | :------: |
|   ✅   | **Type and Field**     | 2 / 2 | May 2024 |
|   ✅   | **Query and Mutation** | 2 / 2 | Jun 2024 |
|   ✅   | **Relationship**       | 4 / 5 | Jun 2024 |
|   ✅   | **Middleware**         | 1 / 1 | Jun 2024 |
|   🚀   | **Subscription**       | 0 / 1 | Jul 2024 |
|   😃   | **Dataloader**         | 0 / 1 | Jul 2024 |
|   😃   | **Directives**         | 0 / 1 | Aug 2024 |
|   😃   | **Extensions**         | 0 / 1 | Aug 2024 |
|   😃   | **Great Playground**   | 0 / 1 | Aug 2024 |
|   😃   | **More Improvements**  | 0 / - | Sep 2024 |

Updated: Wed, 19 Jun 2024

## Who is using adonisjs-graphql?

- [TheDevLog.net](https://thedevlog.net) - A reddit clone.

## License

This package is open-sourced software licensed under the [MIT license](https://raw.githubusercontent.com/tuanvu0995/adonisjs-graphql/main/LICENSE).
