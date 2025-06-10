# Chord Eventing Examples

This repo is meant to house example implmentations of the Chord Commerce [Tracking Plan](https://docs.chord.co/tracking-plan).

## hydrogen-quickstart

This is an example Hydrogen storefront created with `npm create @shopify/hydrogen@latest`. It can be connected to any Shopify store. To run this storefront against Chord's Plantiground Shopify store please use [this environment file](https://share.1password.com/s#FNY68qVCcZArWDrwqCX8a5sFO1mHcyymYVJdU7dkKPQ)

To run this quickstart

0. clone this repo `git clone git@github.com:chordcommerce/chord-eventing-examples.git`
1. `cd hydrogen-quickstart`
2. `cp .env.example .env`
3. populate .env with values from 1pass link above
4. `npm install`
5. `npm run dev`

The storefront should be available at `http://localhost:3001/`
