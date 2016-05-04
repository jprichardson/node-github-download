0.5.0 / 2016-05-04
------------------
- standard update
- fix proper path when downloading ref [#14][#14]

0.4.0 / 2015-08-30
------------------
- JavaScript Standard Style http://standardjs.com
- upgraded to `fs-extra@0.24.x`

0.3.0 / 2014-06-17
------------------
* downloads to a temp dir in `cwd()` instead of `/tmp` [#4](https://github.com/jprichardson/node-github-download/pull/4)
* upgraded `"fs-extra": "~0.6.0"` to `"fs-extra": "^0.9.1"`
* drop support for Node.js `v0.8`

0.2.0 / 2013-04-29
------------------
* updated `fs-extra` dep
* Node `v0.10` compatibility
* fixed inheritance bug
* add travis-ci

0.1.1 / 2013-02-03
------------------
* Updated `fs-extra` dep.

0.1.0 / 2013-01-21
------------------
* Updated dependencies to include `adm-zip` and `fs-extra`.
* If Github API limit is hit (it's pretty low), then it'll download the zip file and extract the contents.

0.0.1 / 2013-01-17
------------------
* Initial release.

[#14]: https://github.com/jprichardson/node-github-download/pull/14      "Fix downloading specific version"
[#13]: https://github.com/jprichardson/node-github-download/issues/13    "Retrieve commit hash"
[#12]: https://github.com/jprichardson/node-github-download/issues/12    "errno -4048 rename when download"
[#11]: https://github.com/jprichardson/node-github-download/issues/11    "downloading parts of a repo"
[#10]: https://github.com/jprichardson/node-github-download/issues/10    "Update to latest version of fs-extra"
[#9]: https://github.com/jprichardson/node-github-download/issues/9      "Downloading from private repos"
[#8]: https://github.com/jprichardson/node-github-download/issues/8      "Pointing at a tag"
[#7]: https://github.com/jprichardson/node-github-download/issues/7      "github-download is not working"
[#6]: https://github.com/jprichardson/node-github-download/pull/6        "bug-fix: download files across devices now works"
[#5]: https://github.com/jprichardson/node-github-download/issues/5      "Make it possible to target a release"
[#4]: https://github.com/jprichardson/node-github-download/pull/4        "Downloading onto a different drive throws an EXDEV error"
[#3]: https://github.com/jprichardson/node-github-download/pull/3        "Added support for GitHub refs (branches, tags, commits)"
[#2]: https://github.com/jprichardson/node-github-download/issues/2      "Upgrade to working adm-zip [backlog]"
[#1]: https://github.com/jprichardson/node-github-download/issues/1      "Delete downloaded zip file [backlog]"
