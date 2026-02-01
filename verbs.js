/* =====================================================
   VERBS DATA + AUTO CONJUGATION ENGINE
===================================================== */

const PRONOUNS = ["eu", "tu", "ele", "nós", "eles"];

/* ================= IRREGULAR VERBS ================= */

const IRREGULAR_VERBS = [
  {
    infinitive: "ser",
    en: "to be",
    conjugations: {
      present: { eu: "sou", tu: "és", ele: "é", nós: "somos", eles: "são" },
      past: { eu: "fui", tu: "foste", ele: "foi", nós: "fomos", eles: "foram" },
      future: { eu: "serei", tu: "serás", ele: "será", nós: "seremos", eles: "serão" }
    }
  },
  {
    infinitive: "estar",
    en: "to be (temporary)",
    conjugations: {
      present: { eu: "estou", tu: "estás", ele: "está", nós: "estamos", eles: "estão" },
      past: { eu: "estive", tu: "estiveste", ele: "esteve", nós: "estivemos", eles: "estiveram" },
      future: { eu: "estarei", tu: "estarás", ele: "estará", nós: "estaremos", eles: "estarão" }
    }
  },
  {
    infinitive: "ir",
    en: "to go",
    conjugations: {
      present: { eu: "vou", tu: "vais", ele: "vai", nós: "vamos", eles: "vão" },
      past: { eu: "fui", tu: "foste", ele: "foi", nós: "fomos", eles: "foram" },
      future: { eu: "irei", tu: "irás", ele: "irá", nós: "iremos", eles: "irão" }
    }
  },
  {
    infinitive: "ter",
    en: "to have",
    conjugations: {
      present: { eu: "tenho", tu: "tens", ele: "tem", nós: "temos", eles: "têm" },
      past: { eu: "tive", tu: "tiveste", ele: "teve", nós: "tivemos", eles: "tiveram" },
      future: { eu: "terei", tu: "terás", ele: "terá", nós: "teremos", eles: "terão" }
    }
  }
];

/* ================= REGULAR VERB GENERATOR ================= */

function conjugateRegular(infinitive) {
  const stem = infinitive.slice(0, -2);
  const type = infinitive.slice(-2);

  const endings = {
    ar: {
      present: ["o", "as", "a", "amos", "am"],
      past: ["ei", "aste", "ou", "ámos", "aram"],
      future: ["arei", "arás", "ará", "aremos", "arão"]
    },
    er: {
      present: ["o", "es", "e", "emos", "em"],
      past: ["i", "este", "eu", "emos", "eram"],
      future: ["erei", "erás", "erá", "eremos", "erão"]
    },
    ir: {
      present: ["o", "es", "e", "imos", "em"],
      past: ["i", "iste", "iu", "imos", "iram"],
      future: ["irei", "irás", "irá", "iremos", "irão"]
    }
  };

  const e = endings[type];
  if (!e) return null;

  return {
    present: mapForms(stem, e.present),
    past: mapForms(stem, e.past),
    future: mapForms(stem, e.future)
  };
}

function mapForms(stem, endings) {
  return {
    eu: stem + endings[0],
    tu: stem + endings[1],
    ele: stem + endings[2],
    nós: stem + endings[3],
    eles: stem + endings[4]
  };
}

/* ================= REGULAR VERB LIST ================= */

const REGULAR_VERBS = [
  ["falar", "to speak"], ["andar", "to walk"], ["trabalhar", "to work"],
  ["estudar", "to study"], ["comprar", "to buy"], ["viver", "to live"],
  ["comer", "to eat"], ["beber", "to drink"], ["abrir", "to open"],
  ["fechar", "to close"], ["aprender", "to learn"], ["ensinar", "to teach"],
  ["viajar", "to travel"], ["usar", "to use"], ["amar", "to love"],
  ["odiar", "to hate"], ["olhar", "to look"], ["ouvir", "to hear"],
  ["pensar", "to think"], ["acreditar", "to believe"], ["morar", "to live"],
  ["correr", "to run"], ["nadar", "to swim"], ["dirigir", "to drive"],
  ["esperar", "to wait"], ["ajudar", "to help"], ["ligar", "to call"],
  ["chegar", "to arrive"], ["sair", "to leave"], ["entrar", "to enter"],
  ["voltar", "to return"], ["sentir", "to feel"], ["perder", "to lose"],
  ["ganhar", "to win"], ["pagar", "to pay"], ["receber", "to receive"],
  ["procurar", "to search"], ["encontrar", "to find"], ["seguir", "to follow"],
  ["mudar", "to change"], ["criar", "to create"], ["crescer", "to grow"],
  ["vender", "to sell"], ["dormir", "to sleep"], ["acordar", "to wake"],
  ["cozinhar", "to cook"], ["limpar", "to clean"], ["lavar", "to wash"],
  ["vestir", "to dress"], ["tirar", "to remove"], ["guardar", "to store"],
  ["escrever", "to write"], ["ler", "to read"], ["responder", "to answer"],
  ["perguntar", "to ask"], ["explicar", "to explain"], ["decidir", "to decide"],
  ["conhecer", "to know"], ["lembrar", "to remember"], ["esquecer", "to forget"],
  ["tentar", "to try"], ["continuar", "to continue"], ["parar", "to stop"],
  ["começar", "to begin"], ["terminar", "to finish"], ["convidar", "to invite"],
  ["aceitar", "to accept"], ["recusar", "to refuse"], ["visitar", "to visit"],
  ["precisar", "to need"], ["preferir", "to prefer"], ["prometer", "to promise"],
  ["servir", "to serve"], ["cuidar", "to take care"], ["viajar", "to travel"]
];

/* ================= BUILD FINAL VERB LIST ================= */

const VERBS = [
  ...IRREGULAR_VERBS,
  ...REGULAR_VERBS.map(([inf, en]) => ({
    infinitive: inf,
    en,
    conjugations: conjugateRegular(inf)
  }))
];

/* ================= SAFETY ================= */

console.log(`Loaded ${VERBS.length} verbs`);
