const GitHubApi = require("github");

const github = new GitHubApi({
    // debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    headers: {
        "user-agent": "vscode-github-app" // GitHub is happy with a unique user agent
    },
    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
    timeout: 5000
});

function getTestplanItems() {
    return github.issues.getForRepo({owner: 'microsoft', repo: 'vscode', labels: 'testplan-item', state: 'open'}).then(result => {
        return result.data;
    });
}

function getItemComplexity(item) {
    const match = item.body.match(/complexity:?\s+(\d+)/i);
    return match ?
        parseInt(match[1]) :
        -1;
}

const isListRow = row => !!row.match(/^\s*\- \[[x ]?\] /);
function getNumTesters(item) {
    let lines = item.body.split(/\n/);

    const firstListRowIdx = lines.findIndex(isListRow);
    if (firstListRowIdx < 0) return -1;

    lines = lines.slice(firstListRowIdx);
    const firstNonListRowIdx = lines.findIndex(row => !isListRow(row));
    if (firstNonListRowIdx >= 0) lines = lines.slice(0, firstNonListRowIdx);

    const numListRows = lines.length;
    return numListRows <= 5 ?
        numListRows : -1;
}

function getItemData(item) {
    return {
        number: item.number,
        title: item.title,
        complexity: getItemComplexity(item),
        numTesters: getNumTesters(item)
    };
}

getTestplanItems().then(items => {
    items = items.map(getItemData);

    console.log('number\tnumTesters\tcomplexity');
    items.forEach(item => {
        console.log(`${item.number}\t${item.numTesters}\t${item.complexity}`);
    });
}, err => {
    console.error(err);
});
