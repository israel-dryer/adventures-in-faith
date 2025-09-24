import React from "react";
import {Box, HStack, IconButton, Image, SimpleGrid, Text, useBreakpointValue} from "@chakra-ui/react";
import {useVirtualizer} from "@tanstack/react-virtual";
import {
    MdArticle,
    MdBookmark as MdBookmarkIcon,
    MdBookmarkBorder,
    MdChromeReaderMode,
    MdClose,
    MdWindow
} from "react-icons/md";

/* ================= Module-scope constants (ESLint-friendly) ================= */

const PAD_X_BASE = 8 * 2;   // base px-2 left+right = 16
const PAD_X_MD = 16 * 2;    // md:px-4 left+right = 32
const PAD_Y_BASE = 8 * 2;   // base pt/pb 2 => 16
const PAD_Y_MD = 12 * 2;    // md: pt/pb 3 => 24
const ACTIVE_EPS = 0.06;    // desktop hysteresis

/* ================================== Helpers ================================= */

const pad3 = (n) => String(n).padStart(3, "0");
const BASE = (import.meta?.env?.BASE_URL ?? "/").replace(/\/+$/, "/");

// Build a URL like:
// `${BASE}${baseDir}/${bookSlug}/pages/${filePrefix}.${001}-${size}.${ext}`
function makeUrlBuilder({baseDir, bookSlug, filePrefix}) {
    const dir = baseDir?.replace(/^\/+|\/+$/g, "") || "books";
    const prefix = filePrefix || bookSlug;
    return (page, size = "1600", ext = "jpg") =>
        `${BASE}${dir}/${bookSlug}/pages/${prefix}.${pad3(page)}-${size}.${ext}`;
}

// Create a generator that yields fallback variants for an image URL
function makeVariantWalker(extPriority, sizePriority) {
    return function* variants(url) {
        const m = url.match(/-(\d+)\.(\w+)$/);
        if (!m) {
            yield url;
            return;
        }
        const size = m[1];
        const ext = m[2];

        // Same size, other exts
        for (const e of extPriority) {
            if (e !== ext) yield url.replace(/\.\w+$/, `.${e}`);
        }
        // Other sizes, all exts
        for (const s of sizePriority) {
            if (s === size) continue;
            for (const e of extPriority) {
                yield url.replace(/-\d+\.\w+$/, `-${s}.${e}`);
            }
        }
    };
}

/* ================================ Component ================================= */

export default function VirtualBookScroll({
                                              // Required/important
                                              bookSlug,                 // e.g. "jerusalem-adventure"
                                              totalPages = 166,
                                              initialPage = 1,

                                              // Optional customization
                                              baseDir = "books",
                                              filePrefix,               // defaults to bookSlug
                                              pageRatioWH = 100 / 163,  // width/height (1600x2608 → 100/163 ≈ 0.6135)
                                              maxPageWidth = 1000,      // matches maxW="min(1000px, 95vw)"
                                              extPriority = ["jpg", "webp", "avif"],
                                              sizePriority = ["1600", "2600"],

                                              // UI tweaks
                                              overscan = 4,
                                              spreadGap = 16,           // px gap between two pages in spread mode
                                          }) {
    const isDesktop = !!useBreakpointValue({base: false, md: true});

    // URL + fallback generators bound to this book
    const urlFor = React.useMemo(
        () => makeUrlBuilder({baseDir, bookSlug, filePrefix: filePrefix || bookSlug}),
        [baseDir, bookSlug, filePrefix]
    );
    const nextVariants = React.useMemo(
        () => makeVariantWalker(extPriority, sizePriority),
        [extPriority, sizePriority]
    );

    // Layout (desktop can toggle single/spread; mobile forced single)
    const [layout, setLayout] = React.useState("single");
    React.useEffect(() => {
        if (!isDesktop) setLayout("single");
    }, [isDesktop]);

    const [navOpen, setNavOpen] = React.useState(false);
    const PAGE_KEY = `currentPage:${bookSlug}`;
    const [page, setPage] = React.useState(() => {
        try {
            const raw = localStorage.getItem(PAGE_KEY);
            const saved = raw ? parseInt(raw, 10) : initialPage;
            return Math.min(Math.max(1, saved || initialPage), totalPages);
        } catch {
            return initialPage;
        }
    })
    const pageRef = React.useRef(page);
    React.useEffect(() => {
        pageRef.current = page;
    }, [page]);

    // Bookmarks (persisted per book)
    const BOOK_KEY = React.useMemo(() => `bookmarks:${bookSlug}`, [bookSlug]);
    const [bookmarks, setBookmarks] = React.useState(() => {
        try {
            const raw = localStorage.getItem(BOOK_KEY);
            const arr = raw ? JSON.parse(raw) : [];
            return new Set(arr);
        } catch {
            return new Set();
        }
    });
    const isBookmarked = React.useMemo(() => bookmarks.has(page), [bookmarks, page]);
    const toggleBookmark = React.useCallback(() => {
        setBookmarks((prev) => {
            const next = new Set(prev);
            if (next.has(page)) next.delete(page);
            else next.add(page);
            return next;
        });
    }, [page]);
    React.useEffect(() => {
        localStorage.setItem(BOOK_KEY, JSON.stringify(Array.from(bookmarks)));
    }, [BOOK_KEY, bookmarks]);

    React.useEffect(() => {
        try {
            localStorage.setItem(PAGE_KEY, String(page));
        } catch {/* Ignore */
        }
    }, [PAGE_KEY, page]);

    // Scroll container
    const parentRef = React.useRef(null);

    // Estimate row height using same width cap + padding as layout uses
    const computeEstimate = React.useCallback((el) => {
        const vw = el.clientWidth;
        const isMd = window.matchMedia("(min-width: 48em)").matches; // md ~768px
        const padX = isMd ? PAD_X_MD : PAD_X_BASE;
        const padY = isMd ? PAD_Y_MD : PAD_Y_BASE;
        const usable = Math.max(0, Math.min(vw - padX, maxPageWidth));

        if (layout === "single" || !isDesktop) {
            const imgH = usable / pageRatioWH;
            return Math.max(300, Math.round(imgH + padY));
        } else {
            const perW = Math.max(0, (usable - spreadGap) / 2);
            const imgH = perW / pageRatioWH;
            return Math.max(300, Math.round(imgH + padY));
        }
    }, [layout, isDesktop, maxPageWidth, pageRatioWH, spreadGap]);

    const [estimated, setEstimated] = React.useState(900);
    React.useLayoutEffect(() => {
        const el = parentRef.current;
        if (!el) return;
        const update = () => setEstimated(computeEstimate(el));
        update(); // initial
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [computeEstimate]);

    // Virtualizer rows (pages for single; pairs for spread)
    const rowCount =
        layout === "single" || !isDesktop ? totalPages : Math.ceil(totalPages / 2);

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimated,
        overscan,
    });

    // Center the initial page
    React.useEffect(() => {
        const p = Math.min(Math.max(1, page), totalPages);
        const idx = layout === "single" || !isDesktop
            ? p - 1
            : Math.floor((p - 1) / 2);
        rowVirtualizer.scrollToIndex(Math.max(0, idx), {align: 'center'});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Scroll to page (works in both layouts)
    const scrollToPage = React.useCallback(
        (p, align = "center") => {
            const idx =
                layout === "single" || !isDesktop ? p - 1 : Math.floor((p - 1) / 2);
            const clamped = Math.min(Math.max(0, idx), rowCount - 1);
            rowVirtualizer.scrollToIndex(clamped, {align});
        },
        [rowVirtualizer, rowCount, layout, isDesktop]
    );

    React.useEffect(() => {
        try {
            const raw = localStorage.getItem(PAGE_KEY);
            let p = raw ? parseInt(raw, 10) : initialPage;
            p = Math.min(Math.max(1, p || initialPage), totalPages);
            setPage(p);
            requestAnimationFrame(() => scrollToPage(p, "center"));
        } catch { /*ignore */
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookSlug]);


    // Toggle layout (desktop only)
    const toggleLayout = React.useCallback(() => {
        if (!isDesktop) return;
        setLayout((prev) => (prev === "single" ? "spread" : "single"));
        requestAnimationFrame(() => scrollToPage(page, "center"));
    }, [isDesktop, page, scrollToPage]);

    /* ---------- Stable active-page logic (no flicker) ---------- */
    // Map: page -> { ratio, mid }
    const visibilityMapRef = React.useRef(new Map());
    const computeRafRef = React.useRef(0);

    const onVisibilityChange = React.useCallback((p, ratio, mid) => {
        const m = visibilityMapRef.current;
        if (ratio <= 0) m.delete(p);
        else m.set(p, {ratio, mid});

        if (computeRafRef.current) return;
        computeRafRef.current = requestAnimationFrame(() => {
            computeRafRef.current = 0;

            const entries = Array.from(m.entries());
            if (!entries.length) return;

            const root = parentRef.current;
            const centerY = root ? root.clientHeight / 2 : window.innerHeight / 2;

            entries.sort((a, b) => {
                if (b[1].ratio !== a[1].ratio) return b[1].ratio - a[1].ratio;
                const da = Math.abs((a[1].mid ?? 0) - centerY);
                const db = Math.abs((b[1].mid ?? 0) - centerY);
                return da - db;
            });

            const candidate = entries[0][0];
            const candRatio = entries[0][1].ratio;

            const currentPage = pageRef.current;
            if (candidate === currentPage) return;

            const current = m.get(currentPage);
            const currentRatio = current?.ratio ?? 0;

            // Stronger hysteresis for small screens
            const EPS = isDesktop ? ACTIVE_EPS : 0.15;
            const STRONG = isDesktop ? 0.66 : 0.8;

            if (candRatio >= currentRatio + EPS || candRatio >= STRONG) {
                setPage(candidate);
            }
        });
    }, [isDesktop]);

    /* =================================== Render =================================== */

    return (
        <HStack w="100%" h="100svh" align="stretch" spacing={0}>
            {/* Desktop: virtualized sidebar thumbnails (toggleable) */}
            {isDesktop && navOpen && (
                <ThumbListDesktop
                    bookSlug={bookSlug}
                    urlFor={urlFor}
                    totalPages={totalPages}
                    current={page}
                    bookmarks={bookmarks}
                    onPick={(p) => {
                        setPage(p);
                        scrollToPage(p, "center");
                    }}
                />
            )}

            {/* Main reading column */}
            <Box position="relative" flex="1" h="100%">
                {/* Top bar */}
                <HStack
                    position="sticky"
                    top="0"
                    zIndex={5}
                    px={3}
                    py={2}
                    bg="whiteAlpha.8"
                    backdropFilter="blur(6px)"
                    justify="space-between"
                    borderBottom="1px solid"
                    borderColor="blackAlpha.200"
                >
                    <HStack>
                        <IconButton
                            title={navOpen ? "Close navigation" : "Show navigation"}
                            aria-label={navOpen ? "Hide thumbnails" : "Show thumbnails"}
                            variant="ghost"
                            onClick={() => setNavOpen((v) => !v)}
                        >
                            {navOpen ? <MdClose/> : <MdWindow/>}
                        </IconButton>

                        {/* Layout toggle (desktop only) */}
                        <IconButton
                            aria-label={layout === "spread" ? "Single page" : "Two-page spread"}
                            display={{base: 'none', md: 'flex'}}
                            variant="ghost"
                            onClick={toggleLayout}
                            isDisabled={!isDesktop}
                            title={layout === "spread" ? "Single page" : "Two-page spread"}
                        >
                            {layout === "spread" ? <MdArticle/> : <MdChromeReaderMode/>}
                        </IconButton>

                        {/* Bookmark toggle */}
                        <IconButton
                            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                            variant="ghost"
                            onClick={toggleBookmark}
                            title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                        >
                            {isBookmarked ? <MdBookmarkIcon/> : <MdBookmarkBorder/>}
                        </IconButton>
                    </HStack>

                    <Text fontSize="sm" opacity={0.7}>
                        {page} / {totalPages}
                    </Text>
                </HStack>

                {/* Mobile: overlay grid of thumbnails when open */}
                {!isDesktop && navOpen && (
                    <ThumbGridMobile
                        urlFor={urlFor}
                        totalPages={totalPages}
                        current={page}
                        bookmarks={bookmarks}
                        onClose={() => setNavOpen(false)}
                        onPick={(p) => {
                            setNavOpen(false);
                            setPage(p);
                            scrollToPage(p, "center");
                        }}
                    />
                )}

                {/* Scroll body */}
                <Box ref={parentRef} h="calc(100% - 41px)" overflow="auto">
                    <Box height={rowVirtualizer.getTotalSize()} position="relative">
                        {rowVirtualizer.getVirtualItems().map((item) => {
                            if (layout === "single" || !isDesktop) {
                                const p = item.index + 1;
                                return (
                                    <RowSingle
                                        key={`r-${p}`}
                                        itemIndex={item.index}
                                        itemStart={item.start}
                                        page={p}
                                        rowVirtualizer={rowVirtualizer}
                                        urlFor={urlFor}
                                        nextVariants={nextVariants}
                                        bookmarks={bookmarks}
                                        onVisibilityChange={onVisibilityChange}
                                        parentRef={parentRef}
                                        maxPageWidth={maxPageWidth}
                                    />
                                );
                            } else {
                                const left = item.index * 2 + 1;
                                const right = left + 1 <= totalPages ? left + 1 : null;
                                return (
                                    <RowSpread
                                        key={`r-${left}`}
                                        itemIndex={item.index}
                                        itemStart={item.start}
                                        left={left}
                                        right={right}
                                        rowVirtualizer={rowVirtualizer}
                                        urlFor={urlFor}
                                        nextVariants={nextVariants}
                                        bookmarks={bookmarks}
                                        onVisibilityChange={onVisibilityChange}
                                        parentRef={parentRef}
                                        maxPageWidth={maxPageWidth}
                                        spreadGap={spreadGap}
                                    />
                                );
                            }
                        })}
                    </Box>
                </Box>
            </Box>
        </HStack>
    );
}

/* =============================== Row renderers =============================== */

function RowSingle({
                       itemIndex,
                       itemStart,
                       page,
                       rowVirtualizer,
                       urlFor,
                       nextVariants,
                       bookmarks,
                       onVisibilityChange,
                       parentRef,
                       maxPageWidth,
                   }) {
    return (
        <Box
            ref={rowVirtualizer.measureElement}
            data-index={itemIndex}
            position="absolute"
            top={0}
            left={0}
            w="100%"
            transform={`translateY(${itemStart}px)`}
        >
            <Box
                px={{base: 2, md: 4}}
                pt={{base: 2, md: 3}}
                pb={{base: 2, md: 3}}
                display="grid"
                placeItems="center"
            >
                <PageCard
                    page={page}
                    urlFor={urlFor}
                    nextVariants={nextVariants}
                    bookmarks={bookmarks}
                    onLoadMeasured={() => rowVirtualizer.measure()}
                    onVisibilityChange={onVisibilityChange}
                    parentRef={parentRef}
                    maxPageWidth={maxPageWidth}
                />
            </Box>
        </Box>
    );
}

function RowSpread({
                       itemIndex,
                       itemStart,
                       left,
                       right,
                       rowVirtualizer,
                       urlFor,
                       nextVariants,
                       bookmarks,
                       onVisibilityChange,
                       parentRef,
                       maxPageWidth,
                       spreadGap,
                   }) {
    return (
        <Box
            ref={rowVirtualizer.measureElement}
            data-index={itemIndex}
            position="absolute"
            top={0}
            left={0}
            w="100%"
            transform={`translateY(${itemStart}px)`}
        >
            <Box px={{base: 2, md: 4}} pt={{base: 2, md: 3}} pb={{base: 2, md: 3}}>
                <HStack spacing={`${spreadGap}px`} justify="center">
                    <Box flex="1" maxW={`calc(${maxPageWidth / 2}px)`}>
                        {left && (
                            <PageCard
                                page={left}
                                urlFor={urlFor}
                                nextVariants={nextVariants}
                                bookmarks={bookmarks}
                                onLoadMeasured={() => rowVirtualizer.measure()}
                                onVisibilityChange={onVisibilityChange}
                                parentRef={parentRef}
                                maxPageWidth={maxPageWidth / 2}
                            />
                        )}
                    </Box>
                    <Box flex="1" maxW={`calc(${maxPageWidth / 2}px)`}>
                        {right && (
                            <PageCard
                                page={right}
                                urlFor={urlFor}
                                nextVariants={nextVariants}
                                bookmarks={bookmarks}
                                onLoadMeasured={() => rowVirtualizer.measure()}
                                onVisibilityChange={onVisibilityChange}
                                parentRef={parentRef}
                                maxPageWidth={maxPageWidth / 2}
                            />
                        )}
                    </Box>
                </HStack>
            </Box>
        </Box>
    );
}

/* =================================== Pieces =================================== */

function PageCard({
                      page,
                      urlFor,
                      nextVariants,
                      bookmarks,
                      onLoadMeasured,
                      onVisibilityChange,
                      parentRef,
                      maxPageWidth,
                  }) {
    return (
        <Box
            w="100%"
            maxW={`min(${maxPageWidth}px, 95vw)`}
            bg="blackAlpha.50"
            borderRadius="md"
            boxShadow="md"
            overflow="hidden"
            position="relative"
            mx="auto"
        >
            {/* Bookmark badge */}
            {bookmarks.has(page) && (
                <Box
                    position="absolute"
                    top="8px"
                    right="10px"
                    zIndex={1}
                    color="yellow.400"
                    bg="blackAlpha.600"
                    px="1.5"
                    py="0.5"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    lineHeight="1"
                    fontSize="sm"
                >
                    <MdBookmarkIcon/>
                </Box>
            )}
            <PageImage
                page={page}
                urlFor={urlFor}
                nextVariants={nextVariants}
                onLoadMeasured={onLoadMeasured}
                onVisibilityChange={onVisibilityChange}
                parentRef={parentRef}
            />
        </Box>
    );
}

function PageImage({
                       page,
                       urlFor,
                       nextVariants,
                       onLoadMeasured,
                       onVisibilityChange,
                       parentRef,
                   }) {
    const [src, setSrc] = React.useState(() => urlFor(page));
    const containerRef = React.useRef(null);

    // Observe visibility (root = scroll container) with many thresholds
    React.useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const rootEl = parentRef?.current || null;
        const thresholds = Array.from({length: 21}, (_, i) => i / 20);
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    const ratio = e.intersectionRatio || 0;
                    const rect = e.boundingClientRect || {top: 0, height: 0};
                    const mid = rect.top + rect.height / 2; // use element center, not top
                    onVisibilityChange?.(page, ratio, mid);
                }
            },
            {root: rootEl, threshold: thresholds}
        );

        io.observe(el);
        return () => io.disconnect();
    }, [page, onVisibilityChange, parentRef]);

    return (
        <Box ref={containerRef} w="100%">
            <Image
                src={src}
                alt={`Page ${page}`}
                w="100%"
                h="auto"
                objectFit="contain"
                loading="lazy"
                draggable={false}
                onLoad={() => onLoadMeasured?.()}
                onError={(e) => {
                    const tried = new Set(
                        (e.currentTarget.getAttribute("data-tried") || "")
                            .split("|")
                            .filter(Boolean)
                    );
                    for (const cand of nextVariants(src)) {
                        if (!tried.has(cand)) {
                            tried.add(cand);
                            e.currentTarget.setAttribute("data-tried", Array.from(tried).join("|"));
                            setSrc(cand);
                            return;
                        }
                    }
                }}
                style={{display: "block"}}
            />
        </Box>
    );
}

/* ================================= Thumbnails ================================= */

function ThumbListDesktop({bookSlug, urlFor, totalPages, current, bookmarks, onPick}) {
    const parentRef = React.useRef(null);
    const v = useVirtualizer({
        count: totalPages,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 92,
        overscan: 8,
    });

    React.useEffect(() => {
        v.scrollToIndex(Math.max(0, current - 1), {align: "center"});
    }, [current, v]);

    return (
        <Box
            ref={parentRef}
            w="300px"
            h="100%"
            overflow="auto"
            borderRight="1px solid"
            borderColor="blackAlpha.200"
            bg="white"
        >
            <Box height={v.getTotalSize()} position="relative" w="100%">
                {v.getVirtualItems().map((it) => {
                    const p = it.index + 1;
                    const active = p === current;
                    const marked = bookmarks.has(p);
                    return (
                        <HStack
                            key={p}
                            position="absolute"
                            top={0}
                            left={0}
                            w="100%"
                            transform={`translateY(${it.start}px)`}
                            px={3}
                            py={2}
                            spacing={3}
                            cursor="pointer"
                            bg={active ? "blue.50" : "transparent"}
                            borderLeft={active ? "3px solid" : "3px solid transparent"}
                            borderColor={active ? "blue.400" : "transparent"}
                            _hover={{bg: active ? "blue.100" : "blackAlpha.50"}}
                            onClick={() => onPick(p)}
                        >
                            <Box position="relative">
                                <Image
                                    src={urlFor(p)}
                                    alt={`${bookSlug} thumb ${p}`}
                                    loading="lazy"
                                    borderRadius="md"
                                    maxW="64px"
                                    maxH="84px"
                                    objectFit="cover"
                                />
                                {marked && (
                                    <Box
                                        position="absolute"
                                        top="4px"
                                        right="4px"
                                        color="yellow.400"
                                        bg="blackAlpha.700"
                                        borderRadius="sm"
                                        p="1"
                                        lineHeight="0"
                                    >
                                        <MdBookmarkIcon size={14}/>
                                    </Box>
                                )}
                            </Box>

                            <HStack justify="space-between" w="full">
                                <Text fontWeight={active ? "bold" : "normal"}>{p}</Text>
                                {marked && (
                                    <Box color="yellow.500" lineHeight="0">
                                        <MdBookmarkIcon size={16}/>
                                    </Box>
                                )}
                            </HStack>
                        </HStack>
                    );
                })}
            </Box>
        </Box>
    );
}

function ThumbGridMobile({urlFor, totalPages, current, bookmarks, onPick, onClose}) {
    const pages = React.useMemo(
        () => Array.from({length: totalPages}, (_, i) => i + 1),
        [totalPages]
    );

    return (
        <Box position="fixed" inset="0" bg="white" zIndex={15} overflow="auto" p={3}>
            <HStack justify="space-between" mb={3}>
                <Text fontWeight="semibold">All pages</Text>
                <IconButton aria-label="Close thumbnails" variant="ghost" onClick={onClose}>
                    <MdClose/>
                </IconButton>
            </HStack>

            <SimpleGrid columns={3} spacing={2}>
                {pages.map((p) => {
                    const active = p === current;
                    const marked = bookmarks.has(p);
                    return (
                        <Box
                            key={p}
                            borderWidth="2px"
                            borderColor={active ? "blue.400" : "transparent"}
                            borderRadius="md"
                            overflow="hidden"
                            position="relative"
                            onClick={() => onPick(p)}
                        >
                            <Image
                                src={urlFor(p)}
                                alt={`Thumb ${p}`}
                                loading="lazy"
                                w="100%"
                                h="120px"
                                objectFit="cover"
                            />
                            {marked && (
                                <Box
                                    position="absolute"
                                    top="4px"
                                    right="4px"
                                    color="yellow.400"
                                    bg="blackAlpha.700"
                                    borderRadius="sm"
                                    p="1"
                                    lineHeight="0"
                                >
                                    <MdBookmarkIcon size={16}/>
                                </Box>
                            )}
                            <Box p={1} textAlign="center" fontSize="xs">
                                {p}
                            </Box>
                        </Box>
                    );
                })}
            </SimpleGrid>
        </Box>
    );
}
