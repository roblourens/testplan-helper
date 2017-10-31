# testplan-helper

- Run like so: `node app.js`
  - Looks for all open issues tagged `testplan-item`
  - Determines complexity by finding something like `Complexity: 3`
  - Determines the number of testers by finding the first group of `- [ ] ...`. If it's less than 5 lines long, it's probably the list of platforms to test
- Copy the output into [the endgame spreadsheet](https://microsoft.sharepoint.com/:x:/t/DD_OTP/EQWFvKyqekhMi2Nqmwgm8c8BSzvvUyzpTxwX3MVYax7Nzg?e=47368767ca6747e18a25a258dd60e8a6) and assign test items by hand
