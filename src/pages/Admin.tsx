import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import type { Product, Review } from "../types/Product";
import type {
  CollectionAdminDto,
  UpsertCollectionRequest,
  AssignProductsToCollectionRequest,
  SetDropOrderRequest
} from "../types/CollectionAdmin";
import { AdminShootsSection } from "../components/ShootsSection";

const API = "https://urbaneraapi.onrender.com/api";

const emptyCollection: UpsertCollectionRequest = {
  slug: "",
  title: "",
  season: "",
  statement: "",
  story: "",
  coverImageUrl: "",
  heroImageUrl: "",
  accent: "",
  isPublished: false,
};

export default function Admin() {
  const toast = useToast();

  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // Data
  const [collections, setCollections] = useState<CollectionAdminDto[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Collections form
  const [colForm, setColForm] = useState<UpsertCollectionRequest>(emptyCollection);
  const [editingCollectionId, setEditingCollectionId] = useState<number | null>(null);

  // Assign products drawer
  const assignDrawer = useDisclosure();
  const [assignCollectionId, setAssignCollectionId] = useState<number | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [clearExistingAssignments, setClearExistingAssignments] = useState(false);

  // Drop order modal
  const orderModal = useDisclosure();
  const [orderCollectionId, setOrderCollectionId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<{ productId: number; name: string }[]>([]);

  // Products CRUD
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    sizes: "" as string,
  });
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const http = useMemo(() => {
    const instance = axios.create({ baseURL: API });
    instance.interceptors.request.use((cfg) => {
      if (token) cfg.headers.Authorization = `Bearer ${token}`;
      return cfg;
    });
    return instance;
  }, [token]);

  const notify = (title: string, status: "success" | "error" | "info" = "success") => {
    toast({ title, status, duration: 2500, isClosable: true, position: "bottom-right" });
  };

  const refreshAll = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [colsRes, prodsRes, revsRes] = await Promise.all([
        http.get<CollectionAdminDto[]>("/admin/collections"),
        http.get<Product[]>("/products"),
        http.get<Review[]>("/reviews"),
      ]);

      setCollections(colsRes.data ?? []);
      setProducts(prodsRes.data ?? []);
      setReviews(revsRes.data ?? []);
      console.log('collections:', colsRes);
      console.log('products:', prodsRes);
      console.log('reviews:', revsRes);
    } catch (e: any) {
      notify("Failed to load admin data.", "error");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // -----------------------
  // Auth
  // -----------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/login`, { username, password });
      const t = res.data?.token;
      if (!t) throw new Error("No token returned");
      localStorage.setItem("token", t);
      setToken(t);
      setUsername("");
      setPassword("");
      notify("Logged in.", "success");
    } catch {
      notify("Invalid username or password.", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCollections([]);
    setProducts([]);
    setReviews([]);
    notify("Logged out.", "info");
  };

  // -----------------------
  // Collections CRUD
  // -----------------------
  const startCreateCollection = () => {
    setEditingCollectionId(null);
    setColForm(emptyCollection);
  };

  const startEditCollection = (c: CollectionAdminDto) => {
    setEditingCollectionId(c.id);
    setColForm({
      slug: c.slug,
      title: c.title,
      season: c.season,
      statement: c.statement,
      story: c.story,
      coverImageUrl: c.coverImageUrl,
      heroImageUrl: c.heroImageUrl,
      accent: c.accent ?? "",
      isPublished: c.isPublished,
    });
  };

  const saveCollection = async () => {
    try {
      const payload: UpsertCollectionRequest = {
        ...colForm,
        accent: colForm.accent?.trim() ? colForm.accent.trim() : null,
      };

      if (editingCollectionId) {
        await http.put(`/admin/collections/${editingCollectionId}`, payload);
        notify("Collection updated.", "success");
      } else {
        await http.post(`/admin/collections`, payload);
        notify("Collection created.", "success");
      }

      setEditingCollectionId(null);
      setColForm(emptyCollection);
      await refreshAll();
    } catch (e: any) {
      const msg = e?.response?.data?.error || "Failed to save collection.";
      notify(String(msg), "error");
    }
  };

  const deleteCollection = async (id: number) => {
    try {
      await http.delete(`/admin/collections/${id}`);
      notify("Collection deleted.", "success");
      await refreshAll();
    } catch (e: any) {
      const msg = e?.response?.data?.error || "Failed to delete collection.";
      notify(String(msg), "error");
    }
  };

  // -----------------------
  // Assign Products
  // -----------------------
  const openAssignProducts = (collectionId: number) => {
    setAssignCollectionId(collectionId);
    setSelectedProductIds([]);
    setClearExistingAssignments(false);
    assignDrawer.onOpen();
  };

  const toggleProductPick = (id: number, checked: boolean) => {
    setSelectedProductIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const assignProducts = async () => {
    if (!assignCollectionId || selectedProductIds.length === 0) return;

    const payload: AssignProductsToCollectionRequest = {
      productIds: selectedProductIds,
      clearExistingCollectionAssignments: clearExistingAssignments,
    };

    try {
      await http.post(`/admin/collections/${assignCollectionId}/assign-products`, payload);
      notify("Products assigned.", "success");
      assignDrawer.onClose();
      setAssignCollectionId(null);
      setSelectedProductIds([]);
      await refreshAll();
    } catch (e: any) {
      const msg = e?.response?.data?.error || "Failed to assign products.";
      notify(String(msg), "error");
    }
  };

  // -----------------------
  // Drop Order
  // NOTE: this requires product.collectionId on product list
  // -----------------------
  const openDropOrder = (collectionId: number) => {
    setOrderCollectionId(collectionId);

    const items = (products as any[])
      .filter((p) => p.collectionId === collectionId)
      .sort((a, b) => (a.dropOrder ?? 9999) - (b.dropOrder ?? 9999))
      .map((p) => ({ productId: p.id, name: p.name }));

    setOrderItems(items);
    orderModal.onOpen();
  };

  const moveOrder = (idx: number, dir: -1 | 1) => {
    setOrderItems((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      const tmp = next[idx];
      next[idx] = next[j];
      next[j] = tmp;
      return next;
    });
  };

  const saveDropOrder = async () => {
    if (!orderCollectionId) return;

    const payload: SetDropOrderRequest = {
      items: orderItems.map((x, i) => ({ productId: x.productId, dropOrder: i + 1 })),
    };

    try {
      await http.post(`/admin/collections/${orderCollectionId}/set-drop-order`, payload);
      notify("Drop order saved.", "success");
      orderModal.onClose();
      await refreshAll();
    } catch (e: any) {
      const msg = e?.response?.data?.error || "Failed to save drop order.";
      notify(String(msg), "error");
    }
  };

  // -----------------------
  // Products CRUD
  // -----------------------
  const addProduct = async () => {
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        sizes: newProduct.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await http.post("/products", payload);
      notify("Product added.", "success");
      setNewProduct({ name: "", description: "", price: 0, imageUrl: "", sizes: "" });
      await refreshAll();
    } catch (e: any) {
      const msg = e?.response?.data?.error || "Failed to add product.";
      notify(String(msg), "error");
    }
  };

  const updateProduct = async () => {
    if (!editProduct) return;
    try {
      const payload = {
        name: editProduct.name,
        description: editProduct.description,
        price: Number(editProduct.price),
        imageUrl: editProduct.imageUrl,
        sizes: editProduct.sizes,
      };
      await http.put(`/products/${editProduct.id}`, payload);
      notify("Product updated.", "success");
      setEditProduct(null);
      await refreshAll();
    } catch (e: any) {
      const msg = e?.response?.data?.error || "Failed to update product.";
      notify(String(msg), "error");
    }
  };

  const removeProduct = async (id: number) => {
    try {
      await http.delete(`/products/${id}`);
      notify("Product deleted.", "success");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      const msg = e?.response?.data?.error || "Failed to delete product.";
      notify(String(msg), "error");
    }
  };

  // -----------------------
  // Reviews moderation
  // -----------------------
  const removeReview = async (id: number) => {
    try {
      await http.delete(`/reviews/${id}`);
      notify("Review deleted.", "success");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      const msg = e?.response?.data?.error || "Failed to delete review.";
      notify(String(msg), "error");
    }
  };

  // -----------------------
  // Render
  // -----------------------
  if (!token) {
    return (
      <Center minH="100vh" bg="black" color="white" px={6}>
        <Box w="full" maxW="420px" p={8} borderRadius="2xl" bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.200">
          <Heading size="lg" mb={6} letterSpacing="wide" textTransform="uppercase">
            Admin Login
          </Heading>

          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="whiteAlpha.700">Username</FormLabel>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} bg="blackAlpha.400" borderColor="whiteAlpha.200" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="whiteAlpha.700">Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} bg="blackAlpha.400" borderColor="whiteAlpha.200" />
              </FormControl>

              <Button type="submit" colorScheme="yellow" size="lg">
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg="black" color="white" py={10}>
      <Container maxW="container.xl">
        <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
          <Box>
            <Heading size="lg" letterSpacing="wide" textTransform="uppercase">
              UrbanEra Admin
            </Heading>
            <Text color="whiteAlpha.700" mt={1}>
              Collections • Products • Reviews
            </Text>
          </Box>

          <HStack>
            <Button variant="outline" borderColor="whiteAlpha.300" onClick={refreshAll} isLoading={loading}>
              Refresh
            </Button>
            <Button colorScheme="yellow" onClick={handleLogout}>
              Logout
            </Button>
          </HStack>
        </Flex>

        <Divider my={6} borderColor="whiteAlpha.200" />

        <Tabs variant="enclosed" colorScheme="yellow">
          <TabList>
            <Tab>Collections</Tab>
            <Tab>Products</Tab>
            <Tab>Shoots</Tab>
            <Tab>Reviews</Tab>
          </TabList>

          <TabPanels>
            {/* ---------------- Collections ---------------- */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                {/* Form */}
                <Box p={6} borderRadius="2xl" bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.200">
                  <Flex align="center" justify="space-between" mb={4}>
                    <Heading size="md" textTransform="uppercase" letterSpacing="wide">
                      {editingCollectionId ? "Edit Collection" : "Create Collection"}
                    </Heading>
                    <Button size="sm" variant="ghost" onClick={startCreateCollection}>
                      Reset
                    </Button>
                  </Flex>

                  <Stack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel color="whiteAlpha.700">Slug</FormLabel>
                      <Input
                        value={colForm.slug}
                        onChange={(e) => setColForm((p) => ({ ...p, slug: e.target.value }))}
                        placeholder="the-first-act-ss26"
                        bg="blackAlpha.400"
                        borderColor="whiteAlpha.200"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="whiteAlpha.700">Title</FormLabel>
                      <Input
                        value={colForm.title}
                        onChange={(e) => setColForm((p) => ({ ...p, title: e.target.value }))}
                        placeholder="The First Act"
                        bg="blackAlpha.400"
                        borderColor="whiteAlpha.200"
                      />
                    </FormControl>

                    <HStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel color="whiteAlpha.700">Season</FormLabel>
                        <Input
                          value={colForm.season}
                          onChange={(e) => setColForm((p) => ({ ...p, season: e.target.value }))}
                          placeholder="SS26"
                          bg="blackAlpha.400"
                          borderColor="whiteAlpha.200"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel color="whiteAlpha.700">Accent (optional)</FormLabel>
                        <Input
                          value={colForm.accent ?? ""}
                          onChange={(e) => setColForm((p) => ({ ...p, accent: e.target.value }))}
                          placeholder="#B8860B"
                          bg="blackAlpha.400"
                          borderColor="whiteAlpha.200"
                        />
                      </FormControl>
                    </HStack>

                    <FormControl isRequired>
                      <FormLabel color="whiteAlpha.700">Statement</FormLabel>
                      <Input
                        value={colForm.statement}
                        onChange={(e) => setColForm((p) => ({ ...p, statement: e.target.value }))}
                        bg="blackAlpha.400"
                        borderColor="whiteAlpha.200"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="whiteAlpha.700">Story</FormLabel>
                      <Textarea
                        value={colForm.story}
                        onChange={(e) => setColForm((p) => ({ ...p, story: e.target.value }))}
                        rows={6}
                        bg="blackAlpha.400"
                        borderColor="whiteAlpha.200"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="whiteAlpha.700">Cover Image URL</FormLabel>
                      <Input
                        value={colForm.coverImageUrl}
                        onChange={(e) => setColForm((p) => ({ ...p, coverImageUrl: e.target.value }))}
                        bg="blackAlpha.400"
                        borderColor="whiteAlpha.200"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="whiteAlpha.700">Hero Image URL</FormLabel>
                      <Input
                        value={colForm.heroImageUrl}
                        onChange={(e) => setColForm((p) => ({ ...p, heroImageUrl: e.target.value }))}
                        bg="blackAlpha.400"
                        borderColor="whiteAlpha.200"
                      />
                    </FormControl>

                    <HStack justify="space-between">
                      <HStack>
                        <Switch
                          isChecked={colForm.isPublished}
                          onChange={(e) => setColForm((p) => ({ ...p, isPublished: e.target.checked }))}
                          colorScheme="yellow"
                        />
                        <Text color="whiteAlpha.700">Published</Text>
                      </HStack>

                      <Button
                        colorScheme="yellow"
                        onClick={saveCollection}
                        isLoading={loading}
                      >
                        {editingCollectionId ? "Save Changes" : "Create Collection"}
                      </Button>
                    </HStack>
                  </Stack>
                </Box>

                {/* List */}
                <Box>
                  <Flex align="center" justify="space-between" mb={3}>
                    <Heading size="md" textTransform="uppercase" letterSpacing="wide">
                      Collections
                    </Heading>
                    {loading && <Spinner size="sm" />}
                  </Flex>

                  <Stack spacing={4}>
                    {collections.map((c) => (
                      <Box
                        key={c.id}
                        p={5}
                        borderRadius="2xl"
                        bg="whiteAlpha.50"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                      >
                        <Flex align="start" justify="space-between" gap={3}>
                          <Box>
                            <HStack spacing={2} mb={1}>
                              <Tag size="sm" variant="subtle" colorScheme="yellow">
                                <TagLabel>{c.season}</TagLabel>
                              </Tag>
                              <Text fontSize="sm" color="whiteAlpha.600">
                                {c.slug}
                              </Text>
                              {c.isPublished ? (
                                <Badge colorScheme="green">PUBLISHED</Badge>
                              ) : (
                                <Badge colorScheme="orange">DRAFT</Badge>
                              )}
                            </HStack>

                            <Text fontSize="lg" fontWeight="800">
                              {c.title}
                            </Text>

                            <Text mt={2} color="whiteAlpha.700" noOfLines={2}>
                              {c.statement}
                            </Text>
                          </Box>

                          <HStack>
                            <IconButton
                              aria-label="Edit"
                              icon={<EditIcon />}
                              variant="outline"
                              borderColor="whiteAlpha.300"
                              onClick={() => startEditCollection(c)}
                            />
                            <IconButton
                              aria-label="Delete"
                              icon={<DeleteIcon />}
                              variant="outline"
                              borderColor="whiteAlpha.300"
                              onClick={() => deleteCollection(c.id)}
                            />
                          </HStack>
                        </Flex>

                        <HStack mt={4} spacing={3} wrap="wrap">
                          <Button size="sm" variant="outline" borderColor="whiteAlpha.300" onClick={() => openAssignProducts(c.id)}>
                            Assign Products
                          </Button>
                          <Button size="sm" variant="outline" borderColor="whiteAlpha.300" onClick={() => openDropOrder(c.id)}>
                            Drop Order
                          </Button>
                        </HStack>
                      </Box>
                    ))}

                    {!collections.length && !loading && (
                      <Text color="whiteAlpha.600">No collections yet.</Text>
                    )}
                  </Stack>
                </Box>
              </SimpleGrid>

              {/* Assign Products Drawer */}
              <Drawer isOpen={assignDrawer.isOpen} placement="right" onClose={assignDrawer.onClose} size="md">
                <DrawerOverlay />
                <DrawerContent bg="black" color="white">
                  <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">
                    Assign Products
                  </DrawerHeader>

                  <DrawerBody>
                    <VStack align="stretch" spacing={4}>
                      <Checkbox
                        isChecked={clearExistingAssignments}
                        onChange={(e) => setClearExistingAssignments(e.target.checked)}
                        colorScheme="yellow"
                      >
                        Clear existing assignments first
                      </Checkbox>

                      <Divider borderColor="whiteAlpha.200" />

                      <VStack align="stretch" spacing={2}>
                        {products.map((p) => {
                          const checked = selectedProductIds.includes(p.id);
                          return (
                            <Flex
                              key={p.id}
                              p={3}
                              borderRadius="xl"
                              border="1px solid"
                              borderColor={checked ? "yellow.400" : "whiteAlpha.200"}
                              bg={checked ? "yellow.500Alpha" : "whiteAlpha.50"}
                              align="center"
                              justify="space-between"
                              gap={3}
                            >
                              <Box>
                                <Text fontWeight="800">{p.name}</Text>
                                <Text fontSize="sm" color="whiteAlpha.600">
                                  ₦{p.price.toLocaleString()}
                                </Text>
                              </Box>

                              <Checkbox
                                isChecked={checked}
                                onChange={(e) => toggleProductPick(p.id, e.target.checked)}
                                colorScheme="yellow"
                              />
                            </Flex>
                          );
                        })}
                      </VStack>
                    </VStack>
                  </DrawerBody>

                  <DrawerFooter borderTopWidth="1px" borderColor="whiteAlpha.200">
                    <HStack w="full" justify="space-between">
                      <Button variant="outline" borderColor="whiteAlpha.300" onClick={assignDrawer.onClose}>
                        Close
                      </Button>
                      <Button
                        colorScheme="yellow"
                        onClick={assignProducts}
                        isDisabled={selectedProductIds.length === 0}
                      >
                        Assign ({selectedProductIds.length})
                      </Button>
                    </HStack>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>

              {/* Drop Order Modal */}
              <Modal isOpen={orderModal.isOpen} onClose={orderModal.onClose} size="lg">
                <ModalOverlay />
                <ModalContent bg="black" color="white" border="1px solid" borderColor="whiteAlpha.200">
                  <ModalHeader>Drop Order</ModalHeader>
                  <ModalBody>
                    {orderItems.length === 0 ? (
                      <Text color="whiteAlpha.600">
                        No products assigned to this collection yet.
                      </Text>
                    ) : (
                      <Stack spacing={2}>
                        {orderItems.map((x, idx) => (
                          <Flex
                            key={x.productId}
                            p={3}
                            borderRadius="xl"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                            align="center"
                            justify="space-between"
                          >
                            <HStack spacing={3}>
                              <Tag colorScheme="yellow" variant="subtle">
                                <TagLabel>{idx + 1}</TagLabel>
                              </Tag>
                              <Text fontWeight="800">{x.name}</Text>
                            </HStack>

                            <HStack>
                              <IconButton
                                aria-label="Up"
                                icon={<ChevronUpIcon />}
                                variant="outline"
                                borderColor="whiteAlpha.300"
                                onClick={() => moveOrder(idx, -1)}
                                isDisabled={idx === 0}
                              />
                              <IconButton
                                aria-label="Down"
                                icon={<ChevronDownIcon />}
                                variant="outline"
                                borderColor="whiteAlpha.300"
                                onClick={() => moveOrder(idx, 1)}
                                isDisabled={idx === orderItems.length - 1}
                              />
                            </HStack>
                          </Flex>
                        ))}
                      </Stack>
                    )}
                  </ModalBody>

                  <ModalFooter>
                    <HStack w="full" justify="space-between">
                      <Button variant="outline" borderColor="whiteAlpha.300" onClick={orderModal.onClose}>
                        Close
                      </Button>
                      <Button colorScheme="yellow" onClick={saveDropOrder} isDisabled={orderItems.length === 0}>
                        Save Order
                      </Button>
                    </HStack>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </TabPanel>

            {/* ---------------- Products ---------------- */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                {/* Create product */}
                <Box p={6} borderRadius="2xl" bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.200">
                  <Heading size="md" textTransform="uppercase" letterSpacing="wide" mb={4}>
                    Add Product
                  </Heading>

                  <Stack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel color="whiteAlpha.700">Name</FormLabel>
                      <Input
                        value={newProduct.name}
                        onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                        bg="blackAlpha.400"
                        borderColor="whiteAlpha.200"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="whiteAlpha.700">Price (₦)</FormLabel>
                      <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct((p) => ({ ...p, price: Number(e.target.value) }))}
                        bg="blackAlpha.400"
                        borderColor="whiteAlpha.200"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="whiteAlpha.700">Description</FormLabel>
                      <Textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
                        bg="blackAlpha.400"
                        borderColor="whiteAlpha.200"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="whiteAlpha.700">Image URL</FormLabel>
                      <Input
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct((p) => ({ ...p, imageUrl: e.target.value }))}
                        bg="blackAlpha.400"
                        borderColor="whiteAlpha.200"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="whiteAlpha.700">Sizes (comma)</FormLabel>
                      <Input
                        value={newProduct.sizes}
                        onChange={(e) => setNewProduct((p) => ({ ...p, sizes: e.target.value }))}
                        placeholder="S,M,L,XL"
                        bg="blackAlpha.400"
                        borderColor="whiteAlpha.200"
                      />
                    </FormControl>

                    <Button colorScheme="yellow" onClick={addProduct}>
                      Add Product
                    </Button>
                  </Stack>
                </Box>

                {/* Edit product */}
                <Box p={6} borderRadius="2xl" bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.200">
                  <Heading size="md" textTransform="uppercase" letterSpacing="wide" mb={4}>
                    Edit Product
                  </Heading>

                  {!editProduct ? (
                    <Text color="whiteAlpha.600">Pick a product from the list to edit.</Text>
                  ) : (
                    <Stack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel color="whiteAlpha.700">Name</FormLabel>
                        <Input
                          value={editProduct.name}
                          onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                          bg="blackAlpha.400"
                          borderColor="whiteAlpha.200"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="whiteAlpha.700">Price</FormLabel>
                        <Input
                          type="number"
                          value={editProduct.price}
                          onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                          bg="blackAlpha.400"
                          borderColor="whiteAlpha.200"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="whiteAlpha.700">Description</FormLabel>
                        <Textarea
                          value={editProduct.description}
                          onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                          bg="blackAlpha.400"
                          borderColor="whiteAlpha.200"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="whiteAlpha.700">Image URL</FormLabel>
                        <Input
                          value={editProduct.imageUrl}
                          onChange={(e) => setEditProduct({ ...editProduct, imageUrl: e.target.value })}
                          bg="blackAlpha.400"
                          borderColor="whiteAlpha.200"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="whiteAlpha.700">Sizes</FormLabel>
                        <Input
                          value={editProduct.sizes.join(",")}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          bg="blackAlpha.400"
                          borderColor="whiteAlpha.200"
                        />
                      </FormControl>

                      <HStack>
                        <Button colorScheme="yellow" onClick={updateProduct}>
                          Save
                        </Button>
                        <Button variant="outline" borderColor="whiteAlpha.300" onClick={() => setEditProduct(null)}>
                          Cancel
                        </Button>
                      </HStack>
                    </Stack>
                  )}
                </Box>
              </SimpleGrid>

              <Divider my={8} borderColor="whiteAlpha.200" />

              <Heading size="md" textTransform="uppercase" letterSpacing="wide" mb={4}>
                Products
              </Heading>

              {loading && <Spinner />}

              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
                {products.map((p) => (
                  <Box
                    key={p.id}
                    p={5}
                    borderRadius="2xl"
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                  >
                    <Text fontWeight="900">{p.name}</Text>
                    <Text color="whiteAlpha.700" mt={1} noOfLines={2}>
                      {p.description}
                    </Text>
                    <Text mt={2} fontWeight="800">
                      ₦{p.price.toLocaleString()}
                    </Text>
                    <Text mt={1} color="whiteAlpha.600" fontSize="sm">
                      Sizes: {p.sizes.join(", ")}
                    </Text>

                    <HStack mt={4}>
                      <Button size="sm" variant="outline" borderColor="whiteAlpha.300" onClick={() => setEditProduct(p)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" borderColor="whiteAlpha.300" onClick={() => removeProduct(p.id)}>
                        Delete
                      </Button>
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>

              {!products.length && !loading && <Text color="whiteAlpha.600">No products yet.</Text>}
            </TabPanel>

            {/* ----------Shoots Section---------- */}
            <TabPanel px={0}>
              <AdminShootsSection http={http} />
            </TabPanel>

            {/* ---------------- Reviews ---------------- */}
            <TabPanel px={0}>
              <Heading size="md" textTransform="uppercase" letterSpacing="wide" mb={4}>
                Reviews
              </Heading>

              {loading && <Spinner />}

              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
                {reviews.map((r) => (
                  <Box
                    key={r.id}
                    p={5}
                    borderRadius="2xl"
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                  >
                    <Text fontWeight="900">Product ID: {r.productId}</Text>
                    <Text mt={2} color="whiteAlpha.700">
                      Rating: <b>{r.rating}/5</b>
                    </Text>
                    <Text mt={2} color="whiteAlpha.700" noOfLines={4}>
                      {r.comment}
                    </Text>
                    <Text mt={2} color="whiteAlpha.600" fontSize="sm">
                      By {r.user?.username || "Anonymous"} • {new Date(r.createdAt).toLocaleDateString()}
                    </Text>

                    <Button mt={4} size="sm" variant="outline" borderColor="whiteAlpha.300" onClick={() => removeReview(r.id)}>
                      Delete
                    </Button>
                  </Box>
                ))}
              </SimpleGrid>

              {!reviews.length && !loading && <Text color="whiteAlpha.600">No reviews yet.</Text>}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}