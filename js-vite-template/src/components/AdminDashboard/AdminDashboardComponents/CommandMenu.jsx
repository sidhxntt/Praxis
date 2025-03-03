import React from "react";
import { IconArrowRightDashed } from "@tabler/icons-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ScrollArea } from "../../ui/scroll-area";
import { useSearch } from "@/Context/SearchContext";
import { ModeToggle } from "./ModeToggle";
import { useNavigate } from "react-router-dom";
import { sidebarData } from "@/SampleData/AdminDashboard/SidebarData";

export function CommandMenu() {
  const navigate = useNavigate();
  const { open, setOpen } = useSearch();

  const runCommand = React.useCallback(
    (command) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pr-1">
          <CommandEmpty>No results found.</CommandEmpty>
          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.url)
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => navigate(navItem.url));
                      }}
                    >
                      <div className="mr-2 flex h-4 w-4 items-center justify-center">
                        <IconArrowRightDashed className="size-2 text-muted-foreground/80" />
                      </div>
                      {navItem.title}
                    </CommandItem>
                  );

                return navItem.items?.map((subItem, j) => (
                  <CommandItem
                    key={`${subItem.url}-${j}`}
                    value={subItem.title}
                    onSelect={() => {
                      runCommand(() => navigate(subItem.url));
                    }}
                  >
                    <div className="mr-2 flex h-4 w-4 items-center justify-center">
                      <IconArrowRightDashed className="size-2 text-muted-foreground/80" />
                    </div>
                    {subItem.title}
                  </CommandItem>
                ));
              })}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <ModeToggle />
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
