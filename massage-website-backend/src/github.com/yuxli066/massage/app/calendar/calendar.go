package calendar

import (
	"context"
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
}

type BusyTimes struct {
	StartTime string
	EndTime   string
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

func (g *GoogleCalendar) SetAppointment(timeIn string, timeOut string) {
	var newAppointment calendar.Event = calendar.Event{
		Summary:     "Event from API",
		Location:    "Massage 1",
		Description: "Short Description of the massage type",
		Start: &calendar.EventDateTime{
			DateTime: timeIn,
			TimeZone: "America/Los_Angeles",
		},
		End: &calendar.EventDateTime{
			DateTime: timeOut,
			TimeZone: "America/Los_Angeles",
		},
		Kind: "calendar#event",
		Attendees: []*calendar.EventAttendee{
			{
				Email: g.USEREMAIL,
			},
		},
		ColorId: "8",
	}

	// prints available event colors
	// colors, err := g.SERVICE.Colors.Get().Do()
	// if err != nil {
	// 	log.Fatalf("Unable to retrieve calendar colors. %v\n", err)
	// 	return
	// }
	// utils.PrettyPrint(colors.Event)

	_, err := g.SERVICE.Events.Insert(g.CALENDARID, &newAppointment).SendUpdates("all").Do()
	if err != nil {
		log.Fatalf("Unable to create event. %v\n", err)
		return
	}
	log.Println("-------------------------------------------------------------------------------------------------------------")
	log.Println("Setting Appointment for time in: " + timeIn + " time out: " + timeOut)
	log.Println("-------------------------------------------------------------------------------------------------------------")
}

func (g *GoogleCalendar) CheckAvailability() []BusyTimes {
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
	freeBusyRes, err := g.SERVICE.Freebusy.Query(&freeBusyRequestQuery).Do()
	if err != nil {
		log.Fatalf("Unable to retrieve Calendar's availability: %v", err)
	}

	var bTimeList []BusyTimes
	for _, times := range freeBusyRes.Calendars[g.USEREMAIL].Busy {
		busyTimes := BusyTimes{
			StartTime: times.Start,
			EndTime:   times.End,
		}
		bTimeList = append(bTimeList, busyTimes)
	}
	log.Println("-------------------------------------------------------------------------------------------------------------")
	log.Print("Times Not Available: ")
	log.Print(bTimeList)
	log.Println("-------------------------------------------------------------------------------------------------------------")
	return bTimeList
}
