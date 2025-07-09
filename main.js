import './style.css'

// Script para inicializar o Typebot
const typebotInitScript = document.createElement("script");
typebotInitScript.type = "module";
typebotInitScript.innerHTML = `import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js'
  
Typebot.initStandard({ typebot: "bot-financiamento-fzzobn9" });
`;
document.body.append(typebotInitScript);