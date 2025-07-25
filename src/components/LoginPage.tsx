import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Lock, User, Eye, EyeOff, AtSign, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import logoImage from "@/assets/al-gestao-logo.png";
import { BRAND } from "@/constants/branding";

interface LoginPageProps {
  onLogin?: (email: string, password: string) => Promise<boolean>;
}

const LoginPage = ({ onLogin }: LoginPageProps = {}) => {
  const { login, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Estados para cadastro
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  // Estados para recuperação de senha
  const [forgotEmail, setForgotEmail] = useState("");
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Erro de validação",
        description: "Digite um e-mail válido",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Erro de validação", 
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await login(email, password);
      
      if (error) {
        if (error.message?.includes('Invalid login credentials')) {
          toast({
            title: "Erro de autenticação",
            description: "Email ou senha incorretos. Verifique suas credenciais.",
            variant: "destructive"
          });
        } else if (error.message?.includes('Email not confirmed')) {
          toast({
            title: "Email não confirmado",
            description: "Por favor, confirme seu email antes de fazer login.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro de autenticação",
            description: error.message || "Erro ao fazer login. Tente novamente.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Login realizado",
          description: `Bem-vindo ao ${BRAND.name}!`
        });
      }
    } catch (error) {
      toast({
        title: "Erro de autenticação",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.name.length < 2) {
      toast({
        title: "Erro de validação",
        description: "Nome deve ter pelo menos 2 caracteres",
        variant: "destructive"
      });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      toast({
        title: "Erro de validação",
        description: "Digite um e-mail válido",
        variant: "destructive"
      });
      return;
    }
    
    if (registerData.password.length < 6) {
      toast({
        title: "Erro de validação",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signUp(registerData.email, registerData.password, registerData.name);
      
      if (result.error) {
        if (result.error.message?.includes('User already registered')) {
          toast({
            title: "Erro de cadastro",
            description: "Este email já está cadastrado. Tente fazer login.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro de cadastro",
            description: result.error.message || "Erro ao criar conta. Tente novamente.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Faça login para continuar."
        });
        
        setShowRegister(false);
        setRegisterData({
          name: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
        
        // Pre-fill email field for convenience
        setEmail(registerData.email);
      }
    } catch (error) {
      toast({
        title: "Erro de cadastro",
        description: "Ocorreu um erro durante o cadastro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      toast({
        title: "Erro de validação",
        description: "Digite um e-mail válido",
        variant: "destructive"
      });
      return;
    }
    
    // TODO: Implement password reset with Supabase
    setTimeout(() => {
      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha"
      });
      setShowForgotPassword(false);
      setForgotEmail("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-sol-lima-pink/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={logoImage} 
            alt={BRAND.name} 
            className="w-40 h-40 mx-auto mb-4 object-contain"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-sol-lima-gold bg-clip-text text-transparent">
            {BRAND.name}
          </h1>
          <p className="text-muted-foreground mt-2">{BRAND.tagline}</p>
        </div>

        <Card className="shadow-xl border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-primary">
              Acesso Profissional
            </CardTitle>
            <CardDescription className="text-center">
              {BRAND.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
                  <DialogTrigger asChild>
                    <button className="text-sm text-primary hover:underline font-medium">
                      Esqueceu sua senha?
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Recuperar Senha</DialogTitle>
                      <DialogDescription>
                        Digite seu e-mail para receber instruções de recuperação
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgotEmail">E-mail</Label>
                        <Input
                          id="forgotEmail"
                          type="email"
                          placeholder="seu@email.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Enviar Código
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="text-center">
                <Dialog open={showRegister} onOpenChange={setShowRegister}>
                  <DialogTrigger asChild>
                    <button className="text-sm text-primary hover:underline font-medium">
                      Criar nova conta
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Profissional</DialogTitle>
                      <DialogDescription>
                        Preencha os dados para criar sua conta
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Seu nome completo"
                          value={registerData.name}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="registerEmail">E-mail</Label>
                        <Input
                          id="registerEmail"
                          type="email"
                          placeholder="seu@email.com"
                          value={registerData.email}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="registerPassword">Senha</Label>
                        <Input
                          id="registerPassword"
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirme sua senha"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cadastrando...
                          </>
                        ) : (
                          "Cadastrar"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações sobre criação de conta */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">📝 Como começar</h3>
              <div className="space-y-1 text-xs text-blue-700">
                <p>1. Clique em "Criar nova conta" para se cadastrar</p>
                <p>2. Confirme seu email (verifique spam/lixo eletrônico)</p>
                <p>3. Faça login com suas credenciais</p>
                <p className="mt-2 font-medium">🔒 Seus dados estão seguros com criptografia</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 {BRAND.name}. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;