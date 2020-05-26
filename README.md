# AjaxFetch (esm)

[![npm package](https://img.shields.io/npm/v/ajax-fetch-esm.svg)](https://www.npmjs.org/package/ajax-fetch-esm)
[![npm download](https://img.shields.io/npm/dt/ajax-fetch-esm.svg)](https://www.npmjs.org/package/ajax-fetch-esm)
[![github license](https://img.shields.io/github/license/shallinta/ajax-fetch-esm.svg)](https://github.com/shallinta/ajax-fetch-esm/blob/master/LICENSE)
[![github issues open](https://img.shields.io/github/issues/shallinta/ajax-fetch-esm.svg)](https://github.com/shallinta/ajax-fetch-esm/issues?q=is%3Aopen+is%3Aissue)
[![github issues closed](https://img.shields.io/github/issues-closed/shallinta/ajax-fetch-esm.svg)](https://github.com/shallinta/ajax-fetch-esm/issues?q=is%3Aissue+is%3Aclosed)
![github language top](https://img.shields.io/github/languages/top/shallinta/ajax-fetch-esm.svg)
[![github stars](https://img.shields.io/github/stars/shallinta/ajax-fetch-esm.svg?style=social&label=Stars)](https://github.com/shallinta/ajax-fetch-esm)  

[![NPM](https://nodei.co/npm/ajax-fetch-esm.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/ajax-fetch-esm)

> An **esm** ajax module based on [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), with **interceptors**. This ajax module is for those environments which do not support CommonJS modules, such as [vite](https://github.com/vuejs/vite).

## Install

```sh
npm install --save ajax-fetch-esm
```

## Features

- [x] Basicaly ajax functions, such as `get`, `post`, etc.
- [x] Esm support.
- [x] Typescript support.
- [x] Based on [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
- [x] No third-party dependencies.
- [x] Singleton and multiple instances support.
- [x] Interceptors for both request and response. Use it just like axios interceptors.
- [ ] More axios-like api support.

## Usage

```js
// use singleton ajaxFetch instance
import ajaxFetch from 'ajax-fetch-esm';
// add url prefix
ajaxFetch.interceptors.request.use((config) => ({ ...config, baseURL: '/api' }));
```

```js
// use specific instance
import ajaxFetch from 'ajax-fetch-esm';

const ajaxFetchInstance = ajaxFetch.of();

ajaxFetchInstance.interceptors.request.use((config) => ({ ...config, baseURL: '/api' }));

export default ajaxFetchInstance;
```

## Recently updated

See [CHANGELOG](CHANGELOG.md).

## Contribute to this

If you'd like to perfect `AjaxFetch` and implement more axios-like api based on Fetch API, feel free contributing to this repository. I have no requirement for this, as long as it is correct. Looking forward to your PRs.
