#! /usr/bin/env bash

set -euxo pipefail

export DEBIAN_FRONTEND=noninteractive

SCRIPT_DIRNAME=$(cd $(dirname ${0}) && pwd)
PROJECT_DIRNAME=$(cd ${SCRIPT_DIRNAME}/../.. && pwd)

cd ${PROJECT_DIRNAME}

cp -rfv .zshrc ${HOME}/.zshrc
ln -s ${PROJECT_DIRNAME}/.credentials.json ${HOME}/.claude/.credentials.json
ln -s ${PROJECT_DIRNAME}/auth.json ${HOME}/.codex/auth.json

mise use -g node
npm install -g @anthropic-ai/claude-code
npm install -g @openai/codex
