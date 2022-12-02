//Kanvase init
canvas = document.getElementById("game_canvas")
canvas.width = 600
canvas.height = 800
//scoreElement = document.getElementById("score_element")

ctx = canvas.getContext("2d")

//Muutujate init
fps = 60
mspf = 1000/fps

playing = false

ctx.textAlign = "center"

score = 0
pipes = []

//Mängija klass
class square {
  constructor (x, y, w, h, color) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.color = color
    this.speed = 0
    this.power = 10
    this.gravity = 0.5
    this.update = function(){
      //Kutsu iga frame ja uuenda mängija pos ja kiirus
      this.speed += this.gravity
      this.y += this.speed
      this.draw()
      if (this.y + this.h > canvas.height){
        stopGame()
      }
    }
    this.draw = function(){
      //Joonista mängija
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    this.jump = function(){
      //Hüppa
      this.speed = -this.power
    }
    this.reset = function(){
      //Taasta mängija algpositsioon
      this.x = x
      this.y = y
      this.speed = 0
    }
  }
}

//Posti klass
class pipe {
  constructor (x, y, w, h, color) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.color = color
    this.speed = 5
    this.point = false
    this.respawn = function(i){
      //Vii post paremale serva ja muuda augu kõrgus
      this.x = canvas.width+Math.floor(i*canvas.width/pipes.length)
      this.y = Math.floor(Math.random()*canvas.height*0.5+0.25*canvas.height-this.h/2)
      this.point = false
    }
    this.update = function(){
      //Uuenda posti pos ja kontrolli kokkupuudet mängijaga
      this.x -= this.speed
      if (this.x < -this.w){
        this.respawn(0)
      }
      this.draw()
      if (player.x < this.x+this.w && player.x+player.w > this.x){
        if (player.y < this.y || player.y+player.h > this.y+this.h){
          stopGame()
        }else{
          if (!this.point){
            addPoint()
            this.point = true
          }
        }
      }
    }
    this.draw = function(){
      //Joonista post
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, 0, this.w, this.y)
      ctx.fillRect(this.x, this.y+this.h, this.w, canvas.height-this.y-this.h)
    }
  }
}

//Väärtusta mängija ja postid
player = new square(200, 400, 20, 20, "black")

pipes.push(new pipe(canvas.width, canvas.height/2, 30, 125, "green"))
pipes.push(new pipe(canvas.width+400, canvas.height/2, 30, 125, "green"))
//pipes.push(new pipe(canvas.width+400, canvas.height/2, 20, 100, "green"))
//console.log(pipes)

//Lisa klahvi vajutuse kuulaja ja update kutsuja
window.addEventListener("keydown", keyDownHandler)
interval = setInterval(update, mspf)

//Peamine funktsioon, mida kutsutakse 60 korda sekundis
function update(){
  //ekraan tühjaks
  ctx.clearRect(0, 0, canvas.width, canvas.height)
 
  //Uuenda ja joonista postid ja mängija
  pipesFunc((element, i) => {
    if (playing){
      element.update()
    }else{element.draw()}
  })
  player.draw()

  //Tekst ekraanile
  ctx.fillStyle = "black"
  ctx.font = "60px Comic Sans MS"
  ctx.fillText(score.toString(), 20*score.toString().length+10, 60)

  //Mängu ja pausi funktsionaalsus
  if (playing){
    player.update()
  }else{
    //Taust ja tekst ekraanile
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgb(255, 100, 200)"
    ctx.font = "60px Comic Sans MS"
    ctx.fillText("JUMPY GAME", canvas.width/2, canvas.height/2)
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)"
    ctx.font = "20px Comic Sans MS"
    ctx.fillText("Press [space] to start", canvas.width/2, canvas.height/2+60)
  }
}

//Alusta mäng
function startGame(){
  score = -1
  addPoint()
  playing = true
}

//Peata mäng
function stopGame(){
  playing = false
}

//Nupuvajutuse käsitleja
function keyDownHandler(event){
  switch (event.keyCode){
    //Tühik
    case 32:
      if (!playing){
        startGame()
        pipesFunc((element, i) => {element.respawn(i)})
        player.reset()
      }
      player.jump()
  }
}

//Lisa punkt
function addPoint(){
  score += 1
  //scoreElement.innerHTML = score
}

//Kutsu funktsiooni igal postil
function pipesFunc(func) {
  for (let i = 0; i < pipes.length; i++) {
    const element = pipes[i];
    func(element, i)
  }
}