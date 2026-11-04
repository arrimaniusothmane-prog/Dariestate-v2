/**
 * Central library of verified photography used across the public website.
 * Keeping the URLs here makes it easy to replace a photo in one place.
 */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const STOCK = {
  hero: {
    villa: u('photo-1600585154340-be6161a56a0c', 2000),
    atelier: u('photo-1521737711867-e3b97375f902', 1800),
    detail: u('photo-1600607687920-4e2a09cf159d', 1400),
  },
  team: {
    youssef: u('photo-1560250097-0b93528c311a', 600),
    leila: u('photo-1573497019940-1c28c88b4f3e', 600),
    mehdi: u('photo-1500648767791-00dcc994a43e', 600),
    karim: u('photo-1507003211169-0a1dd7228f2d', 600),
    sofia: u('photo-1580489944761-15a19d654956', 600),
  },
  people: {
    client1: u('photo-1544005313-94ddf0286df2', 240),
    client2: u('photo-1508214751196-bcfd4ca60f91', 240),
    client3: u('photo-1507003211169-0a1dd7228f2d', 240),
    client4: u('photo-1534528741775-53994a69daeb', 240),
    client5: u('photo-1472099645785-5658abf4ff4e', 240),
  },
  atelier: [
    u('photo-1522071820081-009f0129c71c', 1200),
    u('photo-1556761175-b413da4baf72', 1200),
    u('photo-1497366754035-f200968a6e72', 1200),
    u('photo-1517245386807-bb43f82c33c4', 1200),
    u('photo-1600880292203-757bb62b4baf', 1200),
  ],
  construction: [
    u('photo-1504307651254-35680f356dfd', 1600),
    u('photo-1517089596392-fb9a9033e05b', 1600),
    u('photo-1531835551805-16d864c8d311', 1600),
    u('photo-1508450859948-4e04fabaa4ea', 1600),
    u('photo-1590725140246-20acdee442be', 1600),
    u('photo-1503387762-592deb58ef4e', 1600),
  ],
  exteriors: [
    u('photo-1613977257363-707ba9348227'),
    u('photo-1512917774080-9991f1c4c750'),
    u('photo-1600596542815-ffad4c1539a9'),
    u('photo-1600585152220-90363fe7e115'),
    u('photo-1600607687939-ce8a6c25118c'),
    u('photo-1545324418-cc1a3fa10c00'),
    u('photo-1613490493576-7fde63acd811'),
    u('photo-1600047509807-ba8f99d2cdde'),
    u('photo-1600585154526-990dced4db0d'),
    u('photo-1600573472592-401b489a3cdc'),
  ],
  living: [
    u('photo-1600210492486-724fe5c67fb0'),
    u('photo-1600585154340-be6161a56a0c'),
    u('photo-1618221195710-dd6b41faaea6'),
    u('photo-1615529182904-14819c35db37'),
    u('photo-1600121848594-d8644e57abab'),
    u('photo-1600607688969-a5bfcd646154'),
    u('photo-1560185007-cde436f6a4d0'),
    u('photo-1586023492125-27b2c045efd7'),
  ],
  kitchens: [
    u('photo-1600566753376-12c8ab7fb75b'),
    u('photo-1600566753190-17f0baa2a6c3'),
    u('photo-1556912172-45b7abe8b7e1'),
    u('photo-1600607687644-c7171b42498f'),
  ],
  bedrooms: [
    u('photo-1616486338812-3dadae4b4ace'),
    u('photo-1616594039964-ae9021a400a0'),
    u('photo-1615874959474-d609969a20ed'),
    u('photo-1615874694520-474822394e73'),
    u('photo-1560185127-6ed189bf02f4'),
  ],
  bathrooms: [
    u('photo-1584622650111-993a426fbf0a'),
    u('photo-1600566752355-35792bedcfea'),
    u('photo-1600607688960-e095ff83135c'),
    u('photo-1600566753086-00f18fb6b3ea'),
  ],
  outdoors: [
    u('photo-1542314831-068cd1dbfeeb'),
    u('photo-1567496898669-ee935f5f647a'),
    u('photo-1512917774080-9991f1c4c750'),
    u('photo-1600047509807-ba8f99d2cdde'),
    u('photo-1598300042247-d088f8ab3a91'),
  ],
  city: {
    casablanca: u('photo-1560448204-e02f11c3d0e2'),
    marrakech: u('photo-1542314831-068cd1dbfeeb'),
    rabat: u('photo-1590381105924-c72589b9ef3f'),
    tanger: u('photo-1545324418-cc1a3fa10c00'),
  },
};

/** Merge the photos attached to a property with curated fallbacks so a gallery never has holes. */
export function buildPropertyGallery(images: { id: string; url: string; alt?: string | null; order: number; isCover: boolean }[], title: string) {
  const seen = new Set<string>();
  const gallery = images
    .filter((img) => {
      if (!img.url || seen.has(img.url)) return false;
      seen.add(img.url);
      return true;
    })
    .sort((a, b) => a.order - b.order);

  const fallbacks = [
    ...STOCK.living,
    ...STOCK.kitchens,
    ...STOCK.bedrooms,
    ...STOCK.bathrooms,
    ...STOCK.outdoors,
  ];

  // Only use a fallback when the property genuinely has no photo. We never
  // pad real listings with unrelated stock imagery: the admin's photos are
  // the property's photos.
  let fallbackIndex = 0;
  while (gallery.length === 0 && fallbackIndex < fallbacks.length) {
    const url = fallbacks[fallbackIndex++];
    if (!seen.has(url)) {
      seen.add(url);
      gallery.push({
        id: `fallback-${gallery.length}`,
        url,
        alt: `${title} — photographie d'ambiance`,
        order: gallery.length,
        isCover: gallery.length === 0,
      });
    }
  }

  return gallery;
}
