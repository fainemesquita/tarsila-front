"use client";
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useLoader } from './contexts/LoaderProvider'
import { useAuth } from './contexts/AuthProvider'
import { useRouter } from 'next/navigation'
import { Timestamp } from './components/Timestamp';
import Button from './components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export default function Homepage() {
  const { push } = useRouter();
  const { hideLoader, showLoader } = useLoader();
  const { isAuthenticated, signIn } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    hideLoader();
  }, [hideLoader]);

  useEffect(() => {
    if (isAuthenticated) {
      push("/chat");
    }
  }, [isAuthenticated, push]);

  function handleLogin() {
    showLoader();
    if (!isAuthenticated) {
      signIn()
        .then(() => {})
        .catch(() => {
          setErrorMsg("Erro ao tentar logar.");
          hideLoader();
        })
        .finally(() => {});
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-marfim">
      <main className="flex-1">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="mb-12">
              <Image 
                src="/logo.png" 
                alt="Logo Tarsila" 
                width={120} 
                height={120}
                className="mx-auto mb-8 opacity-0 animate-fadeIn [animation-delay:1s]"
                priority
              />
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl text-marrom-carvao tracking-tight">
              Seu projeto cultural<br className="hidden sm:block" />
              <span className="text-laranja-queimado">
                em um novo patamar
              </span>
            </h1>
            
            <p className="mt-8 max-w-4xl mx-auto text-lg sm:text-xl text-verde-oliva-escuro leading-relaxed">
              Transforme suas ideias em projetos culturais profissionais com o poder da inteligência artificial
            </p>
            
            <div className="mt-12">
              <Button size="lg" onClick={handleLogin} disabled={isAuthenticated}>
                Entrar com Google
              </Button>
              {errorMsg && <p className="text-red-600 mt-4">{errorMsg}</p>}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-20">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-laranja-queimado mb-4">
                Planos Tarsila
              </h2>
              <p className="text-lg text-verde-oliva-escuro">
                Escolha o plano ideal para transformar suas ideias em projetos culturais
              </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Plano Do Sonho ao Projeto */}
              <PricingCard
                title="Do Sonho ao Projeto"
                subtitle="Porta de entrada"
                price="R$ 449"
                installments="12x de R$ 39,92"
                description="1 projeto cultural completo"
                features={[
                  'Nome do Projeto',
                  'Proponente',
                  'Segmento Cultural',
                  'Resumo do Projeto',
                  'Justificativa',
                  'Objetivos (geral e específicos)',
                  'Contrapartidas Sociais',
                  'Acessibilidade',
                  'Estrutura de Execução',
                  'Cronograma de Realização',
                  'Orçamento Detalhado',
                  '5 interações adicionais',
                  '1 portfólio individual',
                  '1 guia de orientação',
                ]}
                note="Valor à vista pode ser dividido entre até 5 usuários (R$ 89,80/cada)"
                onLogin={handleLogin}
                isAuthenticated={isAuthenticated}
              />

              {/* Plano Portfólio */}
              <PricingCard
                title="Portfólio"
                subtitle="Mais projetos, mais colaboração"
                price="R$ 1.212,30"
                installments="12x de R$ 113,75"
                description="3 projetos culturais completos"
                features={[
                  'Tudo do plano anterior',
                  '3 projetos completos',
                  '10 interações adicionais por projeto',
                  '1 painel de projetos',
                  '1 portfólio individual',
                  '1 guia de orientação para todos os projetos',
                ]}
                note="Valor à vista pode ser dividido entre até 5 usuários (R$ 242,46/cada)"
                highlighted
                badge="Popular"
                onLogin={handleLogin}
                isAuthenticated={isAuthenticated}
              />

              {/* Plano Trupe */}
              <PricingCard
                title="Trupe"
                subtitle="Para grupos e coletivos"
                price="R$ 1.745"
                installments="12x de R$ 162,00"
                description="5 projetos culturais completos"
                features={[
                  'Tudo do plano anterior',
                  '5 projetos completos',
                  '20 interações adicionais por projeto',
                  '1 painel de projetos',
                  '5 portfólios individuais',
                  '1 guia de orientação',
                  'Suporte humanizado por projeto',
                ]}
                note="Valor à vista pode ser dividido entre até 5 usuários (R$ 349/cada)"
                onLogin={handleLogin}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
            
          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-verde-oliva-claro/10 to-laranja-queimado/10 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-marrom-carvao mb-4">
              Vamos transformar suas ideias em projetos?
            </h2>
            <p className="text-verde-oliva-escuro mb-8 max-w-2xl mx-auto">
              Amplie, diversifique e fortaleça sua comunidade com a Tarsila. 
              Comece a criar projetos culturais de forma colaborativa hoje mesmo.
            </p>
            <div>
              <Button size="lg" onClick={handleLogin} disabled={isAuthenticated}>
                Entrar com Google
              </Button>
              {errorMsg && <p className="text-red-600 mt-4">{errorMsg}</p>}
            </div>
          </div>
        </div>

        {/* Features Section */}
        {/* <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-laranja-queimado mb-6">
            Tecnologia a serviço da colaboração
          </h2>
          <div className="space-y-6">
            <p className="mt-8 max-w-2xl mx-auto text-md sm:text-lg text-verde-oliva-escuro leading-relaxed">
              Tarsila te ajuda a colocar em palavras o trabalho que você ou o seu 
              grupo já realizam ou querem realizar. O resultado é a geração de um 
              pré-projeto com <strong>objetivo</strong>, <strong>justificativa</strong> e 
              sugestão de <strong>orçamento</strong>, concebido a partir das melhores práticas.
            </p>
            <p className="mt-8 max-w-2xl mx-auto text-md sm:text-lg text-verde-oliva-escuro leading-relaxed">
              As ferramentas de <strong>LLM (Large Language Model)</strong> utilizadas pela CocrIA 
              são treinadas constantemente sobre os termos mais prováveis empregados 
              em cada tipo de projeto e, a partir disto, produzem um texto-base 
              próprio ao qual você poderá acrescentar as suas próprias palavras.
            </p>
            <p className="mt-8 max-w-2xl mx-auto text-md sm:text-lg text-verde-oliva-escuro leading-relaxed">
              A Tarsila surgiu para democratizar o acesso à elaboração de projetos, 
              com o uso de tecnologias generativas de ponta.
            </p>
          </div>       
        </div> */}
      </main>

      {/* Footer */}
      <footer className="border-t border-verde-oliva-claro/20 bg-verde-oliva-escuro">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center">
            <p className="text-sm text-white">
              © <Timestamp /> Tarsila. Democratizando o acesso à elaboração de projetos culturais.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface PricingCardProps {
  title: string
  subtitle?: string
  price: string
  installments: string
  description: string
  features: string[]
  note: string
  highlighted?: boolean
  badge?: string
  onLogin: () => void
  isAuthenticated: boolean
}

function PricingCard({
  title,
  subtitle,
  price,
  installments,
  description,
  features,
  note,
  highlighted = false,
  badge,
  onLogin,
  isAuthenticated,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-2xl p-8 relative flex flex-col ${
        highlighted
          ? 'bg-gradient-to-br from-laranja-queimado/10 to-verde-oliva-claro/10 border-2 border-laranja-queimado shadow-lg'
          : 'bg-white border border-verde-oliva-claro/30 shadow-sm'
      }`}
    >
      {badge && (
        <div className="absolute -top-3 -right-3 bg-laranja-queimado text-marfim text-xs font-bold px-3 py-1 rounded-full">
          {badge}
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-marrom-carvao mb-1">{title}</h3>
        {subtitle && (
          <p className="text-sm text-verde-oliva-escuro italic">{subtitle}</p>
        )}
      </div>

      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-marrom-siena mb-1">
          {price}
        </div>
        <div className="text-sm text-verde-oliva-escuro">
          à vista
        </div>
        <div className="text-xs text-verde-oliva-escuro mt-1">
          ou {installments}
        </div>
      </div>

      <p className="text-center text-marrom-carvao font-medium mb-6 pb-6 border-b border-verde-oliva-claro/30">
        {description}
      </p>

      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle2 className="h-5 w-5 text-verde-oliva-600 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-verde-oliva-escuro">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <div className="mb-6 mt-auto">
        <p className="text-xs text-verde-oliva-escuro italic bg-verde-oliva-escuro-200 p-3 rounded-lg">
          {note}
        </p>
      </div>

      <Button 
        variant={highlighted ? "primary" : "outline"}
        size="lg"
        className="w-full"
        onClick={onLogin}
        disabled={isAuthenticated}
      >
        Começar Agora
      </Button>
    </div>
  )
}