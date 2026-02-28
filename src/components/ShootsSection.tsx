// --- LOOKBOOK / SHOOTS SECTION (Chakra) ---
// Drop this inside your Admin page (e.g. in a new "Lookbook" TabPanel or below Products).
// Assumes you already have `http` (axios instance with baseURL + auth header), `toast` helpers,
// and a `token` gate like the admin page we did.

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { api } from "../api/urbanera";

type Shoot = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

export function AdminShootsSection({ http }: { http: any }) {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [shoots, setShoots] = useState<Shoot[]>([]);

  const [form, setForm] = useState({ title: "", description: "", imageUrl: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const notify = (title: string, status: "success" | "error" | "info" = "success") =>
    toast({ title, status, duration: 2500, isClosable: true, position: "bottom-right" });

  const loadShoots = async () => {
    setLoading(true);
    try {
      const res = await api.get<Shoot[]>("/shoots");
      setShoots(res.data ?? []);
    } catch (e: any) {
      notify("Failed to load shoots.", "error");
      setShoots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShoots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: "", description: "", imageUrl: "" });
  };

  const startEdit = (s: Shoot) => {
    setEditingId(s.id);
    setForm({ title: s.title, description: s.description, imageUrl: s.imageUrl });
  };

  const submit = async () => {
    if (!form.title.trim()) {
      notify("Title is required.", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: (form.description ?? "").trim(),
        imageUrl: (form.imageUrl ?? "").trim(),
      };

      // Matches your controller:
      // POST /api/shoots  { title, description, imageUrl }
      // PUT  /api/shoots/{id}
      if (editingId) {
        await http.put(`/shoots/${editingId}`, payload);
        notify("Shoot updated.", "success");
      } else {
        await http.post("/shoots", payload);
        notify("Shoot added to Lookbook.", "success");
      }

      resetForm();
      await loadShoots();
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.response?.data?.Error || "Failed to save shoot.";
      notify(String(msg), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <HStack align="center" justify="space-between" mb={4} wrap="wrap" gap={3}>
        <Box>
          <Heading size="md" textTransform="uppercase" letterSpacing="wide">
            Lookbook Shoots
          </Heading>
          <Text color="whiteAlpha.700" mt={1}>
            Add and update shoots used in the Magazine / Lookbook page.
          </Text>
        </Box>

        <HStack>
          <Button variant="outline" borderColor="whiteAlpha.300" onClick={loadShoots} isLoading={loading}>
            Refresh
          </Button>
          <Button variant="ghost" onClick={resetForm}>
            Reset Form
          </Button>
        </HStack>
      </HStack>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* Form */}
        <Box p={6} borderRadius="2xl" bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.200">
          <HStack justify="space-between" mb={4}>
            <Text fontWeight="900" letterSpacing="wide" textTransform="uppercase">
              {editingId ? `Edit Shoot #${editingId}` : "Add New Shoot"}
            </Text>
            {loading && <Spinner size="sm" />}
          </HStack>

          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="whiteAlpha.700">Title</FormLabel>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Shoot title"
                bg="blackAlpha.400"
                borderColor="whiteAlpha.200"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="whiteAlpha.700">Description</FormLabel>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description for the lookbook"
                rows={5}
                bg="blackAlpha.400"
                borderColor="whiteAlpha.200"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="whiteAlpha.700">Image URL</FormLabel>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder="https://..."
                bg="blackAlpha.400"
                borderColor="whiteAlpha.200"
              />
            </FormControl>

            <Button colorScheme="yellow" onClick={submit} isLoading={loading}>
              {editingId ? "Save Changes" : "Add Shoot"}
            </Button>

            <Text fontSize="sm" color="whiteAlpha.600">
              Note: your controller currently has no delete endpoint.
            </Text>
          </Stack>
        </Box>

        {/* List */}
        <Box>
          <Text fontWeight="900" letterSpacing="wide" textTransform="uppercase" mb={3}>
            Existing Shoots
          </Text>

          <Divider mb={4} borderColor="whiteAlpha.200" />

          <VStack align="stretch" spacing={4}>
            {shoots.map((s) => (
              <Box
                key={s.id}
                p={5}
                borderRadius="2xl"
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.200"
              >
                <HStack justify="space-between" align="start" gap={3}>
                  <Box>
                    <Text fontWeight="900">{s.title}</Text>
                    <Text mt={2} color="whiteAlpha.700" noOfLines={3}>
                      {s.description || "—"}
                    </Text>
                    <Text mt={2} color="whiteAlpha.600" fontSize="sm" noOfLines={1}>
                      {s.imageUrl || "No image URL"}
                    </Text>
                  </Box>

                  <IconButton
                    aria-label="Edit shoot"
                    icon={<EditIcon />}
                    variant="outline"
                    borderColor="whiteAlpha.300"
                    onClick={() => startEdit(s)}
                  />
                </HStack>
              </Box>
            ))}

            {!loading && shoots.length === 0 && (
              <Text color="whiteAlpha.600">No shoots yet.</Text>
            )}
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}