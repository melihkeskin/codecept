#!/usr/bin/env bash

VERSION=${1:-latest}

echo "Pulling image ${VERSION}"
mkdir report

docker run --rm \
    -v "$(pwd)"/report/:/var/jenkins_home/workspace/Codecept/report/ \
    Codecept/pipe:${VERSION}

status=$?

echo "Final status ${status}"
exit ${status}
