import React from 'react';
import {Heading, VStack} from "@chakra-ui/react";
import books from "../data/books.js";
import BookListItem from "../components/BookListItem.jsx";

const BooksPage = () => {
    return (
        <VStack gap={8} paddingY={8}>
            <Heading className='heading-1' paddingY={4}>Duane's Books</Heading>

            <VStack gap={16} maxWidth={750}>
                {books.map((book) => (<BookListItem id={book.id} key={book.title} book={book}/>))}
            </VStack>

        </VStack>

    );
};

export default BooksPage;