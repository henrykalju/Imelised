canvas = document.getElementById("game_canvas")
canvas.width = 600
canvas.height = 800
//scoreElement = document.getElementById("score_element")

ctx = canvas.getContext("2d")

fps = 60
mspf = 1000/fps

playing = false

score = 0
pipes = []

class bird {
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
      this.speed += this.gravity
      this.y += this.speed
      this.draw()
      if (this.y + this.h > canvas.height){
        stopGame()
      }
    }
    this.draw = function(){
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    this.jump = function(){
      this.speed = -this.power
    }
    this.reset = function(){
      this.x = x
      this.y = y
      this.speed = 0
    }
  }
}

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
      this.x = canvas.width+Math.floor(i*canvas.width/pipes.length)
      this.y = Math.floor(Math.random()*canvas.height*0.5+0.25*canvas.height-this.h/2)
      this.point = false
    }
    this.update = function(){
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
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, 0, this.w, this.y)
      ctx.fillRect(this.x, this.y+this.h, this.w, canvas.height-this.y-this.h)
    }
  }
}

player = new bird(200, 400, 20, 20, "black")

pipes.push(new pipe(canvas.width, canvas.height/2, 30, 125, "green"))
pipes.push(new pipe(canvas.width+400, canvas.height/2, 30, 125, "green"))
//pipes.push(new pipe(canvas.width+400, canvas.height/2, 20, 100, "green"))
//console.log(pipes)


window.addEventListener("keydown", keyDownHandler)
interval = setInterval(update, mspf)

ctx.textAlign = "center"

function update(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
 
  pipesFunc((element, i) => {
    if (playing){
      element.update()
    }
    element.draw()      
  })
  player.draw()

  
  ctx.fillStyle = "black"
  ctx.font = "60px Comic Sans MS"
  ctx.fillText(score.toString(), 20*score.toString().length+10, 60)

  if (playing){
    player.update()
  }else{
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

function startGame(){
  score = -1
  addPoint()
  playing = true
}

function stopGame(){
  playing = false
}

function keyDownHandler(event){
  switch (event.keyCode){
    case 32:
      if (!playing){
        startGame()
        pipesFunc((element, i) => {element.respawn(i)})
        player.reset()
      }
      player.jump()
  }
}

function addPoint(){
  score += 1
  //scoreElement.innerHTML = score
}

function pipesFunc(func) {
  for (let i = 0; i < pipes.length; i++) {
    const element = pipes[i];
    func(element, i)
  }
}