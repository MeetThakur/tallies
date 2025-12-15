const { withAppBuildGradle } = require('@expo/config-plugins');

function withMobileArch(config) {
    return withAppBuildGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            const pattern = /defaultConfig\s*\{/;
            if (pattern.test(config.modResults.contents)) {
                console.log('[withMobileArch] Adding ndk.abiFilters to defaultConfig');
                config.modResults.contents = config.modResults.contents.replace(
                    pattern,
                    `defaultConfig {
            ndk {
                abiFilters 'arm64-v8a'
            }`
                );
            } else {
                console.warn('[withMobileArch] Could not find defaultConfig in build.gradle');
            }
        }
        return config;
    });
}

module.exports = withMobileArch;
