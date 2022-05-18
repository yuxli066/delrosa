package main

import (
	"leo-blog-post/src/github.com/yuxli066/massage/app"
)

func main() {
	app := &app.App{}
	app.Initialize()
	app.Run(":3000")
}
