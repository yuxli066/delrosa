package main

import (
	"delrosa/src/github.com/yuxli066/massage/app"
)

func main() {
	app := &app.App{}
	app.Initialize()
	app.Run(":3000")
}
