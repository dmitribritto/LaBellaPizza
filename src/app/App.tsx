import { useState, useEffect } from "react";
import {
  MapPin, Clock, Phone, ChevronDown, Star, Construction,
  Eye, EyeOff, ArrowLeft, User, Lock, Mail, UserPlus, LogIn, LogOut, AlertCircle, CheckCircle2,
  Loader2,
} from "lucide-react";
import { supabase } from "./supabaseClient";
import guaranaImg from "./guarana.png";


type Screen = "home" | "login" | "register";
type MenuTab = "pizzas" | "bebidas";


export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;           
  imageUrl: string;
  badge: string | null;
  badgeColor: string | null;
  available: boolean;      
  category: "pizza";
  createdAt: string;       
}

export interface Bebida {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  imageUrl: string;
  available: boolean;
  category: "bebida";
  createdAt: string;
}

export interface Review {
  id: string;
  authorName: string;
  text: string;
  stars: number;
  createdAt: string;
}


const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });


const HERO_IMG = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1600&h=900&fit=crop&auto=format";
const PIZZA2_IMG = "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&h=700&fit=crop&auto=format";
const VALID_USER = { username: "dimitri_24479", password: "123456" };


function ItalianStripe() {
  return (
    <div className="flex h-1.5 w-full">
      <div className="flex-1 bg-[#009246]" />
      <div className="flex-1 bg-white" />
      <div className="flex-1 bg-[#CE2B37]" />
    </div>
  );
}

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <span className="text-2xl font-black tracking-tight text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
        La<span className="text-[#009246]">Bella</span>
        <span className="text-[#CE2B37]">Pizza</span>
      </span>
    </button>
  );
}


interface AuthBgProps { children: React.ReactNode }

function AuthBg({ children }: AuthBgProps) {
  return (
    <div className="min-h-screen bg-[#1A1008] flex flex-col" style={{ fontFamily: "'Lato', sans-serif" }}>
      {}
      <ItalianStripe />

      {}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full border border-[#009246]/15" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full border border-[#CE2B37]/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5" />
      </div>

      {}
      <div className="fixed left-0 top-0 bottom-0 w-1.5 bg-[#009246]" />
      <div className="fixed right-0 top-0 bottom-0 w-1.5 bg-[#CE2B37]" />

      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        {children}
      </div>

      {}
      <ItalianStripe />
    </div>
  );
}


interface LoginProps {
  onBack: () => void;
  onGoRegister: () => void;
  onSuccess: (name: string) => void;
}

function LoginScreen({ onBack, onGoRegister, onSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (username === VALID_USER.username && password === VALID_USER.password) {
      setTimeout(() => {
        setLoading(false);
        onSuccess(username);
      }, 900);
      return;
    }

    try {
      const { data, error: dbError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", username)
        .eq("senha", password);

      if (dbError) {
        setError(dbError.message || "Erro ao conectar com o banco de dados.");
      } else if (data && data.length > 0) {
        onSuccess(data[0].email);
      } else {
        setError("E-mail ou senha incorretos.");
      }
    } catch (err) {
      setError("Erro ao conectar ao banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBg>
      <div className="w-full max-w-md">

        {}
        <div className="bg-[#FDF6EE] rounded-3xl overflow-hidden shadow-2xl">
          <ItalianStripe />

          <div className="p-8 md:p-10">
            {}
            <div className="text-center mb-8">
              <p className="text-3xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: "#1A1008" }}>
                La<span style={{ color: "#009246" }}>Bella</span>
                <span style={{ color: "#CE2B37" }}>Pizza</span>
              </p>
              <p className="text-[#7A6A58] text-sm mt-1 uppercase tracking-widest">Área do cliente</p>
            </div>

            <h2 className="text-2xl font-black text-[#1A1008] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bem-vindo de volta
            </h2>
            <p className="text-[#7A6A58] text-sm mb-7">Entre para acessar seus pedidos e favoritos.</p>

            {}
            {error && (
              <div className="flex items-start gap-3 bg-[#CE2B37]/10 border border-[#CE2B37]/30 rounded-xl px-4 py-3 mb-6">
                <AlertCircle size={18} className="text-[#CE2B37] flex-shrink-0 mt-0.5" />
                <p className="text-[#CE2B37] text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A58] mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A58]" />
                  <input
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="seu_email@exemplo.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F0E8DC] border border-[#D4C4B0] rounded-xl text-[#1A1008] placeholder-[#B0A090] focus:outline-none focus:ring-2 focus:ring-[#009246] focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              {}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A58] mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A58]" />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-11 py-3.5 bg-[#F0E8DC] border border-[#D4C4B0] rounded-xl text-[#1A1008] placeholder-[#B0A090] focus:outline-none focus:ring-2 focus:ring-[#009246] focus:border-transparent transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A6A58] hover:text-[#1A1008] transition-colors"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-xs text-[#009246] hover:underline font-semibold">
                  Esqueci minha senha
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A1008] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#CE2B37] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={16} />
                    Entrar
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-[#7A6A58] mt-6">
              Ainda não tem conta?{" "}
              <button onClick={onGoRegister} className="text-[#CE2B37] font-bold hover:underline">
                Cadastre-se
              </button>
            </p>
          </div>

          <ItalianStripe />
        </div>
      </div>
    </AuthBg>
  );
}


interface RegisterProps {
  onBack: () => void;
  onGoLogin: () => void;
}

type FormField = "name" | "email" | "username" | "password" | "confirm";

function RegisterScreen({ onBack, onGoLogin }: RegisterProps) {
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field: FormField) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: "" }));
  };

  const validate = () => {
    const errs: Partial<Record<FormField, string>> = {};
    if (!form.name.trim()) errs.name = "Nome obrigatório.";
    if (!form.email.includes("@")) errs.email = "E-mail inválido.";
    if (form.username.length < 4) errs.username = "Mínimo 4 caracteres.";
    if (form.password.length < 6) errs.password = "Mínimo 6 caracteres.";
    if (form.password !== form.confirm) errs.confirm = "Senhas não coincidem.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("usuarios")
        .insert([
          { email: form.email, senha: form.password }
        ])
        .select();

      if (error) {
        setErrors({ email: error.message || "Erro ao conectar com o banco de dados." });
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setErrors({ email: "Erro de conexão ao realizar cadastro." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthBg>
        <div className="w-full max-w-md text-center">
          <div className="bg-[#FDF6EE] rounded-3xl overflow-hidden shadow-2xl">
            <ItalianStripe />
            <div className="p-10 flex flex-col items-center gap-5">
              <div className="w-20 h-20 bg-[#009246]/10 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} className="text-[#009246]" />
              </div>
              <h2 className="text-2xl font-black text-[#1A1008]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Cadastro realizado!
              </h2>
              <p className="text-[#7A6A58] text-sm max-w-xs">
                Bem-vindo(a) à família LaBella Pizza, <strong>{form.name.split(" ")[0]}</strong>! Verifique seu e-mail ou faça login.
              </p>
              <button
                onClick={onGoLogin}
                className="mt-2 bg-[#CE2B37] text-white px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#a8202a] transition-colors flex items-center gap-2"
              >
                <LogIn size={16} />
                Fazer Login
              </button>
            </div>
            <ItalianStripe />
          </div>
        </div>
      </AuthBg>
    );
  }

  const inputCls = (field: FormField) =>
    `w-full pl-11 pr-4 py-3.5 bg-[#F0E8DC] border rounded-xl text-[#1A1008] placeholder-[#B0A090] focus:outline-none focus:ring-2 focus:ring-[#009246] focus:border-transparent transition-all text-sm ${errors[field] ? "border-[#CE2B37]" : "border-[#D4C4B0]"}`;

  return (
    <AuthBg>
      <div className="w-full max-w-md">
        <div className="bg-[#FDF6EE] rounded-3xl overflow-hidden shadow-2xl">
          <ItalianStripe />
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <p className="text-3xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: "#1A1008" }}>
                La<span style={{ color: "#009246" }}>Bella</span>
                <span style={{ color: "#CE2B37" }}>Pizza</span>
              </p>
              <p className="text-[#7A6A58] text-sm mt-1 uppercase tracking-widest">Criar conta</p>
            </div>

            <h2 className="text-2xl font-black text-[#1A1008] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Junte-se à família
            </h2>
            <p className="text-[#7A6A58] text-sm mb-7">Cadastre-se para acompanhar seus pedidos e muito mais.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A58] mb-2">Nome completo</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A58]" />
                  <input type="text" value={form.name} onChange={set("name")} placeholder="Maria Conti" className={inputCls("name")} />
                </div>
                {errors.name && <p className="text-[#CE2B37] text-xs mt-1.5">{errors.name}</p>}
              </div>

              {}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A58] mb-2">E-mail</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A58]" />
                  <input type="text" value={form.email} onChange={set("email")} placeholder="maria@email.com" className={inputCls("email")} />
                </div>
                {errors.email && <p className="text-[#CE2B37] text-xs mt-1.5">{errors.email}</p>}
              </div>

              {}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A58] mb-2">Usuário</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A58]" />
                  <input type="text" value={form.username} onChange={set("username")} placeholder="maria_conti" className={inputCls("username")} />
                </div>
                {errors.username && <p className="text-[#CE2B37] text-xs mt-1.5">{errors.username}</p>}
              </div>

              {}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A58] mb-2">Senha</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A58]" />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Mínimo 6 caracteres"
                    className={`w-full pl-11 pr-11 py-3.5 bg-[#F0E8DC] border rounded-xl text-[#1A1008] placeholder-[#B0A090] focus:outline-none focus:ring-2 focus:ring-[#009246] focus:border-transparent transition-all text-sm ${errors.password ? "border-[#CE2B37]" : "border-[#D4C4B0]"}`}
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A6A58] hover:text-[#1A1008]">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-[#CE2B37] text-xs mt-1.5">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A58] mb-2">Confirmar senha</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A58]" />
                  <input type="password" value={form.confirm} onChange={set("confirm")} placeholder="Repita a senha" className={inputCls("confirm")} />
                </div>
                {errors.confirm && <p className="text-[#CE2B37] text-xs mt-1.5">{errors.confirm}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#CE2B37] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#a8202a] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><UserPlus size={16} />Criar minha conta</>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-[#7A6A58] mt-6">
              Já tem conta?{" "}
              <button onClick={onGoLogin} className="text-[#009246] font-bold hover:underline">
                Entrar
              </button>
            </p>
          </div>
          <ItalianStripe />
        </div>
      </div>
    </AuthBg>
  );
}

const PIZZA_IMAGES = [
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=500&fit=crop&auto=format", 
  "https://images.unsplash.com/photo-1598023696416-0193a0bcd302?w=800&h=500&fit=crop&auto=format", 
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=500&fit=crop&auto=format", 
  "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&h=500&fit=crop&auto=format", 
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop&auto=format", 
  "https://images.unsplash.com/photo-1571066811602-716837d681de?w=800&h=500&fit=crop&auto=format", 
  "https://images.unsplash.com/photo-1544982503-9f984c14501a?w=800&h=500&fit=crop&auto=format", 
  "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&h=500&fit=crop&auto=format", 
];

const getPizzaImage = (name: string, index: number) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("mussarela") || normalized.includes("margherita") || normalized.includes("marguerita")) {
    return PIZZA_IMAGES[0];
  }
  if (normalized.includes("calabresa") || normalized.includes("pepperoni") || normalized.includes("peperoni")) {
    return PIZZA_IMAGES[1];
  }
  if (normalized.includes("quatro queijos") || normalized.includes("4 queijos")) {
    return PIZZA_IMAGES[2];
  }
  if (normalized.includes("portuguesa")) {
    return PIZZA_IMAGES[3];
  }
  if (normalized.includes("frango")) {
    return PIZZA_IMAGES[4];
  }
  if (normalized.includes("vegetar")) {
    return PIZZA_IMAGES[5];
  }
  return PIZZA_IMAGES[(6 + index) % PIZZA_IMAGES.length];
};

const BEBIDA_IMAGES = [
  "https://images.unsplash.com/photo-1548964856-ac90a56d9530?w=600&h=400&fit=crop&auto=format", 
  "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=400&fit=crop&auto=format", 
  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=400&fit=crop&auto=format", 
  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop&auto=format", 
  "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&h=400&fit=crop&auto=format", 
  "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&h=400&fit=crop&auto=format", 
  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&h=400&fit=crop&auto=format", 
  "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop&auto=format", 
];

const getBebidaImage = (name: string, index: number) => {
  const normalized = name.toLowerCase();
  
  if (normalized.includes("laranja")) {
    return BEBIDA_IMAGES[4]; 
  }
  if (normalized.includes("coca")) {
    return BEBIDA_IMAGES[1]; 
  }
  if (normalized.includes("guaraná") || normalized.includes("guarana")) {
    return guaranaImg;
  }
  if (normalized.includes("água") || normalized.includes("agua")) {
    return BEBIDA_IMAGES[0];
  }
  if (normalized.includes("sprite") || normalized.includes("soda")) {
    return BEBIDA_IMAGES[7]; 
  }
  if (normalized.includes("suco") || normalized.includes("limonada")) {
    return BEBIDA_IMAGES[2];
  }
  if (normalized.includes("chá") || normalized.includes("cha") || normalized.includes("tea")) {
    return BEBIDA_IMAGES[3];
  }
  if (normalized.includes("cerveja") || normalized.includes("chopp") || normalized.includes("beer")) {
    return BEBIDA_IMAGES[5];
  }
  return BEBIDA_IMAGES[(6 + index) % BEBIDA_IMAGES.length];
};


interface HomeProps {
  loggedUser: string | null;
  onLogin: () => void;
  onLogout: () => void;
}

function HomeScreen({ loggedUser, onLogin, onLogout }: HomeProps) {
  const [activeTab, setActiveTab] = useState<MenuTab>("pizzas");
  const [navOpen, setNavOpen] = useState(false);

  
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [bebidas, setBebidas] = useState<Bebida[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  
  const [chatOpen, setChatOpen] = useState(false);
  const [mensagens, setMensagens] = useState<Array<{ sender: 'bot' | 'user', text: string }>>([
    { sender: 'bot', text: 'Ciao! Sou o assistente virtual da pizzaria. Como posso te ajudar hoje? 🍕' }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingMenu(true);
        const { data: produtosData, error: produtosError } = await supabase
          .from("produtos")
          .select("*");

        if (produtosError) {
          console.error("Erro ao carregar produtos:", produtosError);
        } else if (produtosData) {
          const mappedPizzas: Pizza[] = [];
          const mappedBebidas: Bebida[] = [];

          produtosData.forEach((prod: any, idx: number) => {
            if (prod.tipo === "pizza") {
              mappedPizzas.push({
                id: String(prod.id),
                name: prod.nome,
                description: prod.ingredientes || "",
                price: Number(prod.valor) || 0,
                imageUrl: getPizzaImage(prod.nome, idx),
                badge: prod.nome.toLowerCase().includes("calabresa")
                  ? "Favorita"
                  : prod.nome.toLowerCase().includes("mussarela")
                  ? "Clássica"
                  : null,
                badgeColor: prod.nome.toLowerCase().includes("calabresa")
                  ? "bg-[#CE2B37] text-white"
                  : prod.nome.toLowerCase().includes("mussarela")
                  ? "bg-[#009246] text-white"
                  : null,
                available: true,
                category: "pizza",
                createdAt: new Date().toISOString(),
              });
            } else if (prod.tipo === "bebida") {
              mappedBebidas.push({
                id: String(prod.id),
                name: prod.nome,
                description: prod.ingredientes || "",
                price: Number(prod.valor) || 0,
                emoji: prod.nome.toLowerCase().includes("água") || prod.nome.toLowerCase().includes("agua") ? "💧" : "🥤",
                imageUrl: getBebidaImage(prod.nome, idx),
                available: true,
                category: "bebida",
                createdAt: new Date().toISOString(),
              });
            }
          });

          setPizzas(mappedPizzas);
          setBebidas(mappedBebidas);
        }

        const mockReviews: Review[] = [
          { id: "r1", authorName: "Giovanna Ricci", text: "A melhor pizza da cidade! Dá pra sentir o amor da família italiana em cada fatia.", stars: 5, createdAt: "2024-01-01T00:00:00Z" },
          { id: "r2", authorName: "Carlos Andrade", text: "A calabresa é simplesmente incrível. Já venho aqui toda semana!", stars: 5, createdAt: "2024-01-01T00:00:00Z" },
          { id: "r3", authorName: "Luísa Ferreira", text: "Ambiente acolhedor, atendimento nota 10 e pizza de qualidade excepcional.", stars: 5, createdAt: "2024-01-01T00:00:00Z" },
        ];
        setReviews(mockReviews);

      } catch (err) {
        console.error("Erro no Supabase:", err);
      } finally {
        setLoadingMenu(false);
      }
    }

    loadData();
  }, []);

  const enviarMensagem = async () => {
    const texto = inputMsg.trim();
    if (!texto || loadingChat) return;

    setMensagens(prev => [...prev, { sender: 'user', text: texto }]);
    setInputMsg("");
    setLoadingChat(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: texto })
      });
      const dados = await response.json();
      setMensagens(prev => [...prev, { sender: 'bot', text: dados.resposta || "Erro ao falar com o servidor." }]);
    } catch (erro) {
      setMensagens(prev => [...prev, { sender: 'bot', text: "Erro ao falar com o servidor." }]);
    } finally {
      setLoadingChat(false);
    }
  };

  const pizzasDisponiveis = pizzas.filter((p) => p.available);
  const pizzasConstrucao  = pizzas.filter((p) => !p.available);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>
      {}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1008]/92 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo onClick={() => scrollTo("hero")} />

          <div className="hidden md:flex items-center gap-8">
            {["cardapio", "sobre", "avaliacoes", "contato"].map((id) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-white/70 hover:text-white text-sm uppercase tracking-widest transition-colors">
                {id === "cardapio" ? "Cardápio" : id === "avaliacoes" ? "Avaliações" : id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}

            {loggedUser ? (
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm">Olá, <span className="text-[#009246] font-bold">{loggedUser}</span></span>
                <button onClick={onLogout} className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs uppercase tracking-wider transition-colors border border-white/20 px-3 py-2 rounded-full hover:border-white/40">
                  <LogOut size={13} />
                  Sair
                </button>
              </div>
            ) : (
              <button onClick={onLogin} className="flex items-center gap-2 bg-[#CE2B37] text-white text-sm px-5 py-2 rounded-full hover:bg-[#a8202a] transition-colors font-semibold">
                <LogIn size={14} />
                Entrar
              </button>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setNavOpen((v) => !v)}>
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-white transition-all ${navOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all ${navOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all ${navOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {navOpen && (
          <div className="md:hidden bg-[#1A1008] border-t border-white/10 px-6 py-4 flex flex-col gap-4">
            {["cardapio", "sobre", "avaliacoes", "contato"].map((id) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-white/80 text-sm uppercase tracking-widest text-left">
                {id === "cardapio" ? "Cardápio" : id === "avaliacoes" ? "Avaliações" : id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
            {loggedUser ? (
              <button onClick={onLogout} className="flex items-center gap-2 text-white/60 text-sm">
                <LogOut size={14} /> Sair ({loggedUser})
              </button>
            ) : (
              <button onClick={onLogin} className="flex items-center gap-2 text-[#CE2B37] text-sm font-bold">
                <LogIn size={14} /> Entrar
              </button>
            )}
          </div>
        )}
      </nav>

      {}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#1A1008]">
          <img src={HERO_IMG} alt="Pizza italiana artesanal saindo do forno" className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#009246] z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-[#CE2B37] z-10" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-[#009246] uppercase tracking-[0.4em] text-sm font-semibold mb-6" style={{ fontFamily: "'Roboto Slab', serif" }}>
            Família Italiana · Desde 1987
          </p>
          <h1 className="text-white text-5xl md:text-7xl font-black leading-none mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            A Autêntica<br />
            <span className="italic text-[#CE2B37]">Pizza Italiana</span><br />
            está aqui.
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Receitas que cruzaram o Atlântico. Ingredientes selecionados, massa fermentada por 48 horas e forno a lenha. Como a nonna fazia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => scrollTo("cardapio")} className="bg-[#CE2B37] text-white px-8 py-4 rounded-full font-bold text-base hover:bg-[#a8202a] transition-all hover:scale-105 shadow-lg">
              Ver Cardápio
            </button>
            <button onClick={() => scrollTo("contato")} className="border border-white/40 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-white/10 transition-all">
              Fazer Reserva
            </button>
          </div>
        </div>

        <button onClick={() => scrollTo("cardapio")} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/90 transition-colors animate-bounce z-10">
          <ChevronDown size={32} />
        </button>
      </section>

      <ItalianStripe />

      {}
      <section id="cardapio" className="bg-background text-foreground">

        {}
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-14 text-center">
          <p className="text-[#CE2B37] uppercase tracking-[0.4em] text-xs font-bold mb-4">Cardápio</p>
          <h2 className="text-5xl md:text-6xl font-black leading-none mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Feito com <span className="italic text-[#009246]">alma italiana</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">Cada prato preparado na hora, com ingredientes frescos e amor de verdade.</p>

          {}
          <div className="flex justify-center gap-2 mt-10">
            {(["pizzas", "bebidas"] as MenuTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-7 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all border ${
                  activeTab === tab
                    ? "bg-[#1A1008] text-white border-[#1A1008]"
                    : "border-border text-muted-foreground hover:border-[#1A1008]/40 hover:text-foreground"
                }`}
              >
                {tab === "pizzas" ? "Pizzas" : "Bebidas"}
              </button>
            ))}
          </div>
        </div>

        {}
        {loadingMenu && (
          <div className="flex justify-center items-center pb-24 gap-3 text-muted-foreground">
            <Loader2 size={20} className="animate-spin text-[#009246]" />
            <span className="text-sm">Carregando cardápio...</span>
          </div>
        )}

        {}
        {!loadingMenu && activeTab === "pizzas" && (
          <div className="max-w-6xl mx-auto px-6 pb-24">

            {}
            <div className="rounded-3xl overflow-hidden border border-border shadow-sm">
              {pizzasDisponiveis.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground">Nenhuma pizza disponível no momento.</div>
              ) : (
                pizzasDisponiveis.map((pizza, i) => (
                  <div
                    key={pizza.id}
                    className={`grid md:grid-cols-2 gap-0 ${i < pizzasDisponiveis.length - 1 ? "border-b border-border" : ""}`}
                  >
                    {}
                    <div className={`relative h-64 md:h-72 bg-[#F0E8DC] ${i % 2 === 1 ? "md:order-2" : ""}`}>
                      <img
                        src={pizza.imageUrl}
                        alt={`Pizza ${pizza.name}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      {pizza.badge && (
                        <span className={`absolute top-4 left-4 text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider ${pizza.badgeColor}`}>
                          {pizza.badge}
                        </span>
                      )}
                    </div>

                    {}
                    <div className={`flex flex-col justify-center px-10 py-10 bg-card ${i % 2 === 1 ? "md:order-1" : ""}`}>
                      <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs mb-3">Pizza artesanal</p>
                      <h3
                        className="text-4xl font-black text-foreground mb-4 leading-none"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {pizza.name}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xs">{pizza.description}</p>
                      <div className="flex items-end gap-4">
                        <span
                          className="text-3xl font-black text-[#CE2B37]"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {formatPrice(pizza.price)}
                        </span>
                        <span className="text-muted-foreground text-xs uppercase tracking-wider mb-1">pizza inteira</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {}
            <div className="mt-12 rounded-3xl overflow-hidden border border-dashed border-[#D4C4B0] bg-[#FDF6EE]/80">
              <div className="px-8 py-5 border-b border-[#D4C4B0] flex items-center gap-3">
                <Construction size={16} className="text-[#D97706]/85" />
                <p className="text-[#D97706]/85 font-bold text-xs uppercase tracking-[0.25em]" style={{ fontFamily: "'Lato', sans-serif" }}>
                  Novos sabores em breve
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Margherita", description: "Tomate San Marzano, mussarela de búfala, manjericão e azeite." },
                  { name: "Quatro Queijos", description: "Mussarela, gorgonzola, parmesão e provolone derretidos." },
                  { name: "Portuguesa", description: "Presunto, ovos, azeitona, pimentão, cebola e mussarela." },
                  { name: "Pepperoni", description: "Molho de tomate, pepperoni fatiado e mussarela generosa." },
                  { name: "Frango c/ Catupiry", description: "Frango desfiado temperado, catupiry cremoso e mussarela." },
                  { name: "Vegetariana", description: "Abobrinha, berinjela, pimentões, tomate-cereja e rúcula." },
                ].map((pizza, idx) => {
                  const isLastRow = idx >= 3;
                  const isLastCol = (idx + 1) % 3 === 0;
                  
                  let borderCls = "border-[#D4C4B0]/30";
                  if (!isLastCol) borderCls += " border-r";
                  if (!isLastRow) borderCls += " border-b";

                  return (
                    <div key={pizza.name} className={`p-8 relative ${borderCls}`}>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4
                          className="text-[#1A1008]/65 font-bold text-xl leading-tight"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {pizza.name}
                        </h4>
                        <span className="flex-shrink-0 text-[10px] bg-[#FDF2E2]/90 text-[#D97706]/90 border border-[#FCD34D]/30 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                          Em breve
                        </span>
                      </div>
                      <p className="text-[#7A6A58]/75 text-xs leading-relaxed">{pizza.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {}
        {!loadingMenu && activeTab === "bebidas" && (
          <div className="max-w-6xl mx-auto px-6 pb-24">
            {bebidas.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">Nenhuma bebida disponível no momento.</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {bebidas.map((bebida) => (
                  <div
                    key={bebida.id}
                    className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {}
                    <div className="h-48 overflow-hidden relative bg-[#F0E8DC]">
                      <img
                        src={bebida.imageUrl}
                        alt={bebida.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-md text-xl">
                        {bebida.emoji}
                      </div>
                    </div>

                    {}
                    <div className="p-6 flex flex-col flex-1">
                      <span className="text-[10px] font-black uppercase text-[#009246] tracking-widest mb-1.5 block">
                        Bebida Gelada
                      </span>
                      <h3
                        className="text-2xl font-bold text-foreground mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {bebida.name}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        {bebida.description}
                      </p>
                      <div className="mt-auto pt-2 border-t border-border/40 flex items-center justify-between">
                        <span className="text-muted-foreground text-xs uppercase tracking-wider">Valor unitário</span>
                        <span
                          className="text-2xl font-black text-[#CE2B37]"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {formatPrice(bebida.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {}
      <section id="sobre" className="py-24 bg-[#1A1008] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#009246]/40 rounded-2xl" />
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-[#CE2B37]/40 rounded-2xl" />
            <img src={PIZZA2_IMG} alt="Pizza italiana artesanal" className="relative rounded-2xl w-full object-cover h-[500px]" />
          </div>
          <div>
            <p className="text-[#009246] uppercase tracking-[0.35em] text-xs font-bold mb-4">Nossa História</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Uma família.<br />Uma receita.<br /><span className="italic text-[#CE2B37]">Uma paixão.</span>
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Em 1987, a família Conti deixou Nápoles trazendo na bagagem mais do que sonhos — trouxeram a receita da nonna Maria, passada por três gerações, para a massa mais macia e o molho mais saboroso que você já vai provar.
            </p>
            <p className="text-white/70 leading-relaxed mb-8">
              Cada pizza que sai do nosso forno a lenha carrega décadas de tradição, amor e o orgulho de uma família que escolheu o Brasil como seu segundo lar.
            </p>
            <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[{ value: "37+", label: "Anos de história" }, { value: "3ª", label: "Geração familiar" }, { value: "100%", label: "Ingredientes frescos" }].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-black text-[#009246]" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</p>
                  <p className="text-white/50 text-xs mt-1 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="avaliacoes" className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#CE2B37] uppercase tracking-[0.35em] text-xs font-bold mb-3">O que dizem</p>
            <h2 className="text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif" }}>
              Clientes que <span className="italic text-[#009246]">amam</span> nossa pizza
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-2xl p-7 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-5 italic">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#009246] flex items-center justify-center text-white font-bold text-sm">{r.authorName.charAt(0)}</div>
                  <p className="font-bold text-sm">{r.authorName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-20 px-6 bg-muted/60">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {[
            { icon: <Clock size={24} className="text-white" />, bg: "bg-[#009246]", title: "Funcionamento", lines: ["Seg–Sex: 11h às 23h", "Sáb–Dom: 11h às 00h"] },
            { icon: <MapPin size={24} className="text-white" />, bg: "bg-[#CE2B37]", title: "Localização", lines: ["Rua das Pizzas, 1987", "Centro — São Paulo, SP"] },
            { icon: <Phone size={24} className="text-white" />, bg: "bg-[#1A1008]", title: "Contato & Reservas", lines: ["(11) 98905-0689", "contato@labellpizza.com.br"] },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 ${item.bg} rounded-full flex items-center justify-center`}>{item.icon}</div>
              <h3 className="font-black text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
              <div className="text-muted-foreground text-sm space-y-1">
                {item.lines.map((l) => <p key={l}>{l}</p>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {}
      <section id="contato" className="py-24 px-6 bg-[#1A1008] text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-[#009246]/20" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border border-[#CE2B37]/20" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <p className="text-[#009246] uppercase tracking-[0.35em] text-xs font-bold mb-4">Faça seu pedido</p>
          <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pronto pra saborear<br /><span className="italic text-[#CE2B37]">a Itália?</span>
          </h2>
          <p className="text-white/60 mb-10 text-lg">Ligue para fazer seu pedido ou reserva. Também aceitamos pedidos pelo WhatsApp!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+5511989050689" className="flex items-center justify-center gap-2 bg-[#009246] text-white px-8 py-4 rounded-full font-bold hover:bg-[#007a39] transition-all hover:scale-105 shadow-lg">
              <Phone size={18} /> (11) 9 98905-0689
            </a>
            <a href="https://wa.me/5511989050689" className="flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {}
      <footer className="bg-[#0E0804] text-white/40 py-8 px-6 text-center text-sm">
        <div className="flex justify-center gap-1 mb-3 text-lg">
          <span className="text-[#009246]">■</span>
          <span className="text-white">■</span>
          <span className="text-[#CE2B37]">■</span>
        </div>
        <p className="font-semibold text-white/60 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>LaBella Pizza — Família Conti</p>
        <p>© {new Date().getFullYear()} Todos os direitos reservados. Feito com ❤️ e farinha.</p>
      </footer>

      {}
      {loggedUser && (
        <>
          {}
          <button 
            id="botao-chat" 
            onClick={() => setChatOpen(prev => !prev)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1A1008] text-[#FDF6EE] hover:bg-[#CE2B37] hover:text-white px-6 py-4 rounded-full font-bold shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-[#D4C4B0] cursor-pointer"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-xl">👨‍🍳</span> Falar com o Chef
          </button>

          {}
          {chatOpen && (
            <div 
              id="janela-chat" 
              className="fixed bottom-24 right-6 w-[340px] h-[450px] bg-[#FDF6EE] rounded-2xl shadow-2xl flex flex-col z-50 border border-[#D4C4B0] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {}
              <div className="flex h-1.5 w-full">
                <div className="flex-1 bg-[#009246]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#CE2B37]" />
              </div>

              {}
              <div className="bg-[#1A1008] text-[#FDF6EE] p-4 flex justify-between items-center border-b border-[#D4C4B0]/20">
                <div>
                  <h3 className="font-black text-base flex items-center gap-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <span>Chef Pizzaiolo LaBella</span> 👨‍🍳
                  </h3>
                  <p className="text-[10px] text-[#D4C4B0] uppercase tracking-wider font-semibold">Online & Grosso</p>
                </div>
                <button 
                  onClick={() => setChatOpen(false)}
                  className="text-[#D4C4B0] hover:text-[#CE2B37] transition-colors font-bold text-lg p-1"
                >
                  ✕
                </button>
              </div>
              
              {}
              <div 
                className="flex-1 p-4 overflow-y-auto bg-[#F9F3EB] flex flex-col gap-3"
                style={{ backgroundImage: "radial-gradient(#D4C4B0 0.5px, transparent 0.5px)", backgroundSize: "12px 12px" }}
              >
                {mensagens.map((msg, index) => (
                  <div 
                    key={index}
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user' 
                        ? 'align-self-end bg-[#CE2B37] text-white rounded-tr-none self-end' 
                        : 'align-self-start bg-[#FDF6EE] text-[#1A1008] border border-[#D4C4B0] rounded-tl-none self-start'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                {loadingChat && (
                  <div className="self-start bg-[#FDF6EE] text-[#1A1008] border border-[#D4C4B0] rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 bg-[#009246] rounded-full animate-ping" />
                    <span className="text-xs text-[#7A6A58]">O chef está resmungando...</span>
                  </div>
                )}
              </div>
              
              {}
              <div className="p-3 bg-[#FDF6EE] border-t border-[#D4C4B0]/40 flex gap-2 items-center">
                <input 
                  type="text" 
                  placeholder="Fale com o pizzaiolo..." 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') enviarMensagem();
                  }}
                  className="flex-1 bg-[#F0E8DC] border border-[#D4C4B0] rounded-xl px-3 py-2 text-sm text-[#1A1008] placeholder-[#B0A090] focus:outline-none focus:ring-2 focus:ring-[#009246] focus:border-transparent transition-all"
                />
                <button 
                  onClick={enviarMensagem}
                  className="bg-[#009246] hover:bg-[#007a39] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Enviar
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}


export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [loggedUser, setLoggedUser] = useState<string | null>(null);

  useEffect(() => {
    
    const localUser = localStorage.getItem("pizzeria_logged_user");
    if (localUser) {
      setLoggedUser(localUser);
      setScreen("home");
    }

    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email || "";
        setLoggedUser(email);
        localStorage.setItem("pizzeria_logged_user", email);
        setScreen("home");
      }
    });

    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const email = session.user.email || "";
        setLoggedUser(email);
        localStorage.setItem("pizzeria_logged_user", email);
        setScreen("home");
      } else if (event === "SIGNED_OUT") {
        localStorage.removeItem("pizzeria_logged_user");
        setLoggedUser(null);
        setScreen("login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = (username: string) => {
    setLoggedUser(username);
    localStorage.setItem("pizzeria_logged_user", username);
    setScreen("home");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("pizzeria_logged_user");
    setLoggedUser(null);
    setScreen("login");
  };

  if (screen === "login") {
    return (
      <LoginScreen
        onBack={() => setScreen("home")}
        onGoRegister={() => setScreen("register")}
        onSuccess={handleLoginSuccess}
      />
    );
  }

  if (screen === "register") {
    return (
      <RegisterScreen
        onBack={() => setScreen("home")}
        onGoLogin={() => setScreen("login")}
      />
    );
  }

  return (
    <HomeScreen
      loggedUser={loggedUser}
      onLogin={() => setScreen("login")}
      onLogout={handleLogout}
    />
  );
}
