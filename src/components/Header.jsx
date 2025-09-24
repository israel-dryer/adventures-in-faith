import React from 'react';
import {Heading, HStack, Icon, IconButton, Link, Menu, Portal, Text, VStack} from "@chakra-ui/react";
import {Link as RouterLink, NavLink} from 'react-router';
import {MdHome, MdLocalLibrary, MdMenu, MdPerson} from "react-icons/md";

const Header = () => {
    return (
        <>
            {/*Small Screen*/}
            <VStack width='100%' top={0} zIndex={10} gap={0} display={{base: 'block', md: 'none'}}>
                <HStack width='100%' ps={4} borderBottomWidth={1}>
                    <Heading color='gray.700' fontFamily='Montserrat Alternates'> Adventures in Faith </Heading>
                    <Menu.Root>
                        <Menu.Trigger asChild>
                            <IconButton variant="ghost" aria-label='Open menu' size='lg' ms='auto'>
                                <MdMenu></MdMenu>
                            </IconButton>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content fontFamily="Montserrat Variable">
                                    <Menu.Item value={'home'} as={RouterLink} to='/'>
                                        <Icon><MdHome></MdHome></Icon>
                                        <Text ms={2}>Home</Text>
                                    </Menu.Item>
                                    <Menu.Item value={'books'} as={RouterLink} to={'/books'}>
                                        <Icon><MdLocalLibrary></MdLocalLibrary></Icon>
                                        <Text ms={2}>Books</Text>
                                    </Menu.Item>
                                    <Menu.Item value={'bio'} as={RouterLink} to={'/bio'}>
                                        <Icon><MdPerson></MdPerson></Icon>
                                        <Text ms={2}>Bio</Text>
                                    </Menu.Item>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>

                </HStack>
            </VStack>

            {/*Large Screen*/}
            <VStack width="100%" top={0} zIndex={10} gap={0} display={{base: "none", md: "block"}}>
                <HStack justify="center" width="100%" height={90}>
                    <VStack flex={1} maxWidth={1200} align="center" textAlign="center">
                        <Heading className="app-title" color="gray.700">
                            Adventures in Faith
                        </Heading>
                    </VStack>
                </HStack>
                <HStack
                    textAlign="center"
                    spacing={8}
                    justify="center"
                    width="100%"
                    backgroundColor="primary/20"
                    backdropFilter="saturate(115%) blur(6px)"
                    color="#062E2B"
                    borderColor="blackAlpha.200"
                    borderBottomWidth={1}
                    borderTopWidth={1}
                    gap={16}
                    height={12}
                    fontFamily="Montserrat Alternates"
                    textTransform="uppercase"
                >
                    {[
                        {to: "/", label: "Home"},
                        {to: "/books", label: "Books"},
                        {to: "/bio", label: "Bio"},
                    ].map(({to, label}) => (
                        <Link
                            key={to}
                            as={NavLink}
                            to={to}
                            end // ensures exact match for root "/"
                            _focus={{boxShadow: "none", outline: "none"}}
                            style={({isActive}) => ({
                                fontWeight: isActive ? "bold" : "normal",
                            })}
                        >
                            {label}
                        </Link>
                    ))}
                    <IconButton>

                    </IconButton>
                </HStack>
            </VStack>
        </>
    );
};

export default Header;