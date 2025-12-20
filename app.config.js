export default ({ config }) => {
    const isGithubRelease = process.env.EAS_BUILD_PROFILE === "github";

    if (isGithubRelease) {
        if (!config.plugins) {
            config.plugins = [];
        }
        config.plugins.push("./plugins/withMobileArch");
    }

    return {
        ...config,
        name: "Tallies",
        slug: "tallies",
        version: "1.3.0",
        orientation: "portrait",
        owner: "meet11",
        icon: "./assets/images/icon.png",
        scheme: "tallies",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.meet11.tallies",
        },
        android: {
            adaptiveIcon: {
                backgroundColor: "#1A1D22",
                foregroundImage: "./assets/images/android-icon-foreground.png",
                backgroundImage: "./assets/images/android-icon-background.png",
                monochromeImage: "./assets/images/android-icon-monochrome.png",
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            package: "com.meet11.tallies",
            versionCode: 3,
        },
        web: {
            output: "static",
            favicon: "./assets/images/favicon.png",
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#1A1D22",
                    dark: {
                        backgroundColor: "#000000",
                    },
                },
            ],
            "expo-font",
            ...(isGithubRelease ? ["./plugins/withMobileArch"] : [])
        ],
        experiments: {
            typedRoutes: true,
            reactCompiler: true,
        },
        extra: {
            router: {},
            eas: {
                projectId: "c58eea89-2666-4b7b-8373-627df7df114a",
            },
        },
    };
};
