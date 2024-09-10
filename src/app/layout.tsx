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

import { useDisclosure } from "@mantine/hooks";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

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
                {" "}
                Resume Manipulator
              </Title>
            </AppShell.Header>

            <AppShell.Navbar p="md">
              {navBarItems.items.map((item) => (
                <Button className={"m-1"} key={item.title}>
                  {item.title}
                </Button>
              ))}
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
