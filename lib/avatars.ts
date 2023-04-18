export enum AvatarStrategies {
  Pravatar = "pravatar",
  Avataars = "avataars",
  Adventurer = "adventurer",
  Thumbs = "thumbs",
}

export function randomSpriteGenerator({
  seed,
  strategy,
}: {
  seed: string;
  strategy: AvatarStrategies;
}) {
  switch (strategy) {
    case AvatarStrategies.Pravatar:
      return `https://i.pravatar.cc/150?u=${seed}`;
    case AvatarStrategies.Avataars:
      return `https://api.dicebear.com/5.x/avataaars/svg?seed=${seed}`;
    case AvatarStrategies.Adventurer:
      return `https://api.dicebear.com/5.x/adventurer/svg?seed=${seed}`;
    case AvatarStrategies.Thumbs:
      return `https://api.dicebear.com/5.x/thumbs/svg?seed=${seed}`;
  }
}
