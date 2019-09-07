# alientube
Extension that injects reddit comments into Youtube
___

## Build Setup

AlienTube requires:
* `node`
* `npm`
* `web-ext` (optional)

```bash
# install dependencies
npm install

# run tests
npm run test

# build for production with minification
npm run build

# build for development with file watch
npm run dev
```

#### Loading alienTube into your browser

##### Firefox

###### With `web-ext`

1. `npm run start`
1. This reloads the extension on any change.

###### Without `web-ext`

1. Go to `about:debugging` and tick the `Enable add-on debugging` checkbox.
1. Click `Load Temporary Add-on` and select `/manifest.json`.
1. Any time you make changes, you must go back to the `about:debugging` page and `Reload` the extension.
