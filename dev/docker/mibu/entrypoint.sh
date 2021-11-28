#!/bin/bash

yarn install --frozen-lockfile

exec yarn start "$@"
