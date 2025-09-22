'use client'

import {ChakraProvider, defaultSystem, Theme} from '@chakra-ui/react'
import {ColorModeProvider} from './color-mode'


export function Provider({children}) {
    return (
        <ChakraProvider value={defaultSystem}>
            <Theme appearance="light">{children}</Theme>
            {/*<ColorModeProvider {...props} />*/}
        </ChakraProvider>
    )
}
