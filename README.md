# Threads for Youtube (TFY)
Extension that injects reddit comments into Youtube

## Build Setup

TFY requires:
* `node`
* `npm`
* `web-ext` (optional)

Set up your reddit API credentials in a `.env` file:

```
REDDIT_CLIENT_ID='your-client-id'
```

```bash
# install dependencies
npm install

# run unit tests
npm run test

# run integration tests (chrome)
npm run test:integration <browsers>

# build for production with minification
npm run build

# build for development
npm run dev

# build with file watch
npm run watch
```

#### Loading TFY into your browser

##### Firefox

###### With `web-ext`

1. `npm run start:firefox`
1. This reloads the extension on any change.

###### Without `web-ext`

1. Open firefox.
1. Go to `about:debugging` and tick the `Enable add-on debugging` checkbox.
1. Click `Load Temporary Add-on` and select `/manifest.json`.
1. Any time you make changes, you must go back to the `about:debugging` page and `Reload` the extension.

##### Chrome

###### With `web-ext`

1. `npm run start:chrome`
1. This reloads the extension on any change.

###### Without `web-ext`

1. Open Chrome.
1. Go to `chrome://extensions/`.
1. Click `Load unpacked` and select the project's root directory.
1. Any time you make changes, you must go back to the `chrome://extensions/` page and reload the extension by clicking the 'refresh' icon.
