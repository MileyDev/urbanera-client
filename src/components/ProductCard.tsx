import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Badge,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Select,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import type { Product } from "../types/Product";
import { getPrimaryProductImage } from "../utils/productImages";

const MotionBox = motion(Box);

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const primaryImage = getPrimaryProductImage(product.imageUrl, "https://via.placeholder.com/280");

  const ratingText = useMemo(() => {
    if (typeof product.ratingAvg === "number") return product.ratingAvg.toFixed(1);
    return "—";
  }, [product.ratingAvg]);

  const reviewCount = product.reviewCount ?? 0;

  const handleViewDetails = () => navigate(`/product/${product.id}`);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        position: "bottom-right",
        duration: 2500,
        isClosable: true,
        render: () => (
          <Box
            bg="black"
            color="white"
            borderRadius="xl"
            border="1px solid rgba(255,255,255,0.14)"
            boxShadow="0 20px 50px rgba(0,0,0,0.65)"
            p={4}
            maxW="360px"
          >
            <Text fontWeight="800">Pick a size first</Text>
            <Text mt={1} fontSize="sm" color="whiteAlpha.700">
              Select a size before adding to cart.
            </Text>
          </Box>
        ),
      });
      return;
    }

    addToCart({ ...product, quantity: 1, selectedSize });

    toast({
      position: "bottom-right",
      duration: 2500,
      isClosable: true,
      render: () => (
        <Box
          bg="black"
          color="white"
          borderRadius="2xl"
          border="1px solid rgba(45,107,255,0.35)"
          boxShadow="0 26px 70px rgba(0,0,0,0.75)"
          p={4}
          maxW="380px"
        >
          <HStack spacing={4} align="start">
            <Image
              src={primaryImage}
              alt={product.name}
              boxSize="70px"
              borderRadius="xl"
              objectFit="cover"
              border="1px solid rgba(255,255,255,0.12)"
            />
            <VStack align="start" spacing={1}>
              <Text fontWeight="900" letterSpacing="0.02em">
                Added to Cart
              </Text>
              <Text fontSize="sm" color="whiteAlpha.700" noOfLines={1}>
                {product.name}
              </Text>
              <Text fontSize="sm" color="blue.300" fontWeight="800">
                Size {selectedSize}
              </Text>
            </VStack>
          </HStack>
        </Box>
      ),
    });
  };

  return (
    <MotionBox
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      borderRadius="2xl"
      overflow="hidden"
      border="1px solid"
      borderColor="whiteAlpha.200"
      bg="whiteAlpha.50"
      boxShadow="0 18px 55px rgba(0,0,0,0.65)"
      position="relative"
      h="100%"
    >
      {/* Media */}
      <Box position="relative">
        <Image
          src={primaryImage}
          alt={product.name}
          w="100%"
          h="280px"
          objectFit="cover"
          filter="contrast(1.06) saturate(0.95)"
          onError={(e: any) => {
            e.currentTarget.src = "https://via.placeholder.com/280";
          }}
        />

        {/* cinematic overlay */}
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-t, blackAlpha.900, blackAlpha.700 40%, transparent 80%)"
        />

        {/* Drop tag */}
        {product.collection?.season && (
          <Badge
            position="absolute"
            top={4}
            left={4}
            px={3}
            py={1}
            borderRadius="full"
            bg="rgba(45,107,255,0.18)"
            border="1px solid rgba(45,107,255,0.35)"
            color="white"
            textTransform="uppercase"
            letterSpacing="0.14em"
            fontSize="xs"
            backdropFilter="blur(8px)"
          >
            DROP <b style={{ marginLeft: 6 }}>{product.collection.season}</b>
          </Badge>
        )}

        {/* subtle edge glow */}
        <Box
          position="absolute"
          inset={0}
          pointerEvents="none"
          boxShadow="inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 80px rgba(45,107,255,0.12)"
        />
      </Box>

      {/* Body */}
      <VStack align="start" spacing={3} p={4}>
        <Heading
          fontSize="xl"
          fontWeight="700"
          letterSpacing="0.02em"
          textTransform="uppercase"
          color="white"
          lineHeight="1.05"
          noOfLines={2}
        >
          {product.name}
        </Heading>

        <Text color="whiteAlpha.700" fontSize="sm" noOfLines={2} minH="42px">
          {product.description}
        </Text>

        {/* Price + rating */}
        <HStack w="full" justify="space-between" pt={1}>
          <Text fontWeight="900" fontSize="lg" color="white">
            ₦{product.price.toLocaleString()}
          </Text>

          <HStack spacing={2} color="whiteAlpha.800">
            <FaStar color="#2D6BFF" />
            <Text fontSize="sm" fontWeight="700">
              {ratingText}
              {reviewCount > 0 ? ` (${reviewCount})` : ""}
            </Text>
          </HStack>
        </HStack>

        {/* Size */}
        <Box w="full">
          <Text fontSize="sm" color="whiteAlpha.700" mb={2} fontWeight="700">
            Size
          </Text>

          <Select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            bg="rgba(255,255,255,0.03)"
            borderColor="whiteAlpha.200"
            color="white"
            borderRadius="xl"
            _hover={{ borderColor: "blue.400" }}
            _focusVisible={{
              borderColor: "blue.400",
              boxShadow: "0 0 0 4px rgba(45,107,255,0.18)",
            }}
          >
            <option value="" style={{ color: "#111" }}>
              Select a size
            </option>
            {product.sizes.map((size) => (
              <option key={size} value={size} style={{ color: "#111" }}>
                {size}
              </option>
            ))}
          </Select>
        </Box>

        {/* Actions */}
        <HStack w="full" pt={2} spacing={3} mt="auto">
          <Button
            variant="outline"
            w="full"
            borderRadius="xl"
            borderColor="whiteAlpha.300"
            color="white"
            _hover={{ bg: "whiteAlpha.100", borderColor: "whiteAlpha.500" }}
            onClick={handleViewDetails}
          >
            View Details
          </Button>

          <Button
            w="full"
            borderRadius="xl"
            bg="rgba(45,107,255,0.95)"
            color="white"
            fontWeight="900"
            _hover={{ bg: "rgba(45,107,255,0.85)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0px)" }}
            boxShadow="0 16px 40px rgba(45,107,255,0.22)"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </HStack>
      </VStack>
    </MotionBox>
  );
}
