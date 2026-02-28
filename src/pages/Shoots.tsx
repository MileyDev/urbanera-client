import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  IconButton,
  HStack,
  VStack,
  Progress,
  Skeleton,
  useBreakpointValue,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiShare2 } from "react-icons/fi";
import { useInView } from "react-intersection-observer";

type Shoot = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

const MotionBox = motion(Box);

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export default function LookbookStories() {
  const [shoots, setShoots] = useState<Shoot[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0..100 for current slide
  const [isPaused, setIsPaused] = useState(false);
  const [imgReady, setImgReady] = useState(false);

  const durationMs = 6500; // story duration per slide
  const tickMs = 35;

  const isMobile = useBreakpointValue({ base: true, md: false });
  const glassBg = useColorModeValue("rgba(255,255,255,0.08)", "rgba(0,0,0,0.35)");
  const glassBorder = useColorModeValue("rgba(255,255,255,0.16)", "rgba(255,255,255,0.10)");
  const titleColor = useColorModeValue("whiteAlpha.900", "whiteAlpha.900");
  const bodyColor = useColorModeValue("whiteAlpha.800", "whiteAlpha.800");

  const { ref: inViewRef, inView } = useInView({ threshold: 0.25 });

  const timerRef = useRef<number | null>(null);

  const current = shoots[index];
  const nextIndex = useMemo(() => (shoots.length ? (index + 1) % shoots.length : 0), [index, shoots.length]);
  const prevIndex = useMemo(
    () => (shoots.length ? (index - 1 + shoots.length) % shoots.length : 0),
    [index, shoots.length]
  );

  const goTo = useCallback(
    (i: number) => {
      if (!shoots.length) return;
      setImgReady(false);
      setProgress(0);
      setIndex(clamp(i, 0, shoots.length - 1));
    },
    [shoots.length]
  );

  const next = useCallback(() => goTo(nextIndex), [goTo, nextIndex]);
  const prev = useCallback(() => goTo(prevIndex), [goTo, prevIndex]);

  // Fetch shoots
  useEffect(() => {
    const fetchShoots = async () => {
      try {
        const response = await fetch("https://urbaneraapi.onrender.com/api/shoots");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = (await response.json()) as Shoot[];
        setShoots(data || []);
      } catch (err: any) {
        setError("Failed to load shoots. Please try again later.");
      }
    };
    fetchShoots();
  }, []);

  // Preload current + next image for smooth storytelling
  useEffect(() => {
    if (!shoots.length) return;

    const run = async () => {
      const cur = shoots[index]?.imageUrl;
      const nxt = shoots[nextIndex]?.imageUrl;

      if (cur) await preloadImage(cur);
      setImgReady(true);

      if (nxt) preloadImage(nxt); // fire-and-forget
    };

    run();
  }, [index, nextIndex, shoots]);

  // Progress engine (autoplay like stories)
  useEffect(() => {
    if (!shoots.length) return;

    const shouldRun = inView && !isPaused;
    if (!shouldRun) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    if (timerRef.current) window.clearInterval(timerRef.current);

    const step = (tickMs / durationMs) * 100;

    timerRef.current = window.setInterval(() => {
      setProgress((p) => {
        const np = p + step;
        if (np >= 100) return 100;
        return np;
      });
    }, tickMs);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [inView, isPaused, shoots.length]);

  // When progress completes, advance
  useEffect(() => {
    if (!shoots.length) return;
    if (progress >= 100) next();
  }, [progress, next, shoots.length]);

  // Keyboard navigation (desktop)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!shoots.length) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " " || e.key === "Spacebar") setIsPaused((s) => !s);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev, shoots.length]);

  const onTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!shoots.length) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.35) prev();
    else next();
  };

  const shareCurrent = async () => {
    if (!current) return;
    const payload = {
      title: current.title,
      text: current.description,
      url: window.location.href,
    };

    // Best-effort: navigator.share on mobile
    // Otherwise copy to clipboard
    try {
      // @ts-ignore
      if (navigator.share) {
        // @ts-ignore
        await navigator.share(payload);
      } else {
        await navigator.clipboard.writeText(`${current.title}\n${current.description}\n${window.location.href}`);
      }
    } catch {
      // ignore
    }
  };

  if (error) {
    return (
      <Container maxW="container.lg" py={16}>
        <Text textAlign="center" color="red.400" fontWeight="semibold">
          {error}
        </Text>
      </Container>
    );
  }

  if (!shoots.length) {
    return (
      <Container maxW="container.lg" py={16}>
        <VStack spacing={4}>
          <Skeleton height="14px" width="220px" />
          <Skeleton height="520px" width="100%" borderRadius="2xl" />
          <Skeleton height="14px" width="420px" />
        </VStack>
      </Container>
    );
  }

  return (
    <Box ref={inViewRef} minH="100vh" bg="black" position="relative" overflow="hidden">
      {/* Ambient background glow */}
      <Box
        position="absolute"
        inset={0}
        bgGradient="radial(80% 60% at 50% 20%, rgba(255,255,255,0.16), transparent 60%), radial(70% 50% at 20% 80%, rgba(120,120,255,0.14), transparent 60%), radial(70% 50% at 80% 85%, rgba(255,120,120,0.12), transparent 60%)"
        pointerEvents="none"
      />

      <Container maxW="container.xl" py={{ base: 8, md: 12 }} position="relative">
        {/* Header */}
        <Flex align="center" justify="space-between" mb={{ base: 4, md: 6 }}>
          <VStack align="start" spacing={1}>
            <Text color="whiteAlpha.700" fontSize="sm" letterSpacing="0.22em" textTransform="uppercase">
              UrbanEra Lookbook
            </Text>
            <Heading color="whiteAlpha.900" size={{ base: "lg", md: "xl" }}>
              The Urban Magazine
            </Heading>
          </VStack>

          <HStack spacing={2}>
            <Tooltip label={isPaused ? "Resume" : "Pause"}>
              <Box
                px={3}
                py={2}
                borderRadius="xl"
                bg={glassBg}
                border="1px solid"
                borderColor={glassBorder}
                backdropFilter="blur(14px)"
                color="whiteAlpha.900"
                fontSize="sm"
                cursor="pointer"
                userSelect="none"
                onClick={() => setIsPaused((s) => !s)}
              >
                {isPaused ? "Resume" : "Pause"}
              </Box>
            </Tooltip>

            <Tooltip label="Share">
              <IconButton
                aria-label="Share"
                icon={<FiShare2 />}
                onClick={shareCurrent}
                variant="ghost"
                color="whiteAlpha.900"
                _hover={{ bg: "whiteAlpha.200" }}
              />
            </Tooltip>
          </HStack>
        </Flex>

        {/* Story frame */}
        <Box
          borderRadius={{ base: "2xl", md: "3xl" }}
          overflow="hidden"
          position="relative"
          border="1px solid"
          borderColor="whiteAlpha.200"
          bg="black"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onClick={onTap}
          cursor="pointer"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {/* Progress bars */}
          <HStack spacing={2} position="absolute" top={3} left={3} right={3} zIndex={5}>
            {shoots.map((_, i) => {
              const value = i < index ? 100 : i > index ? 0 : progress;
              return (
                <Progress
                  key={i}
                  value={value}
                  size="xs"
                  borderRadius="full"
                  bg="whiteAlpha.300"
                  colorScheme="whiteAlpha"
                  flex={1}
                  sx={{
                    "& > div": {
                      background: "rgba(255,255,255,0.92)",
                    },
                  }}
                />
              );
            })}
          </HStack>

          {/* Main slide */}
          <Box position="relative" w="100%" h={{ base: "72vh", md: "70vh" }} minH={{ base: "520px", md: "560px" }}>
            <AnimatePresence mode="wait">
              <MotionBox
                key={current.id}
                position="absolute"
                inset={0}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {/* Image */}
                <Box
                  position="absolute"
                  inset={0}
                  bgImage={`url(${current.imageUrl})`}
                  bgSize="cover"
                  bgPos="center"
                  filter="saturate(1.08) contrast(1.03)"
                  transform="scale(1.02)"
                />

                {/* Overlays for cinematic readability */}
                <Box
                  position="absolute"
                  inset={0}
                  bgGradient="linear(to-b, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.75) 100%)"
                />
                <Box position="absolute" inset={0} bg="blackAlpha.200" />

                {/* Content panel */}
                <MotionBox
                  position="absolute"
                  left={{ base: 4, md: 8 }}
                  right={{ base: 4, md: 8 }}
                  bottom={{ base: 4, md: 8 }}
                  borderRadius={{ base: "2xl", md: "3xl" }}
                  bg={glassBg}
                  border="1px solid"
                  borderColor={glassBorder}
                  backdropFilter="blur(18px)"
                  p={{ base: 4, md: 6 }}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.08, duration: 0.35, ease: "easeOut" }}
                >
                  <Flex gap={4} align="flex-start" justify="space-between">
                    <Box>
                      <Text
                        color="whiteAlpha.700"
                        fontSize="xs"
                        letterSpacing="0.22em"
                        textTransform="uppercase"
                        mb={2}
                      >
                        Shoot {index + 1} / {shoots.length}
                      </Text>

                      <Heading color={titleColor} size={{ base: "md", md: "lg" }} lineHeight="1.08">
                        {current.title}
                      </Heading>

                      <Text color={bodyColor} mt={3} fontSize={{ base: "sm", md: "md" }} maxW="70ch">
                        {current.description}
                      </Text>
                    </Box>

                    {!isMobile && (
                      <HStack spacing={2} align="center">
                        <IconButton
                          aria-label="Previous"
                          icon={<FiChevronLeft />}
                          onClick={(e) => {
                            e.stopPropagation();
                            prev();
                          }}
                          variant="ghost"
                          color="whiteAlpha.900"
                          _hover={{ bg: "whiteAlpha.200" }}
                        />
                        <IconButton
                          aria-label="Next"
                          icon={<FiChevronRight />}
                          onClick={(e) => {
                            e.stopPropagation();
                            next();
                          }}
                          variant="ghost"
                          color="whiteAlpha.900"
                          _hover={{ bg: "whiteAlpha.200" }}
                        />
                      </HStack>
                    )}
                  </Flex>
                </MotionBox>

                {/* Loading mask for first paint smoothness */}
                {!imgReady && (
                  <Box position="absolute" inset={0} bg="black">
                    <Skeleton height="100%" width="100%" />
                  </Box>
                )}
              </MotionBox>
            </AnimatePresence>
          </Box>

          {/* Mobile hint */}
          {isMobile && (
            <Flex
              position="absolute"
              bottom={3}
              left={3}
              right={3}
              justify="center"
              zIndex={6}
              pointerEvents="none"
            >
              <Box
                px={3}
                py={2}
                borderRadius="xl"
                bg="blackAlpha.500"
                color="whiteAlpha.900"
                fontSize="xs"
                border="1px solid"
                borderColor="whiteAlpha.200"
              >
                Tap left/right to navigate • Hold to pause
              </Box>
            </Flex>
          )}
        </Box>

        {/* Thumbnail rail (optional, but “production” nice) */}
        <Flex mt={{ base: 5, md: 6 }} gap={3} overflowX="auto" pb={1} sx={{ "::-webkit-scrollbar": { display: "none" } }}>
          {shoots.map((s, i) => (
            <Box
              key={s.id}
              minW={{ base: "120px", md: "140px" }}
              h={{ base: "70px", md: "80px" }}
              borderRadius="xl"
              overflow="hidden"
              border="1px solid"
              borderColor={i === index ? "whiteAlpha.700" : "whiteAlpha.200"}
              opacity={i === index ? 1 : 0.78}
              cursor="pointer"
              flexShrink={0}
              onClick={() => goTo(i)}
              transition="all 180ms ease"
              _hover={{ opacity: 1, transform: "translateY(-2px)" }}
            >
              <Box
                w="100%"
                h="100%"
                bgImage={`url(${s.imageUrl})`}
                bgSize="cover"
                bgPos="center"
              />
            </Box>
          ))}
        </Flex>
      </Container>
    </Box>
  );
}