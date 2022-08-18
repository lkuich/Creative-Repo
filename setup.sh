#!/bin/bash
hasura metadata apply
hasura migrate apply --database-name localhost
hasura seed apply --database-name localhost

hasura metadata reload

echo "Setup Hasura, run with: hasura console"
