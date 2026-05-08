import { useContext, useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type { Product, Review } from "../types/Product";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import { FaStar } from "react-icons/fa";
import { getPrimaryProductImage, normalizeProductImages } from "../utils/productImages";

import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  VStack,
  Badge,
  Image,
  Button,
  SimpleGrid,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Spinner,
  Center,
} from "@chakra-ui/react";

const API = "https://urbaneraapi.onrender.com/api";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<string>("");

  // Review form
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // More from this drop
  const [related, setRelated] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [activeImage, setActiveImage] = useState<string>("");

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return Number.isFinite(avg) ? avg : null;
  }, [reviews]);

  useEffect(() => {
    if (!id || isNaN(parseInt(id, 10))) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        setSelectedSize("");
        setRelated([]);
        setReviews([]);
        setActiveImage("");

        const [productRes, reviewsRes] = await Promise.all([
          axios.get<Product>(`${API}/products/${id}`),
          axios.get<Review[]>(`${API}/reviews/${id}`),
        ]);

        setProduct(productRes.data);
        setActiveImage(getPrimaryProductImage(productRes.data.imageUrl));
        setReviews(reviewsRes.data ?? []);
      } catch {
        setError("Failed to load product or reviews.");
        setProduct(null);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  // Load "More from this drop"
  useEffect(() => {
    const runRelated = async (slug: string, currentId: number) => {
      try {
        setRelatedLoading(true);

        /**
         * Preferred (backend): /products?collection=<slug>
         * If your API doesn't support it, fallback to: GET /collections/<slug> then use its products.
         */
        try {
          const res = await axios.get<Product[]>(`${API}/products`, { params: { collection: slug } });
          const items = (res.data ?? []).filter((p) => p.id !== currentId).slice(0, 6);
          setRelated(items);
          return;
        } catch {
          // fallback: /collections/{slug} (if your backend returns products)
          const colRes = await axios.get<any>(`${API}/collections/${slug}`);
          const products: Product[] = (colRes.data?.products ?? []) as Product[];
          const items = (products ?? []).filter((p) => p.id !== currentId).slice(0, 6);
          setRelated(items);
        }
      } catch {
        setRelated([]);
      } finally {
        setRelatedLoading(false);
      }
    };

    const slug = product?.collection?.slug;
    const currentId = product?.id;

    if (slug && typeof currentId === "number") runRelated(slug, currentId);
  }, [product?.collection?.slug, product?.id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      toast.error("Please select a size!", { theme: "dark", autoClose: 2500 });
      return;
    }

    addToCart({ ...product, quantity: 1, selectedSize });

    toast.success(`${product.name} (Size: ${selectedSize}) added to cart!`, {
      theme: "dark",
      autoClose: 2500,
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!username.trim()) {
      toast.error("Please enter a username!", { theme: "dark", autoClose: 2500 });
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5!", { theme: "dark", autoClose: 2500 });
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(`${API}/reviews`, {
        productId: product.id,
        username: username.trim(),
        rating,
        comment: comment.trim(),
      });

      toast.success("Review submitted!", { theme: "dark", autoClose: 2500 });

      setUsername("");
      setRating(0);
      setComment("");

      const reviewsRes = await axios.get<Review[]>(`${API}/reviews/${product.id}`);
      setReviews(reviewsRes.data ?? []);
    } catch {
      toast.error("Failed to submit review.", { theme: "dark", autoClose: 2500 });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Center minH="70vh">
        <VStack spacing={4}>
          <Spinner size="xl" thickness="4px" color="rgba(45,107,255,0.95)" />
          <Text color="whiteAlpha.700">Loading piece...</Text>
        </VStack>
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="70vh">
        <VStack spacing={3}>
          <Text color="red.300" fontWeight="800">
            {error}
          </Text>
          <Button onClick={() => navigate(-1)} variant="outline" borderColor="whiteAlpha.300" color="white">
            Go back
          </Button>
        </VStack>
      </Center>
    );
  }

  if (!product) {
    return (
      <Center minH="70vh">
        <Text color="whiteAlpha.700">Product not found</Text>
      </Center>
    );
  }

  const productImages = normalizeProductImages(product.imageUrl);
  const displayImage = activeImage || getPrimaryProductImage(product.imageUrl);

  return (
    <Box bg="#0B0F14" minH="100vh" py={{ base: 10, md: 14 }}>
      <Container maxW="container.xl">
        {/* Drop link */}
        {product.collection?.slug && (
          <HStack mb={6} justify="space-between" flexWrap="wrap" gap={3}>
            <HStack
              as={RouterLink}
              to={`/drops/${product.collection.slug}`}
              spacing={3}
              px={4}
              py={2}
              borderRadius="full"
              border="1px solid rgba(255,255,255,0.14)"
              bg="rgba(255,255,255,0.03)"
              _hover={{
                textDecoration: "none",
                borderColor: "rgba(45,107,255,0.45)",
                bg: "rgba(45,107,255,0.08)",
              }}
              transition="all 0.18s ease"
            >
              <Badge
                bg="rgba(45,107,255,0.18)"
                border="1px solid rgba(45,107,255,0.35)"
                color="white"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="0.14em"
              >
                Drop
              </Badge>
              <HStack mt={3}>
                <Text color="white" fontWeight="900" noOfLines={1}>
                  {product.collection.title}
                </Text>
                <Text color="whiteAlpha.600" fontSize="sm">
                  • {product.collection.season}
                </Text>
              </HStack>
            </HStack>
          </HStack>
        )}

        {/* Product hero */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, lg: 12 }} alignItems="start">
          {/* Image */}
          <Box
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid rgba(255,255,255,0.10)"
            bg="rgba(255,255,255,0.03)"
            boxShadow="0 18px 55px rgba(0,0,0,0.65)"
          >
            <Box position="relative">
              <Image
                src={displayImage}
                alt={product.name}
                w="100%"
                h={{ base: "420px", md: "560px" }}
                objectFit="cover"
                filter="contrast(1.07) saturate(0.95)"
                onError={(e: any) => (e.currentTarget.src = "https://via.placeholder.com/560")}
              />
              <Box
                position="absolute"
                inset={0}
                pointerEvents="none"
                boxShadow="inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 120px rgba(45,107,255,0.12)"
              />
            </Box>
            {productImages.length > 1 && (
              <SimpleGrid columns={{ base: 4, md: Math.min(productImages.length, 5) }} spacing={3} p={4}>
                {productImages.map((image, index) => (
                  <Box
                    key={`${product.id}-image-${index}`}
                    as="button"
                    type="button"
                    onClick={() => setActiveImage(image)}
                    borderRadius="xl"
                    overflow="hidden"
                    border={displayImage === image ? "1px solid rgba(45,107,255,0.95)" : "1px solid rgba(255,255,255,0.12)"}
                    bg="rgba(255,255,255,0.02)"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      w="100%"
                      h="88px"
                      objectFit="cover"
                      onError={(e: any) => (e.currentTarget.src = "https://via.placeholder.com/140")}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Box>

          {/* Details */}
          <VStack align="stretch" spacing={5}>
            <Box>
              <Heading
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="400"
                textTransform="uppercase"
                letterSpacing="0.02em"
                color="white"
              >
                {product.name}
              </Heading>

              <HStack mt={3} justify="space-between" flexWrap="wrap" gap={3}>
                <Text fontSize="2xl" fontWeight="900" color="white">
                  ₦{product.price.toLocaleString()}
                </Text>

                <HStack color="whiteAlpha.700" spacing={2}>
                  <FaStar style={{ color: "rgba(45,107,255,0.95)" }} />
                  <Text fontWeight="900" color="white">
                    {averageRating ? averageRating.toFixed(1) : "—"}
                  </Text>
                  <Text>{reviews.length ? `(${reviews.length})` : ""}</Text>
                </HStack>
              </HStack>

              <Text mt={4} color="whiteAlpha.700" lineHeight="tall">
                {product.description}
              </Text>
            </Box>

            <Divider borderColor="whiteAlpha.200" />

            <FormControl>
              <FormLabel color="whiteAlpha.700">Size</FormLabel>
              <Select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                bg="rgba(255,255,255,0.03)"
                borderColor="whiteAlpha.200"
                _hover={{ borderColor: "rgba(45,107,255,0.55)" }}
                _focusVisible={{
                  borderColor: "rgba(45,107,255,0.75)",
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
            </FormControl>

            <HStack spacing={3}>
              <Button
                size="lg"
                w="full"
                borderRadius="xl"
                bg="rgba(45,107,255,0.95)"
                color="white"
                fontWeight="900"
                _hover={{ bg: "rgba(45,107,255,0.85)", transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0px)" }}
                boxShadow="0 18px 55px rgba(45,107,255,0.22)"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>

              <Button
                size="lg"
                w="full"
                variant="outline"
                borderRadius="xl"
                borderColor="whiteAlpha.300"
                color="white"
                _hover={{ bg: "whiteAlpha.100" }}
                onClick={() => navigate("/cart")}
              >
                Go to Cart
              </Button>
            </HStack>

            <Text color="whiteAlpha.500" fontSize="sm">
              Limited runs. Built for the streets, finished like luxury.
            </Text>
          </VStack>
        </SimpleGrid>

        {/* Reviews + Form */}
        <SimpleGrid mt={{ base: 12, md: 14 }} columns={{ base: 1, lg: 2 }} spacing={10} alignItems="start">
          {/* Review form */}
          <Box
            borderRadius="2xl"
            border="1px solid rgba(255,255,255,0.10)"
            bg="rgba(255,255,255,0.03)"
            p={{ base: 5, md: 6 }}
            boxShadow="0 18px 55px rgba(0,0,0,0.65)"
          >
            <Heading fontSize="2xl" fontWeight="900" textTransform="uppercase" letterSpacing="0.02em">
              Leave a Review
            </Heading>
            <Text mt={2} color="whiteAlpha.700" fontSize="sm">
              Keep it real. Rate the piece and leave a short note.
            </Text>

            <Divider my={5} borderColor="whiteAlpha.200" />

            <Box as="form" onSubmit={handleSubmitReview}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.700">Username</FormLabel>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    bg="rgba(255,255,255,0.03)"
                    borderColor="whiteAlpha.200"
                    _hover={{ borderColor: "rgba(45,107,255,0.55)" }}
                    _focusVisible={{
                      borderColor: "rgba(45,107,255,0.75)",
                      boxShadow: "0 0 0 4px rgba(45,107,255,0.18)",
                    }}
                    placeholder="Your username"
                  />
                </FormControl>

                <Box>
                  <Text color="whiteAlpha.700" fontWeight="700" mb={2}>
                    Rating
                  </Text>
                  <HStack spacing={2}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Box
                        as="button"
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        aria-label={`Rate ${s}`}
                        style={{ lineHeight: 0 }}
                      >
                        <FaStar
                          size={22}
                          color={s <= rating ? "rgba(45,107,255,0.95)" : "rgba(255,255,255,0.22)"}
                        />
                      </Box>
                    ))}
                  </HStack>
                </Box>

                <FormControl>
                  <FormLabel color="whiteAlpha.700">Comment</FormLabel>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    bg="rgba(255,255,255,0.03)"
                    borderColor="whiteAlpha.200"
                    _hover={{ borderColor: "rgba(45,107,255,0.55)" }}
                    _focusVisible={{
                      borderColor: "rgba(45,107,255,0.75)",
                      boxShadow: "0 0 0 4px rgba(45,107,255,0.18)",
                    }}
                    rows={4}
                    placeholder="Your review"
                  />
                </FormControl>

                <Button
                  type="submit"
                  isLoading={submitting}
                  loadingText="Submitting…"
                  size="lg"
                  borderRadius="xl"
                  bg="rgba(45,107,255,0.95)"
                  color="white"
                  fontWeight="900"
                  _hover={{ bg: "rgba(45,107,255,0.85)", transform: "translateY(-1px)" }}
                  _active={{ transform: "translateY(0px)" }}
                >
                  Submit Review
                </Button>
              </VStack>
            </Box>
          </Box>

          {/* Reviews list */}
          <Box>
            <HStack justify="space-between" align="end" mb={4}>
              <Heading fontSize="2xl" fontWeight="900" textTransform="uppercase" letterSpacing="0.02em">
                Reviews
              </Heading>
              <Text color="whiteAlpha.600" fontSize="sm">
                {reviews.length ? `${reviews.length} total` : "No reviews yet"}
              </Text>
            </HStack>

            <VStack spacing={3} align="stretch">
              {reviews.length ? (
                reviews.map((r) => (
                  <Box
                    key={r.id}
                    borderRadius="2xl"
                    border="1px solid rgba(255,255,255,0.10)"
                    bg="rgba(255,255,255,0.02)"
                    p={4}
                  >
                    <HStack justify="space-between" align="start" gap={3}>
                      <HStack spacing={2}>
                        <FaStar style={{ color: "rgba(45,107,255,0.95)" }} />
                        <Text fontWeight="900" color="white">
                          {r.rating} / 5
                        </Text>
                      </HStack>

                      <Text color="whiteAlpha.500" fontSize="sm">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </Text>
                    </HStack>

                    <Text mt={3} color="whiteAlpha.700" lineHeight="tall">
                      {r.comment}
                    </Text>

                    <Text mt={3} color="whiteAlpha.500" fontSize="sm">
                      Posted by {r.user?.username || "Anonymous"}
                    </Text>
                  </Box>
                ))
              ) : (
                <Box
                  borderRadius="2xl"
                  border="1px solid rgba(255,255,255,0.10)"
                  bg="rgba(255,255,255,0.02)"
                  p={5}
                >
                  <Text color="whiteAlpha.700">No reviews yet. Be the first.</Text>
                </Box>
              )}
            </VStack>
          </Box>
        </SimpleGrid>

        {/* More from this drop */}
        {product.collection?.slug && (
          <Box mt={{ base: 12, md: 16 }}>
            <HStack justify="space-between" align="end" flexWrap="wrap" gap={3}>
              <Box>
                <Heading fontSize="2xl" fontWeight="900" textTransform="uppercase" letterSpacing="0.02em">
                  More from this drop
                </Heading>
                <Text mt={1} color="whiteAlpha.700">
                  {product.collection.title} • {product.collection.season}
                </Text>
              </Box>

              <Button
                as={RouterLink}
                to={`/drops/${product.collection.slug}`}
                variant="outline"
                borderColor="whiteAlpha.300"
                color="white"
                _hover={{ bg: "whiteAlpha.100" }}
              >
                View full drop
              </Button>
            </HStack>

            <Box mt={6}>
              {relatedLoading && (
                <HStack color="whiteAlpha.700">
                  <Spinner size="sm" color="rgba(45,107,255,0.95)" />
                  <Text>Loading more pieces…</Text>
                </HStack>
              )}

              {!relatedLoading && related.length === 0 && (
                <Text color="whiteAlpha.700">No other pieces in this drop yet.</Text>
              )}

              {!relatedLoading && related.length > 0 && (
                <SimpleGrid mt={2} columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {related.map((p) => (
                    <Box key={p.id}>
                      <ProductCard product={p} />
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
