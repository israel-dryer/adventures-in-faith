import React from 'react';
import {Heading, HStack, Icon, IconButton, Link, Menu, Portal, Text, VStack} from "@chakra-ui/react";
import {Link as RouterLink} from 'react-router';
import {IoHome, IoLibrary, IoMenu, IoPerson} from "react-icons/io5";

const Header = () => {
    return (
        <>
            {/*Small Screen*/}
                <VStack width='100%' top={0} zIndex={10} gap={0} display={{base: 'block', md: 'none'}}>
                    <HStack width='100%' ps={4} borderBottomWidth={1} bg='gray.100'>
                        <Heading color='gray.700' fontFamily='Montserrat Alternates'> Adventures in Faith </Heading>
                        <Menu.Root>
                            <Menu.Trigger asChild>
                                <IconButton variant="ghost" aria-label='Open menu' size='lg' ms='auto'>
                                    <IoMenu></IoMenu>
                                </IconButton>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content fontFamily="Montserrat Variable">
                                        <Menu.Item value={'home'} as={RouterLink} to='/'>
                                            <Icon><IoHome></IoHome></Icon>
                                            <Text ms={2}>Home</Text>
                                        </Menu.Item>
                                        <Menu.Item value={'books'} as={RouterLink} to={'/books'}>
                                            <Icon><IoLibrary></IoLibrary></Icon>
                                            <Text ms={2}>Books</Text>
                                        </Menu.Item>
                                        <Menu.Item value={'bio'} as={RouterLink} to={'/bio'}>
                                            <Icon><IoPerson></IoPerson></Icon>
                                            <Text ms={2}>Bio</Text>
                                        </Menu.Item>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>

                    </HStack>
                </VStack>

                {/*Large Screen*/}
                <VStack width='100%' top={0} zIndex={10} gap={0} display={{base: 'none', md: 'block'}}>
                    <HStack justify='center' width='100%' height={115}>
                        <VStack flex={1} maxWidth={1200} align='center' textAlign='center'>
                            <Heading className='app-title' color='gray.700'>
                                Adventures in Faith
                            </Heading>
                            <Text fontSize={18} color='gray.600'>The memoirs of Duane H. Klepel</Text>
                        </VStack>
                    </HStack>
                    <HStack textAlign='center' spacing={8} justify='center' width='100%'
                            bg='gray.100'
                            borderColor='gray.300' borderBottomWidth={1} borderTopWidth={1}
                            gap={16} height={12} fontFamily="Montserrat Alternates" textTransform='uppercase'>
                        <Link as={RouterLink} to='/' display='block'>Home</Link>
                        <Link as={RouterLink} to='/books' display='block'>Books</Link>
                        <Link as={RouterLink} to='/bio' display='block'>Bio</Link>
                    </HStack>
                </VStack>
        </>
    );
};

export default Header;