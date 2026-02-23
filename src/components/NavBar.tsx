import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useMemo } from "react";
import { CartContext } from "../context/CartContext";
import {
  Box,
  Container,
  HStack,
  Text,
  IconButton,
  Badge,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  VStack,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FiShoppingBag, FiBookOpen, FiShoppingCart } from "react-icons/fi";

export default function NavBar() {
  const { cart } = useContext(CartContext);
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cart]
  );

  // Close drawer on route change
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const PillLink = ({
    to,
    children,
    right,
  }: {
    to: string;
    children: React.ReactNode;
    right?: React.ReactNode;
  }) => (
    <HStack
      as={Link}
      to={to}
      spacing={2}
      px={4}
      py={2}
      borderRadius="full"
      border="1px solid rgba(255,255,255,0.14)"
      bg="rgba(255,255,255,0.03)"
      color="white"
      _hover={{
        textDecoration: "none",
        transform: "translateY(-1px)",
        borderColor: "rgba(45,107,255,0.45)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
      }}
      transition="all 0.18s ease"
    >
      <Box>{children}</Box>
      {right}
    </HStack>
  );

  const DrawerLink = ({
    to,
    label,
    icon,
    right,
  }: {
    to: string;
    label: string;
    icon: React.ReactNode;
    right?: React.ReactNode;
  }) => (
    <HStack
      as={Link}
      to={to}
      px={3}
      py={3}
      borderRadius="xl"
      border="1px solid rgba(255,255,255,0.10)"
      bg="rgba(255,255,255,0.03)"
      color="white"
      justify="space-between"
      _hover={{
        textDecoration: "none",
        borderColor: "rgba(45,107,255,0.45)",
        bg: "rgba(45,107,255,0.08)",
      }}
      transition="all 0.18s ease"
    >
      <HStack spacing={3}>
        <Box color="rgba(45,107,255,0.95)">{icon}</Box>
        <Text fontWeight="800" letterSpacing="0.02em">
          {label}
        </Text>
      </HStack>
      {right}
    </HStack>
  );

  return (
    <>
      <Box
        as="nav"
        position="sticky"
        top={0}
        zIndex={50}
        bg="rgba(11,15,20,0.75)"
        backdropFilter="blur(14px)"
        borderBottom="1px solid rgba(255,255,255,0.08)"
      >
        <Container maxW="container.xl" py={3}>
          <HStack justify="space-between">
            <Text
              as={Link}
              to="/"
              fontWeight="900"
              letterSpacing="0.16em"
              textTransform="uppercase"
              color="white"
              _hover={{ textDecoration: "none", color: "rgba(45,107,255,0.95)" }}
            >
              UrbanEra
            </Text>

            {/* Desktop */}
            <HStack display={{ base: "none", lg: "flex" }} spacing={3}>
              <PillLink to="/drops" right={<FiShoppingBag />}>
                Drops
              </PillLink>

              <PillLink to="/magazine" right={<FiBookOpen />}>
                LookBook
              </PillLink>

              <PillLink
                to="/cart"
                right={
                  <HStack spacing={2}>
                    <FiShoppingCart />
                    {itemCount > 0 && (
                      <Badge
                        borderRadius="full"
                        bg="rgba(45,107,255,0.95)"
                        color="white"
                        px={2}
                      >
                        {itemCount}
                      </Badge>
                    )}
                  </HStack>
                }
              >
                Cart
              </PillLink>
            </HStack>

            {/* Mobile */}
            <HStack display={{ base: "flex", lg: "none" }} spacing={2}>
              <IconButton
                aria-label="Open menu"
                icon={<HamburgerIcon />}
                onClick={onOpen}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.100" }}
              />
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="xs">
        <DrawerOverlay />
        <DrawerContent bg="#0B0F14" borderLeft="1px solid rgba(255,255,255,0.10)">
          <DrawerHeader>
            <HStack justify="space-between">
              <Text
                fontWeight="900"
                letterSpacing="0.16em"
                textTransform="uppercase"
                color="white"
              >
                UrbanEra
              </Text>
              <IconButton
                aria-label="Close menu"
                icon={<CloseIcon />}
                onClick={onClose}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.100" }}
              />
            </HStack>
          </DrawerHeader>

          <Divider borderColor="whiteAlpha.200" />

          <DrawerBody py={6}>
            <VStack spacing={3} align="stretch">
              <DrawerLink to="/drops" label="Drops" icon={<FiShoppingBag />} />
              <DrawerLink to="/magazine" label="The Urban LookBook" icon={<FiBookOpen />} />
              <DrawerLink
                to="/cart"
                label="Cart"
                icon={<FiShoppingCart />}
                right={
                  itemCount > 0 ? (
                    <Badge bg="rgba(45,107,255,0.95)" color="white" borderRadius="full" px={2}>
                      {itemCount}
                    </Badge>
                  ) : undefined
                }
              />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}