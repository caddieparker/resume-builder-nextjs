"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Container,
  Stack,
  Title,
  Center,
  Divider,
} from "@mantine/core";
import { supabase } from "../../../lib/supabaseClient";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function SignInPage() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error("Google sign-in error:", error.message);
    }
  };

  return (
    <Container size={420} my={40}>
      <Center>
        <Title order={2}>Welcome Back</Title>
      </Center>

      <Divider my="lg" label="sign in with" labelPosition="center" />

      <Stack align="center">
        <Button
          fullWidth
          leftSection={<IconBrandGoogle size={18} />}
          onClick={handleGoogleSignIn}
          variant="outline"
          size="md"
        >
          Sign in with Google
        </Button>
      </Stack>
    </Container>
  );
}
