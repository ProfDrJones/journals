# Nextcloud Journals 

## The idea

The Journals app is intended to provide a personal and/or collaborative Journal to Nextcloud.

It is not intended as another Notes or Todo App.

I will utilize vJournal for a couple of reasons:
* it is already supported by nextcloud DAV but is not used yet
* it closes the gap of actively supported ical object formats by nextcloud and therefore 
* vJournal was meant for journal entries
* it integrates with existing calendars
* vJournal is based (forked) on the Nextcloud calendar App as this ap already supports all key funktions for vJournal.

all credit for the hard work goes to the Nextcloud calendar Team.

I would love for contributers to support me with this project.

## :hammer_and_wrench: Installation

This App is currently in developement. There is no working version as of yet.

I would love for contributers to support me with this project.

Place this app in **nextcloud/apps/**

## Maintainers

- [Johannes Szeibert](https://github.com/ProfDrJones)

## Build the app

``` bash
# set up and build for production
make

# install dependencies
make dev-setup

# build for dev and watch changes
make watch-js

# build for dev
make build-js

# build for production with minification
make build-js-production

```
## Running tests
You can use the provided Makefile to run all tests by using:

```
make test
```
