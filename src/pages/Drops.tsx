import { Box, Container, Heading, Text, VStack, SimpleGrid, Spinner, Center, HStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchCollections, fetchCollectionDetail } from "../api/urbanera";
import CollectionCard from "../components/CollectionCard";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

export default function Drops() {
  const { data: collections, isLoading, error } = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <Center h="70vh"><Spinner size="xl" color="blue.400" thickness="5px" /></Center>;
  if (error || !collections) return <Center h="70vh"><Text color="red.300">Failed to load drops.</Text></Center>;

  return (
    <Box py={{ base: 14, md: 18 }} bg="#0B0F14" minH="100vh">
      <Container maxW="container.xl">
        <VStack align="start" spacing={3} mb={10}>
          <Heading textTransform="uppercase" fontWeight="400" fontSize={{ base: "4xl", md: "6xl" }}>
            Drops
          </Heading>
          <Text color="whiteAlpha.700" maxW="800px">
            Collections with story. Each drop has a narrative + curated pieces under it.
          </Text>
        </VStack>

        <VStack align="stretch" spacing={14}>
          {collections.map((c) => (
            <DropSection key={c.slug} slug={c.slug} />
          ))}
        </VStack>
      </Container>
    </Box>
  );
}

function DropSection({ slug }: { slug: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["collection-detail", slug],
    queryFn: () => fetchCollectionDetail(slug),
    staleTime: 1000 * 60 * 5,
  });

  // Even if detail is loading, we still want to show the collection card feel.
  if (!data && isLoading) {
    return (
      <Box>
        <Center py={8}><Spinner size="md" color="blue.400" /></Center>
      </Box>
    );
  }

  if (!data) return null;

  const preview = (data.products ?? []).slice(0, 3);

  return (
    <Box>
      {/* header card (clickable) */}
      <Box mb={6}>
        {/* reuse your collection list design by crafting a list-like object */}
        <CollectionCard
          c={{
            slug: data.slug,
            title: data.title,
            season: data.season,
            statement: data.statement,
            coverImageUrl: data.coverImageUrl,
            heroImageUrl: data.heroImageUrl,
            accent: data.accent,
            productCount: data.products?.length ?? 0,
          }}
        />
      </Box>

      {/* products preview */}
      {preview.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={7}>
          {preview.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </SimpleGrid>
      ) : (
        <Text color="whiteAlpha.600">No products in this drop yet.</Text>
      )}

      <HStack mt={4} justify="space-between">
        <Text color="whiteAlpha.500" fontSize="sm">
          Previewing {Math.min(preview.length, 3)} items
        </Text>

        <Link to={`/drops/${data.slug}`} style={{ color: "rgba(45,107,255,0.95)", fontWeight: 700 }}>
          View full drop →
        </Link>
      </HStack>
    </Box>
  );
}