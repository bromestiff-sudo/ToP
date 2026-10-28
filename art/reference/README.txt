TOWER OF POOP - sprite references for PixelLab
================================================
Every sprite currently in the game, exported at its NATIVE size (1 game pixel = 1 image pixel),
with transparent background. Animated sprites have one file per frame (_f1, _f2, ...).

  characters/       the 5 playable characters (roll soldier 20x24, others their own size)
  hens/             the 7 hens, one per floor (52x48)
  bosses/           the other floor bosses (52x48)
  final/            the Heart of the Tower and the primordial egg
  fallen-brothers/  the 12 fallen brothers (mini-bosses)
  enemies/          the poops and their friends
  npcs/ items/ weapons/ pickups/ props/ fx/
  preview-x4/       one contact sheet per folder, enlarged 4x, just to look at
  manifest.csv      every sprite with its size and number of frames

HOW TO USE THEM IN PIXELLAB
  - Keep the same canvas size as the original (see manifest.csv): the game expects it.
  - "Create S-XL image (Pro)": up to 4 reference images + 1 style image -> new versions.
  - "Create images from style references (Pro)": feed several sprites of one family
    (e.g. all hens) to keep one consistent style across the set.
  - "Edit image" / "Edit image (Pro)": start from the original and ask for changes.
  - "Animate with text": give the new sprite as reference to get walk/attack frames.
  - Export as PNG with transparent background, same file names, and send them back:
    they will be wired into the game in place of the drawn ones.
