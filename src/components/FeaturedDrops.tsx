import { Box, Container, Heading, Text, HStack, SimpleGrid, Spinner, Center } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchCollections } from "../api/urbanera";
import CollectionCard from "./CollectionCard";

export default function FeaturedDrops() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <Center py={16}><Spinner size="lg" color="blue.400" thickness="4px" /></Center>;
  }

  if (error || !data) {
    return (
      <Center py={16}>
        <Text color="red.300">Failed to load drops.</Text>
      </Center>
    );
  }

  const collections = data.slice(0, 8);

  return (
    <Box py={{ base: 16, md: 20 }} bgGradient="linear(to-b, #0B0F14, #0A121B)">
      <Container maxW="container.xl">
        <Heading textTransform="uppercase" fontSize={{ base: "3xl", md: "5xl" }} fontWeight="400">
          Featured Drops
        </Heading>
        <Text mt={2} color="whiteAlpha.700" maxW="720px">
          Start with the latest chapters. Each drop is a story + a set of pieces.
        </Text>

        {/* MOBILE: scroll-snap */}
        <Box display={{ base: "block", md: "none" }} mt={10}>
          <Box
            overflowX="auto"
            overflowY="hidden"
            scrollSnapType="x mandatory"
            sx={{
              WebkitOverflowScrolling: "touch",
              "::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            <HStack spacing={5} align="stretch" w="max-content" pb={2}>
              {collections.map((c) => (
                <Box key={c.slug} scrollSnapAlign="start" flex="0 0 auto" w="88vw" maxW="420px">
                  <CollectionCard c={c} />
                </Box>
              ))}
            </HStack>
          </Box>

          <Text mt={3} textAlign="center" fontSize="sm" color="whiteAlpha.500">
            Swipe to explore →
          </Text>
        </Box>

        {/* DESKTOP */}
        <Box display={{ base: "none", md: "block" }} mt={10}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {collections.map((c) => (
              <CollectionCard key={c.slug} c={c} />
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}