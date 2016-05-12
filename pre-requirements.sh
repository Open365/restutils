#!/bin/bash
set -e
set -u

yum install -y \
	npm

npm install -g \
	grunt \
	grunt-cli
