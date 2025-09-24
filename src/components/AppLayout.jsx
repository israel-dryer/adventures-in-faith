import React from 'react';
import Header from "./Header.jsx";
import {Box, Flex, VStack} from "@chakra-ui/react";
import {Outlet} from "react-router";

const AppLayout = () => {
    return (
        <>
            <VStack h='100vh' w='full' spacing={0} align='stretch' overflow='hidden' gap={0}
                    bgImage="url(/backgrounds/green.png)" bgSize="cover" bgRepeat="norepeat">
                <Box as='header' position='sticky' top={0} zIndex='docked' w='full'>
                    <Header/>
                </Box>
                <VStack as='main' minH={0} overflowY='auto' p={0} align='center'
                        backgroundColor='rgba(255, 255, 255, 0.75)'>
                    <Flex justify='center' px={4} maxW={1200} width='full'>
                        <Outlet/>
                    </Flex>
                </VStack>
            </VStack>

        </>
    );
};

export default AppLayout;