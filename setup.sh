#!/bin/bash
hasura metadata apply
hasura migrate apply --database-name Localhost
hasura seed apply --database-name Localhost

hasura metadata reload

echo "Setup Hasura, run with: hasura console"
