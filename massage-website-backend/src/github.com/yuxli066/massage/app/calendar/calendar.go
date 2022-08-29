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

type TimeSlot struct {
	STARTTIME string
	ENDTIME   string
}

type TimesAvailable struct {
	TODAY    string
	SCHEDULE map[string][]TimeSlot
}

type GoogleCalendarService interface {
	GetConfig()
	GetClient()
	GetService()
	Authenticate()
	GetAppointments()
	CheckAvailability()
	GetNumericalMonth()
}

func (g *GoogleCalendar) GetNumericalMonth(month string) string {
	switch month {
	case "January":
		return "01"
	case "February":
		return "02"
	case "March":
		return "03"
	case "April":
		return "04"
	case "May":
		return "05"
	case "June":
		return "06"
	case "July":
		return "07"
	case "August":
		return "08"
	case "September":
		return "09"
	case "October":
		return "10"
	case "November":
		return "11"
	case "December":
		return "12"
	default:
		return ""
	}
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
		Kind:    "calendar#event",
		ColorId: "2",
	}

	_, err := g.SERVICE.Events.Insert(g.CALENDARID, &newAppointment).SendUpdates("all").Do()
	if err != nil {
		log.Fatalf("Unable to create event. %v\n", err)
		return
	}
	log.Println("-------------------------------------------------------------------------------------------------------------")
	log.Println("Setting Appointment for time in: " + timeIn + " time out: " + timeOut)
	log.Println("-------------------------------------------------------------------------------------------------------------")
}

func (g *GoogleCalendar) CheckAvailability() TimesAvailable {
	Tstart := time.Now()
	T_today := Tstart.Local().Format("2006-01-02")
	log.Println("Todays's Date:", T_today)
	Tend := Tstart.Add(time.Hour * 24 * 35) // get availability for the next 35 days
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

	var T_available = TimesAvailable{
		TODAY:    T_today,
		SCHEDULE: make(map[string][]TimeSlot),
	}
	for _, times := range freeBusyRes.Calendars[g.USEREMAIL].Busy {
		current_date, err := time.Parse(time.RFC3339, times.Start)
		if err != nil {
			log.Fatalf("Error parsing time: %v", err)
		}
		yr, month, date := current_date.Date()
		dateString := fmt.Sprint(yr) + "-" + g.GetNumericalMonth(month.String()) + "-" + fmt.Sprint(date)

		// format returned busy times
		s_time, _ := time.Parse(time.RFC3339, times.Start)
		e_time, _ := time.Parse(time.RFC3339, times.End)
		s_hr, s_min, _ := s_time.Clock()
		e_hr, e_min, _ := e_time.Clock()
		s_ampm := "AM"
		e_ampm := "AM"

		// format returned time based on am/pm instead of 24 hr clock cycle
		if s_hr >= 12 {
			s_ampm = "PM"
			if s_hr > 12 {
				s_hr = s_hr - 12
			}
		}

		if e_hr >= 12 {
			e_ampm = "PM"
			if e_hr > 12 {
				e_hr = e_hr - 12
			}
		}

		// append busy times to the available schedules
		ts := TimeSlot{
			STARTTIME: fmt.Sprint(s_hr) + ":" + fmt.Sprintf("%02d", s_min) + " " + s_ampm,
			ENDTIME:   fmt.Sprint(e_hr) + ":" + fmt.Sprintf("%02d", e_min) + " " + e_ampm,
		}
		T_available.SCHEDULE[dateString] = append(T_available.SCHEDULE[dateString], ts)
	}

	log.Print(T_available, "\n\n")
	return T_available
}
