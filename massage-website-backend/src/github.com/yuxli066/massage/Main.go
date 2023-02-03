package main

import (
	"delrosa/src/github.com/yuxli066/massage/app"
	"fmt"
	"os"
	"sync"
)

func main() {

	args := os.Args[1:]

	if args[0] == "frontend" {
		fmt.Println("Running Frontend Router")
		wg := new(sync.WaitGroup)
		wg.Add(1)
		app := &app.App{}

		go func() {
			app.Initialize_FrontEnd()
			app.Run(":3000")
			wg.Done()
		}()

		wg.Wait()
	}

	if args[0] == "backend" {
		fmt.Println("Running Backend Router")
		wg := new(sync.WaitGroup)
		wg.Add(1)
		app := &app.App{}

		go func() {
			app.Initialize_Backend()
			app.Api_Run(":65535")
			wg.Done()
		}()

		wg.Wait()
	}

}
