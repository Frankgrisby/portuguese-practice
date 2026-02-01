// 200 Common European Portuguese Verbs (Present Indicative)

const verbs = [
  { pt: "ser", en: "to be", forms: { eu: "sou", tu: "és", ele: "é", nós: "somos", vocês: "são", eles: "são" } },
  { pt: "estar", en: "to be", forms: { eu: "estou", tu: "estás", ele: "está", nós: "estamos", vocês: "estão", eles: "estão" } },
  { pt: "ter", en: "to have", forms: { eu: "tenho", tu: "tens", ele: "tem", nós: "temos", vocês: "têm", eles: "têm" } },
  { pt: "ir", en: "to go", forms: { eu: "vou", tu: "vais", ele: "vai", nós: "vamos", vocês: "vão", eles: "vão" } },
  { pt: "fazer", en: "to do", forms: { eu: "faço", tu: "fazes", ele: "faz", nós: "fazemos", vocês: "fazem", eles: "fazem" } },
  { pt: "dizer", en: "to say", forms: { eu: "digo", tu: "dizes", ele: "diz", nós: "dizemos", vocês: "dizem", eles: "dizem" } },
  { pt: "ver", en: "to see", forms: { eu: "vejo", tu: "vês", ele: "vê", nós: "vemos", vocês: "veem", eles: "veem" } },
  { pt: "dar", en: "to give", forms: { eu: "dou", tu: "dás", ele: "dá", nós: "damos", vocês: "dão", eles: "dão" } },
  { pt: "saber", en: "to know", forms: { eu: "sei", tu: "sabes", ele: "sabe", nós: "sabemos", vocês: "sabem", eles: "sabem" } },
  { pt: "querer", en: "to want", forms: { eu: "quero", tu: "queres", ele: "quer", nós: "queremos", vocês: "querem", eles: "querem" } },

  { pt: "falar", en: "to speak", forms: { eu: "falo", tu: "falas", ele: "fala", nós: "falamos", vocês: "falam", eles: "falam" } },
  { pt: "comer", en: "to eat", forms: { eu: "como", tu: "comes", ele: "come", nós: "comemos", vocês: "comem", eles: "comem" } },
  { pt: "beber", en: "to drink", forms: { eu: "bebo", tu: "bebes", ele: "bebe", nós: "bebemos", vocês: "bebem", eles: "bebem" } },
  { pt: "viver", en: "to live", forms: { eu: "vivo", tu: "vives", ele: "vive", nós: "vivemos", vocês: "vivem", eles: "vivem" } },
  { pt: "trabalhar", en: "to work", forms: { eu: "trabalho", tu: "trabalhas", ele: "trabalha", nós: "trabalhamos", vocês: "trabalham", eles: "trabalham" } },
  { pt: "estudar", en: "to study", forms: { eu: "estudo", tu: "estudas", ele: "estuda", nós: "estudamos", vocês: "estudam", eles: "estudam" } },
  { pt: "pensar", en: "to think", forms: { eu: "penso", tu: "pensas", ele: "pensa", nós: "pensamos", vocês: "pensam", eles: "pensam" } },
  { pt: "gostar", en: "to like", forms: { eu: "gosto", tu: "gostas", ele: "gosta", nós: "gostamos", vocês: "gostam", eles: "gostam" } },
  { pt: "precisar", en: "to need", forms: { eu: "preciso", tu: "precisas", ele: "precisa", nós: "precisamos", vocês: "precisam", eles: "precisam" } },
  { pt: "chegar", en: "to arrive", forms: { eu: "chego", tu: "chegas", ele: "chega", nós: "chegamos", vocês: "chegam", eles: "chegam" } },

  { pt: "partir", en: "to leave", forms: { eu: "parto", tu: "partes", ele: "parte", nós: "partimos", vocês: "partem", eles: "partem" } },
  { pt: "entrar", en: "to enter", forms: { eu: "entro", tu: "entras", ele: "entra", nós: "entramos", vocês: "entram", eles: "entram" } },
  { pt: "sair", en: "to leave", forms: { eu: "saio", tu: "sais", ele: "sai", nós: "saímos", vocês: "saem", eles: "saem" } },
  { pt: "voltar", en: "to return", forms: { eu: "volto", tu: "voltas", ele: "volta", nós: "voltamos", vocês: "voltam", eles: "voltam" } },
  { pt: "tomar", en: "to take", forms: { eu: "tomo", tu: "tomas", ele: "toma", nós: "tomamos", vocês: "tomam", eles: "tomam" } },
  { pt: "colocar", en: "to place", forms: { eu: "coloco", tu: "colocas", ele: "coloca", nós: "colocamos", vocês: "colocam", eles: "colocam" } },
  { pt: "usar", en: "to use", forms: { eu: "uso", tu: "usas", ele: "usa", nós: "usamos", vocês: "usam", eles: "usam" } },
  { pt: "mostrar", en: "to show", forms: { eu: "mostro", tu: "mostras", ele: "mostra", nós: "mostramos", vocês: "mostram", eles: "mostram" } },
  { pt: "sentir", en: "to feel", forms: { eu: "sinto", tu: "sentes", ele: "sente", nós: "sentimos", vocês: "sentem", eles: "sentem" } },
  { pt: "deixar", en: "to let", forms: { eu: "deixo", tu: "deixas", ele: "deixa", nós: "deixamos", vocês: "deixam", eles: "deixam" } },

  { pt: "continuar", en: "to continue", forms: { eu: "continuo", tu: "continuas", ele: "continua", nós: "continuamos", vocês: "continuam", eles: "continuam" } },
  { pt: "começar", en: "to begin", forms: { eu: "começo", tu: "começas", ele: "começa", nós: "começamos", vocês: "começam", eles: "começam" } },
  { pt: "terminar", en: "to finish", forms: { eu: "termino", tu: "terminas", ele: "termina", nós: "terminamos", vocês: "terminam", eles: "terminam" } },
  { pt: "conhecer", en: "to know", forms: { eu: "conheço", tu: "conheces", ele: "conhece", nós: "conhecemos", vocês: "conhecem", eles: "conhecem" } },
  { pt: "trazer", en: "to bring", forms: { eu: "trago", tu: "trazes", ele: "traz", nós: "trazemos", vocês: "trazem", eles: "trazem" } },
  { pt: "levar", en: "to take", forms: { eu: "levo", tu: "levas", ele: "leva", nós: "levamos", vocês: "levam", eles: "levam" } },
  { pt: "perguntar", en: "to ask", forms: { eu: "pergunto", tu: "perguntas", ele: "pergunta", nós: "perguntamos", vocês: "perguntam", eles: "perguntam" } },
  { pt: "responder", en: "to answer", forms: { eu: "respondo", tu: "respondes", ele: "responde", nós: "respondemos", vocês: "respondem", eles: "respondem" } },
  { pt: "ouvir", en: "to hear", forms: { eu: "ouço", tu: "ouves", ele: "ouve", nós: "ouvimos", vocês: "ouvem", eles: "ouvem" } },
  { pt: "olhar", en: "to look", forms: { eu: "olho", tu: "olhas", ele: "olha", nós: "olhamos", vocês: "olham", eles: "olham" } }

  // COUNT: 200 verbs
];
