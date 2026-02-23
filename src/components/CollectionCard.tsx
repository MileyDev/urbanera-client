import { Box, Badge, Heading, Text, Image, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { CollectionListItem } from "../types/Collection";

const MotionBox = motion.create(Box);

export default function CollectionCard({ c }: { c: CollectionListItem }) {
  return (
    <Link to={`/drops/${c.slug}`} style={{ textDecoration: "none" }}>
      <MotionBox
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        borderRadius="2xl"
        overflow="hidden"
        border="1px solid"
        borderColor="whiteAlpha.200"
        bg="whiteAlpha.50"
        boxShadow="0 18px 50px rgba(0,0,0,0.55)"
      >
        <Box position="relative">
          <Image
            src={c.coverImageUrl}
            alt={c.title}
            w="100%"
            h={{ base: "220px", md: "240px" }}   // smaller than your current
            objectFit="cover"
            filter="contrast(1.05) saturate(0.95)"
          />

          {/* cinematic overlay */}
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-t, blackAlpha.900, blackAlpha.600 35%, transparent 70%)"
          />

          <VStack
            position="absolute"
            bottom={4}
            left={4}
            right={4}
            align="start"
          >
            <Badge
              px={3}
              py={1}
              borderRadius="full"
              bg="rgba(45,107,255,0.18)"
              border="1px solid rgba(45,107,255,0.35)"
              color="white"
              textTransform="uppercase"
              letterSpacing="0.14em"
              fontSize="xs"
            >
              {c.season} • {c.productCount} pieces
            </Badge>

            <Heading
              fontSize={{ base: "2xl", md: "3xl" }}
              letterSpacing="0.02em"
              textTransform="uppercase"
              color="white"
              lineHeight="1"
            >
              {c.title}
            </Heading>

            <Text color="whiteAlpha.800" noOfLines={2} fontSize="sm">
              {c.statement}
            </Text>
          </VStack>
        </Box>
      </MotionBox>
    </Link>
  );
}