export const categorySeeds = [
  {
    name: "Organización Estética",
    slug: "organizacion-estetica",
    description: "Belleza y orden funcional para combatir el ruido visual en tu hogar."
  },
  {
    name: "Decoración Funcional",
    slug: "deco-funcional",
    description: "Piezas minimalistas que aportan calma, luz cálida y serenidad a tus ambientes."
  },
  {
    name: "Textiles Naturales",
    slug: "textiles-naturales",
    description: "Textiles suaves y orgánicos en tonos neutros para sumar calidez hygge."
  },
  {
    name: "Mesa y Ritual",
    slug: "mesa-y-ritual",
    description: "Vajilla artesanal imperfecta para disfrutar de pausas lentas y cotidianas."
  },
  {
    name: "Muebles Pequeños",
    slug: "muebles-pequenos",
    description: "Diseño compacto, inteligente y de madera clara para optimizar espacios reales."
  }
];

export const productSeeds = [
  {
    name: "Bandeja de Bambú Natsu",
    slug: "bandeja-de-bambu-natsu",
    description: "Bandeja de madera de bambú clara de alta resistencia. Ideal para organizar cosméticos o servir té en ambientes de calma.",
    price: 18500,
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
    ],
    categorySlug: "organizacion-estetica",
    stock: 25,
    featured: true,
    tags: ["bambu", "bandeja", "organizacion", "destacados"]
  },
  {
    name: "Canasto de Yute Sora",
    slug: "canasto-de-yute-sora",
    description: "Canasto tejido a mano en yute natural de alta densidad. Solución ideal para guardar mantas, textiles o ropa en monoambientes.",
    price: 24000,
    images: [
      "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80"
    ],
    categorySlug: "organizacion-estetica",
    stock: 30,
    featured: false,
    tags: ["yute", "canasto", "organizacion"]
  },
  {
    name: "Lámpara de Mesa Shoji",
    slug: "lampara-de-mesa-shoji",
    description: "Lámpara de escritorio minimalista con pantalla de papel difusor y base de madera de roble claro. Emite una luz ultra cálida y acogedora.",
    price: 54900,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
    ],
    categorySlug: "deco-funcional",
    stock: 15,
    featured: true,
    tags: ["iluminacion", "lampara", "calma", "destacados"]
  },
  {
    name: "Difusor Cerámico Hasu",
    slug: "difusor-ceramico-hasu",
    description: "Difusor de aceites esenciales fabricado a mano en cerámica mate texturada. Diseño minimalista y difusor ultrasónico silencioso.",
    price: 39500,
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
    ],
    categorySlug: "deco-funcional",
    stock: 40,
    featured: true,
    tags: ["aroma", "ceramica", "spa"]
  },
  {
    name: "Manta de Algodón Fjord",
    slug: "manta-de-algodon-fjord",
    description: "Manta liviana tejida en algodón premium color crudo natural. Aporta textura, relieve y confort hygge a tu sillón o cama.",
    price: 32000,
    images: [
      "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=800&q=80"
    ],
    categorySlug: "textiles-naturales",
    stock: 20,
    featured: true,
    tags: ["textil", "manta", "algodon"]
  },
  {
    name: "Funda de Almohadón Lino Sand",
    slug: "funda-de-almohadon-lino-sand",
    description: "Funda de almohadón de 50x50 cm en lino rústico lavado. Tacto sumamente suave, terminación desflecada y color arena natural.",
    price: 12500,
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80"
    ],
    categorySlug: "textiles-naturales",
    stock: 50,
    featured: false,
    tags: ["textil", "lino", "almohadon"]
  },
  {
    name: "Set de Té Kyoto",
    slug: "set-de-te-kyoto",
    description: "Set de té japonés de gres cerámico con acabado mate. Incluye tetera con asa de bambú tejida y dos tazas individuales sin asa.",
    price: 62000,
    images: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
    ],
    categorySlug: "mesa-y-ritual",
    stock: 10,
    featured: true,
    tags: ["vajilla", "ritual", "ceramica", "destacados"]
  },
  {
    name: "Cuenco de Cerámica Wabi",
    slug: "cuenco-de-ceramica-wabi",
    description: "Cuenco irregular de gres hecho a mano, ideal para ramen o cereales. Acabado áspero mate con sutiles motas minerales.",
    price: 14500,
    images: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
    ],
    categorySlug: "mesa-y-ritual",
    stock: 35,
    featured: false,
    tags: ["vajilla", "ceramica", "cuenco"]
  },
  {
    name: "Mesa Auxiliar Øresund",
    slug: "mesa-auxiliar-oresund",
    description: "Mesa auxiliar circular de madera de fresno natural escandinavo. Diseño compacto de tres patas, ideal como mesa de luz o de apoyo.",
    price: 85000,
    images: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80"
    ],
    categorySlug: "muebles-pequenos",
    stock: 8,
    featured: true,
    tags: ["mueble", "madera", "mesa", "destacados"]
  },
  {
    name: "Banco Bajo Kiri",
    slug: "banco-bajo-kiri",
    description: "Banco bajo multifuncional de madera maciza de Kiri. Sirve como asiento extra, zapatero compacto de entrada o apoyo de plantas.",
    price: 48000,
    images: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80"
    ],
    categorySlug: "muebles-pequenos",
    stock: 12,
    featured: false,
    tags: ["mueble", "madera", "banco"]
  },
  {
    name: "Kit Home Office Calmo",
    slug: "kit-home-office-calmo",
    description: "Combo curado para tu rincón de trabajo. Incluye una lámpara Shoji, un organizador de escritorio de roble, una bandeja de bambú y un florero cerámico pequeño.",
    price: 115000,
    discountPrice: 99000,
    images: [
      "/images/kit_home_office.png"
    ],
    categorySlug: "deco-funcional",
    stock: 15,
    featured: true,
    tags: ["kit", "home-office", "iluminacion", "calma", "destacados"]
  },
  {
    name: "Kit Baño Spa",
    slug: "kit-bano-spa",
    description: "Transforma tu baño en un santuario zen. Incluye juego de toallas de algodón orgánico crudo, difusor de cerámica Hasu y bandeja de bambú Natsu.",
    price: 78000,
    discountPrice: 69000,
    images: [
      "/images/kit_baño_spa.png"
    ],
    categorySlug: "organizacion-estetica",
    stock: 20,
    featured: true,
    tags: ["kit", "spa", "organizacion", "ceramica", "destacados"]
  },
  {
    name: "Kit Mesa Japandi",
    slug: "kit-mesa-japandi",
    description: "El ritual de la pausa lento para dos. Incluye dos cuencos Wabi, dos tazas cerámicas Kyoto, una bandeja de madera clara y dos individuales de yute.",
    price: 92000,
    discountPrice: 82000,
    images: [
      "/images/kit_mesa_japandi.png"
    ],
    categorySlug: "mesa-y-ritual",
    stock: 10,
    featured: true,
    tags: ["kit", "vajilla", "ritual", "destacados"]
  }
];

export const bannerSeeds = [
  {
    title: "Menos ruido visual. Más calma en casa.",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
    targetUrl: "/search?q=destacados",
    position: "home-main",
    isActive: true
  },
  {
    title: "Objetos simples para rituales cotidianos.",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80",
    targetUrl: "/contacto",
    position: "categories-side",
    isActive: true
  }
];
