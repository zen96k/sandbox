#! /usr/bin/env bash

set -euxo pipefail

export DEBIAN_FRONTEND=noninteractive

SCRIPT_DIRNAME=$(cd $(dirname ${0}) && pwd)
PROJECT_DIRNAME=$(cd ${SCRIPT_DIRNAME}/../.. && pwd)

cd ${PROJECT_DIRNAME}

cp -rfv .zshrc ${HOME}/.zshrc

find ${HOME}/.claude -mindepth 1 -maxdepth 1 -not -name '.credentials.json' -exec rm -rf {} +
find ${HOME}/.codex -mindepth 1 -maxdepth 1 -not -name 'auth.json' -name '.credentials.json' -exec rm -rf {} +

mise use -g node
npm install -g @anthropic-ai/claude-code
npm install -g @openai/codex
