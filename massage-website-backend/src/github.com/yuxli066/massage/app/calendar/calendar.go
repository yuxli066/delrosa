package calendar

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	"golang.org/x/oauth2/google"
	"golang.org/x/oauth2/jwt"
	"google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
)

type GoogleCalendar struct {
	CTX            context.Context
	USEREMAIL      string
	CONFIGFILEPATH string
	SCOPE          string
	CALENDARID     string
	CONFIG         *jwt.Config
	CLIENT         *http.Client
	SERVICE        *calendar.Service
	CALENDARIDS    *calendar.CalendarList
}

type GoogleCalendarService interface {
	GetConfig()
	GetClient()
	GetService()
	Authenticate()
	GetAppointments()
	CheckAvailability()
}

func (g *GoogleCalendar) GetConfig() *jwt.Config {
	b, err := ioutil.ReadFile(g.CONFIGFILEPATH)
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}

	config, err := google.JWTConfigFromJSON(b, g.SCOPE)
	if err != nil {
		log.Fatalf("Unable to parse client secret file to config: %v", err)
	}

	config.Subject = g.USEREMAIL
	g.CONFIG = config

	return config
}

func (g *GoogleCalendar) GetClient() *http.Client {
	g.CLIENT = g.CONFIG.Client(g.CTX)
	return g.CLIENT
}

func (g *GoogleCalendar) GetService() *calendar.Service {
	calendarService, err := calendar.NewService(g.CTX, option.WithHTTPClient(g.CLIENT))

	g.SERVICE = calendarService
	if err != nil {
		log.Fatalf("Unable to retrieve Calendar client: %v", err)
	}

	return g.SERVICE
}

func (g *GoogleCalendar) Authenticate() {
	g.GetConfig()
	g.GetClient()
	g.GetService()
	calendars, err := g.SERVICE.CalendarList.List().Do()
	if err != nil {
		log.Fatalf("Unable to retrieve Calendar list: %v", err)
	}
	log.Println("All User's Calendars ")
	for _, item := range calendars.Items {
		if item.AccessRole == "owner" {
			g.CALENDARID = item.Id
		}
	}
}

func (g *GoogleCalendar) GetAppointments() {
	t := time.Now().Format(time.RFC3339)
	events, err := g.SERVICE.Events.List("primary").ShowDeleted(false).SingleEvents(true).TimeMin(t).MaxResults(10).OrderBy("startTime").Do()
	if err != nil {
		log.Fatalf("Unable to retrieve next ten of the user's events: %v", err)
	}

	fmt.Print("\n Upcoming appointments: \n\n")
	if len(events.Items) == 0 {
		fmt.Println("No upcoming appointments found.")
	} else {
		for _, item := range events.Items {
			date := strings.Split(item.Start.DateTime, "T")[0]
			time := strings.Split(item.Start.DateTime, "T")[1]
			fmt.Printf(" Name: %v \n Date: %v \n Event Time: %v\n\n", strings.Trim(item.Summary, " "), date, time)
		}
	}
}

func (g *GoogleCalendar) CheckAvailability() {
	Tstart := time.Now()
	Tend := Tstart.Add(time.Hour * 24 * 60)
	freeBusyRequestQuery := calendar.FreeBusyRequest{
		TimeMin:  Tstart.Format(time.RFC3339),
		TimeMax:  Tend.Format(time.RFC3339),
		TimeZone: "PST",
		Items: []*calendar.FreeBusyRequestItem{
			{
				Id: g.CALENDARID,
			},
		},
	}
	freeTimes, err := g.SERVICE.Freebusy.Query(&freeBusyRequestQuery).Do()
	if err != nil {
		log.Fatalf("Unable to retrieve Calendar's availability: %v", err)
	}
	j, _ := json.MarshalIndent(freeTimes, "", "  ")
	log.Println("Free time slots on the calendar: ")
	log.Println(string(j))
}
