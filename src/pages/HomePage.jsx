import React from 'react';
import {chakra, Em, Heading, Image, Text, VStack} from "@chakra-ui/react";
import FeatureBook from "../components/FeatureBook.jsx";
import books from '../data/books.js';

const Span = chakra("span")

const HomePage = () => {
    return (
        <>
            <VStack maxWidth={750}>
                <VStack gap={8} pb={8}>
                    <VStack>
                        <Heading fontSize={18} mt={14} color='gray.700'>The memoirs of</Heading>
                        <Heading className='heading-1'>Duane H. Klepel</Heading>
                    <Image src="bio/duane-profile-5-4.png"
                           maxWidth={250}
                           mt={12}
                           borderRadius={8}
                           filter='grayscale(100%)'></Image>
                    </VStack>
                    <Text w='full' mt={{base: 0, md: 4}}>
                        A family archive made public—two memoirs, freely available to read online. From Thailand’s
                        hill tribes to Jerusalem’s old streets, these are lived stories of faith, service, and stubborn
                        hope.
                    </Text>
                    <Text w='full'>
                        The content on this site is shared in loving memory of <Em>Duane H. Klepel (1937 - 2024)</Em>.
                    </Text>
                </VStack>
                <VStack gap={16} py={{base: 4, md: 8}}>
                    <Heading className='heading-1'>Featured Books</Heading>
                    {
                        books.map(b => <FeatureBook key={b.title} book={b}/>)
                    }
                </VStack>

                <VStack gap={8} py={8}>
                    <Heading className='heading-1'>Content Guidance</Heading>
                    <Text w='full'>
                        These are historical, first‑person accounts. Some chapters mention war, human trafficking,
                        sexual exploitation, and illness. Reader discretion advised.
                    </Text>
                    <Text w='full'>
                        Names or details may be adjusted to protect privacy where appropriate.
                    </Text>
                </VStack>
            </VStack>
        </>
    );
};

export default HomePage;