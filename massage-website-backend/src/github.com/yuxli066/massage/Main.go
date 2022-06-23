package main

import (
	"delrosa/src/github.com/yuxli066/massage/app"
	"sync"
)

func main() {

	// create a WaitGroup
	wg := new(sync.WaitGroup)
	wg.Add(1)
	app := &app.App{}

	go func() {
		app.Initialize()
		app.Run(":3000")
		wg.Done()
	}()

	wg.Wait()

}
