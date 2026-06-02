import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaInstagram, FaWhatsapp, FaShieldAlt, FaHeadset } from "react-icons/fa";

const supportPhone = "+234 911 766 6722";
const instagramHandle = "@theurban_era";

export default function SupportPrivacy() {
  return (
    <Box bg="#0B0F14" minH="100vh" py={{ base: 10, md: 14 }}>
      <Container maxW="container.xl">
        <Stack spacing={5} mb={10}>
          <Badge
            alignSelf="start"
            px={3}
            py={1}
            borderRadius="full"
            bg="rgba(45,107,255,0.16)"
            border="1px solid rgba(45,107,255,0.35)"
            color="white"
            textTransform="uppercase"
            letterSpacing="0.14em"
          >
            Support and Privacy
          </Badge>

          <Heading
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="400"
            textTransform="uppercase"
            letterSpacing="0.02em"
            color="white"
          >
            UrbanEra Support and Privacy Policy
          </Heading>

          <Text color="whiteAlpha.700" maxW="760px" lineHeight="tall">
            This page explains how to reach us for help and how UrbanEra handles information
            collected through the app, checkout, membership signup, reviews, and account activity.
          </Text>

          <HStack spacing={3} flexWrap="wrap">
            <Button as="a" href="#support" variant="outline" borderColor="whiteAlpha.300" color="white">
              Support
            </Button>
            <Button as="a" href="#privacy" bg="rgba(45,107,255,0.95)" color="white" _hover={{ bg: "rgba(45,107,255,0.85)" }}>
              Privacy Policy
            </Button>
          </HStack>
        </Stack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <Box
            id="support"
            scrollMarginTop="96px"
            p={{ base: 5, md: 6 }}
            borderRadius="2xl"
            border="1px solid rgba(255,255,255,0.10)"
            bg="rgba(255,255,255,0.03)"
          >
            <HStack spacing={3} mb={4}>
              <Box color="rgba(45,107,255,0.95)">
                <FaHeadset />
              </Box>
              <Heading fontSize="xl" fontWeight="900" textTransform="uppercase" letterSpacing="0.02em">
                Support
              </Heading>
            </HStack>

            <VStack align="stretch" spacing={4}>
              <Text color="whiteAlpha.700" lineHeight="tall">
                For order help, sizing questions, delivery updates, account access issues, or
                general product support, contact us through the channels below.
              </Text>

              <HStack
                as={Link}
                href={`https://wa.me/2349117666722`}
                isExternal
                px={4}
                py={3}
                borderRadius="xl"
                border="1px solid rgba(255,255,255,0.12)"
                bg="rgba(255,255,255,0.02)"
                _hover={{ textDecoration: "none", borderColor: "rgba(45,107,255,0.45)", bg: "rgba(45,107,255,0.08)" }}
              >
                <Box color="rgba(45,107,255,0.95)">
                  <FaWhatsapp />
                </Box>
                <Box>
                  <Text fontWeight="900" color="white">
                    WhatsApp
                  </Text>
                  <Text color="whiteAlpha.700" fontSize="sm">
                    {supportPhone}
                  </Text>
                </Box>
              </HStack>

              <HStack
                as={Link}
                href="https://instagram.com/theurban_era"
                isExternal
                px={4}
                py={3}
                borderRadius="xl"
                border="1px solid rgba(255,255,255,0.12)"
                bg="rgba(255,255,255,0.02)"
                _hover={{ textDecoration: "none", borderColor: "rgba(45,107,255,0.45)", bg: "rgba(45,107,255,0.08)" }}
              >
                <Box color="rgba(45,107,255,0.95)">
                  <FaInstagram />
                </Box>
                <Box>
                  <Text fontWeight="900" color="white">
                    Instagram
                  </Text>
                  <Text color="whiteAlpha.700" fontSize="sm">
                    {instagramHandle}
                  </Text>
                </Box>
              </HStack>

              <Text color="whiteAlpha.500" fontSize="sm">
                Response times depend on volume and local business hours.
              </Text>
            </VStack>
          </Box>

          <Box
            id="privacy"
            scrollMarginTop="96px"
            p={{ base: 5, md: 6 }}
            borderRadius="2xl"
            border="1px solid rgba(255,255,255,0.10)"
            bg="rgba(255,255,255,0.03)"
          >
            <HStack spacing={3} mb={4}>
              <Box color="rgba(45,107,255,0.95)">
                <FaShieldAlt />
              </Box>
              <Heading fontSize="xl" fontWeight="900" textTransform="uppercase" letterSpacing="0.02em">
                Privacy Policy
              </Heading>
            </HStack>

            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="900" color="white">
                  Effective date: June 2, 2026
                </Text>
                <Text color="whiteAlpha.700" mt={2} lineHeight="tall">
                  UrbanEra operates a streetwear shopping app and related checkout services. We
                  collect only the information needed to process orders, manage support requests,
                  and improve the experience.
                </Text>
              </Box>

              <Divider borderColor="whiteAlpha.200" />

              <Box>
                <Text fontWeight="900" color="white">
                  Information we collect
                </Text>
                <Text color="whiteAlpha.700" mt={2} lineHeight="tall">
                  We may collect your name, email address, delivery details, order contents,
                  selected sizes, review content, and membership signup details. The app also
                  stores cart data locally on your device so items remain saved between visits.
                </Text>
              </Box>

              <Box>
                <Text fontWeight="900" color="white">
                  How we use information
                </Text>
                <Text color="whiteAlpha.700" mt={2} lineHeight="tall">
                  We use data to process checkout, deliver orders, respond to support requests,
                  send membership updates when requested, moderate reviews, and improve product and
                  store performance.
                </Text>
              </Box>

              <Box>
                <Text fontWeight="900" color="white">
                  Sharing and third parties
                </Text>
                <Text color="whiteAlpha.700" mt={2} lineHeight="tall">
                  We may share order data with service providers that help us run the app,
                  process payment, host the backend, or manage delivery and communication. We do
                  not intentionally sell personal data.
                </Text>
              </Box>

              <Box>
                <Text fontWeight="900" color="white">
                  Security and retention
                </Text>
                <Text color="whiteAlpha.700" mt={2} lineHeight="tall">
                  We use reasonable technical and administrative measures to protect information.
                  Data is kept only as long as needed for order fulfillment, support, legal, and
                  business purposes.
                </Text>
              </Box>

              <Box>
                <Text fontWeight="900" color="white">
                  Your choices
                </Text>
                <Text color="whiteAlpha.700" mt={2} lineHeight="tall">
                  You can request access, correction, or deletion of your personal information by
                  contacting support. You may also clear locally stored cart data from your device
                  by clearing browser or app storage.
                </Text>
              </Box>

              <Box>
                <Text fontWeight="900" color="white">
                  Updates
                </Text>
                <Text color="whiteAlpha.700" mt={2} lineHeight="tall">
                  We may update this policy from time to time. The latest version will appear on
                  this page.
                </Text>
              </Box>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
