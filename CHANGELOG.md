# 1.0.0 (2023-04-02)


### Bug Fixes

* change terminal kit import path ([6819fb1](https://github.com/lyricstify/lyricstify/commit/6819fb1d9adc3c14a1e327b9ea9c6a0a75f1bcd5))
* **common:** add missing error message types ([79ed568](https://github.com/lyricstify/lyricstify/commit/79ed5682a0c369f71274ed3cda4ee0a3cd28b74a))
* **data-source:** change data source provider implementation ([9abfb50](https://github.com/lyricstify/lyricstify/commit/9abfb508b108c5c320868e5a4f21f5db5aa653a2))
* **initialize:** send error messages to stderr ([4dfe5b1](https://github.com/lyricstify/lyricstify/commit/4dfe5b1194543191a6d68cffe6c6a023c2cbe250))
* **lyric:** add error handling for http not found and forbidden ([9434672](https://github.com/lyricstify/lyricstify/commit/9434672a4e1dad386d20d928fe9b362912d2b7bc))
* **lyric:** fix invalid api path ([51de71d](https://github.com/lyricstify/lyricstify/commit/51de71d55548414a44f7840ebd1e3a48fbaeca13))
* **lyric:** remove unused interface properties ([a51d709](https://github.com/lyricstify/lyricstify/commit/a51d709d961e0f9c41977a14c80d82bf22fe4e8c))
* more descriptive error message ([5871f24](https://github.com/lyricstify/lyricstify/commit/5871f2421047f7eaf23dd44a6ba7071b57e493e4))
* **npm:** ignore publish bundle and executable files to npm ([f174709](https://github.com/lyricstify/lyricstify/commit/f174709f0b84b253aac4003f91d4efd443bb83ef))
* **pipe:** always use value from gradually update progress observable instead ([44a59bc](https://github.com/lyricstify/lyricstify/commit/44a59bc8ed1370389136d1679d5c163408e0fa46))
* **player:** change expired token error handling ([027fd55](https://github.com/lyricstify/lyricstify/commit/027fd55bd65d3295eb5bc6e2859b1d4e1e09f807))
* **player:** only emits event when lyrics is changed ([1bdac94](https://github.com/lyricstify/lyricstify/commit/1bdac946297d0213e70525014375d560f2d45bf4))
* **refresh-token:** add find or create from existing client to generate refresh token ([98c1f0b](https://github.com/lyricstify/lyricstify/commit/98c1f0bc3cde8d35f38e3758a0872218be9d1fc2))
* **refresh-token:** save buffer to refresh token from client id and secret ([c8436a3](https://github.com/lyricstify/lyricstify/commit/c8436a35ec117a3ba955e2001bd8a2d8a92ca082))
* **rxjs:** change incorrect error message ([0c13896](https://github.com/lyricstify/lyricstify/commit/0c1389646238a4c954e3fea0a35d18869d586e5f))
* **start:** remove last value from poll currently playing observable ([05ae0e1](https://github.com/lyricstify/lyricstify/commit/05ae0e1b49a70addfb1d2e324ec3da9c6413398d))
* **token:** change expired token validation ([7d51b8c](https://github.com/lyricstify/lyricstify/commit/7d51b8cf73e47f0e46c3e743574687b5757afdaa))
* **transformation:** add missing transformation deps ([ba5c0a6](https://github.com/lyricstify/lyricstify/commit/ba5c0a60c57927d06dc0c70225e31793051917f6))
* **transformation:** cache kuroshiro instance via closure ([b85cdc7](https://github.com/lyricstify/lyricstify/commit/b85cdc7c6318b7ad4f4765559c1162d307fb37e7))
* **transformation:** change incorrect empty array fill ([41c5d50](https://github.com/lyricstify/lyricstify/commit/41c5d50ab9347ddc6c1ba47c9acfe325abef2451))
* **transformation:** default markup to bold ([260adaa](https://github.com/lyricstify/lyricstify/commit/260adaa4e24a18474d2aab9ba8f5076db572ea01))
* **transformation:** override default value only if undefined by user ([468bb4b](https://github.com/lyricstify/lyricstify/commit/468bb4b4c6b1329352e1d8fa84b37030a153223e))
* **types:** add missing export keyword ([5960f1b](https://github.com/lyricstify/lyricstify/commit/5960f1bf4ad382acfb40cdc5c7a112c439c048da))
* **utils:** fix split string by width calculation ([8370062](https://github.com/lyricstify/lyricstify/commit/8370062c0235e3db03111c4e663a241002687640))
* **utils:** update pipeline path ([1d58aeb](https://github.com/lyricstify/lyricstify/commit/1d58aeb49d4f76c6bab81ad5d8146a862126ef8b))


### Features

* add sync type options ([f6795dc](https://github.com/lyricstify/lyricstify/commit/f6795dc2306395c188f151fb9b209359b2cceabc))
* **authorization:** initial commit for authorization module ([ef21036](https://github.com/lyricstify/lyricstify/commit/ef21036888dbf681c8ad96157e53ead5040e0d48))
* auto retry http requests when failed ([da717e7](https://github.com/lyricstify/lyricstify/commit/da717e70233f47d78d9022a1a7c51e74419a5308))
* **client:** add new find one or fail method ([b8a9d96](https://github.com/lyricstify/lyricstify/commit/b8a9d96ea39b0db6304e7c014f9cf4b27d3ec10f))
* **client:** initial commit for client module ([6d963d4](https://github.com/lyricstify/lyricstify/commit/6d963d47305370ee5b3040594c8f61d2e57c57e0))
* **common:** initial commit for observable runner contract ([f401b88](https://github.com/lyricstify/lyricstify/commit/f401b884ce4e95b1ef7dcae54d7a96b33a707b7c))
* **data-source:** encapsulate actions inside repository ([3cce2ac](https://github.com/lyricstify/lyricstify/commit/3cce2ac0414bbf72aa15842597b32e46bd6db463))
* **data-source:** initial commit for data source module ([4f55118](https://github.com/lyricstify/lyricstify/commit/4f55118cb1282a2b8fee6e59044de448c9c8d78f))
* initial commit for fresh nest app ([ff563fe](https://github.com/lyricstify/lyricstify/commit/ff563fe263bc4ab141e76959d79bd74dddff9ce1))
* **initialize:** initial commit for init command feature ([348f691](https://github.com/lyricstify/lyricstify/commit/348f69190aa9e50b6d5522b1f75accc53dc02c5c))
* **lyric:** initial commit for lyric module ([abfab9f](https://github.com/lyricstify/lyricstify/commit/abfab9f83107ed3a2faf267200bf18152e0f5bd6))
* **pipe:** initial commit for pipe command ([728b4a2](https://github.com/lyricstify/lyricstify/commit/728b4a22232e332bdaf592c5a04ee596a63d9e47))
* **player:** initial commit for player module ([46f0ab5](https://github.com/lyricstify/lyricstify/commit/46f0ab5b242ceafae198dde4ba4eaa46a8a6cda0))
* **refresh-token:** initial commit for refresh token module ([3f984a7](https://github.com/lyricstify/lyricstify/commit/3f984a7e0fc76228e78cfb2e83d971bc14308c76))
* **rxjs:** initial commit for custom rxjs operators ([9e9c7cb](https://github.com/lyricstify/lyricstify/commit/9e9c7cbeacd90ef3cd70972a3e4b0b63056618ad))
* **start:** initial commit for start command ([61d7a84](https://github.com/lyricstify/lyricstify/commit/61d7a84f2e049978ddfad59e3ef5e74e47b1a525))
* **terminal-kit:** initial commit for terminal kit module ([5f202d2](https://github.com/lyricstify/lyricstify/commit/5f202d21b66daeb84aaae795258d098fc733241e))
* **token:** initial commit for token module ([de64636](https://github.com/lyricstify/lyricstify/commit/de646363a7efd2bf991110f1c7bf2e61ed0b6efb))
* **transformation:** add horizontal align center, left, or right choices ([4d42d50](https://github.com/lyricstify/lyricstify/commit/4d42d501f4352667fd779805b1292a115c2815d2))
* **transformation:** add options to choose romanization provider ([cf69f39](https://github.com/lyricstify/lyricstify/commit/cf69f394cee83ba44b533c5c13fa2cbd9c6b8c6a))
* **transformation:** initial commit for lyrics transformations feature ([2d4d120](https://github.com/lyricstify/lyricstify/commit/2d4d120f050ed9bcfb562dbc5a77f2d2dfebf6d1))
* **utils:** initial commit for app utils ([3060d79](https://github.com/lyricstify/lyricstify/commit/3060d7906b60b90fa326b4f59d2b99f2443bc622))


### Reverts

* **github-actions:** use previous secret token configuration ([377a5ef](https://github.com/lyricstify/lyricstify/commit/377a5ef8144d156ad60c87136a7c07da085d9c9b))
