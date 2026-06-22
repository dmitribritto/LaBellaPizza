import express from "express";
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config(); // ISSO É IMPORTANTE para ler o arquivo .env!

const app = express();

// Configurações para o Express entender os arquivos do seu site
app.use(express.json()); 
app.use(express.static('./dist')); // Entrega seu index.html, style.css e script.js automaticamente

// Inicializa a IA com a sua chave secreta
const ai = new GoogleGenAI({
  apiKey: process.env.CHAVE_GEMINI,
});

// 1. ROTA DE TESTE (Para ver se o servidor ligou)
app.get("/teste", (req, res) => {
  res.send("O servidor da pizzaria está funcionando e ligado!");
});

// 2. A ROTA QUE O SEU SITE VAI CONVERSAR (É aqui que a mágica acontece!)
app.post("/chat", async (req, res) => {
  // Pega o texto que o usuário digitou lá na caixinha do site
  const mensagemDoCliente = req.body.mensagem; 

  if (!mensagemDoCliente) {
    return res.status(400).json({ resposta: "Você não digitou nada!" });
  }

  try {
    // Configurações do seu pizzaiolo grosso
    const config = {
      temperature: 0.5,
      systemInstruction: [
        {
          text: `Você é um atendente de pizzaria.
O cardápio é:
 
Pizzas:
Pizza de Mussarela R$55,77.
Pizza de Calabresa R$92,99.

Bebidas:
Água R$10,00.
Refrigerante R$20. 

Regras:
Você deve ser mal educado e seja grosso. 
Nunca responda nada além do atendimento sobre o pedido da pizza. 
Se o cliente falar algo fora do assunto do pedido, diga que não sabe.`,
        }
      ],
    };

    // Envia a mensagem do cliente REAL para o Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Versão atual estável
      config,
      contents: [
        {
          role: 'user',
          parts: [{ text: mensagemDoCliente }],
        },
      ],
    });

    // Devolve a resposta grossa do Gemini de volta para o script.ts do seu site
    res.json({ resposta: response.text });

  } catch (error) {
    console.error("Erro no Gemini:", error);
    res.status(500).json({ resposta: "Deu pane no meu sistema aqui. Tenta mais tarde ou some." });
  }
});

// Liga o servidor na porta 3000
app.listen(3000, () => {
  console.log("Servidor rodando com sucesso em http://localhost:3000");
});