# CaretTab - New Tab Dashboard

A browser extension that replaces your New Tab page with a unique and fully customizable dashboard. **Your Tab, Your Rules!** Explore the realm of infinite customization right at your fingertips and transform the way you experience browsing. Get it today for free!

For more information visit the website for [CaretTab](http://www.bluecaret.com/carettab)

For help or feature suggestions visit the [CaretTab Support page](https://bluecaret.com/carettab/help)

## Changelog

[View the changelog on the wiki](https://github.com/bluecaret/carettab/wiki/Changelog)

## Explanation of permissions:

- **Storage**: Used to store your settings in the browser's storage area.
- **Replace the page you see when opening a new tab**: Used to replace the New Tab page with this extension.
- **This extension can read and change your data on sites**: The sites listed with this permission are used to retrieve data for CaretTab to function.
- **https://fonts.googleapis.com/***: The fonts available in the extension are from Google Fonts; this URL is where the fonts are loaded from.
- **https://dtfv5mvrx9.execute-api.us-west-2.amazonaws.com/***: This is an Amazon Web Services server that CaretTab accesses to retrieve various data such us API access for weather among other data. Data is only ever retrieved from this address, never sent.
- (Optional) **https://developer.sepush.co.za/***: Used to retrieve data for the Loadshedding widget.
- (Optional) **Read the icons of the websites you visit**: Used to display the favicons (logos) of the website you add to your quick links.
- (Optional) **Read a list of your most frequently visited websites**: Used to display the "most visited" menu on the quick links widget, when enabled.
- (Optional) **Read and change your bookmarks**: Used to display your browser bookmarks on the quick links widget, when enabled.

## Install

You can install CaretTab through the browser web stores.

**Chrome:**
[https://chrome.google.com/webstore/detail/carettab-new-tab-page/cojpndognjdcakkimaloeealehpkljna](https://chrome.google.com/webstore/detail/carettab-new-tab-page/cojpndognjdcakkimaloeealehpkljna)

**Edge:**
[https://microsoftedge.microsoft.com/addons/detail/bfpmncaohmjelebfobabccfjgmeolloe](https://microsoftedge.microsoft.com/addons/detail/bfpmncaohmjelebfobabccfjgmeolloe)

**Note:** Since this is built for chromium browsers, it is possible to install CaretTab on other browsers, however, only Chrome and Edge are officially supported.

## Contributions

If you're considering contributing, kindly review this section.

I welcome Pull Requests for:

- Bug Fixes
- Translation Fixes

Currently not accepting Pull Requests for:

- New Features
- New Translations

If you're eager to help, I genuinely value your intentions. However, since CaretTab is primarily a solo project, I strive to maintain its simplicity for easier management on my part. Consequently, I have limited time to review PRs for new features. Furthermore, each translation introduces extra overhead, which is why I'm currently not considering additional translations.

### Environment setup

Recommended to use Visual Studio Code and to install the suggested extensions in the `.vscode/extensions.json` file

Install dependencies with `npm install`

Lint with `npm run lint` and format code with `npm run format`.

Run in development with `npm run dev`, then use the "Load Unpacked" option in the browser to start load the extension.

Run `npm run build` to test a production compiled build.

Run `npm run compile:all` to prep extension for updating to the store.

## Credit

CaretTab was designed and developed by BlueCaret (John W Hancock)

[http://www.bluecaret.com/carettab](http://www.bluecaret.com/carettab) - [http://www.bluecaret.com](http://www.bluecaret.com)
