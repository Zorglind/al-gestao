// Branding constants for AL Gestão Interna
export const BRAND = {
  name: "AL Gestão Interna",
  shortName: "AL Gestão",
  tagline: "Sistema de Gestão Interno",
  description: "Plataforma integrada para gerenciamento empresarial",
  logo: {
    main: "/src/assets/al-gestao-logo.png",
    fallback: "AL"
  },
  // Legacy names to be replaced
  oldNames: ["Sol Lima", "Sol Lima Tricologia"]
} as const;

export const NOTIFICATIONS = {
  defaultItems: [
    "Parabéns! Você bateu sua meta do mês!",
    "Lembre-se: Agenda da Ana às 14h hoje", 
    "Novo produto chegou no estoque"
  ]
} as const;