let allure = require('allure-commandline');
let generation = allure(['generate', 'allure-results', '--clean']);
let opn = require('open');

generation.on('exit', function(exitCode) {
    console.log(`Generation finished with code: ${exitCode}`);
    opn('allure-report/index.html');
});
