const { defineConfig } = require("cypress");

module.exports = defineConfig({
        env: {
                MAILSLURP_API_KEY: "7d45a5980eec7f07da94c7d2847b0bf303cbe68e1d3f1eff8cab961973c3518f",
        },
        e2e: {
                baseUrl: "http://preprod.backmarket.fr",
                defaultCommandTimeout: 40000,
                responseTimeout: 40000,
                requestTimeout: 40000,
                setupNodeEvents(on, config) {
                        // implement node event listeners here
                },
        },
});