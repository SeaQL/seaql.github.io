import "https://www.sea-ql.org/cookieconsent/cookieconsent.umd.js";

function askCookieConsent() {
    CookieConsent.run({
        guiOptions: {
            consentModal: {
                layout: "box",
                position: "bottom left",
                equalWeightButtons: false,
                flipButtons: false
            },
            preferencesModal: {
                layout: "box",
                position: "right",
                equalWeightButtons: false,
                flipButtons: false
            }
        },
        categories: {
            necessary: {
                readOnly: true
            },
            analytics: {},
            marketing: {}
        },
        language: {
            default: "en",
            autoDetect: "browser",
            translations: {
                en: {
                    consentModal: {
                        title: "Cookie Settings",
                        description: "By clicking “Accept all cookies”, you agree SeaQL.org to store cookies on your device and disclose information in accordance with our Cookie Policy.",
                        acceptAllBtn: "Accept all cookies",
                        acceptNecessaryBtn: "Necessary cookies only",
                        showPreferencesBtn: "Customize settings",
                        footer: null,
                    },
                    preferencesModal: {
                        title: "Cookie Consent Preference Center",
                        acceptAllBtn: "Accept all cookies",
                        acceptNecessaryBtn: "Necessary cookies only",
                        savePreferencesBtn: "Confirm my choices",
                        closeIconLabel: "Close",
                        sections: [
                            {
                                title: "Cookie Usage",
                                description: "When you visit any of our websites, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences, or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give you a more personalized experience. Because we respect your right to privacy, you can choose not to allow some types of cookies. Click on the different category headings to find out more and manage your preferences. Please note, blocking some types of cookies may impact your experience of the site and the services we are able to offer."
                            },
                            {
                                title: "Strictly Necessary Cookies <span class=\"pm__badge\">Always Enabled</span>",
                                description: "These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work. These cookies do not store any personally identifiable information.",
                                linkedCategory: "necessary"
                            },
                            {
                                title: "Analytics Cookies",
                                description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous. If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.",
                                linkedCategory: "analytics"
                            },
                            {
                                title: "Advertisement Cookies",
                                description: "These cookies are used to make advertising messages more relevant to you and may be set through our site by us or by our advertising partners. They may be used to build a profile of your interests and show you relevant advertising on our site or on other sites. They do not store directly personal information, but are based on uniquely identifying your browser and internet device.",
                                linkedCategory: "marketing"
                            },
                        ]
                    }
                }
            }
        },
        onFirstConsent: ({ cookie }) => {
            console.log("CookieConsent.onFirstConsent", { cookie });
            updateClarityConsent(cookie);
        },
        onConsent: ({ cookie }) => {
            console.log("CookieConsent.onConsent", { cookie });
            updateClarityConsent(cookie);
        },
        onChange: ({ cookie, changedCategories, changedPreferences }) => {
            console.log("CookieConsent.onChange", { cookie, changedCategories, changedPreferences });
            updateClarityConsent(cookie);
        },
    });
}

function updateClarityConsent(cookie) {
    const consent = {
        analytics_Storage: cookie.categories.includes("analytics") ? "granted" : "denied",
        ad_Storage: cookie.categories.includes("marketing") ? "granted" : "denied",
    };
    console.log("clarity.consentv2", consent);
    window.clarity("consentv2", consent);
}

setTimeout(askCookieConsent, 5000);
