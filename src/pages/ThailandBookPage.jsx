import React from "react";
import VirtualBookScroll from "../components/VirtualBookScroll.jsx";

export default function ThailandBookPage() {
    return (
        <VirtualBookScroll
            bookSlug="thailand-adventure"
            totalPages={254}
            initialPage={1}
            baseDir="books"
            filePrefix="thailand-adventure"
            pageRatioWH={100 / 163}
            maxPageWidth={1000}
            extPriority={["jpg", "webp", "avif"]}
            sizePriority={["1600", "2600"]}
        />
    );
}
