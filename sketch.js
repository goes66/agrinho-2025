let trator;
let alimentos = [];
let obstaculos = [];
let pontos = 0;
let energia = 100;
let fase = 1;
let jogoAtivo = false;
let jogoFim = false;

function setup() {
  createCanvas(600, 400);
  iniciarJogo();
}

function draw() {
  background(200, 255, 200);
  
  if (!jogoAtivo) {
    telaInicial();
    return;
  }

  if (jogoFim) {
    telaGameOver();
    return;
  }

  desenhaCenario();
  mostrarInfo();
  
  trator.mostrar();
  trator.mover();

  for (let a of alimentos) a.mostrar();
  for (let o of obstaculos) {
    o.mostrar();
    if (o.colide(trator)) fimDeJogo();
  }

  verificarColheita();
  verificarEntrega();
  atualizarEnergia();
}

function keyPressed() {
  if (!jogoAtivo && key === ' ') iniciarJogo();
  if (jogoAtivo && !jogoFim) {
    if (keyCode === UP_ARROW) trator.direcao = -1;
    else if (keyCode === DOWN_ARROW) trator.direcao = 1;
  }
}

function keyReleased() {
  if (jogoAtivo && !jogoFim) trator.direcao = 0;
}

function iniciarJogo() {
  trator = new Trator();
  pontos = 0;
  energia = 100;
  fase = 1;
  jogoAtivo = true;
  jogoFim = false;
  gerarAlimentos(3);
  gerarObstaculos(3);
  loop();
}

function fimDeJogo() {
  jogoFim = true;
  noLoop();
}

function telaInicial() {
  background(180, 240, 180);
  textAlign(CENTER);
  textSize(26);
  fill(0);
  text("🚜🌾 Agrinho 2025 – Campo e Cidade 🏙️🌽", width / 2, height / 2 - 40);
  textSize(16);
  text("⬆️⬇️ Use as setas para mover o trator", width / 2, height / 2);
  text("🟢 Pressione ESPAÇO para começar!", width / 2, height / 2 + 30);
}

function telaGameOver() {
  textAlign(CENTER);
  textSize(32);
  fill(255, 0, 0);
  text("💀 FIM DE JOGO!", width / 2, height / 2 - 20);
  textSize(20);
  fill(0);
  text("⭐ Pontuação final: " + pontos, width / 2, height / 2 + 20);
  text("🔁 Pressione ESPAÇO para jogar novamente", width / 2, height / 2 + 60);
}

function desenhaCenario() {
  // Campo 🌾
  fill(100, 200, 100);
  rect(0, 0, 200, height);
  fill(30, 120, 30);
  text("🌾 Campo", 60, 20);

  // Cidade 🏙️
  fill(180, 180, 255);
  rect(400, 0, 200, height);
  fill(30, 30, 120);
  text("🏙️ Cidade", 460, 20);
}

function mostrarInfo() {
  fill(0);
  textSize(14);
  text("⭐ Pontos: " + pontos, 10, height - 10);

  // Barra de energia ⛽
  fill(255, 0, 0);
  rect(250, 10, 100, 10);
  fill(0, 200, 0);
  rect(250, 10, energia, 10);
  stroke(0);
  noFill();
  rect(250, 10, 100, 10);
  text("⚡ Energia", 360, 18);
}

function atualizarEnergia() {
  energia -= 0.05;
  if (energia <= 0) fimDeJogo();
}

function verificarColheita() {
  for (let a of alimentos) {
    if (!a.coletado && trator.x < 200 && dist(trator.x, trator.y, a.x, a.y) < 20) {
      a.coletado = true;
      trator.carregando++;
    }
  }
}

function verificarEntrega() {
  if (trator.carregando > 0 && trator.x > 400) {
    pontos += trator.carregando;
    trator.carregando = 0;
    fase++;
    energia = min(energia + 20, 100);
    gerarAlimentos(2 + fase);
    gerarObstaculos(2 + fase);
  }
}

function gerarAlimentos(qtd) {
  alimentos = [];
  for (let i = 0; i < qtd; i++) {
    alimentos.push(new Alimento(random(30, 180), random(50, height - 50)));
  }
}

function gerarObstaculos(qtd) {
  obstaculos = [];
  for (let i = 0; i < qtd; i++) {
    obstaculos.push(new Obstaculo(random(200, 400), random(0, height - 20)));
  }
}

class Trator {
  constructor() {
    this.x = 300;
    this.y = height / 2;
    this.direcao = 0;
    this.carregando = 0;
  }

  mover() {
    this.y += this.direcao * 5;
    this.y = constrain(this.y, 0, height - 20);
  }

  mostrar() {
    fill(this.carregando > 0 ? 'orange' : 'red');
    rect(this.x, this.y, 40, 20);
    fill(255);
    textSize(12);
    text(this.carregando, this.x + 15, this.y + 15);
  }
}

class Alimento {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.coletado = false;
  }

  mostrar() {
    if (!this.coletado) {
      fill('green');
      ellipse(this.x, this.y, 15);
      textSize(10);
      fill(0);
      text("🥬", this.x - 5, this.y + 5);
    }
  }
}

class Obstaculo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  mostrar() {
    fill('gray');
    rect(this.x, this.y, 20, 20);
    textSize(16);
    fill(0);
    text("🧱", this.x + 2, this.y + 16);
  }

  colide(trator) {
    return collideRectRect(trator.x, trator.y, 40, 20, this.x, this.y, 20, 20);
  }
}

// Função de colisão
function collideRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 + w1 > x2 &&
         x1 < x2 + w2 &&
         y1 + h1 > y2 &&
         y1 < y2 + h2;
}
