Package.describe({
    name: 'codechimera:meteor-bootstrap-sweetalert',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'A beautiful (bootstrap-styled) "replacement" for JavaScript\'s alert',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/codechimera/meteor-bootstrap-sweetalert.git',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.3.2');
    api.addFiles([
        'bootstrap-sweetalert/lib/sweet-alert.html',
        'bootstrap-sweetalert/lib/sweet-alert.css',
        'bootstrap-sweetalert/lib/sweet-alert.js'
    ], ['client']);
});