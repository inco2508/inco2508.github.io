let dt = 0
let scale = 1
let phrases = `
// Copyright 2016 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//go:generate bundle -o=h2_bundle.go -prefix=http2 -tags=!nethttpomithttp2 golang.org/x/net/http2

package http

import (
"io"
"strconv"
"strings"
"time"
"unicode/utf8"

"golang.org/x/net/http/httpguts"
)

// incomparable is a zero-width, non-comparable type. Adding it to a struct
// makes that struct also non-comparable, and generally doesn't add
// any size (as long as it's first).
type incomparable [0]func()

// maxInt64 is the effective "infinite" value for the Server and
// Transport's byte-limiting readers.
const maxInt64 = 1<<63 - 1

// aLongTimeAgo is a non-zero time, far in the past, used for
// immediate cancellation of network operations.
var aLongTimeAgo = time.Unix(1, 0)

// omitBundledHTTP2 is set by omithttp2.go when the nethttpomithttp2
// build tag is set. That means h2_bundle.go isn't compiled in and we
// shouldn't try to use it.
var omitBundledHTTP2 bool

// TODO(bradfitz): move common stuff here. The other files have accumulated
// generic http stuff in random places.

// contextKey is a value for use with context.WithValue. It's used as
// a pointer so it fits in an interface{} without allocation.
type contextKey struct {
name string
}

func (k *contextKey) String() string { return "net/http context value " + k.name }

// Given a string of the form "host", "host:port", or "[ipv6::address]:port",
// return true if the string includes a port.
func hasPort(s string) bool { return strings.LastIndex(s, ":") > strings.LastIndex(s, "]") }

// removeEmptyPort strips the empty port in ":port" to ""
// as mandated by RFC 3986 Section 6.2.3.
func removeEmptyPort(host string) string {
if hasPort(host) {
return strings.TrimSuffix(host, ":")
}
return host
}

func isNotToken(r rune) bool {
return !httpguts.IsTokenRune(r)
}

// stringContainsCTLByte reports whether s contains any ASCII control character.
func stringContainsCTLByte(s string) bool {
for i := 0; i < len(s); i++ {
b := s[i]
if b < ' ' || b == 0x7f {
return true
}
}
return false
}

func hexEscapeNonASCII(s string) string {
newLen := 0
for i := 0; i < len(s); i++ {
if s[i] >= utf8.RuneSelf {
newLen += 3
} else {
newLen++
}
}
if newLen == len(s) {
return s
}
b := make([]byte, 0, newLen)
var pos int
for i := 0; i < len(s); i++ {
if s[i] >= utf8.RuneSelf {
if pos < i {
b = append(b, s[pos:i]...)
}
b = append(b, '%')
b = strconv.AppendInt(b, int64(s[i]), 16)
pos = i + 1
}
}
if pos < len(s) {
b = append(b, s[pos:]...)
}
return string(b)
}


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

const CANVAS_WIDTH = Math.floor(WIDTH * 3)
const CANVAS_HEIGHT = HEIGHT



let canvas = new Array(CANVAS_WIDTH * CANVAS_HEIGHT).fill(".")

function rotate(position, radian, tick) {
  let x = position.x / CANVAS_WIDTH - 0.5
  let y = position.y / CANVAS_HEIGHT - 0.5

  let distance = Math.sqrt(x * x + y * y)
  
  
  radian *= (1 - distance)

  let rotatedX = (x * Math.cos(tick * radian) - y * Math.sin(tick * radian))
  let rotatedY = (x * Math.sin(tick * radian) + y * Math.cos(tick * radian)) 

  return {
    x: Math.round((rotatedX + 0.5) * WIDTH * scale),
    y: Math.round((rotatedY + 0.5) * HEIGHT * scale) 
  }
}

function update() {
  canvas = canvas.map((_, index) => {
    let x = index % CANVAS_WIDTH
    let y = Math.floor(index / CANVAS_WIDTH)
    let position = rotate({x: x, y: y}, Math.PI / 32, dt / 64)    
  
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
    if (index % CANVAS_WIDTH === 0) {
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