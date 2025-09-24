'use client'
import system from '../../system.js';

import {ChakraProvider} from '@chakra-ui/react'

export function Provider({children}) {
    return (
        <ChakraProvider value={system}>
            {children}
        </ChakraProvider>
    )
}
