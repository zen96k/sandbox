#! /usr/bin/env bash

set -euxo pipefail

export DEBIAN_FRONTEND=noninteractive

SCRIPT_DIRNAME=$(cd $(dirname ${0}) && pwd)
PROJECT_DIRNAME=$(cd ${SCRIPT_DIRNAME}/../.. && pwd)

cd ${PROJECT_DIRNAME}

cp -rfv .credentials.json ${HOME}/.claude/.credentials.json
cp -rfv auth.json ${HOME}/.codex/auth.json
cp -rfv .zshrc ${HOME}/.zshrc

mise use -g node
npm install -g @anthropic-ai/claude-code
npm install -g @openai/codex
