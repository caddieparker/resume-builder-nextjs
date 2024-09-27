"use client";

import {
  AppShell,
  Burger,
  Button,
  MantineProvider,
  Title,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "../app/globals.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient"; // Adjust this path to where you import Supabase client
import { useDisclosure } from "@mantine/hooks";
import { Session } from "@supabase/supabase-js"; // Import the correct type for session

export default function Layout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null); // Explicitly type session as Session or null

  // Fetch session info on component mount to check if user is signed in
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session); // data.session can be of type Session or null
    };

    getSession();
  }, []);

  const handleSignOut = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/sign-out", {
        method: "POST",
      });

      if (response.ok) {
        setSession(null); // Clear session after sign out
        router.push("/sign-in");
      } else {
        const { error } = await response.json();
        console.error("Sign-out error:", error);
      }
    } catch (error) {
      console.error("Sign-out failed", error);
    } finally {
      setLoading(false);
    }
  };

  const navBarItems = {
    items: [
      { title: "Home", href: "/" },
      { title: "Upload Resume", href: "/about" },
      { title: "Contact", href: "/contact" },
    ],
  };

  return (
    <html lang="en">
      <body>
        <MantineProvider>
          <AppShell
            header={{ height: 60 }}
            navbar={{
              width: 300,
              breakpoint: "sm",
              collapsed: { mobile: !opened },
            }}
            padding="md"
          >
            <AppShell.Header>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <Title order={1} my="md">
                Resume Manipulator
              </Title>
            </AppShell.Header>

            <AppShell.Navbar p="md">
              {session ? (
                <>
                  {/* Show navigation items and sign out button when user is signed in */}
                  {navBarItems.items.map((item) => (
                    <Button
                      key={item.title}
                      onClick={() => router.push(item.href)}
                      className={"m-1"}
                    >
                      {item.title}
                    </Button>
                  ))}
                  <Button
                    className={"m-1"}
                    onClick={handleSignOut}
                    disabled={loading}
                  >
                    {loading ? "Signing Out..." : "Sign Out"}
                  </Button>
                </>
              ) : (
                <Button
                  className={"m-1"}
                  onClick={() => router.push("/sign-in")}
                >
                  Sign In
                </Button>
              )}
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
