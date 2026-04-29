import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  VStack,
  SimpleGrid,
  Input,
  Button,
  Divider,
  Link,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaInstagram, FaWhatsapp, FaBolt, FaCrown, FaGem } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";


function IntroCard() {
  return (
    <Box py={{ base: 14, md: 18 }} bg="#0B0F14">
      <Container maxW="container.xl">
        <Box
          borderRadius="2xl"
          border="1px solid rgba(255,255,255,0.10)"
          bg="rgba(255,255,255,0.03)"
          boxShadow="0 18px 55px rgba(0,0,0,0.65)"
          overflow="hidden"
          position="relative"
        >
          {/* Glow / texture */}
          <Box
            position="absolute"
            inset={0}
            pointerEvents="none"
            bgGradient="radial(900px 420px at 20% 10%, rgba(45,107,255,0.18), transparent 55%)"
          />
          <Box
            position="absolute"
            inset={0}
            pointerEvents="none"
            boxShadow="inset 0 0 0 1px rgba(255,255,255,0.06)"
          />

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={0}>
            {/* Copy */}
            <Box p={{ base: 7, md: 10 }}>
              <Text
                fontSize="sm"
                letterSpacing="0.18em"
                textTransform="uppercase"
                color="whiteAlpha.700"
              >
                Lagos roots • street luxury
              </Text>

              <Heading
                mt={3}
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="400"
                textTransform="uppercase"
                letterSpacing="0.02em"
                color="white"
              >
                UrbanEra is the{" "}
                <Box as="span" color="rgba(45,107,255,0.95)">
                  new standard
                </Box>
                .
              </Heading>

              <Text mt={4} color="whiteAlpha.700" lineHeight="tall" maxW="560px">
                Born from Nigeria’s urban culture—built with discipline, craft, and the energy of
                the streets. Every drop is a chapter: story-first, limited-run, finished like luxury.
              </Text>

              <HStack mt={7} spacing={3} flexWrap="wrap">
                {[
                  { icon: FaBolt, label: "Limited drops" },
                  { icon: FaGem, label: "Premium finishing" },
                  { icon: FaCrown, label: "Street authority" },
                ].map((x) => (
                  <HStack
                    key={x.label}
                    px={4}
                    py={2}
                    borderRadius="full"
                    border="1px solid rgba(255,255,255,0.12)"
                    bg="rgba(255,255,255,0.02)"
                    spacing={3}
                  >
                    <Icon as={x.icon} color="rgba(45,107,255,0.95)" />
                    <Text color="whiteAlpha.800" fontWeight="800" mt={3} fontSize="sm">
                      {x.label}
                    </Text>
                  </HStack>
                ))}
              </HStack>
            </Box>

            {/* Visual panel */}
            <Box
              minH={{ base: "260px", md: "340px" }}
              bg="rgba(255,255,255,0.02)"
              borderLeft={{ base: "none", lg: "1px solid rgba(255,255,255,0.08)" }}
              position="relative"
            >
              <Box
                position="absolute"
                inset={0}
                bgGradient="linear(to-b, rgba(0,0,0,0.25), rgba(0,0,0,0.85))"
              />
              <Box
                position="absolute"
                inset={0}
                bgImage="radial-gradient(circle at 20% 20%, rgba(45,107,255,0.18), transparent 40%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.06), transparent 45%)"
              />
              <VStack position="relative" h="100%" justify="center" p={10} spacing={3} textAlign="left" align="start">
                <Text color="whiteAlpha.700" fontSize="sm" letterSpacing="0.14em" textTransform="uppercase">
                  The First Act • SS26
                </Text>
                <Heading color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="900">
                  Story-led drops.
                </Heading>
                <Text color="whiteAlpha.700" maxW="440px" lineHeight="tall">
                  Each piece is tied to a collection narrative—so the shop feels like a gallery, not a catalog.
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}

function MembersClubSection() {

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubscribe = async () => {
    setIsLoading(true);


    try {
      const response = await fetch('https://urbaneraapi.onrender.com/api/membership/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          firstName: fullName,
          lastName: '',
        }),
      });

      if (!response.ok) throw new Error('Signup failed');

      toast({
        title: "Subscribed!",
        description: "Welcome to UrbanEra.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Clear fields
      setEmail('');
      setFullName('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Box py={{ base: 14, md: 18 }} bg="linear-gradient(180deg, #070B10 0%, #05070B 100%)" borderTop="1px solid rgba(255,255,255,0.08)">
      <Container maxW="container.xl">
        <Box
          borderRadius="2xl"
          border="1px solid rgba(255,255,255,0.10)"
          bg="rgba(255,255,255,0.03)"
          boxShadow="0 18px 55px rgba(0,0,0,0.65)"
          p={{ base: 7, md: 10 }}
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            inset={0}
            pointerEvents="none"
            bgGradient="radial(900px 420px at 80% 0%, rgba(45,107,255,0.16), transparent 55%)"
          />

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} position="relative">
            <Box>
              <Text
                fontSize="sm"
                letterSpacing="0.18em"
                textTransform="uppercase"
                color="whiteAlpha.700"
              >
                Members Club
              </Text>

              <Heading mt={3} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="900" textTransform="uppercase" letterSpacing="0.02em" color="white">
                Early access. Feature on The Story.
              </Heading>

              <Text mt={4} color="whiteAlpha.700" lineHeight="tall" maxW="520px">
                Get first access to launches, member-only releases, feature on The Story and behind-the-scenes story notes.
                No spam. Just drops.
              </Text>

              <HStack mt={6} spacing={4} flexWrap="wrap">
                <Text color="whiteAlpha.600" fontSize="sm">• Early access</Text>
                <Text color="whiteAlpha.600" fontSize="sm">• Story features</Text>
                <Text color="whiteAlpha.600" fontSize="sm">• Restock alerts</Text>
              </HStack>
            </Box>

            <Box>
              <VStack align="stretch" spacing={3}>
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="rgba(255,255,255,0.03)"
                  borderColor="whiteAlpha.200"
                  _hover={{ borderColor: "rgba(45,107,255,0.55)" }}
                  _focusVisible={{
                    borderColor: "rgba(45,107,255,0.75)",
                    boxShadow: "0 0 0 4px rgba(45,107,255,0.18)",
                  }}
                  size="lg"
                  borderRadius="xl"
                />
                <Input
                  placeholder="Enter your name (optional)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  bg="rgba(255,255,255,0.03)"
                  borderColor="whiteAlpha.200"
                  _hover={{ borderColor: "rgba(45,107,255,0.55)" }}
                  _focusVisible={{
                    borderColor: "rgba(45,107,255,0.75)",
                    boxShadow: "0 0 0 4px rgba(45,107,255,0.18)",
                  }}
                  size="lg"
                  borderRadius="xl"
                />
                <Button
                  onClick={handleSubscribe}
                  isLoading={isLoading}
                  size="lg"
                  borderRadius="xl"
                  bg="rgba(45,107,255,0.95)"
                  color="white"
                  fontWeight="900"
                  _hover={{ bg: "rgba(45,107,255,0.85)", transform: "translateY(-1px)" }}
                  _active={{ transform: "translateY(0px)" }}
                  boxShadow="0 18px 55px rgba(45,107,255,0.22)"
                >
                  Subscribe
                </Button>

                <Text color="whiteAlpha.500" fontSize="xs">
                  By subscribing you agree to receive emails from UrbanEra. Unsubscribe anytime.
                </Text>

                <Divider borderColor="whiteAlpha.200" />

                <HStack spacing={4}>
                  <Link href="https://wa.me/+2349117666722" isExternal _hover={{ textDecoration: "none" }}>
                    <HStack
                      px={4}
                      py={2}
                      borderRadius="full"
                      border="1px solid rgba(255,255,255,0.12)"
                      bg="rgba(255,255,255,0.02)"
                      _hover={{ borderColor: "rgba(45,107,255,0.45)", bg: "rgba(45,107,255,0.08)" }}
                    >
                      <Icon as={FaWhatsapp} color="rgba(45,107,255,0.95)" />
                      <Text color="whiteAlpha.800" fontWeight="800" mt={2} fontSize="sm">
                        WhatsApp
                      </Text>
                    </HStack>
                  </Link>

                  <Link href="https://instagram.com/theurban_era" isExternal _hover={{ textDecoration: "none" }}>
                    <HStack
                      px={4}
                      py={2}
                      borderRadius="full"
                      border="1px solid rgba(255,255,255,0.12)"
                      bg="rgba(255,255,255,0.02)"
                      _hover={{ borderColor: "rgba(45,107,255,0.45)", bg: "rgba(45,107,255,0.08)" }}
                    >
                      <Icon as={FaInstagram} color="rgba(45,107,255,0.95)" />
                      <Text color="whiteAlpha.800" fontWeight="800" mt={2} fontSize="sm">
                        Instagram
                      </Text>
                    </HStack>
                  </Link>
                </HStack>
              </VStack>
            </Box>
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}

function Footer() {
  return (
    <Box bg="#05070B" borderTop="1px solid rgba(255,255,255,0.08)" py={12}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Box>
            <Heading fontSize="lg" color="white" textTransform="uppercase" letterSpacing="0.12em">
              UrbanEra
            </Heading>
            <Text mt={3} color="whiteAlpha.600" lineHeight="tall" maxW="360px">
              Street luxury from Lagos. Story-led drops. Limited runs.
            </Text>
          </Box>

          <Box>
            <Heading fontSize="sm" color="whiteAlpha.800" textTransform="uppercase" letterSpacing="0.14em">
              Explore
            </Heading>
            <VStack align="start" spacing={2} mt={3}>
              <Link as={RouterLink} to="/drops" color="whiteAlpha.700" _hover={{ color: "white" }}>
                Drops
              </Link>
              <Link as={RouterLink} to="/magazine" color="whiteAlpha.700" _hover={{ color: "white" }}>
                LookBook
              </Link>
              <Link as={RouterLink} to="/cart" color="whiteAlpha.700" _hover={{ color: "white" }}>
                Cart
              </Link>
            </VStack>
          </Box>

          <Box>
            <Heading fontSize="sm" color="whiteAlpha.800" textTransform="uppercase" letterSpacing="0.14em">
              Social
            </Heading>
            <VStack align="start" spacing={3} mt={3}>
              <Link href="https://instagram.com/theurban_era" isExternal color="whiteAlpha.700" _hover={{ color: "white" }}>
                Instagram <FaInstagram style={{ display: "ruby", marginLeft: 4 }} />
              </Link>
              <Link href="https://wa.me/+2349117666722" isExternal color="whiteAlpha.700" _hover={{ color: "white" }}>
                WhatsApp <FaWhatsapp style={{ display: "ruby", marginLeft: 4 }} />
              </Link>
            </VStack>
          </Box>
        </SimpleGrid>

        <Divider my={10} borderColor="whiteAlpha.200" />

        <HStack justify="space-between" flexWrap="wrap" gap={3}>
          <Text color="whiteAlpha.500" fontSize="sm">
            © {new Date().getFullYear()} UrbanEra. All rights reserved.
          </Text>
          <HStack spacing={5}>
            <Text color="whiteAlpha.500" fontSize="sm">
              Lagos, Nigeria
            </Text>
            <Text color="whiteAlpha.500" fontSize="sm">
              Street Luxury
            </Text>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}

export { IntroCard, MembersClubSection, Footer };