import {createSystem, defaultConfig, defineConfig,} from "@chakra-ui/react"

// Add just your tokens; recipes come from defaultConfig
const config = defineConfig({
        theme: {
            semanticTokens: {
                colors: {
                    primary: {value: "{colors.brandTeal.600}"},
                    accent: {
                        value: "{colors.brandCoral.600}"
                    }
                }
            },
            tokens: {
                colors: {
                    brandTeal: {
                        50: {value: "#ECF5F4"},
                        100: {value: "#D8EEEC"},
                        200: {value: "#B6E0DB"},
                        300: {value: "#8FD0C8"},
                        400: {value: "#5CB9AE"},
                        500: {value: "#2FA595"},
                        600: {value: "#0F766E"}, // primary
                        700: {value: "#0B5E57"},
                        800: {value: "#094F4A"},
                        900: {value: "#063A36"},
                    },
                    brandCoral: {
                        50: {value: "#FFF1EE"},
                        100: {value: "#FBD9D3"},
                        200: {value: "#F6B9B0"},
                        300: {value: "#F2958A"},
                        400: {value: "#F08E7E"},
                        500: {value: "#EC7B69"},
                        600: {value: "#E46853"},
                        700: {value: "#CC5946"},
                        800: {value: "#A74338"},
                        900: {value: "#7B2F27"},
                    },
                },
            },
        },
    })
;

// Build the system from defaults + your config
export const system = createSystem(defaultConfig, config)
export default system
