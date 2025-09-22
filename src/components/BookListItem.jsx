import React from 'react';
import {Button, Flex, Heading, HStack, Image, Text, VStack} from "@chakra-ui/react";
import {Link} from "react-router";

const BookListItem = ({book}) => {
    return (
        <Flex direction={{base: 'column', md: 'row'}} gap={8} align={{base: 'center', md: 'start'}}>
            <Image src={book.image} maxWidth={150} boxShadow="xl"></Image>
            <VStack alignItems="start" marginBottom='auto' gap={4}>
                <Heading w='full'>{book.title}</Heading>
                <Text>{book.description}</Text>
                <Button
                    w={{base: 'full', md: 'auto'}}
                    mt={{base: '1rem', md: 0}}
                    as={Link}
                    to={book.stub}>Read this book</Button>

            </VStack>
        </Flex>
    );
};

export default BookListItem;