import React from 'react';
import {HStack, Image, VStack, Text, Heading, Button, Flex} from "@chakra-ui/react";
import {Link} from 'react-router';

const FeatureBook = ({book}) => {
    return (
        <Flex direction={{base: 'column', md: 'row'}} gap={8} align='center'>
            <Image src={book.image} maxWidth={250} boxShadow="xl"></Image>
            <VStack alignItems="start" marginBottom='auto' gap={4}>
                <Heading w='full' textAlign={{base: 'center', md: 'left'}}>{book.title}</Heading>
                <Text>{book.brief}</Text>
                <Text>{book.meta}</Text>
                <HStack justify={{base: 'center', md: 'left'}} w='full' mt={{base: 4, md: 8}}>
                    <Button backgroundColor="primary" variant="solid" as={Link} to={book.slug}>Start Reading</Button>
                    <Button color="primary" variant="outline" as={Link} to={'/books#' + book.slug}>About this Book</Button>
                </HStack>
            </VStack>
        </Flex>
    );
};

export default FeatureBook;