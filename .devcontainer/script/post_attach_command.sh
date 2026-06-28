#! /usr/bin/env bash

set -euxo pipefail

export DEBIAN_FRONTEND=noninteractive

SCRIPT_DIRNAME=$(cd $(dirname ${0}) && pwd)
PROJECT_DIRNAME=$(cd ${SCRIPT_DIRNAME}/../.. && pwd)

cd ${PROJECT_DIRNAME}/sandbox

mise install
mise exec -- npm install
mise exec -- npx -y playwright install-deps
mise exec -- npx -y playwright-core install chromium
