import React from 'react';
import {Button, Flex, Heading, HStack, Image, Text, VStack} from "@chakra-ui/react";
import {Link} from "react-router";

const BookListItem = ({book}) => {
    // Works with Vite/React public/… assets even when BASE_URL is set
    const BASE = (import.meta?.env?.BASE_URL ?? "/").replace(/\/+$/, "");
    const bookId =
        book.slug ??
        book.id ??
        (book.stub ? book.stub.replace(/^\/+|\/+$/g, "").split("/").pop() : "");
    const pdfHref = `${BASE}/books/${bookId}/${bookId}.pdf`;

    return (
        <Flex direction={{base: 'column', md: 'row'}} gap={8} align={{base: 'center', md: 'start'}}>
            <VStack gap={8}>
                <Image src={book.image} maxWidth={{base: '100%', md: 300}} boxShadow="xl"/>
                <HStack w="full">
                    <Button flex={1} backgroundColor="primary" as={Link} to={book.stub}>
                        Read
                    </Button>

                    {/* Download opens save dialog; still works if the browser just opens PDFs */}
                    <Button
                        flex={1}
                        variant="outline"
                        color="primary"
                        as="a"
                        href={pdfHref}
                        download={`${bookId}.pdf`}
                        target="_blank"           // optional: also open in a new tab
                        rel="noopener noreferrer" // safe when using target=_blank
                    >
                        Download
                    </Button>
                </HStack>
            </VStack>

            <VStack alignItems="start" marginBottom="auto" gap={4}>
                <Heading w="full">{book.title}</Heading>
                <Text>{book.description}</Text>
            </VStack>
        </Flex>
    );
};

export default BookListItem;
