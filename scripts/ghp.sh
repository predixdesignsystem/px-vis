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

# Create a temp directory that will store the bower.json file
mkdir tmp_bower

# Clone this repo, and go into that folder
git clone ${REPO} ghp_tmp
cd ghp_tmp

# Find out our repo name from the bower file
REPO_NAME=$(grep "name" bower.json | sed 's/"name": "//' | sed 's/",//')
echo "repo name is ${REPO_NAME}"

# Copy the bower.json file out of the directory to a temp one
cp bower.json ../tmp_bower/bower.json
# ... and checkout gh-pages - create it if it doesn't exist.
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
# ... and copy the bower.json file from our temp directory into the current one, overriding it, and passing a yes in there's a prompt
yes | cp ../tmp_bower/bower.json bower.json

# Overwrite whatever is in root .bowerrc to force installation of bower packages at the root
rm -f .bowerrc
echo "{ \"directory\": \".\" }" > .bowerrc

# Overwrite whatever is in root `index.html` to create the redirect
# Note: We are not overwriting the component's documentation `index.html` file
# here, we are making sure that http://url/px-something/ redirects to
# http://url/px-something/px-something/, where the demo page is installed
rm -f index.html
meta_temp='<META http-equiv=refresh content="0;URL=COMPONENT_NAME/">'
echo ${meta_temp/'COMPONENT_NAME'/$REPO_NAME} > index.html

# Install your new tag through bower (use --force because it will fail without forcing it)
bower install ${REPO_NAME} --force
# @DARK_THEME: Force install px-dark-theme (to generate dark-theme demos)
bower install px-dark-theme --force

# ------------------------------------------------------------------------------
# BUILD PROJECT
# ------------------------------------------------------------------------------

# Go into the component folder we've just installed from bower
cd ${REPO_NAME}

# @DARK_THEME: Copy `index.html` to new file, where we will add dark theme
yes | cp index.html index-dark.html

# @DARK_THEME: Import dark-theme on the `index-dark.html` page
perl -pi -w -e 's/px-theme\/px-theme-styles.html/px-dark-theme\/px-dark-theme-styles.html/g;' index-dark.html

# ------------------------------------------------------------------------------
# SW-PRECACHE
# ------------------------------------------------------------------------------

# npm install sw-precache
# sw-precache  --root='.' --static-file-globs='**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}'

# ------------------------------------------------------------------------------
# GIT PUSH TO REMOTES
# ------------------------------------------------------------------------------

# Remember to exit out of the component before we do any git stuff
cd ../

# Do the git stuff
git add .
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
