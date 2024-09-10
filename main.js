let dt = 0
let scale = 1
let phrases = `
Aliquam rhoncus imperdiet risus, sit amet venenatis lectus volutpat in.
Praesent ac eros id eros porta dictum in in lorem. Etiam pulvinar volutpat dolor, vitae.
Nam sodales, metus sit amet lacinia placerat, nulla lacus commodo.
Quisque tincidunt elementum enim at laoreet. Maecenas congue porta augue.
Ut scelerisque justo auctor, ornare sem sed, volutpat nibh. Donec dapibus posuere metus molestie pharetra. Vivamus et arcu facilisis, malesuada tortor ut, tincidunt eros. Aliquam.
Donec quis sapien pretium, dignissim elit sed, tincidunt mi. Sed.
Sed non tincidunt risus, vitae interdum neque. Morbi dictum ac.
Aenean ullamcorper, ligula vitae viverra malesuada, ipsum metus sollicitudin leo.
Nulla leo neque, lobortis a nulla a, ornare interdum felis. Sed in venenatis augue, vel.
Vivamus in eros vel mi hendrerit iaculis. Integer nunc nunc, aliquet quis eros eu, vulputate mollis libero. Cras eget finibus quam. Praesent elit odio, iaculis.
Fusce finibus cursus suscipit. Aenean venenatis eleifend massa, et porttitor.
Sed vitae felis nisi. Cras blandit mi vitae erat euismod.
Donec id quam congue, pulvinar ipsum vitae, sagittis tortor. Pellentesque ultricies facilisis sodales. Nulla vitae.
In nunc leo, pharetra placerat laoreet eget, lacinia vel mauris.
Nunc sit amet sagittis sem. Nam quis efficitur elit. Nullam sollicitudin gravida eros eget tincidunt.
Praesent non nulla vehicula, accumsan risus sit amet, hendrerit nibh.
Aliquam rhoncus imperdiet risus, sit amet venenatis lectus volutpat in.
Praesent ac eros id eros porta dictum in in lorem. Etiam pulvinar volutpat dolor, vitae.
Nam sodales, metus sit amet lacinia placerat, nulla lacus commodo. Nam sodales, metus sit amet lacinia placerat, nulla lacus commodo. Nam sodales, metus sit amet lacinia placerat, nulla lacus commodo.
Quisque tincidunt elementum enim at laoreet. Maecenas congue porta augue.
Ut scelerisque justo auctor, ornare sem sed, volutpat nibh. Donec dapibus posuere metus molestie pharetra. Vivamus et arcu facilisis, malesuada tortor ut, tincidunt eros. Aliquam.
Donec quis sapien pretium, dignissim elit sed, tincidunt mi. Sed.
Sed non tincidunt risus, vitae interdum neque. Morbi dictum ac.
Aenean ullamcorper, ligula vitae viverra malesuada, ipsum metus sollicitudin leo.
Nulla leo neque, lobortis a nulla a, ornare interdum felis. Sed in venenatis augue, vel.
Vivamus in eros vel mi hendrerit iaculis. Integer nunc nunc, aliquet quis eros eu, vulputate mollis libero. Cras eget finibus quam. Praesent elit odio, iaculis.
Fusce finibus cursus suscipit. Aenean venenatis eleifend massa, et porttitor.
Sed vitae felis nisi. Cras blandit mi vitae erat euismod.
Donec id quam congue, pulvinar ipsum vitae, sagittis tortor. Pellentesque ultricies facilisis sodales. Nulla vitae.
In nunc leo, pharetra placerat laoreet eget, lacinia vel mauris.
Nunc sit amet sagittis sem. Nam quis efficitur elit. Nullam sollicitudin gravida eros eget tincidunt.
Praesent non nulla vehicula, accumsan risus sit amet, hendrerit nibh.
Aliquam rhoncus imperdiet risus, sit amet venenatis lectus volutpat in.
Praesent ac eros id eros porta dictum in in lorem. Etiam pulvinar volutpat dolor, vitae.
Nam sodales, metus sit amet lacinia placerat, nulla lacus commodo.
Quisque tincidunt elementum enim at laoreet. Maecenas congue porta augue.
Ut scelerisque justo auctor, ornare sem sed, volutpat nibh. Donec dapibus posuere metus molestie pharetra. Vivamus et arcu facilisis, malesuada tortor ut, tincidunt eros. Aliquam.
Donec quis sapien pretium, dignissim elit sed, tincidunt mi. Sed.
Sed non tincidunt risus, vitae interdum neque. Morbi dictum ac.
Aenean ullamcorper, ligula vitae viverra malesuada, ipsum metus sollicitudin leo.
Nulla leo neque, lobortis a nulla a, ornare interdum felis. Sed in venenatis augue, vel.
Vivamus in eros vel mi hendrerit iaculis. Integer nunc nunc, aliquet quis eros eu, vulputate mollis libero. Cras eget finibus quam. Praesent elit odio, iaculis.
Fusce finibus cursus suscipit. Aenean venenatis eleifend massa, et porttitor.
Sed vitae felis nisi. Cras blandit mi vitae erat euismod.
Donec id quam congue, pulvinar ipsum vitae, sagittis tortor. Pellentesque ultricies facilisis sodales. Nulla vitae.
In nunc leo, pharetra placerat laoreet eget, lacinia vel mauris.
Nunc sit amet sagittis sem. Nam quis efficitur elit. Nullam sollicitudin gravida eros eget tincidunt.
Praesent non nulla vehicula, accumsan risus sit amet, hendrerit nibh.
`
phrases = phrases.split("\n").filter((phrase) => phrase.length > 0 ? phrase : "")

let longestPhrase = phrases.reduce((previousPhrase, currentPhrase) => {
  return previousPhrase.length > currentPhrase.length
    ? previousPhrase
    : currentPhrase
}, phrases[0])

phrases = phrases.map((phrase) => {
  let paddingLength = longestPhrase.length - phrase.length
  let padding = new Array(paddingLength).fill(" ").join("")
  return phrase + padding
})

const INPUT =  phrases.join("").split("")

const WIDTH = longestPhrase.length
const HEIGHT = phrases.length

let canvas = new Array(WIDTH * HEIGHT).fill(" ")

function rotate(position, radian, tick) {
  let x = position.x / WIDTH - 0.5
  let y = position.y / HEIGHT - 0.5

  let distance = Math.sqrt(x * x + y * y)
  
  radian -= Math.log2(distance)

  let rotatedX = (x * Math.cos(tick * radian) - y * Math.sin(tick * radian))
  let rotatedY = (x * Math.sin(tick * radian) + y * Math.cos(tick * radian)) 

  return {
    x: Math.round((rotatedX + 0.5) * WIDTH * scale),
    y: Math.round((rotatedY + 0.5) * HEIGHT * scale) 
  }
}

function update() {
  canvas = canvas.map((_, index) => {
    let x = index % WIDTH
    let y = Math.floor(index / WIDTH)
    let position = rotate({x: x, y: y}, Math.PI / Math.pow(2, 10), dt / Math.pow(2, 10))    
  
    if (position.x >= 0 && position.x < WIDTH 
        && position.y >= 0 && position.y < HEIGHT) {
      return INPUT[position.x + position.y * WIDTH]
    }
    
    return " "
  })

  dt += 1
}

function draw() {
  let output = canvas.reduce((previous, current, index) => {
    if (index % WIDTH === 0) {
      previous += "\n"
    }

    return previous + current
  })

  document.querySelector("#swirl").textContent = output
}


window.addEventListener("resize", (e) => {
  scale = window.innerWidth / document.querySelector("#swirl").offsetWidth
  if (scale > 1) {
    scale = 1
  }
})

setInterval(() => {
  update()
  draw()
})