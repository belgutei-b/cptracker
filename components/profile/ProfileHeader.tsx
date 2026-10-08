import type { ReactNode } from "react";
import { CalendarDays, Globe, Mail } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProviderIcon, { getProviderLabel } from "@/components/profile/ProviderIcon";

function getInitials(name: string, email: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]).join("");
  return (initials || email[0] || "?").toUpperCase();
}

export default function ProfileHeader({
  name,
  email,
  image,
  providers,
  joinedLabel,
  timezone,
}: {
  name: string;
  email: string;
  image?: string | null;
  providers: string[];
  joinedLabel: string;
  timezone: string;
}) {
  return (
    <div className="flex items-center gap-4 md:gap-5">
      <Avatar className="size-14 md:size-[72px]">
        {image && <AvatarImage src={image} alt="" />}
        <AvatarFallback className="text-lg font-semibold text-foreground md:text-2xl">
          {getInitials(name, email)}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-col gap-2">
        <h1 className="truncate text-2xl font-semibold tracking-tight md:text-[28px]">
          {name || email}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13.5px] text-muted-foreground">
          {email && <MetaItem icon={<Mail />}>{email}</MetaItem>}
          {providers.map((provider) => (
            <MetaItem key={provider} icon={<ProviderIcon provider={provider} />}>
              {getProviderLabel(provider)}
            </MetaItem>
          ))}
          <MetaItem icon={<CalendarDays />}>Joined {joinedLabel}</MetaItem>
          <MetaItem icon={<Globe />}>{timezone}</MetaItem>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 [&_svg]:size-3.5 [&_svg]:shrink-0">
      {icon}
      {children}
    </span>
  );
}
