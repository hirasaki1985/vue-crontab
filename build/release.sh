#!/bin/bash
SCRIPT_DIR=$(cd $(dirname $0); pwd)

echo "now version is"
cat $SCRIPT_DIR/../package.json | grep 'version'
echo

echo "please enter release version."
read VERSION
echo
# npm version patch

echo "Releasing $VERSINO - are you sure? (Y/N)"
read REPLY

if [[ $REPLY =~ ^[Yy]$ ]]
then
  # run tests
  echo "run tests"
  echo
  npm run test:unit

  # commit
  echo "git add and commit."
  echo
  npm version $VERSION --message "[release] $VERSION"
  git add -A
  git commit -m "[build] $VERSION"

  # push
  echo "git push"
  echo
  git push

  # add tag
  echo "git add tag"
  echo
  # git push origin refs/tags/v$VERSION
  git tag -a v$VERSION -m "[release] $VERSION"
  git push origin v$VERSION

fi
