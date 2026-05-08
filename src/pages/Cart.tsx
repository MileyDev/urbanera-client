import { useContext, useMemo, useState } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  HStack,
  VStack,
  Button,
  Divider,
  Badge,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { getPrimaryProductImage } from "../utils/productImages";

interface DeliveryDetails {
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  city: string;
  address: string;
}

interface Cities {
  [key: string]: string[];
}

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    firstName: "",
    lastName: "",
    country: "",
    state: "",
    city: "",
    address: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const countries = ["Nigeria"];
  const states = [
    "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
    "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
    "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
    "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"
  ];

  const cities: Cities = {
    Lagos: ["Abule-Egba","Agege","Ebute Meta","Iju-Ishaga","Ikeja","Ikorodu","Lekki","Ogba","Ojota","Oshodi","Surulere","Victoria Island"],
    FCT: ["Abuja","Gwagwalada","Kuje"],
    Ogun: ["Abeokuta","Agbado","Ijebu-Ode","Sango-Ota"],
    Oyo: ["Ibadan South","Ibadan North","Ibadan West"],
  };

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * (item.quantity || 0), 0),
    [cart]
  );

  const validate = () => {
    if (!email.trim()) return "Please enter your email.";
    const d = deliveryDetails;
    if (!d.firstName || !d.lastName || !d.country || !d.state || !d.city || !d.address)
      return "Please enter all delivery details.";
    if (!cart.length) return "Your cart is empty.";
    return null;
  };

  const handleCheckout = async () => {
    const v = validate();
    if (v) {
      setError(v);
      toast({
        position: "bottom-right",
        duration: 2600,
        isClosable: true,
        render: () => (
          <Box
            bg="black"
            color="white"
            borderRadius="2xl"
            border="1px solid rgba(255,255,255,0.14)"
            boxShadow="0 26px 70px rgba(0,0,0,0.75)"
            p={4}
            maxW="420px"
          >
            <Text fontWeight="900">Fix this first</Text>
            <Text mt={1} fontSize="sm" color="whiteAlpha.700">
              {v}
            </Text>
          </Box>
        ),
      });
      return;
    }

    setError(null);

    try {
      setSubmitting(true);
      const response = await axios.post(
        "https://urbaneraapi.onrender.com/api/checkout/create-checkout-session",
        {
          email,
          deliveryDetails,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            imageUrl: item.imageUrl,
            quantity: item.quantity || 1,
            selectedSize: item.selectedSize,
          })),
        }
      );

      const { checkoutUrl } = response.data;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError("No checkout URL received. Please try again.");
      }
    } catch {
      setError("Failed to initiate checkout. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box bg="#0B0F14" minH="100vh" py={{ base: 10, md: 14 }}>
      <Container maxW="container.xl">
        <HStack justify="space-between" align="end" mb={8} flexWrap="wrap" gap={3}>
          <Box>
            <Heading
              textTransform="uppercase"
              letterSpacing="0.02em"
              fontWeight="400"
              fontSize={{ base: "4xl", md: "5xl" }}
            >
              Cart
            </Heading>
            <Text color="whiteAlpha.700" mt={2}>
              Street-lux, handled properly. Review your selection before checkout.
            </Text>
          </Box>

          <Box
            px={4}
            py={3}
            borderRadius="2xl"
            border="1px solid rgba(255,255,255,0.10)"
            bg="rgba(255,255,255,0.03)"
          >
            <Text fontSize="sm" color="whiteAlpha.600" textTransform="uppercase" letterSpacing="0.14em">
              Order Total
            </Text>
            <Text fontSize="2xl" fontWeight="900" color="white">
              ₦{total.toLocaleString()}
            </Text>
          </Box>
        </HStack>

        {error && (
          <Box
            mb={6}
            p={4}
            borderRadius="2xl"
            border="1px solid rgba(255,0,0,0.25)"
            bg="rgba(255,0,0,0.08)"
            color="white"
          >
            <Text fontWeight="900">Checkout issue</Text>
            <Text color="whiteAlpha.800" mt={1}>
              {error}
            </Text>
          </Box>
        )}

        {cart.length === 0 ? (
          <Box
            p={10}
            borderRadius="2xl"
            border="1px solid rgba(255,255,255,0.10)"
            bg="rgba(255,255,255,0.03)"
            textAlign="center"
          >
            <Text color="whiteAlpha.700">Your cart is empty.</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} alignItems="start">
            {/* LEFT: cart items */}
            <VStack align="stretch" spacing={4}>
              {cart.map((item) => (
                <Box
                  key={`${item.id}-${item.selectedSize}`}
                  borderRadius="2xl"
                  overflow="hidden"
                  border="1px solid rgba(255,255,255,0.10)"
                  bg="rgba(255,255,255,0.03)"
                  boxShadow="0 18px 55px rgba(0,0,0,0.65)"
                >
                  <HStack align="stretch" spacing={0}>
                    <Box w={{ base: "120px", md: "160px" }} flexShrink={0} position="relative">
                      <Image
                        src={getPrimaryProductImage(item.imageUrl, "https://via.placeholder.com/250")}
                        alt={item.name}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        onError={(e: any) => (e.currentTarget.src = "https://via.placeholder.com/250")}
                        filter="contrast(1.06) saturate(0.95)"
                      />
                      <Box
                        position="absolute"
                        inset={0}
                        boxShadow="inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 80px rgba(45,107,255,0.10)"
                        pointerEvents="none"
                      />
                    </Box>

                    <Box p={4} flex="1">
                      <HStack justify="space-between" align="start" gap={3}>
                        <Box>
                          <Text fontWeight="900" textTransform="uppercase" letterSpacing="0.02em" color="white" noOfLines={2}>
                            {item.name}
                          </Text>
                          <HStack mt={2} spacing={2} flexWrap="wrap">
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
                              Size {item.selectedSize}
                            </Badge>

                            <Badge
                              bg="rgba(255,255,255,0.06)"
                              border="1px solid rgba(255,255,255,0.12)"
                              color="whiteAlpha.900"
                              borderRadius="full"
                              px={3}
                              py={1}
                              fontSize="xs"
                            >
                              ₦{item.price.toLocaleString()} each
                            </Badge>
                          </HStack>
                        </Box>

                        <Button
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          leftIcon={<FaTrash />}
                          variant="ghost"
                          color="whiteAlpha.800"
                          _hover={{ bg: "whiteAlpha.100", color: "red.300" }}
                          size="sm"
                        >
                          Remove
                        </Button>
                      </HStack>

                      <Text mt={3} color="whiteAlpha.650" noOfLines={2} fontSize="sm">
                        {item.description}
                      </Text>

                      <Divider my={4} borderColor="whiteAlpha.200" />

                      <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            variant="outline"
                            borderColor="whiteAlpha.300"
                            color="white"
                            _hover={{ borderColor: "rgba(45,107,255,0.55)", bg: "rgba(45,107,255,0.08)" }}
                            onClick={() => updateQuantity(item.id, item.selectedSize, (item.quantity || 1) - 1)}
                            isDisabled={(item.quantity || 1) <= 1}
                            leftIcon={<FaMinus />}
                          >
                            Decrease
                          </Button>

                          <Box
                            px={3}
                            py={2}
                            borderRadius="xl"
                            border="1px solid rgba(255,255,255,0.12)"
                            bg="rgba(255,255,255,0.03)"
                            minW="54px"
                            textAlign="center"
                          >
                            <Text fontWeight="900">{item.quantity || 1}</Text>
                          </Box>

                          <Button
                            size="sm"
                            variant="outline"
                            borderColor="whiteAlpha.300"
                            color="white"
                            _hover={{ borderColor: "rgba(45,107,255,0.55)", bg: "rgba(45,107,255,0.08)" }}
                            onClick={() => updateQuantity(item.id, item.selectedSize, (item.quantity || 1) + 1)}
                            leftIcon={<FaPlus />}
                          >
                            Increase
                          </Button>
                        </HStack>

                        <Text fontWeight="900" color="white">
                          ₦{(item.price * (item.quantity || 1)).toLocaleString()}
                        </Text>
                      </HStack>
                    </Box>
                  </HStack>
                </Box>
              ))}

              <HStack justify="space-between" pt={2}>
                <Button
                  variant="outline"
                  borderColor="whiteAlpha.300"
                  color="white"
                  _hover={{ bg: "whiteAlpha.100" }}
                  onClick={() => {
                    clearCart();
                    toast({
                      position: "bottom-right",
                      duration: 2200,
                      isClosable: true,
                      render: () => (
                        <Box
                          bg="black"
                          color="white"
                          borderRadius="2xl"
                          border="1px solid rgba(255,255,255,0.14)"
                          boxShadow="0 26px 70px rgba(0,0,0,0.75)"
                          p={4}
                          maxW="360px"
                        >
                          <Text fontWeight="900">Cart cleared</Text>
                          <Text mt={1} fontSize="sm" color="whiteAlpha.700">
                            Your selection has been emptied.
                          </Text>
                        </Box>
                      ),
                    });
                  }}
                >
                  Clear Cart
                </Button>

                <Text color="whiteAlpha.600" fontSize="sm">
                  Items:{" "}
                  <b style={{ color: "white" }}>
                    {cart.reduce((s, i) => s + (i.quantity || 0), 0)}
                  </b>
                </Text>
              </HStack>
            </VStack>

            {/* RIGHT: checkout form */}
            <Box
              borderRadius="2xl"
              border="1px solid rgba(255,255,255,0.10)"
              bg="rgba(255,255,255,0.03)"
              p={{ base: 5, md: 6 }}
              boxShadow="0 18px 55px rgba(0,0,0,0.65)"
              position="sticky"
              top="92px"
              alignSelf="start"
            >
              <Heading fontSize="2xl" fontWeight="900" textTransform="uppercase" letterSpacing="0.02em">
                Checkout
              </Heading>
              <Text mt={2} color="whiteAlpha.700" fontSize="sm">
                Enter delivery details. You’ll be redirected to secure payment.
              </Text>

              <Divider my={5} borderColor="whiteAlpha.200" />

              <VStack spacing={4} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color="whiteAlpha.700">First Name</FormLabel>
                    <Input
                      value={deliveryDetails.firstName}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, firstName: e.target.value })}
                      bg="rgba(255,255,255,0.03)"
                      borderColor="whiteAlpha.200"
                      _hover={{ borderColor: "rgba(45,107,255,0.55)" }}
                      _focusVisible={{ borderColor: "rgba(45,107,255,0.75)", boxShadow: "0 0 0 4px rgba(45,107,255,0.18)" }}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="whiteAlpha.700">Last Name</FormLabel>
                    <Input
                      value={deliveryDetails.lastName}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, lastName: e.target.value })}
                      bg="rgba(255,255,255,0.03)"
                      borderColor="whiteAlpha.200"
                      _hover={{ borderColor: "rgba(45,107,255,0.55)" }}
                      _focusVisible={{ borderColor: "rgba(45,107,255,0.75)", boxShadow: "0 0 0 4px rgba(45,107,255,0.18)" }}
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.700">Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="rgba(255,255,255,0.03)"
                    borderColor="whiteAlpha.200"
                    _hover={{ borderColor: "rgba(45,107,255,0.55)" }}
                    _focusVisible={{ borderColor: "rgba(45,107,255,0.75)", boxShadow: "0 0 0 4px rgba(45,107,255,0.18)" }}
                  />
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color="whiteAlpha.700">Country</FormLabel>
                    <Select
                      value={deliveryDetails.country}
                      onChange={(e) =>
                        setDeliveryDetails({ ...deliveryDetails, country: e.target.value, state: "", city: "" })
                      }
                      bg="rgba(255,255,255,0.03)"
                      borderColor="whiteAlpha.200"
                      _hover={{ borderColor: "rgba(45,107,255,0.55)" }}
                      _focusVisible={{ borderColor: "rgba(45,107,255,0.75)", boxShadow: "0 0 0 4px rgba(45,107,255,0.18)" }}
                    >
                      <option value="" style={{ color: "#111" }}>
                        Select Country
                      </option>
                      {countries.map((c) => (
                        <option key={c} value={c} style={{ color: "#111" }}>
                          {c}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired isDisabled={!deliveryDetails.country}>
                    <FormLabel color="whiteAlpha.700">State</FormLabel>
                    <Select
                      value={deliveryDetails.state}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, state: e.target.value, city: "" })}
                      bg="rgba(255,255,255,0.03)"
                      borderColor="whiteAlpha.200"
                      _hover={{ borderColor: "rgba(45,107,255,0.55)" }}
                      _focusVisible={{ borderColor: "rgba(45,107,255,0.75)", boxShadow: "0 0 0 4px rgba(45,107,255,0.18)" }}
                    >
                      <option value="" style={{ color: "#111" }}>
                        Select State
                      </option>
                      {states.map((s) => (
                        <option key={s} value={s} style={{ color: "#111" }}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired isDisabled={!deliveryDetails.state}>
                  <FormLabel color="whiteAlpha.700">City</FormLabel>
                  <Select
                    value={deliveryDetails.city}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })}
                    bg="rgba(255,255,255,0.03)"
                    borderColor="whiteAlpha.200"
                    _hover={{ borderColor: "rgba(45,107,255,0.55)" }}
                    _focusVisible={{ borderColor: "rgba(45,107,255,0.75)", boxShadow: "0 0 0 4px rgba(45,107,255,0.18)" }}
                  >
                    <option value="" style={{ color: "#111" }}>
                      Select City
                    </option>
                    {(cities[deliveryDetails.state] ?? []).map((city) => (
                      <option key={city} value={city} style={{ color: "#111" }}>
                        {city}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired isDisabled={!deliveryDetails.city}>
                  <FormLabel color="whiteAlpha.700">Home Address</FormLabel>
                  <Textarea
                    value={deliveryDetails.address}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                    bg="rgba(255,255,255,0.03)"
                    borderColor="whiteAlpha.200"
                    _hover={{ borderColor: "rgba(45,107,255,0.55)" }}
                    _focusVisible={{ borderColor: "rgba(45,107,255,0.75)", boxShadow: "0 0 0 4px rgba(45,107,255,0.18)" }}
                    minH="92px"
                    resize="vertical"
                  />
                </FormControl>

                <Divider borderColor="whiteAlpha.200" />

                <HStack justify="space-between">
                  <Text color="whiteAlpha.700" fontSize="sm">
                    Total
                  </Text>
                  <Text fontSize="xl" fontWeight="900" color="white">
                    ₦{total.toLocaleString()}
                  </Text>
                </HStack>

                <Button
                  size="lg"
                  borderRadius="xl"
                  bg="rgba(45,107,255,0.95)"
                  color="white"
                  fontWeight="900"
                  _hover={{ bg: "rgba(45,107,255,0.85)", transform: "translateY(-1px)" }}
                  _active={{ transform: "translateY(0px)" }}
                  boxShadow="0 18px 55px rgba(45,107,255,0.22)"
                  isLoading={submitting}
                  loadingText="Redirecting…"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <Text color="whiteAlpha.500" fontSize="xs" textAlign="center">
                  Secure payment • Delivery details sent with order
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}
