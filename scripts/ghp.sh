#!/bin/bash

# Exit with nonzero exit code if anything fails
set -e

# ------------------------------------------------------------------------------
# CONFIGURE SCRIPT
# ------------------------------------------------------------------------------

# Set our source branch (where we'll build from) and our target branch (where we
# want to send the build page to)
SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"
REPO=`git config remote.origin.url`

# Prep git credentials
GIT_USER_NAME="Travis CI"
GIT_USER_EMAIL="PredixtravisCI@ge.com"
GIT_COMMIT_MESSAGE="[Travis] Rebuild documentation for Github Pages"

# Check if we should run a deploy, or if we should skip it. Only commits to master
# should trigger a build. Pull requests and commits to features branches should not.
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy; just doing a build."
    exit 0
fi

# ------------------------------------------------------------------------------
# PREPARE FILESYSTEM
# ------------------------------------------------------------------------------

cd $TRAVIS_BUILD_DIR

# Find out our repo name from the bower file
REPO_NAME=$(grep "name" bower.json | sed 's/"name": "//' | sed 's/",//')
echo "repo name is ${REPO_NAME}"

#delete all the files!
rm -rf node_modules
rm -rf bower_components
rm -rf css
rm -rf sass
rm -rf scripts
rm -rf test
rm *.html
rm *.json
rm *.enc
rm *.js
rm *.png
rm *.lock
rm *.ico
rm *.md
rm *.pdf
yes | rm .travis.yml
rm .bowerrc
rm .editorconfig
rm -rf .github
rm .gitignore
rm .jshintrc

# force installation of bower packages at the root
echo "{ \"directory\": \".\" }" > .bowerrc

#make sure the deploy key isn't saved into the git repo
echo "deploy_key" > .gitignore

# add the redirect.
# Note: We are not overwriting the component's documentation `index.html` file
# here, we are making sure that http://url/px-something/ redirects to
# http://url/px-something/px-something/, where the demo page is installed
meta_temp='<META http-equiv=refresh content="0;URL=COMPONENT_NAME/">'
echo ${meta_temp/'COMPONENT_NAME'/$REPO_NAME} > index.html

# ------------------------------------------------------------------------------
# BOWER
# ------------------------------------------------------------------------------
#
#for some reason, bower isn't available here, so, install it globally, so it doesn't end up as another folder.
npm install bower -g
bower cache clean
# Install the repo and the dark-theme.
bower install ${REPO_NAME} px-dark-theme px-dark-demo-theme

#copy the bower file into our root
yes | cp ${REPO_NAME}/bower.json bower.json

#and run install
bower install

# ------------------------------------------------------------------------------
# BUILD PROJECT
# ------------------------------------------------------------------------------

# Go into the component folder we've just installed from bower
# cd ${REPO_NAME}

# ------------------------------------------------------------------------------
# SW-PRECACHE
# ------------------------------------------------------------------------------

# npm install sw-precache
# sw-precache  --root='.' --static-file-globs='**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}'

# ------------------------------------------------------------------------------
# GIT PUSH TO REMOTES
# ------------------------------------------------------------------------------

# Remember to exit out of the component before we do any git stuff
# cd ../

# Do the git stuff

# checkout a new orphan
git checkout --orphan $TARGET_BRANCH

git add -A .
git commit -m "${GIT_COMMIT_MESSAGE}"

# Set git credentials (defined in settings above)
git config user.name ${GIT_USER_NAME}
git config user.email ${GIT_USER_EMAIL}


# We get the URL in this format: "https://github.com/PredixDev/px-something"
# First, we need to replace https-style remote URL with a SSH-style remote
# URL we can push to below
SSH_GIT=${REPO/https:\/\/github.com\//git@github.com:}

# Now, the URL is in this format: "git@github.com:PredixDev/px-something"
# Next, replace `PredixDev` Github organization with `predix-ui` so configure
# the correct remote to push to.
# The resulting URL will be: "git@github.com:predix-ui/px-something"
SSH_GIT_PREDIXUI=${SSH_GIT/:PredixDev\//:predix-ui\/}

# Prepare ssh key, which we'll use to authenticate for SSH-push deploy
eval `ssh-agent -s`
# ... and change permissions for deploy key
chmod 0400 $TRAVIS_BUILD_DIR/deploy_key

# Push to predix-ui/repo `gh-pages` branch (force to override out-of-date refs)
ssh-add $TRAVIS_BUILD_DIR/deploy_key
git push $SSH_GIT_PREDIXUI $TARGET_BRANCH --force

sleep 120s

curl -X DELETE "https://api.cloudflare.com/client/v4/zones/${cloudflare_zone_identifier}/purge_cache" -H "X-Auth-Email: martin.wragg@ge.com" -H "X-Auth-Key: ${cloudflare}" -H "Content-Type: application/json" --data '{"purge_everything":true}'
