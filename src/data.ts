import { CVData } from './types';

export const initialCVData: CVData = {
  personalInfo: {
    fullName: "Mateus Bernardo Chirindza",
    title: "Desenvolvedor Full-Stack Senior",
    email: "mateus.chirindza@email.com",
    phone: "+258 84 987 6543",
    location: "Maputo, Moçambique",
    about: "Engenheiro de Software apaixonado por criar soluções web eficientes, escaláveis e com design centrado no utilizador. Mais de 5 anos de experiência prática na concepção de arquitecturas modulares, liderança de equipas ágeis e integrações de pagamentos móveis em Moçambique (M-Pesa, e-Mola). Comprometido em elevar o nível tecnológico de produtos digitais.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  experiences: [
    {
      id: "exp-1",
      company: "Moçambique Digital Tech",
      role: "Desenvolvedor de Software Principal",
      startDate: "2023-01",
      endDate: "Presente",
      description: "Liderança técnica no desenvolvimento da plataforma nacional de facturação. Implementação de microserviços escaláveis que reduziram o tempo de carregamento em 40%. Integração completa de APIs financeiras para processamento seguro de pagamentos recorrentes."
    },
    {
      id: "exp-2",
      company: "Limbo Soluções Criativas",
      role: "Desenvolvedor Full-Stack",
      startDate: "2021-03",
      endDate: "2022-12",
      description: "Desenvolvimento de aplicações web interativas com ecossistema React. Colaboração em equipas multidisciplinares para implementar layouts dinâmicos e otimização para SEO, garantindo crescimento orgânico de 25% nas plataformas dos clientes."
    }
  ],
  educations: [
    {
      id: "edu-1",
      institution: "Universidade Eduardo Mondlane (UEM)",
      degree: "Licenciatura em Engenharia Informática",
      startDate: "2017-02",
      endDate: "2020-11",
      description: "Foco em Estrutura de Dados, Engenharia de Software e Tecnologias Web. Trabalho de final de curso excelente focado em segurança de dados digitais."
    }
  ],
  skills: [
    { id: "s-1", name: "TypeScript / React", level: 5 },
    { id: "s-2", name: "Node.js & Express", level: 5 },
    { id: "s-3", name: "Bases de Dados (PostgreSQL, NoSQL)", level: 4 },
    { id: "s-4", name: "Integração M-Pesa / APIs", level: 5 },
    { id: "s-5", name: "Gestão Ágil (Scrum)", level: 4 }
  ],
  languages: [
    "Português (Nativo)",
    "Inglês (Avançado)",
    "Xichangana (Fluente)"
  ]
};

export const avatarPresets = [
  { name: "Profissional Masculino 1", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
  { name: "Profissional Feminino 1", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
  { name: "Profissional Masculino 2", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
  { name: "Profissional Feminino 2", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
  { name: "Sem Foto", url: "" }
];
