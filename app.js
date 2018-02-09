const GitHubApi = require("github");

const github = new GitHubApi({
    // debug: true,
    protocol: "https",
    host: "api.github.com",
    headers: {
        "user-agent": "roblourens-testplan-helper"
    },
    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
    timeout: 5000
});

function getTestplanItems() {
    return github.issues.getForRepo({ owner: 'microsoft', repo: 'vscode', labels: 'testplan-item', state: 'open', per_page: 1000 }).then(result => {
        return result.data;
    });
}

function getItemComplexity(item) {
    const match = item.body.match(/\**complexity\**:?[\*,\s]*(\d+)/i);
    return match ?
        parseInt(match[1]) :
        -1;
}

const isListRow = row => !!row.match(/^\s*\- \[[x ]?\] /);
const issuesWithPreferredTesters = {};
function getNumTesters(item) {
    let lines = item.body.split(/\n/);

    const firstListRowIdx = lines.findIndex(isListRow);
    if (firstListRowIdx < 0) return -1;

    lines = lines.slice(firstListRowIdx);
    const firstNonListRowIdx = lines.findIndex(row => !isListRow(row));
    if (firstNonListRowIdx >= 0) lines = lines.slice(0, firstNonListRowIdx);

    for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(/^\s*\- \[[x ]?\]\s*\S*(@\S+)/);
        if (match) {
            issuesWithPreferredTesters[item.number] = (issuesWithPreferredTesters[item.number] || '') + ',' + match[1];
        }
    }
    
    const numListRows = lines.length;
    return numListRows <= 5 ?
        numListRows : -1;
}

function getItemData(item) {
    return {
        number: item.number,
        author: item.user.login,
        title: item.title,
        complexity: getItemComplexity(item),
        numTesters: getNumTesters(item)
    };
}

getTestplanItems().then(items => {
    items = items.map(getItemData);

    logItems(items, ['number', 'author', 'numTesters', 'complexity']);
    
    console.log('\n\n===');
    if (Object.keys(issuesWithPreferredTesters).length) {
        console.log(`Below issues have preferred testers:`)
        for (var issue in issuesWithPreferredTesters) {
            console.log(`${issue}: ${issuesWithPreferredTesters[issue].substr(1)}`);
        }
    }

    console.log('\n\n===');
    logItems(items, ['title']);
    
}, err => {
    console.error(err);
});

function logItems(items, props) {
    // Log header
    console.log(props.join('\t'));

    // Log values
    items.forEach(item => {
        console.log(props
            .map(prop => item[prop])
            .join('\t'));
    });
}