import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Image,
  Badge,
  HStack,
  IconButton,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiShare2 } from "react-icons/fi";

import ProductCard from "../components/ProductCard";
import type { CollectionDetail } from "../types/Collection";

const API = "https://urbaneraapi.onrender.com/api";
const MotionBox = motion(Box);

export default function DropDetail() {
  const { slug } = useParams();

  const [drop, setDrop] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const heroH = useBreakpointValue({ base: "78vh", md: "72vh" });

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get<CollectionDetail>(`${API}/collections/${slug}`);
        setDrop(res.data);
      } catch {
        setError("Drop not found or failed to load.");
        setDrop(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) run();
  }, [slug]);

  const storyParagraphs = useMemo(() => {
    if (!drop?.story) return [];
    return drop.story
      .split(/\n\s*\n/g)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [drop?.story]);

  const titleParts = useMemo(() => {
    const t = drop?.title?.trim() ?? "";
    const parts = t.split(" ").filter(Boolean);
    if (parts.length <= 1) return { head: t, accent: "" };
    return { head: parts.slice(0, -1).join(" "), accent: parts.slice(-1).join(" ") };
  }, [drop?.title]);

  const shareDrop = async () => {
    if (!drop) return;
    const payload = {
      title: drop.title,
      text: drop.statement || "",
      url: window.location.href,
    };

    try {
      // @ts-ignore
      if (navigator.share) {
        // @ts-ignore
        await navigator.share(payload);
      } else {
        await navigator.clipboard.writeText(
          `${drop.title}\n${drop.statement ?? ""}\n${window.location.href}`
        );
      }
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <Box bg="black" minH="100vh">
        <Box position="relative" h={heroH} overflow="hidden">
          <Skeleton position="absolute" inset={0} />
          <Box position="absolute" inset={0} bgGradient="linear(to-b, blackAlpha.200, blackAlpha.900)" />
          <Container maxW="container.xl" h="100%">
            <Flex h="100%" align="flex-end" pb={{ base: 8, md: 14 }}>
              <Box
                w={{ base: "100%", md: "70%" }}
                p={{ base: 4, md: 7 }}
                borderRadius={{ base: "2xl", md: "3xl" }}
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="whiteAlpha.200"
                backdropFilter="blur(16px)"
              >
                <SkeletonText noOfLines={1} spacing="3" skeletonHeight="3" />
                <SkeletonText mt="4" noOfLines={2} spacing="3" skeletonHeight="4" />
                <SkeletonText mt="4" noOfLines={2} spacing="3" skeletonHeight="3" />
              </Box>
            </Flex>
          </Container>
        </Box>

        <Container maxW="container.xl" py={{ base: 10, md: 14 }}>
          <SkeletonText noOfLines={1} spacing="4" skeletonHeight="5" />
          <SkeletonText mt="6" noOfLines={6} spacing="3" skeletonHeight="3" />
        </Container>
      </Box>
    );
  }

  if (error || !drop) {
    return (
      <Box bg="black" minH="100vh" display="grid" placeItems="center" px={6}>
        <VStack spacing={3} textAlign="center">
          <Heading color="whiteAlpha.900" size="lg">
            Drop not found
          </Heading>
          <Text color="whiteAlpha.700" maxW="60ch">
            {error ?? "This collection doesn’t exist."}
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box bg="black" minH="100vh">
      {/* HERO */}
      <Box position="relative" h={heroH} overflow="hidden">
        {/* Background Image */}
        <Box position="absolute" inset={0}>
          {drop.heroImageUrl ? (
            <Image
              src={drop.heroImageUrl}
              alt={drop.title}
              position="absolute"
              inset={0}
              w="100%"
              h="100%"
              objectFit="cover"
              fallbackSrc="/fallback-hero.jpg"
            />
          ) : (
            <Box
              position="absolute"
              inset={0}
              bgGradient="linear(to-br, gray.800, black)"
            />
          )}
        </Box>
        <Box
          position="absolute"
          inset={0}
          bgGradient="radial(70% 60% at 50% 20%, rgba(255,255,255,0.12), transparent 60%)"
          pointerEvents="none"
        />

        <Container maxW="container.xl" h="100%" position="relative">
          <Flex h="100%" align="flex-end" pb={{ base: 8, md: 14 }}>
            <MotionBox
              w={{ base: "100%", md: "78%" }}
              p={{ base: 4, md: 7 }}
              borderRadius={{ base: "2xl", md: "3xl" }}
              bg="whiteAlpha.100"
              border="1px solid"
              borderColor="whiteAlpha.200"
              backdropFilter="blur(18px)"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Flex align="center" justify="space-between" gap={4} mb={3}>
                <HStack spacing={2} wrap="wrap">
                  {drop.season && (
                    <Badge
                      px={3}
                      py={1}
                      borderRadius="full"
                      bg="whiteAlpha.200"
                      color="whiteAlpha.900"
                      letterSpacing="0.24em"
                      textTransform="uppercase"
                      fontSize="xs"
                    >
                      {drop.season}
                    </Badge>
                  )}
                  <Badge
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg="blackAlpha.500"
                    color="whiteAlpha.900"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                    fontSize="xs"
                  >
                    Drop
                  </Badge>
                </HStack>

                <IconButton
                  aria-label="Share drop"
                  icon={<FiShare2 />}
                  onClick={shareDrop}
                  variant="ghost"
                  color="whiteAlpha.900"
                  _hover={{ bg: "whiteAlpha.200" }}
                />
              </Flex>

              <Heading color="whiteAlpha.900" size={{ base: "xl", md: "2xl" }} lineHeight="1.02">
                {titleParts.head}{" "}
                {titleParts.accent ? (
                  <Box as="span" position="relative" color="whiteAlpha.900">
                    {titleParts.accent}
                    <Box
                      as="span"
                      position="absolute"
                      left={0}
                      right={0}
                      bottom="-6px"
                      height="10px"
                      bg="whiteAlpha.300"
                      filter="blur(10px)"
                      opacity={0.8}
                    />
                  </Box>
                ) : null}
              </Heading>

              {drop.statement && (
                <Text mt={3} color="whiteAlpha.800" fontSize={{ base: "md", md: "lg" }} maxW="70ch">
                  {drop.statement}
                </Text>
              )}

              <HStack mt={5} spacing={3} color="whiteAlpha.700" fontSize="sm" wrap="wrap">
                <Text>{drop.products?.length ?? 0} piece(s)</Text>
                <Text>•</Text>
                <Text>UrbanEra</Text>
              </HStack>
            </MotionBox>
          </Flex>
        </Container>
      </Box>

      {/* STORY */}
      <Box bg="black" py={{ base: 10, md: 14 }}>
        <Container maxW="container.xl">
          <Flex align="baseline" justify="space-between" mb={6} gap={4} wrap="wrap">
            <Heading color="whiteAlpha.900" size="lg">
              The Story
            </Heading>
            <Text color="whiteAlpha.600" fontSize="sm" letterSpacing="0.22em" textTransform="uppercase">
              Editorial Notes
            </Text>
          </Flex>

          <Box
            borderRadius={{ base: "2xl", md: "3xl" }}
            p={{ base: 5, md: 8 }}
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.200"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              inset={0}
              bgGradient="radial(60% 50% at 20% 10%, rgba(255,255,255,0.10), transparent 60%)"
              pointerEvents="none"
            />

            <VStack align="start" spacing={4} position="relative">
              {(storyParagraphs.length ? storyParagraphs : [drop.story]).map((p, idx) => (
                <Text
                  key={idx}
                  color="whiteAlpha.800"
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight={{ base: "1.85", md: "1.9" }}
                  maxW="82ch"
                >
                  {p}
                </Text>
              ))}
            </VStack>
          </Box>
        </Container>
      </Box>

      {/* PIECES */}
      <Box py={{ base: 10, md: 14 }} bg="black">
        <Container maxW="container.xl">
          <Flex align="baseline" justify="space-between" mb={6} gap={4} wrap="wrap">
            <Heading color="whiteAlpha.900" size="lg">
              Pieces in this Drop
            </Heading>
            <Text color="whiteAlpha.600" fontSize="sm">
              Built for streets, finished like art.
            </Text>
          </Flex>

          <Divider borderColor="whiteAlpha.200" mb={8} />

          {drop.products.length === 0 ? (
            <Box
              borderRadius="2xl"
              p={8}
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="whiteAlpha.200"
              textAlign="center"
            >
              <Text color="whiteAlpha.700">No products in this drop yet.</Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 5, md: 7 }}>
              {drop.products.map((product) => (
                <Box
                  key={product.id}
                  borderRadius="2xl"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  bg="whiteAlpha.50"
                  transition="transform 180ms ease, border-color 180ms ease"
                  _hover={{ transform: "translateY(-4px)", borderColor: "whiteAlpha.400" }}
                >
                  <ProductCard product={product} />
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>
    </Box>
  );
}