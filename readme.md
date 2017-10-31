# testplan-helper

- Run like so: `node app.js`
  - Looks for all open issues tagged `testplan-item`
  - Determines complexity by finding something like `Complexity: 3`
  - Determines the number of testers by finding the first group of `- [ ] ...`. If it's less than 5 lines long, it's probably the list of platforms to test
- Copy the output into the endgame spreadsheet and assign test items by hand (see the endgame wiki page for details)
